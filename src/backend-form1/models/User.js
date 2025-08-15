const mongoose = require('mongoose');
const { modelName } = require('./Transaction');


const userSchema  = new mongoose.Schema({
    CompanyName: {type: String, required: true},
    businessemail: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    isVerified: {type: Boolean, default: false},
    verificationCode: String,
    codeExpires: Date,
});

module.exports = mongoose.model('User', userSchema);