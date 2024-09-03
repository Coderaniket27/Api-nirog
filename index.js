const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const { mongoURI } = require("./private-constant");

const secret = "i love my ????";
var validator = require("email-validator");
const jwt = require("jsonwebtoken");

const FormModel = require("./FormModel.js");
const FormModels = require("./FormData.js");

app.use(express.json()); // middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3001;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    //console.log(res);

    console.log("Connected to  congo database");
  });
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };
  const options = { expiresIn: "1d" };

  return jwt.sign(payload, secret, options);
}

// This function will authenticate a user based on the JWT token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/", (req, res) => {
  res.send("Alok Weds %%%%%");
});
app.get("/check", (req, res) => {
  req.session.destroy();
  res.send("Hello World Aniket !");
});



app.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.send({
      status: 200,
      message: "Log out successfully",
    });
  } catch (err) {
    res.send({
      status: 400,
      message: "Database error hai deho",
      error: err,
    });
  }
});
app.post("/cardregister",  async (req, res) => {
  const { name, phone, email, address, aadhar, pincode, date, member, familyMembers } = req.body;

  try {
      // Validate required fields
      if (!name || !phone || !email || !address || !aadhar || !date || !member) {
          return res.status(400).send({
              message: "Missing data hai",
              data: req.body,
          });
      }

      // Validate Aadhar number length
      if (aadhar.length !== 12) {
          return res.status(400).send({
              message: "Invalid Aadhar number",
              data: req.body,
          });
      }

      // Check for existing entries
      const existingUser = await FormModel.findOne({ 
          $or: [{ aadhar }, { phone }, { email }, { member }]
      });

      if (existingUser) {
          return res.status(401).send({
              message: "Aadhar, phone, email, or membership ID already registered",
          });
      }

      // Check family members' Aadhar numbers
      if (familyMembers && familyMembers.length > 0) {
          for (let i = 0; i < familyMembers.length; i++) {
              const familyAadhar = familyMembers[i].familyAadhar;

              if (familyAadhar) {
                  const existingFamilyMember = await FormModel.findOne({ "familyMembers.familyAadhar": familyAadhar });
                  console.log(existingFamilyMember,"ko")
                  if (existingFamilyMember) {
                      return res.status(401).send({
                          message: `Family member's Aadhar number at index ${i} is already registered`,
                      });
                  }
              }
          }
      }

      // Save the new form data
      const formData = new FormModel({
          name,
          pincode,
          phone,
          email,
          address,
          aadhar,
          date,
          member,
          familyMembers,
      });

      const savedForm = await formData.save();

      res.status(200).send({
          message: "Form submitted successfully",
          data: savedForm,
      });

  } catch (err) {
      console.log(err);
      res.status(500).send({
          message: "Database error",
          error: err,
      });
  }
});

app.post("/login", async (req, res) => {
  // You should validate the user's credentials before generating the token

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = {
      id: 1,
      email: email,
    };

    // Check if email and password were provided in the request body
    if (!email || !password) {
      return res.send({
        message: "Please provide email and password",
        status: "404",
      });
    }

    const validEmail = "prakashaniket3@gmail.com";
    const validPassword = "password12345";

    if (email !== validEmail || password !== validPassword) {
      return res.send({ message: "Invalid email or password", status: "404" });
    }

    const token = generateToken(user);

    res.send({
      message: "login success",
      status: "200",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      message: "err",
    });
  }
});
app.get("/dash", async (req, res) => {
  let email = req.body.email;
  let search;
  try {
    search = await FormModel.findOne({ email: email });
    if (!search) {
      return res.send({
        message: "enter email",
      });
    } else {
      return res.send({
        message: "great api",
        data: search,
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "err",
    });
  }
});

app.post("/downloadcard", async (req, res) => {
  let aadhar = req.body.aadhar;
  let search;
  try {
    search = await FormModel.findOne({ aadhar: aadhar });
    if (!search) {
      return res.send({
        message: "enter correct aadhar number",
      });
    } else {
      return res.send({
        status: "200",
        message: "card downloaded",
        data: search,
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "err",
    });
  }
});

app.post("/dashboard", async (req, res) => {
  console.log(req.body);
  const { name, phone, address, pincode, status, date } = req.body;

  if (!name || !phone || !address || !pincode || !status || !date) {
    return res.send({
      status: 400,
      message: "Missing data",
      data: req.body,
    });
  }

  // Write into DB

  let form = new FormModels({
    name: name,
    phone: phone,
    address: address,
    pincode: pincode,
    status: status,
    date: date,
  });
  try {
    let formData = await form.save();

    console.log(formData);

    res.send({
      status: 200,
      message: "Form Submmitted Successfully",
      data: formData,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: 400,
      message: "Database error hai deho",
      error: err,
    });
  }
});
app.post("/enquiry", async(req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
  
    // Check if required fields are present
    if (!firstName) {
      return res.status(400).json({ error: "First name is required" });
    }
  
    if (!lastName) {
      return res.status(400).json({ error: "Last name is required" });
    }
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }
  
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    // You can perform further validation or save the data to a database here
  
    let form = new FormModels({
        firstName:firstName,
        lastName:lastName,
        phone: phone,
        email: email,
        message:message,
      });
      try {
        let formData = await form.save();
    
        console.log(formData);
    
        res.send({
          status: 200,
          message: "Form Submmitted Successfully",
          data: formData,
        });
      } catch (err) {
        console.log(err);
        res.send({
          status: 400,
          message: "Database error hai deho",
          error: err,
        });
      }  });

app.get("/finddata/:date", async (req, res) => {
  let date = req.params;

  try {
    search = await FormModels.find(date);
    if (!search) {
      return res.send({
        message: "enter email",
      });
    } else {
      return res.send({
        message: "great api",
        data: search,
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "err",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening  aniket at http://localhost:${port}`);
});
