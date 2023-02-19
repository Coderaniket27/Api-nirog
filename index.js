const express = require('express')
const app = express()
const mongoose = require('mongoose');
var cors = require('cors')
var validator = require("email-validator");


const FormModel = require('./FormModel.js');
app.use(express.json()); // middleware
app.use(express.urlencoded({extended: true})); 
app.use(cors())
const port = process.env.PORT || 3001
const mongoURI = 'mongodb+srv://aniket:1q2w3e4r5t@cluster0.2dal9.mongodb.net/bck?retryWrites=true&w=majority';


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((res) => {
     //console.log(res);
     
    console.log('Connected to  congo database');
  })

app.get('/', (req, res) => {
    res.send('Hello World Aniket!')
  })
  app.get('/hero', (req, res) => {
    res.send('Hero beta!')
  })
  app.post('/register', async (req, res) => {
    console.log(req.body);
    const {  name, phone, email,address,query } = req.body;

    if( !name || !phone ||!address||!query) {
        return res.send({
            status: 400,
            message: "Missing data",
            data: req.body
        })
    }

    
    

    
if(query.length && address.length <5){
    return res.send({
        status: 400,
        message: "Invalid query or address",
        data: red.body
    })
}
    // Write into DB
        try {
            let email =req.body.email;
            if(validator.validate(email)){
            let formDs = await FormModel.findOne({email:email})
            console.log("hello kavya .......");
            if(formDs) {
                return res.send({
                    status: 401,
                    message: "email already taken please use another name"
                })
            }
        }
        else{

            return res.send({
                status:400,
                message: "email is not valid"
            })
        }
    }
catch(err){
    console.log(err)
   return res.send({
        status: 400,
        message: "Database   error",
        error: err
        
    })
}
let formData = new FormModel({
    name: name,

    phone: phone,
    query:query,
    address:address
    

})

if(email)
    formData.email = email;
    try {
    
        let formDb = await formData.save();

        console.log(formDb);

        res.send({
            status: 200,
            message: "Form Submmitted Successfully",
            pata: formDb
        });
    }
    catch(err) {
        console.log(err)
        res.send({
            status: 400,
            message: "Database error hai deho",
            error: err
        })
    }
})

app.post('/update', async(req, res) => {
    let name = req.body.name;
    let newData = req.body.newData;

    try {

        let oldData = await FormModel.findOneAndUpdate({name: name}, newData);
console.log(newData)
        res.send({
            status: 200,
            message: "Updated data successfully",
            data: oldData
        })
    }
    catch(err) {
        res.send({
            status: 400,
            message: "Database Error",
            error: err
        })
    }
  })
  app.post('/login', async (req,res) => {
    let email = req.body.email;
    let pass=req.body.password
    console.log(pass)

    let search
try {
     search= await FormModel.findOne({email:email})
    if(!search){
        return res.send({
            message:"enter email"
        })
    }
   
    if (!search.email==email){
        return res.send({
            message:"login with correct name",
            status:400
        })
    }
   
    
}
    catch(err){
        return res.send({
            message:"see problem"
        })
    }
try {
    console.log(pass)
    if(pass==search.password){
        return res.send({
            message:"login successfully",
            status:"200",
            email:email,
            data:search
        })
    }
    else{
        return res.send({
            message:"enter right password",
            status:400
        })
    }

    

}
catch(err){
    console.log(err)
    return res.send({
        message:"error"
    })
}
})









app.get('/dash', async(req, res) => {
    let email = req.body.email;
    let search
    try {
         search= await FormModel.findOne({email:email})
        if(!search){
            return res.send({
                message:"enter email"
            })
        }
        else{
            return res.send({
                message:"great api",
                data:search
            })
        }}
        catch(err){
            console.log(err)
            return res.send({
                message:"err"
            })
        }
    

})
    app.listen(port, () => {
    console.log(`Example app listening  aniket at http://localhost:${port}`)
  })