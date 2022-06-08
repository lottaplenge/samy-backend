
const signUp = require('../middleware/sign-up.js');
const users = require('../middleware/users.js');
const login = require('../middleware/login.js');
const {Router} = require("express");

const router = Router();
router.post('/sign-up', signUp.validate, users.create);
router.get('/users/:id', login.verify, users.findSingle);
router.get('/users/', login.verify, users.list);

module.exports = {
    router: router
}
