const router = require('express').Router();
const Product = require('../models/Product');
const Post = require('../models/Post');

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).send('Forbidden');
}

router.get('/', isAdmin, async (req, res) => {
  const [products, posts] = await Promise.all([Product.find().lean(), Post.find().lean()]);
  res.render('admin/index', { products, posts });
});

router.get('/products/new', isAdmin, (req, res) => res.render('admin/products_new'));
router.post('/products', isAdmin, async (req, res, next) => {
  try {
    const { title, price, desc, category, image } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,'');
    await Product.create({ title, price, desc, category, image, slug, stock: 10 });
    res.redirect('/admin');
  } catch (e) { next(e); }
});

router.get('/posts/new', isAdmin, (req, res) => res.render('admin/posts_new'));
router.post('/posts', isAdmin, async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,'');
    await Post.create({ title, body, slug });
    res.redirect('/admin');
  } catch (e) { next(e); }
});

router.post('/products/:id/delete', isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

router.post('/posts/:id/delete', isAdmin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
