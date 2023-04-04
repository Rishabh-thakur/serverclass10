const Resource = require("../models/resource.model");
const fs = require("fs");

exports.getResourceById = async (req, res, next, id) => {
  try {
    const user = await Resource.findOne({_id : id});
 if(!user){
  return res.status(401).json({success : false,error : "No resource find"});
 }else{
    req.user = user;
    next();
  }
  } catch (error) {
    console.log(error);
  }
};

exports.createResource = async (req, res) => {
  try {
    const { name } = req.body;

    const findCategory = await Resource.findOne({ name: name });

    if (findCategory) {
      return res
        .status(400)
        .json({ success: false, message: "An resource already exist !" });
    }

    const result = new Resource({
      name: name,
      pdf: req?.file ? req?.file?.path : undefined,
      childCategory: req?.childCategory?._id,
    });

    await result.save();
    res.status(200).json({
      success: true,
      message: "resource created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllResource = async (req, res) => {
  try {
    const findCategory = await Resource.find().populate("childCategory");

    if (findCategory?.length <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No resource exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get all resource successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getResource = async (req, res) => {
  try {
    const findCategory = await Resource.findOne({
      _id: req.resource?._id,
    }).populate("childCategory");

    if (!findCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No resource exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get resource successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const updateCategory = await Resource.findOneAndUpdate(
      { _id: req?.resource._id },
      {
        name: req.body?.name,
        pdf: req?.file ? req?.file?.path : req?.resource?.pdf,
      },
      { new: true, useFindAndModify: false }
    );

    if (updateCategory && req?.resource?.pdf) {
      if (req?.file) {
        fs.unlink(req.resource?.pdf, (err, data) => {
          if (err) console.log(err);
        });
      }
    }

    if (!updateCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No resource exist!" });
    }

    res.status(200).json({
      success: true,
      message: "update resource successfully",
      data: updateCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const deleteCategory = await Resource.findOneAndDelete({
      _id: req?.resource?._id,
    });
   
    if (deleteCategory && req?.resource?.pdf) {
      fs.unlink(req.resource?.pdf, (err, data) => {
        if (err) console.log(err);
      });
    }

    if (!deleteCategory) {
      return res
        .status(400)
        .json({ success: false, message: "No resource exist!" });
    }

    res.status(200).json({
      success: true,
      message: "deleted resource successfully",
      data: deleteCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllResourceByChild = async (req, res) => {
  try {
    const findCategory = await Resource.find({
      childCategory: req?.childCategory?._id,
    }).populate("childCategory");

    if (findCategory?.length <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No resource exist!" });
    }

    res.status(200).json({
      success: true,
      message: "get all resource successfully",
      data: findCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
