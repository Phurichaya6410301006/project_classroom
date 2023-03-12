const Authuser = require('./../models/authuser')
const AuthuserDocument = require('./../models/authuser-documment');
const {pathMapping} =require("./../middleware/pathMapping");

exports.create = (req, res) => {
    Authuser.find({ email: req.body.email}).then(async data => {
        if (data.length == 0) {
            const user = new Authuser(req.body);
            await user.save().then(async data => {
                await new AuthuserDocument({
                    fileName: '',
                    filePath: '',
                    fileType : '' ,
                    userId: data?._id
                 }).save();
                 
                return res.status(200).json({
                    code: 200,
                    msg: `บันทึกข้อมูลสำเร็จ`,
                    data: data
                });
            })
        }else{
           return res.status(409).json({
            code: 409,
            msg: `มีการใช้อีเมลนี้แล้ว`
        });  
        }
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `ไม่สามารถเพิ่มข้อมูลได้เนื่องจาก ${err.message}`
        });
    })
}

exports.login = (req, res) => {
    Authuser.findOne({ email: req.body.email}).then(data => {
        if (!data) {
            return res.status(404).json({
                code: 404,
                msg: `อีเมลหรือรหัสผ่านไม่ถูกต้อง`
            });
        }
        if(data.password != req.body.password){
            return res.status(404).json({
                code: 404,
                msg: `อีเมลหรือรหัสผ่านไม่ถูกต้อง`
            });
        }

        return res.status(200).json({
            code: 200,
            msg: `เข้าสู่ระบบเรียบร้อย`,
            data: data
        });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
        });
    })
}

exports.getUserInfo = (req, res) => {
    let dataReturn = {};
    Authuser.findById(req.params.userId).then(async data => {
        if(data == null){
         return res.status(404).json({
             code: 404,
             msg: `ไม่พบข้อมูล`
         });
        }

        await AuthuserDocument.findOne({userId : req.params.userId}).then(async dataDoc => {
            dataReturn = Object.assign({},data._doc,{
            fileName: dataDoc.fileName,
            filePath:pathMapping({shortPath: dataDoc.filePath}),
            fileType : dataDoc.fileType,
            fileId :dataDoc._id
          })
        })

         return res.status(200).json({
             code: 200,
             msg: `พบข้อมูล`,
             data:dataReturn
         });
     }).catch(err => {
         return res.status(500).json({
             code: 500,
             msg: `เกิดข้อผิดพลาดเนื่องจาก ${err.message}`
         });
     })
 }


 exports.updateUser = (req, res) => {
    
    Authuser.findByIdAndUpdate(req.params.userId,{$set: {
        email:req.body.email,
        fullName:req.body.fullName,
     }}).then(async dataUser => {
        const {  fileMiddleware } = req.body;
        if(fileMiddleware){
            const {
                imagePathFull,
                imagePath,
                fieldName,
                originalname,
                mimetype,
            } = fileMiddleware[0];
            await AuthuserDocument.findOneAndUpdate({userId : req.params.userId},{$set: {
                fileName: originalname,
                filePath: imagePath,
                fileType : mimetype 
             } })
        }
       return res.status(200).json({
                    code: 200,
                    msg: `บันทึกข้อมูลสำเร็จ`
                });
    }).catch(err => {
        return res.status(500).json({
            code: 500,
            msg: `ไม่สามารถแก้ไขข้อมูลได้เนื่องจาก ${err.message}`
        });
    })
}

