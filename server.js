'use strict';
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');
const mongoose = require('mongoose');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hayan_bakery');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.use(session({
  secret: process.env.SESSION_SECRET || 'session-key',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 10 }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/', require('./routes/site'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', ensureLogin.ensureLoggedIn('/auth/login'), require('./routes/admin'));

app.use((req, res) => res.status(404).render('404'));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
app.use('/vendor', require('express').static(require('path').join(__dirname, 'node_modules/bootstrap/dist')));
