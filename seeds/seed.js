'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Post = require('../models/Post');

function slugify(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hayan_bakery');

  const admin = await User.findOne({ username: 'admin' });
  if (!admin) await User.register({ username: 'admin', role: 'admin' }, 'admin');

  const items = [
    { title: 'Hayan Pullman Loaf', price: 15, category: 'Bread', desc: 'Signature milk loaf.' },
    { title: 'Overnight Milk Pullman Loaf', price: 15, category: 'Bread', desc: 'Fluffy & light.' },
    { title: 'Cream Loaf', price: 10, category: 'Bread', desc: 'Feather-light, rich taste.' },
    { title: 'Lemon Vanilla Madeleine', price: 2.5, category: 'Dessert', desc: 'Citrus glaze & a touch of rum.' },
    { title: 'Earl Grey Financier', price: 3.5, category: 'Dessert', desc: 'Tea-infused almond cake.' },
    { title: 'Hazelnut Caramel Financier', price: 3.5, category: 'Dessert', desc: 'Roasted hazelnut + caramel.' },
    { title: 'White Chocolate Matcha Financier', price: 3.5, category: 'Dessert', desc: 'Matcha + white chocolate.' },
    { title: 'Galette Bretonne', price: 3.0, category: 'Dessert', desc: 'Buttery shortbread, sea salt.' }
  ].map(p => ({ ...p, slug: slugify(p.title), stock: 20 }));

  for (const it of items) {
    await Product.findOneAndUpdate({ slug: it.slug }, it, { upsert: true, setDefaultsOnInsert: true });
  }

  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    await Post.create({ title: 'Welcome to Hayan', slug: 'welcome-to-hayan', body: 'First bake drop is live.' });
  }

  console.log('seeded');
  await mongoose.connection.close();
}
run().catch(e => { console.error(e); process.exit(1); });
