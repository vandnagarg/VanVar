var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema=  new Schema({
	name:{type:String},
	age:{type:String},
	phnNumber:{type:String},
	work:{type:String},
   city:{type:String},
   password:{type:String},
   img:{type:String}
});
userSchema.methods.encryptPassword = function(password){
   return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null)
};
userSchema.methods.validPassword = function (password,callback) {
    return bcrypt.compare(password,this.password,callback);  // this refers to actual password
};

module.exports = mongoose.model('NeedJobUser',userSchema);
