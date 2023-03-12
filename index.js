const express = require('express')
const bodyPraser = require('body-parser')
const mongoose = require('mongoose')

const dbConfig = require('./config/mongodb.config.js')

const constant = require('./constant/initdata.constant')

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended:true
}))

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url).then(()=>{
  initDataConstant();
}).catch(err => {
  console.log('Cannot connect');
  process.exit();
})

app.use(cors());
app.use('/file_resource', express.static(__dirname + "/public/data/uploads"));
app.get('/',(req,res) => {
    let port = server.address().port
    res.json({result :"ok",status :`Server Run as ${port}`})
})

require('./routes/authuser.route')(app);
require('./routes/classRoom.route')(app);
require('./routes/work-score.route')(app);


const server = app.listen(3000,()=>{
  let port = server.address().port
  console.log('run as',port);
})


// const Customer = require('./models/customer.js')

function initDataConstant(){
  // Customer.deleteMany(()=>{constant.sex.forEach(element => {new Customer(element).save()})});
}
