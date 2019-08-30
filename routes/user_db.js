const express = require('express');
const router = express.Router();
const db = require('./db');
const mongoose = require('mongoose');
var session = require('express-session');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(session({
	secret: 'Mxyzptlk',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 3600000 }
}))

const userSchema = new mongoose.Schema({
	name: String,
	gender: String,
	dob: Date,
	username: String,
	password: String,
	email: String,
	isAdmin: Boolean,
	status: String
});

const User = mongoose.model('User', userSchema);

router.post('/register', function(req, res, next) {

	const { error } = validateFields(req.body);
	if(error) {
		return res.status(400).send(error.details[0].message);
	} else {
		var encrypt_pass="";

		async function Register_user(){
			try {
				const pass = await encryptPassword();
				const repos = await addUser(pass);
				const redirect = redirectToLogin();
			}
			catch(err) {
				console.log('Error',err.message);
			}
		};

		async function encryptPassword() {
			return new Promise((resolve, reject) => {
				bcrypt.genSalt(saltRounds, function(err, salt) {
					bcrypt.hash(req.body.password, salt, function(err, hash) {
						if(err) reject(err);
						else resolve(hash);
					});
				});
			});
		}

		async function addUser(encrypt_pass) {

			const addUser = new User({
				name: req.body.name,
				gender: req.body.gender,
				dob: req.body.dob,
				username: req.body.username,
				password: encrypt_pass,
				email: req.body.email,
				isAdmin: false,
				status: 'Active'
			});

			const user_registered = await addUser.save();
		}

		async function redirectToLogin() {
			res.redirect('../login');
		}

		Register_user();
		
	}
	
});

router.post('/login', function(req, res, next) {

	async function Login_user(){
		try {
			const getuser = await getUser();
			const checkPassword = await checkPassword(getuser[0].password);
			if(checkPassword=='Admin User') {
				res.redirect('/admin/dashboard');
			} else {
				res.redirect('/login');
			}
		}
		catch(err) {
			res.send(err);
		}
	};

	async function getUser() {
		let login_check = await User.find({ username: req.body.username });
		if(login_check){
			return login_check;
		} else {
			throw 'User does not exist';
		}
	}

	async function checkPassword(userdetails) {
		let login_password = userdetails;
		return new Promise((resolve, reject) => {
			bcrypt.compare(req.body.password, login_password, function(err, res) {
				if (err) {
					reject(err);
				} else if (res==false) {
					reject('Password does not match with the records...');
				} else {
					if(userdetails.isAdmin == true) {
						resolve('Admin User');
					} else {
						resolve('Normal User');
					}
				}
			});
		});
	}

	Login_user();

});

function validateFields(user) {
	const Joivalidate = {
		name: Joi.string().min(3).required(),
		gender: Joi.required(),
		dob: Joi.date().required(),
		username: Joi.string().alphanum().min(3).max(30).required(),
		password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
		conf_password: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'Password does not match' } } }),
		email: Joi.string().email().required()
	}

	return Joi.validate(user, Joivalidate);
}

module.exports = router;