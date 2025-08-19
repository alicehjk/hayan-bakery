const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/login', (req, res)=> res.render('login', { activePage: 'login' }));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

router.get('/signup', (req, res)=> res.render('signup', { activePage: 'signup' }));
router.post('/signup', async (req, res, next) => {
  try {
    const user = new User({ username: req.body.username });
    await User.register(user, req.body.password);
    req.login(user, err => {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (e) { next(e); }
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
