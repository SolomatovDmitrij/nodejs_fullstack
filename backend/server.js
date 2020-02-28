const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

//express customization
const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute = 'mongodb+srv://admin:admin1982@cluster0-mjnlg.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connecting to database'));
db.on('error', console.error.bind(console, 'connect error to MongoDB database:'));

//logger customization
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//get metod
router.get('/getData', (req, res) => {
    Data.find( (err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    }
)});

//update data
router.post('/updateData', (req, res) => {
    const { id, update } = req.body;
    Data.findAndUodateData(id, update, (err) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    }); 
});

//delete
router.delete('/deleteData', (req, res) => {
    const {id} = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({success: true});
    });
});

//create 
router.post('/putData', (req, res) => {
    const {id, message} = req.body;
    if ((!id && id!==0) || !message) return res.json({
        success: false,
        error: 'invalid input data'
    });
    data = new Data;
    data.id = id;
    data.message = message;
    data.save((err) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    })
} );

app.use('/api', router);
app.listen(API_PORT, () => console.log(`listening port ${API_PORT}`));


