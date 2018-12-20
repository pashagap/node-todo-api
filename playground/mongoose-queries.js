const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

var userId = '5c1ad4c84bc96bf411ea96a6';

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e.message));

if (!ObjectID.isValid(userId)) {
  console.log('ID not valid');
} else {
  User.findById(userId).then((user) => {
    if (!user) {
      return console.log('User not found');
    }
    console.log('User By Id', user);
  }).catch((e) => console.log(e.message));
}
