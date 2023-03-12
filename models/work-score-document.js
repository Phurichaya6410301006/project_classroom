const mongoose = require('mongoose');

const WorkScoreDocumentSchema = mongoose.Schema({
    fileName: String,
    filePath: String,
    fileType:String ,
    userId: String,
    workId: String
},{
    versionKey:false
});

module.exports = mongoose.model('WorkScoreDocument',WorkScoreDocumentSchema)