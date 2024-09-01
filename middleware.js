const { productSchema, biddingSchema, walletSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/product');



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Log in to continue');

        return res.redirect('/login');

    }
    next();
}




module.exports.validateProduct = (req, res, next) => {

        const { error } = productSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }

        
   
}


module.exports.isOwnerAndLimit = async (req, res, next)=>{
    
    
    try{
       const {id} = req.params;
       const product = await Product.findById(id);

    
    
    if(Date.now()>product.startTime)
    {
        req.flash('error', 'Action Not Allowed!!!')
        return res.redirect(`/products/${id}`)
    }
    if(!product.owner.equals(req.user._id))
    {
        req.flash('error', 'Action Not Allowed!!!')
        return res.redirect(`/products/${id}`)
    }
    }catch(e){
    req.flash('error','Item does not Exist or is Deleted')
    return res.redirect('/products')

    }

    next();
}

module.exports.isOwnerAndCondition = async (req, res, next)=>{
   
    
    try{
        const {id} = req.params;
        const product = await Product.findById(id);

    
    if(!product)
    {
        req.flash('error','Item does not Exist or is Deleted')
        return res.redirect('/products')
    } 
    if(Date.now() <= product.endTime || product.sold || product.biddings.length==0)
    {
        req.flash('error', 'Action Not Allowed!!!')
        return res.redirect(`/products/${id}`)
    }
    if(!product.owner.equals(req.user._id))
    {
        req.flash('error', 'Action Not Allowed!!!')
        return res.redirect(`/products/${id}`)
    }
    }catch(e){
    req.flash('error','Item does not Exist or is Deleted')
    return res.redirect('/products')

    }
    next();
}

module.exports.validateWalletValue = (req, res, next) =>{
    const {error} = walletSchema.validate(req.body)
    if(error){
        req.flash('error', 'Please Enter a Valid Value')
        return res.redirect('/user/wallet')
    }
    next();
}
module.exports.validateBidding = (req, res, next) => {
    const { error } = biddingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}