// verify that the request comes with an id in the params section
module.exports = {
    verify: (req, res, next) => {
        const id = req.params.id;
        if (id) {
            next();
        } else {
            res.status(400);
            res.end('No id given!');
        }
    }
};
