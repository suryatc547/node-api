var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Products = require('../model/Products');
const Carts = require('../model/Carts');

// router.use();
const jWt = (req,res,next) => {
	let resp = {code:401,message:null,data:null};
	let header = req.header('Authorization');
	if(header) {
		let splitHeader = header.trim().split(' ');
		if(splitHeader && splitHeader[1]){
			jwt.verify(splitHeader[1],'kj3u878',(err,verify) => {
				if(err || !verify) {
					resp['message'] = 'Unauthorized!';
					res.jsonp(resp);	
				} else {
					next();
				}
			});
		} else {
			resp['message'] = 'Unauthorized!';
			res.jsonp(resp);
		}
	} else {
		resp['message'] = 'Unauthorized!';
		res.jsonp(resp);
	}
};
/* GET users listing. */
router.get('/', jWt ,async (req, res) => {
	console.log('lll')
	let resp = {code:200,message:null,data:null};
	let token = req.params.user_token;
  	const userData = await Users.findOne({token:token}).select({'username':1,'email':1});
  	if(userData) {
  		resp['message'] = 'success'; resp['data'] = userData;
  	} else {
  		resp['code'] = 404;
  		resp['message'] = 'No such user found!';
  	}
  	res.jsonp(resp);
});

router.get('/products',jWt,async (req,res) => {
	const products = await Products.find();
	let resp = {code:200,message:null,data:null};
	if(products) {
		products.find((pro,i) => {
			// products[i]._id = encrypt(pro._id);
		});
  		resp['message'] = 'success'; resp['data'] = products;
  	} else {
  		resp['code'] = 404;
  		resp['message'] = 'No such user found!';
  	}
  	res.jsonp(resp);
});

router.post('/add-product',jWt,async (req,res) => {
	let resp = {code:200,message:null,data:null};
	let validationErrors = {product_name:[],price:[]};
	const productExists = await Products.findOne({product_name:req.body.product_name}).countDocuments();
	if(productExists > 0){
		validationErrors.product_name.push('Product exists!');
		resp['message'] = 'Invalid data send!';
		resp['data'] = validationErrors;
		resp['code'] = 400;
	} else {
		const insResult = await Products.create({product_name:req.body.product_name,price:req.body.price,created_at:Date.now()});
		if(insResult) resp['message'] = 'Added successfully!';
		else {
			resp['message'] = 'Unable to add, something went wrong!';
			resp['code'] = 400;
		}
	}
	res.jsonp(resp);
});

router.get('/view-product/:id',jWt,async (req,res) => {
	// let id = decrypt(req.query.id);
	let id = req.params.id; console.log(id);
	let resp = {code:200,message:null,data:null};
	let productData = await Products.findOne({_id:id});
	if(productData){
		resp['message'] = 'success';
		resp['data'] = productData;
	} else {
		resp['message'] = 'Product not found!';
		resp['code'] = 404;
	}
	res.jsonp(resp);	
});

router.get('/my-cart',jWt,async (req,res) => {
	let id = req.query.user_token;
	// console.log('ss',req.query)
	let resp = {code:200,message:null,data:null};
	let cartData = await Carts.find({user_token:id});
	let cartSum = await Carts.aggregate([
	{$match:{'user_token':id}},
	{$group:{_id:null,count:{$sum:'$price'}}},
	]);
	console.log(cartSum)
	if(cartData){
		resp['message'] = 'success';
		resp['data'] = {carts:cartData,total:cartSum[0].count};
	} else {
		resp['message'] = 'Carts not found!';
		resp['code'] = 404;
	}
	res.jsonp(resp);	
});

router.post('/add-cart',jWt,async (req,res) => {
	let resp = {code:200,message:null,data:null};
	let product = await Products.findOne({_id:req.body.id});
	let result = await Carts.create({user_token:req.body.user_token,product_id:req.body.id,product_name:product.product_name,price:product.price});
	if(result){
		let cart = await Carts.find({user_token:req.body.user_token});
		let cartSum = await Carts.aggregate([
		{$match:{'user_token':req.body.user_token}},
		{$group:{_id:null,count:{$sum:'$price'}}},
		]);
		resp['message'] = 'success';
		resp['data'] = {carts:cart,total:cartSum[0].count};
	} else {
		resp['message'] = 'Unable to add to cart!';
		resp['code'] = 400;
	}
	res.jsonp(resp);	
});

module.exports = router;
