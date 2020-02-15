var express = require('express'),
    routes = express.Router();
var userController = require('./controller/user-controller');
var passport = require('passport');


routes.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.send('This is an api');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

routes.get('/special', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.json({msg: `Hey ${req.user.email}! I open at the close`});
});

module.exports = routes;

