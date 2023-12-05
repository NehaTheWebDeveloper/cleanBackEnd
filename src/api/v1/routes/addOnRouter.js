const express = require("express")
const addOnController = require("../controllers/addOnController");
const addonRouter = express.Router();
const authorization = require("../middlewares/ApiAuthentication")


addonRouter.post("/addon",authorization,addOnController.addAddOn);
addonRouter.get("/addon",authorization,addOnController.getAllAddOns);
addonRouter.get("/addon/:addonId",authorization,addOnController.getAddOnById);
addonRouter.put("/addon/:addonId",authorization,addOnController.updateAddOnById);
addonRouter.delete("/addon/:addonId",authorization,addOnController.deleteAddOnById);

module.exports = addonRouter;
