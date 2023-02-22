const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    pincode: {
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
    date: {
        type: String
    },
    status: {
        type: String,
        //required: true
    },
    
   
})

module.exports = mongoose.model('Formdata', formSchema);