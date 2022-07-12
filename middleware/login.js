// verify that the request comes from a logged in user (crudely)
const jwt = require("jsonwebtoken");
const {users} = require("./users");
module.exports = {
    verify: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            try {
                const payload = jwt.verify(token, 'mysupersecretbackendtoken');
                const findOne = users.data.filter(user => user.id === payload.userId);
                if (!findOne || findOne.length === 0) {
                    res.status(403).send("Forbidden");
                } else {
                    next();
                }
            } catch (e) {
                console.error(e);
                res.status(400).send("Invalid token");
            }
        } else {
            res.status(401);
            res.end('Unauthorized');
        }
    }
};
