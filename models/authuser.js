const mongoose = require('mongoose');

const AuthUserSchema = mongoose.Schema({
    fullName : String,
    email : String,
    password : String
},{
    versionKey:false
});

module.exports = mongoose.model('User',AuthUserSchema)