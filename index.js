/**
 * Created by quang on 15/06/2017.
 */

const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require("body-parser")
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
// gm mô đum insert text vào ảnh
const gm = require('gm').subClass({imageMagick: true});
// cấu hình nụnucks
nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app,
    watch: true
});
    // sử dụng midleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static('public'))
    // template engine
app.engine('html', nunjucks.render);

app.set('view engine', 'html');
    //
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },  // derectory cần upload
    filename: function (req, file, cb) {
        cb(null, file.originalname) //shortid.generate() + '-'+
    }   // tên file upload

})
        // kiểm tra định dạng đuôi ảnh
function fileFilter (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(new Error(file.mimetype + ' is not accepted'))
    }
}
// sư dụng multer upload image
app.upload = multer({storage: storage, fileFilter: fileFilter})
    //render ra trang views.html phương thức get
app.get('/', (req, res) => {
    res.render('views')
})
    // render ra trang  localhost:3333/upload bằng phương thức get
app.post('/upload', app.upload.single('photo'), function (req, res, next) {
    console.log(req.file);
    console.log(req.body);
    // sư dung gm chèn chữ vào ảnh
    gm(req.file.path) // nơi chứa ảnh cần chèn
        .font("Helvetica.ttf", 60)
        .drawText(170, 100, req.file.filename)  // chữ cân viết vào
        .write('./public/uploads/' + req.file.originalname, function (err) {
            if (!err) console.log('done'); // nơi file đè chữ lưu trữ
            res.render('views',{image: req.file.originalname}) //render ra trang views
        });
})

app.listen(3333, () =>{
    console.log('listen on localhost:3333')
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Error: ' + err.message)
})


