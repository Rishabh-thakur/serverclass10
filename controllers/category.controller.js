const Category = require("../models/parentCategory.model");
const fs = require("fs");

exports.getCategoryById = async (req, res, next, id) => {
  try {
    const user = await Category.findOne({_id : id});
 if(!user){
  return res.status(401).json({success : false,error : "No category find"});
 }else{
    req.category = user;
    next();
  }
  } catch (error) {
    console.log(error);
  }
 
};

exports.createCategory = async (req,res) => {
    try {
    
      const findUser = await Category.findOne({ name : req?.body?.name });
  
      if (findUser)
        return res
          .status(401)
          .json({ success: false, message: "category exist already" });
  
      const result = new Category({ name : req?.body?.name , image : req?.file ? req?.file?.path : undefined });
  
      await result.save();
  
      res.status(200).json({
        success: true,
        message: "category saved successfully",
        user: result
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
}

exports.getAllCategory = async (req, res) => {
  try {
    const findCategory = await Category.find();

    if (findCategory?.length <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No category exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get all categories successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const findCategory = await Category.findOne({ _id: req.category?._id });

    if (!findCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No category exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get category successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updateCategory = await Category.findOneAndUpdate(
      { _id: req?.category._id },
      {
        name: req.body?.name,
        image: req?.file ? req?.file?.path : req?.category?.image,
      },
      { new: true, useFindAndModify: false }
    );

    if (updateCategory && req?.category?.image ) {
      if(req?.file){
      fs.unlink(req.category?.image, (err, data) => {
        if (err) console.log(err);

      });
    }
    }

    if (!updateCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No category exist!" });
    }

    res.status(200).json({
      success: true,
      message: "update category successfully",
      data: updateCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await Category.findOneAndDelete({
      _id: req?.category._id,
    });

    if (deleteCategory && req?.category?.image) {
      fs.unlink(req.category?.image, (err, data) => {
        if (err) console.log(err);

      });
    }

    if (!deleteCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No category exist!" });
    }

    res.status(200).json({
      success: true,
      message: "deleted category successfully",
      data: deleteCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
