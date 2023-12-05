const express = require("express")
const serviceTypeController = require("../controllers/serviceTypeController");
const serviceTypeRouter = express.Router();
const authorization = require("../middlewares/ApiAuthentication")



// Service Type
serviceTypeRouter.post("/serviceType",authorization, serviceTypeController.addServiceType);
serviceTypeRouter.get("/serviceType",authorization, serviceTypeController.getAllServiceType);
serviceTypeRouter.get("/serviceType/:serviceTypeId",authorization, serviceTypeController.getServiceTypeById);
serviceTypeRouter.put("/serviceType/:serviceTypeId",authorization, serviceTypeController.updateServiceTypeById);
serviceTypeRouter.delete("/serviceType/:serviceTypeId",authorization, serviceTypeController.deleteServiceTypeById);

module.exports = serviceTypeRouter;
