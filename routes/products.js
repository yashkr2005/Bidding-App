const express = require('express');
const router = express.Router();
const { productSchema } = require('../schemas.js');
const { isLoggedIn, validateProduct, isOwnerAndLimit, isOwnerAndCondition} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const User = require('../models/user');
const Tran =  require('../models/transactions');
const multer = require('multer');
const { storage, cloudinary} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
.get(isLoggedIn, catchAsync( async (req, res) => {
    const d = Date.now()
    const type = "All"
    const category = undefined;
    const products = await Product.find({endTime:{ $gt: d }});
    res.render('products/index', { products, category, type })
}))
.post( isLoggedIn,  upload.array('image'), validateProduct, catchAsync( async (req, res,next) => {
    const user = await User.findById(req.user._id);
    const product = new Product(req.body.product);
    if(Date.now()>=product.startTime){
        req.flash('error', 'Start Time must be greater than Present Time');
       return res.redirect(`/products/new`)

    }
   
    
    product.endTime = Date.parse(product.startTime)+product.duration*3600000 
    product.lastbid = product.price-1;
    
    product.image = req.files.map(f=>({ url: f.path.replace('upload/','upload/w_800,h_600,c_pad,b_white/'), filename: f.filename}))
    product.owner = req.user._id
    //console.log(product)
    await user.itemsAdded.push(product);
    await user.save();
    await product.save();
    req.flash('success','Successfully added a new item')
    res.redirect(`/products/${product._id}`)
}))

router.get('/new', isLoggedIn, catchAsync( async (req, res) => {
    res.render('products/new');
}))



router.route('/:id')
.get(isLoggedIn, catchAsync( async (req, res,) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'biddings',
        populate: {
            path: 'owner',
            select: 'username'
        }
    }).populate('owner','username');
    if(!product)
    {
        req.flash('error','Item does not Exist or is Deleted')
        return res.redirect('/products')
    } 
    

    res.render('products/show', { product });
}))
.put( isLoggedIn,isOwnerAndLimit, upload.array('image'),validateProduct, catchAsync( async (req, res) => {
    const { id } = req.params;
   
    const inputs = req.body.product
    const val = Date.parse(inputs.startTime)
    if(Date.now() >= val){
        req.flash('error', 'Start Time must be greater than Present Time');
       return  res.redirect(`/products/${id}/edit`)
    }
    const endtime = val + inputs.duration*3600000
    const lastBid = inputs.price-1
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product , endTime: endtime, lastbid: lastBid});
    const temp = req.files.map(f=>({ url: f.path.replace('upload/','upload/w_800,h_400,c_pad,b_white/'), filename: f.filename}))
    await product.image.push(...temp)
    await product.save();
    req.flash('success','Successfully Updated the item')
    res.redirect(`/products/${product._id}`)
}))
.delete(isLoggedIn,isOwnerAndLimit, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user  =  await User.findById(req.user._id);
    const ind = await user.itemsAdded.indexOf(id);
    await user.itemsAdded.splice(ind, 1);
    await user.save();
    await Product.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted the item')
    res.redirect('/products');
}))


router.get('/:id/edit',isLoggedIn,isOwnerAndLimit, catchAsync( async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    res.render('products/edit', { product });
}))

router.put('/:id/favorite', isLoggedIn, catchAsync( async(req, res)=>{
    const user = await User.findById(req.user._id);
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product)
    {
        req.flash('error','Item does not Exist or is Deleted')
        return res.redirect('/products')
    } 
    const ind  = await user.favorites.indexOf(id);
    if(ind == -1)
    {
        await user.favorites.push(id);
        product.favCount++;
        req.flash('success','Item Added to Favorites');
    }
    else
    {
        await user.favorites.splice(ind,1);
        product.favCount--;
        req.flash('success','Item Removed from Favorites');
    }
    await user.save();
    await product.save();
    res.redirect(`/products/${id}`);

    
}))

router.put('/:id/transaction', isLoggedIn, isOwnerAndCondition, catchAsync( async( req, res)=>{

    const { id } = req.params;
    const product = await Product.findById(id);
    const owner = await User.findById(req.user._id);
    const buyer  = await User.findById(product.lastbidder);
    const tranOwner  =  new Tran();
    const tranBuyer =  new Tran();

    tranOwner.amt = product.lastbid;
    tranOwner.name = buyer.username;
    tranOwner.date = Date.now();
    tranOwner.way = "Sold " + product.title;

    tranBuyer.amt = 0 - product.lastbid;
    tranBuyer.name = owner.username;
    tranBuyer.date = Date.now();
    tranBuyer.way = "Won " + product.title;

    owner.wallet+= product.lastbid;
    buyer.wallet-=product.lastbid;
    product.sold = true;
    owner.itemsSold++;

    await owner.transactions.push(tranOwner);
    await buyer.transactions.push(tranBuyer);
    await buyer.itemsWon.push(product);
    await Promise.all[tranOwner.save(), tranBuyer.save(), product.save(), owner.save(), buyer.save() ];

    req.flash('success','Transaction was Successful');
    res.redirect(`/products/${id}`);

}))


module.exports = router