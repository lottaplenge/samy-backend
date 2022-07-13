
const signUp = require('../middleware/sign-up.js');
const users = require('../middleware/users.js');
const offers = require('../middleware/offers.js');
const login = require('../middleware/login.js');
const hasId = require('../middleware/hasId.js');
const {Router} = require("express");

const router = Router();
router.post('/sign-up', signUp.validate, users.create);
router.get('/users/:id', login.verify, hasId.verify, users.findSingle);
router.delete('/users/:id', login.verify, hasId.verify, users.delete);
router.put('/users/:id', login.verify, hasId.verify, users.update);
router.get('/users/', login.verify, users.list);

router.post('/offers', login.verify, offers.create);
router.get('/offers/:id', login.verify, hasId.verify, offers.findSingle);
router.delete('/offers/:id', login.verify, hasId.verify, offers.delete);
router.put('/offers/:id', login.verify, hasId.verify, offers.update);
router.get('/offers/', login.verify, offers.list);

module.exports = {
    router: router
}
