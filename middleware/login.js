module.exports = {
    verify: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            next();
        } else {
            res.status(401);
            res.end('Unauthorized');
        }
    }
};
