const mongoose = require('mongoose');

const AuthuserDocumentSchema = mongoose.Schema({
    fileName: String,
    filePath: String,
    fileType:String ,
    userId: String
},{
    versionKey:false
});

module.exports = mongoose.model('AuthuserDocument',AuthuserDocumentSchema)