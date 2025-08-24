'use strict';
require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// ---- Models
const User = require('./models/User');

// ---- App
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---- Security & parsing
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// ---- Sessions & Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---- Static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/vendor/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// ---- Make user available in views
app.use((req, res, next) => { res.locals.user = req.user; next(); });

// ---- Health check for Render
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// ---- Routes
app.use('/', require('./routes/site'));
app.use('/auth', require('./routes/auth'));

// ---- 404
app.use((req, res) => {
  res.status(404).render('404');
});

// ---- Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('500', { error: err });
});

// ---- Mongo & server start (wait for DB first)
mongoose.set('bufferCommands', false); // fail fast instead of buffering queries

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI env var is missing');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });

    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Listening on :${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Exit so Render restarts the service rather than hanging
    process.exit(1);
  }
}

start();

module.exports = app;
