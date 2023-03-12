const WorkScore = require('./../models/work-score');
const WorkScoreDocument = require('./../models/work-score-document');
const {pathMapping} =require("./../middleware/pathMapping");
const Authuser = require('./../models/authuser');
const ClassRoomJoin = require("./../models/classRoomJoin");

exports.createSendWork = async (req, res) => {

    let newWork = null;
    await WorkScore.findOne({ $and: [{ workId: req.params.workId }, { userId: req.params.userId }] }).then(async work => {
        if (work == null) {
            await new WorkScore({
                workId: req.params.workId,
                userId: req.params.userId,
                score: null,
                workText: '',
                statusWork: 'SUBMIT'
            }).save().then(async (work) => { newWork = work; })
        }else{
            await WorkScore.updateOne({ $and: [{ workId: req.params.workId }, { userId: req.params.userId }] }, {$set: { statusWork: 'SUBMIT' }}, {upsert: true});

        }

        const { fileMiddleware } = req.body;
        if (fileMiddleware) {
            for (let i = 0; i < fileMiddleware.length; i++) {
                const {
                    imagePath,
                    originalname,
                    mimetype,
                } = fileMiddleware[i];

                const workscoredocument = new WorkScoreDocument({
                    fileName: originalname,
                    filePath: imagePath,
                    fileType: mimetype,
                    userId: req.params.userId,
                    workId: req.params.workId
                });

                await workscoredocument.save();
            }
        }


        return res.status(200).json({
            code: 200,
            msg: `บันทึกข้อมูลสำเร็จ`
        });


    }).catch((err) => {
        return res.status(500).json({
            code: 500,
            msg: `ไม่สามารถเพิ่มข้อมูลได้เนื่องจาก ${err.message}`,
        });
    });
};

exports.getListSendWork = async (req, res) => {

    let jsonWorkScore = {};
    await WorkScore.findOne({ $and: [{ workId: req.params.workId }, { userId: req.params.userId }] }).then(async workScore => {

    console.log(req.params.workId,req.params.userId);
        await WorkScoreDocument.find({ $and: [{ workId: req.params.workId }, { userId: req.params.userId }] }).then(async dataFind => {
            dataFind.forEach((e) => { e.filePath = pathMapping({ shortPath: e.filePath }) });
         
            jsonWorkScore = Object.assign({}, workScore?  workScore._doc :{}, { listFile: dataFind });
        })

        
        return res.status(200).json({
            code: 200,
            msg: `ค้นหาข้อมูล`,
            data: jsonWorkScore
        });

    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.deleteWorkScoreDocument = (req, res) => {
    WorkScoreDocument.findByIdAndDelete(req.params.workScoreDocumentId).then(async data => {
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูลที่ต้องการลบ`
        });
       }
        
       await WorkScoreDocument.find({ $and: [{ workId: req.params.workId }, { userId: req.params.userId }] }).then(async dataFind => {
        if(dataFind.length == 0){
            await WorkScore.updateOne({ $and: [{ workId: data.workId }, { userId: data.userId }] }, {$set: { statusWork: 'NOT_SUBMIT' }}, {upsert: true});
        }
       })

        return res.status(200).json({
            code: 200,
            msg: `ลบข้อมูลเรียบร้อย`
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}


exports.getListWorkScoreInWork = async (req, res) => {

    let jsonWorkScore = [];
    await WorkScore.find({workId:req.params.workId}).then(async workscore => {

        console.log(workscore);
        for (const itemWorkscore of workscore) {
            await WorkScoreDocument.find({ $and: [{ workId: itemWorkscore.workId }, { userId: itemWorkscore.userId }] }).then(async dataFind => {
            dataFind.forEach((e) => { e.filePath = pathMapping({ shortPath: e.filePath }) });
         
            jsonWorkScore.push(Object.assign({}, itemWorkscore?  itemWorkscore._doc :{}, { listFile: dataFind }));
        })
        }

        

        return res.status(200).json({
            code: 200,
            msg: `ค้นหาข้อมูล`,
            data: jsonWorkScore
        });

    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}


exports.updateScoreWork = (req, res) => {
    WorkScore.findByIdAndUpdate(req.params.workscoreId, {$set: { score: req.body.score,statusWork: 'CHECK_SUBMIT' }}, {upsert: true})
    .then(async (data) => {
            return res.status(200).json({
                code: 200,
                msg: `บันทึกข้อมูลสำเร็จ`,
                data: data,
            });
        }).catch((err) => {
            return res.status(500).json({
                code: 500,
                msg: `ไม่สามารถเพิ่มข้อมูลได้เนื่องจาก ${err.message}`,
            });
        });
};