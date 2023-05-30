const User = require("../models/user");

module.exports = {

    create: (req, res, next) => {
        const mail = req.body.mail;
        User.findOne({mail})
            .then(existingUser => {
                if(existingUser){
                    return res.status(409).json({ error: 'User already exists' });
                }
                // create user in mongodb database
                const userMongo = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    street: req.body.street,
                    streetNumber: req.body.streetNumber,
                    city: req.body.city,
                    mail: req.body.mail,
                    postCode: req.body.postCode,
                    password: req.body.password
                });

                return userMongo.save()
                    .then((result) =>{
                        /*const token = jwt.sign({
                                userId: result._id,
                            },
                            'mysupersecretbackendtoken', {
                                expiresIn: '1d'
                            }
                        );*/
                        res.status(201);
                        //res.cookie("token", token, {maxAge: 86400})
                        res.send(result);


                        next();
                    })
                    .catch((err) =>{
                        console.log(err);
                    })
            });


    },

    list: (req, res) => {

        User.find()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
            });
    },

    findSingle: (req, res) => {
        User.findById(req.params.id)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
            })

    },

    delete: (req, res) => {
        User.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({
                    msg: "User deleted!",
                });
            })
            .catch((err) => {
                console.log(err);
            })

    },

    update: (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                street: req.body.street,
                streetNumber: req.body.streetNumber,
                city: req.body.city,
                mail: req.body.mail,
                postCode: req.body.postCode,
                //password: req.body.password
            },
        },{new:true})
            .then((result) => {
                res.send(result);
                next();
            })
            .catch((err) => {
                console.log(err);
            })

    },
    updatePassword(req, res, next){
        const userId = req.params.id;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        console.log(currentPassword, newPassword, userId);

        User.findById(userId)
            .then(user => {
                console.log(user);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                return user.verifyPassword(currentPassword).then(isPasswordValid => {
                    if (!isPasswordValid) {
                        return res.status(401).json({ error: 'Invalid current password' });
                    }
                    console.log("password Valid: ", isPasswordValid);

                    user.password = newPassword;
                    return user.save();
                });
            })
            .then(() => {
                res.json({ message: 'Password updated successfully' });
            })
            .catch(error => {
                res.status(500).json({ error: 'Internal server error' });
            });
    }
}

