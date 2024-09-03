const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
    familyAadhar: {
        type: String,
        unique: true,  // Ensure family member's aadhar is unique
        sparse: true   // Allows for null/undefined values
    },
    familyFullName: {
        type: String,
    }
});

const formSchema = new Schema({
    pincode: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true  // Ensure phone number is unique
    },
    name: {
        type: String,
        required: true,
        unique: true  // Ensure name is unique
    },
    email: {
        type: String,
        required: true,
        unique: true  // Ensure email is unique
    },
    address: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true,
        unique: true,  // Ensure aadhar number is unique
        minlength: 12,
        maxlength: 12
    },
    date: {
        type: String,
        required: true
    },
    member: {
        type: String,
        required: true,
        unique: true  // Ensure member ID is unique
    },
    status: {
        type: String,
    },
    familyMembers: [familyMemberSchema]  // Embed family members schema
}, {
    timestamps: true  // Add timestamps for createdAt and updatedAt
});

module.exports = mongoose.model('Formdated', formSchema);
