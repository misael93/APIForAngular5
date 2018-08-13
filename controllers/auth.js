var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../config/auth');

function generateToken(user) {
    return jwt.sign(user, authConfig.secret, {
        expiresIn: "100d"
    });
}

function setUserInfo(request) {
    return {
        _id: request._id,
        email: request.email,
        role: request.role
    };
}

exports.register = function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;

    if (!email) {
        return res.status(400).send({ error: 'You must enter an email address' });
    }

    if (!password) {
        return res.status(400).send({ error: 'You must enter a password' });
    }

    if (!name) {
        return res.status(400).send({ error: 'You must enter a name' });
    }

    User.findOne({ email: email }, function (err, existingUser) {

        if (err) {
            return next(err);
        }

        if (existingUser) {
            return res.status(409).send({ error: 'That email address is already in use' });
        }

        var user = new User({
            email: email,
            password: password,
            name: name
        });

        user.save(function (err, user) {

            if (err) {
                return next(err);
            }

            var userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })

        });

    });

}

exports.login = function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;

    if (!email) {
        return res.status(400).send({ error: 'You must enter an email address' });
    }

    if (!password) {
        return res.status(400).send({ error: 'You must enter a password' });
    }

    User.findOne({ email: email }, (err, user) => {

        if (err) {
            return next(err);
        }

        var response = { result: false };

        if (!user) {
            response.message = 'Email address not found';
            return res.status(200).send(response);
        }

        user.comparePassword(password, (err, isMatch) => {

            if (err) {
                return next(err);
            }

            if (isMatch) {
                response.result = true;
                response.token = generateToken(user);
            } else {
                response.message = 'Wrong password';
            }

            return res.status(200).send(response);

        });

    });

}
