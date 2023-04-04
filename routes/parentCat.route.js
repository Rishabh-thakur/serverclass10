const controller = require("../controllers/category.controller");
const upload = require("../middleware/logoUpload.middlware");
const { isAdmin } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.param("categoryId", controller.getCategoryById);
  app.param("userId", userController.getUserById);

  app.post("/api/createCategory/:userId",isAdmin, upload, controller.createCategory);
  app.get("/api/getAllCategory", controller.getAllCategory);
  app.get("/api/getCategory/:categoryId", controller.getCategory);
  app.put("/api/updateCategory/:categoryId/:userId",isAdmin,upload, controller.updateCategory);
  app.delete("/api/deleteCategory/:categoryId/:userId",isAdmin, controller.deleteCategory);
};
