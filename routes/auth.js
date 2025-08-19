const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await User.register({ username }, password);
    res.redirect('/auth/login');
  } catch (e) { next(e); }
});

router.get('/login', (req, res) => res.render('login'));
router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;
