const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Post = require('../models/Post');

router.get('/', async (req, res, next) => {
  try {
    const latest = await Product.find().sort({ createdAt: -1 }).limit(6).lean();
    res.render('index', { latest, activePage: 'home' });
  } catch (e) { next(e); }
});

router.get('/catalog', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q ? { title: new RegExp(q, 'i') } : {};
    const items = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.render('catalog', { items, q, activePage: 'catalog' });
  } catch (e) { next(e); }
});

router.get('/blog', async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.render('blog', { posts, activePage: 'blog' });
  } catch (e) { next(e); }
});

module.exports = router;
