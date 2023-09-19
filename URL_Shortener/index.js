const express =  require('express')
const mongoose = require('mongoose')
const bodyparser=require('body-parser')
const shorturl=require('./model/shortURL.js')
const app = express()

mongoose.connect("mongodb://localhost:27017/Example",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
var db=mongoose.connection;

db.on('error',()=>console.log('Error-Exists!'));
db.once('open',()=>console.log('Suuccessfully Connected!'));

app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(bodyparser.urlencoded({
    extended:true
}))
app.set('view engine', 'ejs')
app.get('/',async(req,res)=>
{
    const shorturls=await shorturl.find();
    res.render('index',{shorturls:shorturls});
})

app.post('/shortURLs',async(req,res)=>
{
    await shorturl.create({ full: req.body.fullurl})
    res.redirect('/')
})

app.get('/:shorturl',async(req,res)=>
{
    const urls=await shorturl.findOne({short:req.params.shorturl})
    if(urls==null) return res.sendStatus(404);
    urls.clicks++;
    urls.save();
    res.redirect(urls.full)
})

app.post('/shortURLs',(req,res)=>
{

})

app.listen(3000,(req,res)=>
{
    console.log('Successfully Registered-NodeJS!');
})