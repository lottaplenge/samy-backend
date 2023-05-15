const express = require('express');
const User = require('../models/user');
const signUp = require('../middleware/sign-up.js');
const users = require('../middleware/users.js');
const login = require("../middleware/login");


const dbRoutes = express.Router();

dbRoutes.post('/sign-up', signUp.validate, users.create);
dbRoutes.get('/users/', login.verify, users.list);


module.exports = dbRoutes;