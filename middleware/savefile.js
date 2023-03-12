const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const imagePath = '/public/data/uploads';
const dir = path.join(__dirname, '../', imagePath);

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
    console.log("Hello World", dir);
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const filename = uuidv4() + path.extname(file.originalname);
    const files = req.body.fileMiddleware || [];
    console.log(file);
    files.push({
      imagePathFull: dir + '/' + filename,
      imagePath: imagePath + '/' + filename,
      fieldName: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });
    req.body.fileMiddleware = files;
    cb(null, filename);
  },
});

function _saveFile(fields) {
  const saveFileMiddle = multer({storage: storage})
      .fields(fields);
  return saveFileMiddle;
}

module.exports.saveFileMiddleware = {saveFile: _saveFile};
