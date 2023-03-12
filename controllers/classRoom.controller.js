const ClassRoom = require("./../models/classRoom");
const ClassRoomJoin = require("./../models/classRoomJoin");
const AnnounceAndWork = require("./../models/announce-and-work");
const AnnounceAndWorkDocument = require("./../models/announce-and-work-document");
const Authuser = require('./../models/authuser')
const WorkScore = require('./../models/work-score');
const { v4: uuidv4 } = require('uuid');
const {pathMapping} =require("./../middleware/pathMapping");
const AuthuserDocument = require('./../models/authuser-documment')

exports.create = (req, res) => {
    req.body.keyClassRoom = uuidv4().substring(0, getRandomIntInclusive(5,7));
    const classroom = new ClassRoom(req.body);
    
    classroom
        .save()
        .then(async (data) => {
            const classroomjoin = new ClassRoomJoin({
                classRoomId: data._id,
                userId : req.body.userCreateId
            });

            await classroomjoin.save();
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



exports.getListClassRoomPerPerson = (req, res) => {
    ClassRoomJoin.find({ userId: req.query.userId}).then(async data => {
        let listData = []
        for (const item of data) {
          await ClassRoom.findById(item.classRoomId).then(async classroom => { 
            listData.push(Object.assign({},item._doc,{classroom : classroom}));
        })
        }

        return res.status(200).json({
            code: 200,
            msg: `ค้นหาข้อมูล`,
            data: listData
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.createClassRoomjoinByKey = async (req, res) => {
    ClassRoom.findOne({ keyClassRoom : req.params.keyClassRoom}).then( async classroom => { 
         console.log(classroom);

           if(classroom == null){
            return res.status(404).json({
                code: 404,
                msg: `รหัสชั้นเรียนไม่ถูกต้อง`,
            });
           }

            const classroomjoin = new ClassRoomJoin({
                classRoomId: classroom._id,
                userId : req.body.userId
            });

            await classroomjoin.save();
            return res.status(200).json({
                code: 200,
                msg: `บันทึกข้อมูลสำเร็จ`
            });
       
    }).catch((err) => {
            return res.status(500).json({
                code: 500,
                msg: `ไม่สามารถเข้าร่วมชั้นเรียนได้เนื่องจาก ${err.message}`,
            });
        });
};

exports.createClassroomAnnounceAndWorkDocument = async (req, res) => {
    
    const announceAndWork = new AnnounceAndWork({
        classRoomId: req.body.classRoomId,
        description: req.body.description,
        subject: req.body.subject,
        userCreateId: req.body.userCreateId,
        userCreateDate: req.body.userCreateDate,
        userUpdateId: req.body.userUpdateId,
        userUpdateDate: req.body.userUpdateDate,
        announceOrWork: req.body.announceOrWork
    });
    announceAndWork
        .save()
        .then(async (dataAnnounceAndWork) => {
            const {  fileMiddleware } = req.body;
            if(fileMiddleware){
                  for (let i = 0; i < fileMiddleware.length; i++) {
                const {
                    imagePathFull,
                    imagePath,
                    fieldName,
                    originalname,
                    mimetype,
                } = fileMiddleware[i];
                
                const announceAndWorkDocument = new AnnounceAndWorkDocument({
                    fileName: originalname,
                    filePath: imagePath,
                    fileType : mimetype ,
                    classRoomId:  req.body.classRoomId,
                    announceAndWorkId: dataAnnounceAndWork._id,
                 });

                 await announceAndWorkDocument.save();
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

exports.updateClassroomAnnounceAndWorkDocument = async (req, res) => {
    
        AnnounceAndWork.findByIdAndUpdate(req.params.announceAndWorkId,req.body).then(async (dataAnnounceAndWork) => {
            const {  fileMiddleware } = req.body;
            if(fileMiddleware){
                  for (let i = 0; i < fileMiddleware.length; i++) {
                const {
                    imagePathFull,
                    imagePath,
                    fieldName,
                    originalname,
                    mimetype,
                } = fileMiddleware[i];
                
                const announceAndWorkDocument = new AnnounceAndWorkDocument({
                    fileName: originalname,
                    filePath: imagePath,
                    fileType : mimetype ,
                    classRoomId:  req.body.classRoomId,
                    announceAndWorkId: req.body._id,
                 });

                 await announceAndWorkDocument.save();
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

exports.getListClassRoomAnnounceAndWork = (req, res) => {
    AnnounceAndWork.find({classRoomId:req.params.classRoomId}).then(async data => {
        let listData = [];
        let listDataReturn = {};
        for (const item of data) {
          await AnnounceAndWorkDocument.find({$and:[{classRoomId: req.params.classRoomId},{announceAndWorkId:item._id}]}).then(async dataFind => { 
            dataFind.forEach((e) => {
                e.filePath = pathMapping({shortPath: e.filePath});
              });
            await Authuser.findById(item.userCreateId).then(async user => { 
                await AuthuserDocument.findOne({userId : user._id}).then(async dataDoc => {
                    user = Object.assign({},user._doc,{
                    fileName: dataDoc.fileName,
                    filePath:pathMapping({shortPath: dataDoc.filePath}),
                    fileType : dataDoc.fileType,
                    fileId :dataDoc._id
                  })
                })
                listData.push(Object.assign({},item._doc,{listFile : dataFind,userCreate:user}));
            });

            
        })
        }

        for (const element of listData) {
             await WorkScore.find({workId:element._id}).then( workScoer => { 
                element.workScoer = workScoer;
            });
        }

        await ClassRoom.findById(req.params.classRoomId).then(async classroom => { 
           listDataReturn = Object.assign({},classroom._doc,{listAnnounceAndWork : listData});
        })

        return res.status(200).json({
            code: 200,
            msg: `ค้นหาข้อมูล`,
            data: listDataReturn
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.deleteAnnounceAndWorkDocument = (req, res) => {
    AnnounceAndWorkDocument.findByIdAndDelete(req.params.announceAndWorkDocumentId).then(async data => {
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูลที่ต้องการลบ`
        });
       }
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

exports.deleteAnnounceAndWork = (req, res) => {
    AnnounceAndWork.findByIdAndDelete(req.params.announceAndWorkId).then(async data => {
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูลที่ต้องการลบ`
        });
       }
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

exports.getListPersonPerClassRoom = (req, res) => {
    ClassRoomJoin.find({ classRoomId: req.query.classRoomId}).then(async data => {
        let listData = []
        for (const item of data) {
          await Authuser.findById(item.userId).then(async user => { 
            await AuthuserDocument.findOne({userId : user._id}).then(async dataDoc => {
                user = Object.assign({},user._doc,{
                fileName: dataDoc.fileName,
                filePath:pathMapping({shortPath: dataDoc.filePath}),
                fileType : dataDoc.fileType,
                fileId :dataDoc._id
              })
            })
            listData.push(Object.assign({},item._doc,{user : user}));
        })
        }

        return res.status(200).json({
            code: 200,
            msg: `ค้นหาข้อมูล`,
            data: listData
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.deleteClassRoom = (req, res) => {
    console.log(req.params.classRoomId);
    ClassRoom.findByIdAndDelete(req.params.classRoomId).then(async data => {
        await ClassRoomJoin.deleteMany({classRoomId : req.params.classRoomId});
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูลที่ต้องการลบ`
        });
       }
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

exports.getClassroomById = (req, res) => {
    ClassRoom.findById(req.params.classRoomId).then(async data => {
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูล`
        });
       }
        return res.status(200).json({
            code: 200,
            msg: `พบข้อมูล`,
            data:data
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.updateClassroomById = (req, res) => {
    ClassRoom.findByIdAndUpdate(req.params.classRoomId, req.body).then(async data => {
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูลที่ต้องการแก้ไข`
        });
       }
        return res.status(200).json({
            code: 200,
            msg: `แก้ไขข้อมูลชั้นเรียนเรียบร้อย`,
            data:data
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.getAnnounceandWork = (req, res) => {
   AnnounceAndWork.findById(req.params.announceAndWorkId).then(async data => {
       if(data == null){
        return res.status(404).json({
            code: 404,
            msg: `ไม่พบข้อมูล`
        });
       }
        return res.status(200).json({
            code: 200,
            msg: `พบข้อมูล`,
            data:data
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }