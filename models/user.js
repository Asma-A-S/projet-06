const mongoose = require('mongoose');
const mongooseError = require('mongoose-mongodb-errors')
console.log(mongooseError)
// importation du plugin unique validator, email unique
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(mongooseError);
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
