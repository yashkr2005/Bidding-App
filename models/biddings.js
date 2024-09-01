const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bidSchema = new Schema({
    //uname: String,
    price: Number,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }
})

module.exports = mongoose.model("Bidding", bidSchema)