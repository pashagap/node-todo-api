const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({}).then((result) => {
//   console.log(result);
// });

var id = new ObjectID("5c1adc4baddf89a02f522ad4");

Todo.findByIdAndRemove(id.toHexString()).then((todo) => {
  console.log(todo);
});
