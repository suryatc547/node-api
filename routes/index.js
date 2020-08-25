var express = require('express');
var router = express.Router();
const Users = require('../model/Users');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',async (req,res) => {
	console.log(req.body)
	let resp = {code:200,message:null,data:null};
	let validationErrors = {username:[],email:[],password:[]};
	const userExists = await Users.findOne({username:req.body.username}).countDocuments();
	const emailExists = await Users.findOne({email:req.body.email}).countDocuments();
	if(userExists > 0){
		validationErrors.username.push('Username exists!');
		resp['message'] = 'Invalid data send!';
		resp['data'] = validationErrors;
		resp['code'] = 400;
	} else if(emailExists > 0){
		validationErrors.email.push('Email exists!');
		resp['message'] = 'Invalid data send!';
		resp['data'] = validationErrors;
		resp['code'] = 400;
	} else {
		const insResult = await Users.create({username:req.body.username,email:req.body.email,password:encrypt(req.body.password),created_at:Date.now(),user_token:encrypt(req.body.username+Date.now())});
		if(insResult) resp['message'] = 'Registered successfully!';
		else { 
			resp['code'] = 400;
			resp['message'] = 'Unable to register, something went wrong!';
		}
	}
	res.jsonp(resp);
});

router.post('/login', async (req,res) => {
	let resp = {code:200,message:null,data:null};
	// let validationErrors = {email:[],email:[],password:[]};
	const userExists = await Users.findOne({email:req.body.email,password:encrypt(req.body.password)}).select('user_token');
	console.log(userExists)
	if(userExists && userExists.user_token){
		resp['message'] = 'Logged in successfully!';
		let token = jwt.sign({exp:Math.floor(Date.now() / 1000) + (60 * 20)},'kj3u878');
		resp['data'] = {api_token:token,user_token:userExists.user_token};
	} else {
		resp['message'] = 'Invalid credentials!';
		resp['code'] = 401;
	}
	res.jsonp(resp);
});

module.exports = router;
