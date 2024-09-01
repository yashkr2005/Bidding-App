const mongoose = require('mongoose');
const Bidding = require('./biddings');
const User = require('./user');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: String,
    image: [ {
        url: String,
        filename: String
    }],
    startTime: Date,
    duration: Number,
    endTime: Date,
    sold: {
        type: Boolean,
        default: false
    },
    category: String,
    price: Number,
    lastbid: Number,
    lastbidder: String,
    description: String,
    favCount:{
        type: Number,
        default: 0
    },
    favdata: Array,
    owner:{
              type: Schema.Types.ObjectId,
              ref: 'User'
    },

    biddings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Bidding'
        }
    ]
    
});

ProductSchema.post('findOneAndDelete', async function(doc){
    if(doc)
    {
        await Bidding.deleteMany({
            _id: {
                $in: doc.biddings
            }
        })
    }
})

module.exports = mongoose.model('Product', ProductSchema);