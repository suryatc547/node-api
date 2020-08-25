const mongoose = require('mongoose');
const model = require('./model');
const Schema = mongoose.Schema;
const CartsSchema = new Schema({
	product_id:{type:mongoose.Types.ObjectId},
	user_token:{type:String,require:true},
	product_name:{type:String,required:true},
	price:{type:Number,required:true},
	updated_at:{type:Date,default:Date.now()},
	created_at:{type:Date},
},{versionKey:false});
const CartsModel = model.model('carts',CartsSchema);
module.exports = CartsModel;