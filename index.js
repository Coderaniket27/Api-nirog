const express = require('express')
const app = express()
const mongoose = require('mongoose');
var cors = require('cors')

const secret="i love my ????"
var validator = require("email-validator");
const jwt = require('jsonwebtoken');

const FormModel = require('./FormModel.js');
const FormModels = require('./FormData.js');

app.use(express.json()); // middleware
app.use(express.urlencoded({extended: true})); 
app.use(cors())
const mongoURI = 'mongodb+srv://aniket:1q2w3e4r5t@cluster0.2dal9.mongodb.net/bck?retryWrites=true&w=majority';



const port = process.env.PORT || 3001


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((res) => {
     //console.log(res);
     
    console.log('Connected to  congo database');
  })
  function generateToken(user) {
    const payload = {
     
        id: user.id,
        email: user.email,
    };
    const options = { expiresIn: '1d' };

    return jwt.sign(payload, secret, options);
  }
  
  // This function will authenticate a user based on the JWT token
  function authenticate (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

app.get('/', (req, res) => {

    res.send('Hello World Aniket boss!')
  })
  app.get('/check', (req, res) => {
      req.session.destroy()
    res.send('Hello World Aniket !')
  })
  
  app.post('/logout', (req,res) =>{
    try{
        req.session.destroy()
   res.send({
    status:200,
    message:"Log out successfully"
   })
    }
    catch(err){
        res.send({
            status: 400,
            message: "Database error hai deho",
            error: err
        })
    }
  })
  app.post('/register',  async (req, res, next) => {
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
  app.post('/cardregister', authenticate, async (req, res) => {
    console.log(req.body);
    const {  name, phone, email,address,aadhar,pincode,date,member } = req.body;
try {
    if( !name || !phone ||!address||!aadhar||!date||!member) {
        return res.send({
            status: 400,
            message: "Missing data hai",
            data: req.body
        })
    }

    
    

    
if(aadhar.length !="12"){
    return res.send({
        status: 400,
        message: "Invalid aadhar no",
        data: req.body
    })
}
}
catch(err) {
    console.log(err)
    res.send({
        status: 400,
        message: "Database error hai deho",
        error: err
    })
}
    // Write into DB
        try {
            let aadhar =req.body.aadhar;
            let member= req.body.member
            
            let formDs = await FormModel.findOne({aadhar:aadhar})

        
            if(formDs) {
                return res.send({
                    status: 401,
                    message: " Aadhar  already Registered"
                })
            }
            let formMember = await FormModel.findOne({member:member})
            if(formMember) {
                return res.send({
                    status: 401,
                    message: " membership ID already Registered"
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
     pincode:pincode,
    phone: phone,
    aadhar:aadhar,
    address:address,
    date:date,
    email:email,
    member:member
    

})


    try {
    
        let formDb = await formData.save();

        console.log(formDb);

        res.send({
            status: "200",
            message: "Form Submmitted Successfully",
            pata: formDb
        });
    }
    catch(err) {
        console.log(err)
        res.send({
            status: 400,
            message: "Database error ",
            error: err
        })
    }
})

// app.post('/update', async(req, res) => {
//     let phone = req.body.phone;
//     let newData = req.body.newData;
//     console.log(req.body)

//     try {

//         let oldData = await FormModel.findOneAndUpdate({phone: phone}, newData);
//         console.log(oldData)
// console.log(newData)
// if(oldData){
//        return  res.send({
//             status: 200,
//             message: "Updated data successfully bro",
//             data: oldData
//         })
//     }
//     else{
//         return res.send({
//             message:"enter data",
//             status:400
//         })
//     }
// }

   

//     catch(err) {
//         res.send({
//             status: 400,
//             message: "Database Error",
//             error: err
//         })
//     }
//   })
app.post('/login', async (req, res) => {
    // You should validate the user's credentials before generating the token
   
    
    const email=req.body.email
    const password=req.body.password
    

      try{

        const user = {
            id: 1,
            email: email,
          
          };

  // Check if email and password were provided in the request body
  if (!email || !password) {
    return res.send({ message: 'Please provide email and password',status:"404" });
  }

  // Find the user by email address in your database or data source
//    const search= await FormModelss.findOne({email:email})
//   if(!search ){
//     res.send({
//         message:"please enter valid email",
//         status:"404"
//     })
// }
const validEmail = 'prakashaniket3@gmail.com';
const validPassword = 'password12345';

if (email !== validEmail || password !== validPassword) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

    const token = generateToken(user);
    
  res.send({
    message:"login success",
    status:"200",
    token:token
  })

  
}
catch(err){
    console.log(err)
    return res.send({
        message:"err"
    })
}
  });
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









app.post('/downloadcard', async(req, res) => {
    let aadhar = req.body.aadhar;
    let search
    try {
         search= await FormModel.findOne({aadhar:aadhar})
        if(!search){
            return res.send({
                message:"enter correct aadhar no"
            })
        }
        else{
            return res.send({
                status:"200",
                message:"card downloaded",
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