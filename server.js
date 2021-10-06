const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://gnanesh:gnanesh@cluster0.9n91y.mongodb.net/HasteBin?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser: true
},()=>{
    console.log("database running");
});

const Document = require('./models/Document');


app.get("/", (req,res)=>{
    const code = `Welcome to HasteBin!
    
use the commands in the top right corner
to create a new file to share with others

    `
    res.render("code-display", { code, language: 'plaintext' });
});

app.get("/new", (req,res)=>{
     res.render('new')
})

app.post('/save', async(req,res)=>{
    try {
        const value = req.body.value;
        console.log(value); 
        const document  = await Document.create({value});
        res.redirect(`/${document.id}`);
    } 
    catch (error) {
        console.error(error);
        res.render('new', {value});
    }
   
});

app.get('/:id', async(req,res)=>{
    const id  = req.params.id;

    try {
     const document = await Document.findById(id);
     res.render('code-display', {code: document.value, id});    
    } 
    catch (error) {
        console.error(error);
        res.redirect('/');
        
    }

})

app.get("/:id/duplicate", async(req,res)=>{
    const id  = req.params.id;

    try {
     const document = await Document.findById(id);
     res.render('new', {value: document.value});    
    } 
    catch (error) {
        console.error(error);
        res.redirect(`/${id}`);
        
    }
})

app.listen(3000, (req,res)=>{console.log("server running")});