const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../auth');
const { errorHandler } = require('../auth'); 

// Register
module.exports.register = (req, res) => {
    const { email, password, isAdmin } = req.body; 

    if (!email || !email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    } else if (!password || password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(409).json({ message: 'Email already registered.' });
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const user = new User({
                email,
                password: hashedPassword,
                isAdmin: false 
            });
            return user.save()
                .then(() => res.status(201).json({ message: 'Registered Successfully.' }))
                .catch(err => {
                    console.error("Error in saving: ", err);
                    errorHandler(err, req, res);
                });
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
};

// Login
module.exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    User.findOne({ email })
        .then(result => {
            if (result == null) {
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({
                        access: auth.createAccessToken(result)
                    });
                } else {
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
};

// Retrieve user
module.exports.getDetails = (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing token.' });
    }
    User.findById(req.user.id)
        .select('_id email isAdmin')

        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            res.status(200).json({ user });
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
};

