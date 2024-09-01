const express = require('express');
const router = express.Router();
const { isLoggedIn, validateWalletValue} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/product');
const User = require('../models/user')
const Tran = require('../models/transactions')


router.get('/profile', isLoggedIn, catchAsync( async(req, res)=>{
    res.render('products/profile')
}))

router.route('/wallet')
.get(isLoggedIn, catchAsync( async(req, res) =>{
    const user = await User.findById(req.user._id).populate('transactions');
    const tran = user.transactions;
     res.render('products/wallet', { tran })
}))
.put( isLoggedIn, validateWalletValue, catchAsync( async(req,res) =>{
    const id = req.user._id
    const updateValue = parseInt(req.body.walletAdd.wallet) + req.user.wallet
    const tran = new Tran();
    tran.amt = parseInt(req.body.walletAdd.wallet);
    tran.name = "Self";
    tran.date = Date.now();
    tran.way  = "Self Added";
    const user  = await User.findById(id);
    await user.transactions.push(tran);
    user.wallet = updateValue;
    await tran.save();
    await user.save();
    
    req.flash('success', 'Value Added Successfully')
    res.redirect('/user/wallet')
}))

router.route('/favorites')
.get(isLoggedIn, catchAsync( async(req, res) =>{

    const user = await User.findById(req.user._id).populate('favorites');
    const products = user.favorites;
    res.render('products/favorites',{ products})

}))

router.put('/:id/remove', isLoggedIn, catchAsync( async(req, res)=>{
    const user = await User.findById(req.user._id);
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product)
    {
        req.flash('error','Item does not Exist or is Deleted')
        return res.redirect('/products')
    } 
    const ind  = await user.favorites.indexOf(id);
        await user.favorites.splice(ind,1);
        product.favCount--;
       
    await user.save();
    await product.save();
    req.flash('success','Item Removed from Favorites');
    res.redirect(`/user/favorites`);

    
}))

router.get('/itemsadded', isLoggedIn, catchAsync( async(req, res)=>{

    const user = await User.findById(req.user._id).populate('itemsAdded')
    const products = user.itemsAdded;
    const type = "All"
    await products.reverse()
    
    res.render('products/itemsadded',{ products, type })

}))

router.get('/itemsadded/live', isLoggedIn, catchAsync( async(req, res)=>{

    const user = await User.findById(req.user._id).populate('itemsAdded')
    const d = Date.now();
    const products = user.itemsAdded.filter( e=> d>=e.startTime&&d<=e.endTime );
    const type = "Live"
    
    res.render('products/itemsadded',{ products, type })

}))

router.get('/itemsadded/scheduled', isLoggedIn, catchAsync( async(req, res)=>{

    const user = await User.findById(req.user._id).populate('itemsAdded')
    const d = Date.now();
    const products = user.itemsAdded.filter( e=> d<e.startTime );
    const type = "Scheduled"
    
    res.render('products/itemsadded',{ products, type })

}))

router.get('/itemsadded/biddingover', isLoggedIn, catchAsync( async(req, res)=>{

    const user = await User.findById(req.user._id).populate('itemsAdded')
    const d = Date.now();
    const products = user.itemsAdded.filter( e=> d>=e.endTime&&!e.sold);
    const type = "BiddingOver"
    
    res.render('products/itemsadded',{ products, type })

}))

router.get('/itemsadded/sold', isLoggedIn, catchAsync( async(req, res)=>{

    const user = await User.findById(req.user._id).populate('itemsAdded')
    const products = user.itemsAdded.filter( e=> e.sold );
    const type = "Sold"
    await products.reverse()
    
    res.render('products/itemsadded',{ products, type })

}))

router.get('/itemswon', isLoggedIn, catchAsync( async( req, res)=>{

    const user = await User.findById(req.user._id).populate('itemsWon')
    const products = user.itemsWon;
    
    res.render('products/itemswon',{ products })

}))

router.route('/location')
.get( isLoggedIn, catchAsync( async(req, res)=>{
    const location  = req.user.location;
   
    res.render('products/location',{ location });
}))
.put( isLoggedIn, catchAsync( async(req, res)=>{
    const location  = req.body.location;
    if(location.trim()=="")
    {
        req.flash('error','Please provide a valid Location')
        return res.redirect('/user/location')
    }
    const user = await User.findByIdAndUpdate(req.user._id,{location: location})
    res.redirect('/user/location');

}))
module.exports = router

