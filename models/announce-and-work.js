const mongoose = require('mongoose');

const AnnounceAndWorkSchema = mongoose.Schema({
    classRoomId: String,
    description: String,
    subject: String,
    userCreateId: String,
    userCreateDate: String,
    userUpdateId: String,
    userUpdateDate: String,
    announceOrWork: String
},{
    versionKey:false
});

module.exports = mongoose.model('AnnounceAndWork',AnnounceAndWorkSchema)

// announceOrWork = ANNOUNCE , WORK