var mongoose =require('mongoose');

//book schema

var userSchema = new mongoose.Schema({
	firstname:{type: String, lowercase: true, required:true},
	lastname:{type: String, lowercase: true, required:true},
	phone:{type: String, lowercase: true, required:true},
	email:{type:String, required:true,index:true, unique:true},
	password:{type:String, required:true}

});

var User =mongoose.model('riders', userSchema);
module.exports = User;