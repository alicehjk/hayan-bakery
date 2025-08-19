'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Post = require('../models/Post');

function slugify(t) {
  return (t || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hayan_bakery');

  const admin = await User.findOne({ username: 'admin' });
  if (!admin) await User.register({ username: 'admin', role: 'admin' }, 'admin');

  const sample = [
    {
      title: 'Hayan Pullman Loaf',
      price: 15.0,
      category: 'Bread',
      image: '',
      desc: 'Signature milk loaf made with levain, tangzhong, and butter. Chewy, soft, and fluffy.',
      slug: 'hayan-pullman-loaf'
    },
    {
      title: 'Overnight Milk Pullman Loaf',
      price: 15.0,
      category: 'Bread',
      image: '',
      desc: 'Classic Korean-style milk bread. Extra fluffy and light with a gentle buttery flavor.',
      slug: 'overnight-milk-pullman-loaf'
    },
    {
      title: 'Cream Loaf',
      price: 10.0,
      category: 'Bread',
      image: '',
      desc: 'Pastry-like loaf made with heavy cream. Feather-light texture and rich buttery taste.',
      slug: 'cream-loaf'
    },
    {
      title: 'Lemon Vanilla Madeleine',
      price: 2.5,
      category: 'Dessert',
      image: '',
      desc: 'Soft lemon vanilla cake with bright citrus glaze and a touch of rum.',
      slug: 'lemon-vanilla-madeleine'
    },
    {
      title: 'Earl Grey Financier',
      price: 3.5,
      category: 'Dessert',
      image: '',
      desc: 'Almond financier infused with real Earl Grey tea leaves, dipped in Earl Grey chocolate.',
      slug: 'earl-grey-financier'
    },
    {
      title: 'Hazelnut Caramel Financier',
      price: 3.5,
      category: 'Dessert',
      image: '',
      desc: 'Soft almond cake with roasted hazelnuts, topped with house-made butter caramel.',
      slug: 'hazelnut-caramel-financier'
    },
    {
      title: 'White Chocolate Matcha Financier',
      price: 3.5,
      category: 'Dessert',
      image: '',
      desc: 'Matcha almond cake coated in creamy matcha white chocolate.',
      slug: 'white-chocolate-matcha-financier'
    },
    {
      title: 'Galette Bretonne',
      price: 3.0,
      category: 'Dessert',
      image: '',
      desc: 'Crispy, buttery French shortbread with deep caramelized flavor and flaky sea salt.',
      slug: 'galette-bretonne'
    }
  ].map(p => ({
    ...p,
    slug: p.slug || slugify(p.title),
    stock: 20
  }));

  // upsert by slug so it’s safe to re-run
  for (const item of sample) {
    await Product.findOneAndUpdate(
      { slug: item.slug },
      item,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    await Post.create({
      title: 'Welcome to Hayan',
      body: 'First bake drop is live.',
      slug: 'welcome-to-hayan'
    });
  }

  console.log('seeded');
  await mongoose.connection.close();
}

run().catch(e => { console.error(e); process.exit(1); });
