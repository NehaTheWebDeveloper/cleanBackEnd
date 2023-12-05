
const express = require("express");
const authorization = require("../middlewares/ApiAuthentication")
const providerRouter = express.Router();
const providerController = require("../controllers/providersController");

// Providers CRUD
providerRouter.post("/providers",authorization, providerController.addProviders);
providerRouter.get("/providers",authorization, providerController.getAllProviders);
providerRouter.get("/providers/:providerId",authorization, providerController.getProviderById);
providerRouter.put("/providers/:providerId",authorization, providerController.updateProviderById);
providerRouter.delete("/providers/:providerId",authorization, providerController.deleteProviderById);

module.exports = providerRouter;
