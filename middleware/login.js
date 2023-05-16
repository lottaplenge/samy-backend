// verify that the request comes from a logged in user.js (crudely)
const jwt = require("jsonwebtoken");
const User = require('../models/user')
module.exports = {
    verify: (req, res, next) => {
        const token = req.headers.token;

        if (token) {
            try {
                const payload = jwt.verify(token, 'mysupersecretbackendtoken');
                User.findById(payload.userId)
                    .then(() => {
                        console.log("User ", payload.userId, " verified!");
                        next();
                    })
            } catch (err) {
                console.error(err);
                res.status(400).send("Invalid token");
            }
        } else {
            res.status(401);
            res.end('Unauthorized');
        }

    }
};
