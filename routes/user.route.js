const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.param("userId", controller.getUserById);

  app.post("/api/signup", controller.signup);
  app.post("/api/signin", controller.signin);
  app.get("/api/getUser/:userId", controller.getUser);
  app.get("/api/getAllUser", controller.getAllUser);
  app.put("/api/disableUser/:userId", controller.disableUser);
  app.put("/api/makeVerify/:userId", controller.generateVerification);
  app.put("/api/verifyOtp/:userId", controller.matchOTP);
  app.put("/api/updateUser/:userId", controller.updateUser);
};
