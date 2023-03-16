const express = require('express')
const app = express()
const mongoose = require('mongoose');
var cors = require('cors')
var validator = require("email-validator");
const session = require('express-session');
const MongoDBSession= require('connect-mongodb-session')(session);

const FormModel = require('./FormModel.js');
const FormModels = require('./FormData.js');

app.use(express.json()); // middleware
app.use(express.urlencoded({extended: true})); 
app.use(cors())
const mongoURI = 'mongodb+srv://aniket:1q2w3e4r5t@cluster0.2dal9.mongodb.net/bck?retryWrites=true&w=majority';
const isAuth =(req,res,next) =>{
    if(req.session.isAuths){
        next();
    }
    else{
        res.send({
            message:"jare login kar"
        })
    }
}
const database = new MongoDBSession({
    uri:mongoURI,
    collection: "mySessi"

})
app.use(session({secret: "Shh, its a secret!",
resave: false,
saveUninitialized: false,

store: database,
saveUninitialized:true,
resave: false 
}));

const port = process.env.PORT || 3001


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((res) => {
     //console.log(res);
     
    console.log('Connected to  congo database');
  })

app.get('/', (req, res) => {
    req.session.isAuths = true;

    res.send('Hello World Aniket boss!')
  })
  app.get('/check', (req, res) => {
      req.session.destroy()
    res.send('Hello World Aniket !')
  })
  app.get('/great', (req, res) => {
    try {
        if(req.session.isAuths==true){
            res.send("good")
        }
        else{
            res.send("please hit")
        }
    }
    catch(err){
        console.log(err)
        return res.send({
            message:"err"
        })
    }

  })

  app.get('/find', async (req, res) => {
    
   
    try {
         search= await FormModel.find()
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
  app.post('/cardregister', isAuth, async (req, res, next) => {
    console.log(req.body);
   
    const {name, phone, email,address,query} = req.body;

    if( !name || !phone ||!address||!query) {
        return res.send({
            status: 400,
            message: "Missing data",
            data: req.body
        })
    }
   if (query.length!=8){
    return res.send({
        status:400,
        message: "Please enter Valid Aadhar",
        data: req.body
    })
   }
    
    

    

    // Write into DB
        try {
            let Aadhar =req.body.query;
            let phone = req.body.phone;

            
            let formDs = await FormModel.findOne({phone:phone}||{query:Aadhar})
            
            if(formDs) {
                return res.send({
                    status: 401,
                    message: "Aadhar or phone  already taken please use another"
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
                    message: "email or no already taken please use another name"
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
    let phone = req.body.phone;
    let newData = req.body.newData;
    console.log(req.body)

    try {

        let oldData = await FormModel.findOneAndUpdate({phone: phone}, newData);
        console.log(oldData)
console.log(newData)
if(oldData){
       return  res.send({
            status: 200,
            message: "Updated data successfully bro",
            data: oldData
        })
    }
    else{
        return res.send({
            message:"enter data",
            status:400
        })
    }
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
    let email = "prakashaniket3@gmail.com"
    let pass="12345678"
    let Email=req.body.email;
    let Pass=req.body.password;
    console.log(pass)

    
try {
    if(Email===email && pass==Pass){
        req.session.isAuths = true;

        return res.send({
           status:"200",
            message:"login"
        })
    }
    else{
       return res.send({
           status:"400",
        message: "please login"
        })
    }
    
   
   
    
}
    catch(err){
        return res.send({
            message:"see problem"
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

app.post('/dashboard', async (req, res) => {
    console.log(req.body);
    const {  name, phone,address,pincode,status,date } = req.body;

    if( !name || !phone ||!address||!pincode||!status||!date) {
        return res.send({
            status: 400,
            message: "Missing data",
            data: req.body
        })
    }

    
    

 
    // Write into DB
        
let form = new FormModels({
    name: name,
    phone: phone,
    address:address,
    pincode:pincode,
    status:status,
    date:date,
    

})
try {
    
    let formData = await form.save();

    console.log(formData);

    res.send({
        status: 200,
        message: "Form Submmitted Successfully",
        data: formData
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

app.get('/finddata/:date', async (req, res) => {
    
   let date=req.params;

    try {
         search= await FormModels.find(date)
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