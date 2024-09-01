const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    wallet:{
        type: Number,
        default: 0
    },
    location:{
        type: String,
        default: ""
    },
    itemsSold:{
        type: Number,
        default: 0
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    itemsAdded:[{
        type: Schema.Types.ObjectId,
        ref:'Product'
    }],
    itemsWon: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);