var mongoose= require('mongoose');

var userSchema1 = new mongoose.Schema({
	car:{type: String},
	firstname:{type: String, lowercase: true, required:true},
	lastname:{type: String, lowercase: true, required:true},
	phone:{type: String, lowercase: true, required:true},
	city:{type: String, lowercase: true, required:true},
    email:{type:String, required:true,index:true, unique:true},
	password:{type:String, required:true}

});

var Drive =mongoose.model('drivers', userSchema1);
module.exports = Drive;