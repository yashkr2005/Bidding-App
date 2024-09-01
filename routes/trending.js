const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/product');
const { isLoggedIn } = require('../middleware');

router.route('/')
.get(isLoggedIn, catchAsync(async (req,res) =>{
    const d = Date.now()
    const type = "Trending"
    const category = undefined;
    const products = await Product.find({endTime:{ $gt: d }}).sort({favCount: -1});
    res.render('products/index', { products,category, type });

}))

router.route('/:category')
.get(isLoggedIn, catchAsync(async (req, res) =>{
    const {category} = req.params
    const d = Date.now()
    const type = "Trending"
    const products = await Product.find({ $and: [ {endTime: { $gt: d}} , {category:category }]}).sort({favCount: -1});
    res.render('products/index', { products,category, type });
}))

module.exports = router