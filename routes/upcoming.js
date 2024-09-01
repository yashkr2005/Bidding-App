const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/product');
const { isLoggedIn } = require('../middleware');

router.route('/')
.get(isLoggedIn, catchAsync(async (req,res) =>{
    var d = Date.now();
    const type = "Upcoming"
    const category = undefined;
    const products = await Product.find({startTime: { $gt: d} });
    res.render('products/index', { products ,category, type});

}))


router.route('/:category')
.get(isLoggedIn, catchAsync(async (req, res) =>{
    const {category} = req.params
    const d = Date.now()
    const type = "Upcoming"
    const products = await Product.find({ $and: [ {startTime: { $gt: d} } , {category:category }]});
    res.render('products/index', { products , category, type});
}))

module.exports = router