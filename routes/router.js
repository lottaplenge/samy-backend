const express = require('express');
const signUp = require('../middleware/sign-up.js');
const users = require('../middleware/users.js');
const login = require('../middleware/login');
const hasId = require('../middleware/hasId');
const offers = require('../middleware/offers');


const router = express.Router();

router.post('/sign-up', signUp.validate, users.create);
router.get('/users/:id', login.verify, hasId.verify, users.findSingle);
router.delete('/users/:id', hasId.verify, users.delete);
router.get('/users/', login.verify, users.list);
router.put('/users/:id', login.verify, hasId.verify, users.update);
router.put('/users/password/:id', login.verify, hasId.verify, users.updatePassword);
router.post('/login', login.login);
router.post('/logout', login.verify, login.logout);

router.post('/offers', login.verify, offers.create);
router.get('/offers/:id', login.verify, hasId.verify, offers.findSingle);
router.delete('/offers/:id', login.verify, hasId.verify, offers.delete);
router.put('/offers/:id', login.verify, hasId.verify, offers.update);
router.get('/offers/', login.verify, offers.list);



module.exports = router;