const mongoose = require('mongoose');
const model = require('./model');
const Schema = mongoose.Schema;
const ProductsSchema = new Schema({
	product_name:{type:String,required:true,unique:true},
	price:{type:Number,required:true},
	updated_at:{type:Date,default:Date.now()},
	created_at:{type:Date},
},{versionKey:false});
const ProductsModel = model.model('products',ProductsSchema);
module.exports = ProductsModel;