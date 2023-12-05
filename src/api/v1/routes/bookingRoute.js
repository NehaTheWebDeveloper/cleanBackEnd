const express = require("express");
const bookingRouter = express.Router();

const authorization = require("../middlewares/ApiAuthentication")
const bookingController = require("../controllers/bookingController");



bookingRouter.post("/bookings", authorization,bookingController.createBooking);
bookingRouter.get("/bookings", authorization,bookingController.getAllBookings);
bookingRouter.get("/bookings/:bookingId", authorization,bookingController.getBookingById);
bookingRouter.put("/bookings/:bookingId", authorization,bookingController.updateBooking);
bookingRouter.delete("/bookings/:bookingId", authorization,bookingController.deleteBookingById);
bookingRouter.get("/bookings/status/:status", authorization,bookingController.getBookingsByStatus);



module.exports = bookingRouter;
