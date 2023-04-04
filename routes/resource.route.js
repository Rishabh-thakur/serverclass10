const controller = require("../controllers/resource.controller");
const upload = require("../middleware/pdfUpload.middleware");
const { isAdmin } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");
const {
  getChildCategoryById,
} = require("../controllers/childCategory.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.param("childId", getChildCategoryById);
  app.param("userId", userController.getUserById);
app.param("resourceId",controller.getResourceById);

  app.post(
    "/api/createResource/:childId/:userId",
    isAdmin,
    upload,
    controller.createResource
  );

  app.get("/api/getAllResource", controller.getAllResource);
  app.get("/api/getResource/:resourceId", controller.getResource);
  app.get("/api/getResourceByChild/:childId", controller.getAllResourceByChild);
  app.put(
    "/api/updateResource/:resourceId/:userId",
    isAdmin,
    upload,
    controller.updateResource
  );
  app.delete(
    "/api/deleteResource/:resourceId/:userId",
    isAdmin,
    controller.deleteResource
  );
};
