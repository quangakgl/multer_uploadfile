/**
 * Created by quang on 15/06/2017.
 */
const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true});
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require("body-parser")
const multer = require('multer')
const shortid = require('shortid')
nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app,
    watch: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static('public'))

app.engine('html', nunjucks.render);

app.set('view engine', 'html');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //shortid.generate() + '-'+
    }

})

function fileFilter (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(new Error(file.mimetype + ' is not accepted'))
    }
}

app.upload = multer({storage: storage, fileFilter: fileFilter})

app.get('/', (req, res) => {
    res.render('views')
})

app.post('/upload', app.upload.single('photo'), function (req, res, next) {

    console.log(req.file);
    console.log(req.body);

    gm(req.file.path)
        .font("Helvetica.ttf", 60)
        .drawText(170, 100, req.file.filename)
        .write('./public/uploads/' + req.file.originalname, function (err) {
            if (!err) console.log('done');
            res.render('views',{image: req.file.originalname})
        });
})

app.listen(3333, () =>{
    console.log('listen on localhost:3333')
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Error: ' + err.message)
})


