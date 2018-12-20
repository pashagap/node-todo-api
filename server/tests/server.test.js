const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const dummyTodos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 123
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummyTodos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create an empty todo', (done) => {
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(dummyTodos.length);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(dummyTodos.length);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var newID =new ObjectID();

    request(app)
      .get(`/todos/${newID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {

    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should return deleted todo doc', (done) => {
    var idToDeleteHex = dummyTodos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${idToDeleteHex}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(idToDeleteHex);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(idToDeleteHex).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var newID =new ObjectID();

    request(app)
      .delete(`/todos/${newID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {

    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {
    var idToUpdateHex = dummyTodos[0]._id.toHexString();
    var body = {
      text: "Test update todo",
      completed: true
    }

    request(app)
      .patch(`/todos/${idToUpdateHex}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
      // .end((err, res) => {
      //   if (err) {
      //     return done(err);
      //   }
      //
      //   Todo.findById(idToUpdateHex).then((todo) => {
      //     expect(todo.completed).toBe(true);
      //     expect(todo.completedAt).toBe(123);
      //     done();
      //   }).catch((e) => done(e));
      // });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var idToUpdateHex = dummyTodos[1]._id.toHexString();
    var body = {
      text: "Test update todo 2",
      completed: false
    }

    request(app)
      .patch(`/todos/${idToUpdateHex}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
      // .end((err, res) => {
      //   if (err) {
      //     return done(err);
      //   }
      //
      //   Todo.findById(idToUpdateHex).then((todo) => {
      //     expect(todo.completed).toBe(true);
      //     expect(todo.completedAt).toBe(123);
      //     done();
      //   }).catch((e) => done(e));
      // });
  });

});
