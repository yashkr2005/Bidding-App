const mongoose = require('mongoose')
const Schema = mongoose.Schema


const tranSchema = new Schema({
    amt: Number,
    name: String,
    date: Date,
    way: String
})

module.exports = mongoose.model("Transaction", tranSchema)