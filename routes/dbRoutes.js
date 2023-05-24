const express = require('express');
const signUp = require('../middleware/sign-up.js');
const users = require('../middleware/users.js');
const login = require("../middleware/login");
const hasId = require("../middleware/hasId");
const offers = require("../middleware/offers");


const dbRoutes = express.Router();

dbRoutes.post('/sign-up', signUp.validate, users.create);
dbRoutes.get('/users/:id', hasId.verify, users.findSingle);
dbRoutes.delete('/users/:id', hasId.verify, users.delete);
dbRoutes.get('/users/', login.verify, users.list);
dbRoutes.put('/users/:id', hasId.verify, users.update);

dbRoutes.post('/offers', login.verify, offers.create);
dbRoutes.get('/offers/:id', login.verify, hasId.verify, offers.findSingle);
dbRoutes.delete('/offers/:id', login.verify, hasId.verify, offers.delete);
dbRoutes.put('/offers/:id', login.verify, hasId.verify, offers.update);
dbRoutes.get('/offers/', login.verify, offers.list);



module.exports = dbRoutes;