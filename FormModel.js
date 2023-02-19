const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    query: {
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
        type: String
    },
    password: {
        type: String,
        //required: true
    },
    
   
})

module.exports = mongoose.model('Forms', formSchema);