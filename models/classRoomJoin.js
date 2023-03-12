const mongoose = require('mongoose');

const ClassRoomJoinSchema = mongoose.Schema({
    classRoomId: String,
    userId : String
},{
    versionKey:false
});

module.exports = mongoose.model('ClassRoomJoin',ClassRoomJoinSchema)