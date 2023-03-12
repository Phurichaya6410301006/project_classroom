const mongoose = require('mongoose');

const ClassRoomSchema = mongoose.Schema({
    keyClassRoom: String,
    nameClassRoom : String,
    classRoomNumber : String,
    descriptionClassRoom: String,
    subject: String,
    userCreateId: String,
    userCreateDate: String,
    userUpdateId: String,
    userUpdateDate: String,
},{
    versionKey:false
});

module.exports = mongoose.model('ClassRoom',ClassRoomSchema)