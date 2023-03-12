const mongoose = require('mongoose');

const AnnounceAndWorkDocumentSchema = mongoose.Schema({
    fileName: String,
    filePath: String,
    fileType:String ,
    classRoomId: String,
    announceAndWorkId: String
},{
    versionKey:false
});

module.exports = mongoose.model('AnnounceAndWorkDocument',AnnounceAndWorkDocumentSchema)