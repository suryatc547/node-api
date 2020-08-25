const mongoose = require('mongoose');
const model = require('./model');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
	username:{type:String,required:true,unique:true},
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true},
	user_token:{type:String},
	updated_at:{type:Date,default:Date.now()},
	created_at:{type:Date},
},{versionKey:false});
const UsersModel = model.model('users',UserSchema);
module.exports = UsersModel;