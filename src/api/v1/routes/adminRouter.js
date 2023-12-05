
const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

// Admin Login
adminRouter.post("/login", adminController.adminUser);

// adminRouter.post("/v1/login", adminController.createAdmin);
// adminRouter.get("/v1/login", adminController.getAllAdmins);
// adminRouter.get("/v1/login", adminController.getAdminById);
// adminRouter.put("/v1/login", adminController.updateAdminById);
// adminRouter.delete("/v1/login", adminController.deleteAdminById);

// adminRouter.get("*",(req,res)=>{
//     res.redirect("/admin")
// })

module.exports = adminRouter;

