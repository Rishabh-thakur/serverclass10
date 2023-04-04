const ChildCategory = require("../models/childCategory.model");
const fs = require("fs");


exports.getChildCategoryById = async (req, res, next, id) => {
  try {
    const user = await ChildCategory.findOne({_id : id});
 if(!user){
  return res.status(401).json({success : false,error : "No child category find"});
 }else{
    req.user = user;
    next();
  }
  } catch (error) {
    console.log(error);
  }
};

exports.createChildCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const findCategory = await ChildCategory.findOne({ name: name });

    if (findCategory) {
      return res
        .status(400)
        .json({ success: false, message: "An category already exist !" });
    }

    const result = new ChildCategory({
      name: name,
      image: req?.file ? req?.file?.path : undefined,
      category : req?.category?._id,
    });

    await result.save();
    res.status(200).json({
      success: true,
      message: "Child Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllChildCategory = async (req, res) => {
  try {
    const findCategory = await ChildCategory.find().populate("category");

    if (findCategory?.length <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No child category exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get all child categories successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getChildCategory = async (req, res) => {
  try {
    const findCategory = await ChildCategory.findOne({ _id: req.childCategory?._id }).populate("category");

    if (!findCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No child category exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get child category successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateChildCategory = async (req, res) => {
  try {
    
    const updateCategory = await ChildCategory.findOneAndUpdate(
      { _id: req?.childCategory._id },
      {
        name: req.body?.name,
        image: req?.file ? req?.file?.path : req?.childCategory.image,
        category : req?.body?.parentCategory ? req?.body?.parentCategory : req?.childCategory?.category
      },
      { new: true, useFindAndModify: false }
    );

    if (updateCategory && req?.childCategory?.image ) {
        if(req?.file){
      fs.unlink(req.childCategory?.image, (err, data) => {
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

exports.deleteChildCategory = async (req, res) => {
  try {
    const deleteCategory = await ChildCategory.findOneAndDelete({
      _id: req?.childCategory._id,
    });

    if (deleteCategory && req?.childCategory?.image) {
      fs.unlink(req.childCategory?.image, (err, data) => {
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
      message: "deleted child Category successfully",
      data: deleteCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getAllChildByCategory = async (req, res) => {
    try {
      const findCategory = await ChildCategory.find({category : req?.category?._id}).populate("category");
  
      if (findCategory?.length <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "No child category exist!" });
      }
  
      res.status(200).json({
        success: true,
        message: "get all child categories successfully",
        data: findCategory,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
