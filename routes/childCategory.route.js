const { getCategoryById } = require("../controllers/category.controller");
const upload = require("../middleware/logoUpload.middlware");
const { isAdmin } = require("../middleware/auth.middleware");
const controller = require("../controllers/childCategory.controller");
const userController = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.param("categoryId", getCategoryById);
  app.param("childId", controller.getChildCategoryById);
  app.param("userId", userController.getUserById);

  app.post("/api/createChildCategory/:categoryId/:userId",isAdmin,upload, controller.createChildCategory);
  app.get("/api/getAllChildCategory", controller.getAllChildCategory);
  app.get("/api/getChildByCategory/:categoryId",controller.getAllChildByCategory);
  app.get("/api/getChildCategory/:childId", controller.getChildCategory);
  app.put("/api/update/childCategory/:childId/:userId",isAdmin,upload, controller.updateChildCategory);
  app.delete("/api/deleteChildCategory/:childId/:userId",isAdmin, controller.deleteChildCategory);
};
