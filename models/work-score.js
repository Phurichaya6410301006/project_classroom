const mongoose = require('mongoose');

const WorkScoreSchema = mongoose.Schema({
    workId: String,
    userId : String,
    score:Number,
    workText:String,
    statusWork:String
},{
    versionKey:false
});

module.exports = mongoose.model('WorkScore',WorkScoreSchema);

// statusWork : NOT_SUBMIT,SUBMIT,CHECK_SUBMIT

