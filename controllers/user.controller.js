const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findOne({_id : id});
 if(!user){
  return res.status(401).json({success : false,error : "No user find"});
 }else{
    req.user = user;
    next();
  }
  } catch (error) {
    console.log(error);
  }
 
};

exports.signup = async (req, res) => {
  try {
    let { userName, email, password, confirmPassword,phone } = req.body;

    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   
    if (!isEmail.test(email)) {
      return res
        .status(401)
        .json({ success: false, message: "Enter valid email" });
    }

    if (password.length < 8 && password.length > 20) {
      return res.status(401).json({
        success: false,
        message: "Password must be between 8 to 20 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Please enter same password and confirm password",
      });
    }

    const findUser = await User.findOne({ email });

    if (findUser)
      return res
        .status(401)
        .json({ success: false, message: "User exist already" });

    const hashPassword = await bcrypt.hash(password, 10);

    const result = new User({ email, password: hashPassword, name: userName,phone });

    await result.save();

    const token = jwt.sign({ email: result.email }, process.env.USER_TOKEN, {
      expiresIn: "36000h",
    });
    result.password = undefined;
    res.status(200).json({
      success: true,
      message: "user saved successfully",
      user: result,
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = await User.findOne({ email });
  
      if (!findUser)
        return res
          .status(401)
          .json({ success: false, message: "No such user exists" });
  
  
      const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
  
      if (!isPasswordCorrect)
        return res
          .status(404)
          .json({ success: false, message: "Password Incorrect !!" });
  


      let token = jwt.sign({ email: findUser.email }, process.env.USER_TOKEN, {
        expiresIn: "36000h",
      });
  
      findUser.password = undefined;
      res
        .status(200)
        .json({
          success: true,
          message: "User signin successfully",
          user : findUser,
          token,
        });
  
    
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  exports.getAllUser = async (req, res) => {
    try {
     
      const findUsers = await User.find({role : 0});
  
      if (findUsers.length <= 0)
        return res
          .status(401)
          .json({ success: false, message: "No user exist" });
  
          findUsers.map((user)=>{
            user.password = undefined;
          })
  
      res
        .status(200)
        .json({
          success: true,
          message: "Get all user successfully",
          users : findUsers
        });
  
    
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  exports.getUser = async (req, res) => {
    try {
     
      const findUser = await User.findOne({_id : req?.user?._id});
  
      if (!findUser)
        return res
          .status(401)
          .json({ success: false, message: "No user exist" });
          findUser.password = undefined;
      res
        .status(200)
        .json({
          success: true,
          message: "Get user successfully",
          user : findUser,
        });
  
    
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
 exports.disableUser = async (req,res) => {
  try {

    const updateUser = await User.findOneAndUpdate(
        { _id: req?.user._id },
       {
           disabled : !req.user?.disabled
        },
        { new: true, useFindAndModify: false }
      );

      if(!updateUser) res.status(401).json({success : false , message : "unable to update"});

      res.status(200).json({success : true,message : "disabled successfully",data : updateUser});

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
 }

 exports.updateUser = async (req,res) => {
  try {
    const newName = req.body?.name;

    const updateUser = await User.findOneAndUpdate(
      { _id: req?.user._id },
     {
         name : newName,
         phone : req?.body?.phone
      },
      { new: true, useFindAndModify: false }
    );

    if(!updateUser) res.status(401).json({success : false , message : "unable to update"});

    res.status(200).json({success : true,message : "updated user successfully",data : updateUser});


  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
 }

 exports.generateVerification = async(req,res) => {
  try {
  
    const OTP = Math.floor(Math.random()*9999);
  
    const updateUser = await User.findOneAndUpdate(
      { _id: req?.user._id },
     {
         otp : OTP
      },
      { new: true, useFindAndModify: false }
    );

    if(!updateUser) res.status(401).json({success : false , message : "unable to update"});

    res.status(200).json({success : true,message : "updated user successfully",data : updateUser});

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
 }

 exports.matchOTP = async(req,res) => {
  try {
    const OTP = req.body?.otp;
      if(OTP == req.user?.otp){
        const updateUser = await User.findOneAndUpdate(
          { _id: req?.user._id },
         {
             verified : true
          },
          { new: true, useFindAndModify: false }
        );
    
        if(!updateUser) res.status(401).json({success : false , message : "unable to update"});
    
        res.status(200).json({success : true,message : "verify user successfully",data : updateUser});
      }else{
        req.status(400).json({success : false, message : "OTP did not matched"});
      }
      
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
 }