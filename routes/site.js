const router = require('express').Router();
const Product = require('../models/Product');
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  const latest = await Product.find().sort({ createdAt: -1 }).limit(6).lean();
  res.render('index', { latest });
});

router.get('/catalog', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  let filter = {};
  if (q) filter = { $or: [{ title: { $regex: q, $options: 'i' } }, { category: { $regex: q, $options: 'i' } }] };
  const items = await Product.find(filter).sort({ createdAt: -1 }).lean();
  res.render('catalog', { items, q });
});

router.get('/product/:slug', async (req, res) => {
  const item = await Product.findOne({ slug: req.params.slug }).lean();
  if (!item) return res.status(404).render('404');
  res.render('product', { item });
});

router.get('/blog', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  res.render('blog', { posts });
});

router.get('/post/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).lean();
  if (!post) return res.status(404).render('404');
  res.render('post', { post });
});

module.exports = router;
