const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    aadhar: {
        type: String,
        
    },
    member: {
        type: String,
    },
    pincode: {
        type: String,
    },
    date: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    name: {
        type:String,
    },
    address:{
        type:String,
    },
    email: {
        type: String,
    },
   
    
   
})

module.exports = mongoose.model('cardData', formSchema);