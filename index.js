const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
// const { connectFirebase } = require("./Database/Firebase");
const router = require("./src/api/v1/routes/userRouter")
const adminRouter = require("./src/api/v1/routes/adminRouter")
const bookingRouter = require("./src/api/v1/routes/bookingRoute")
const addOnRouter = require("./src/api/v1/routes/addOnRouter")
const serviceTypeRouter = require("./src/api/v1/routes/serviceTypeRouter")
const providerRouter = require("./src/api/v1/routes/providerRouter")


app.use(morgan("tiny"));
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 8000;
app.use("/api/v1/",router) 
app.use("/api/v1/",adminRouter) 
app.use("/api/v1/",bookingRouter) 
app.use("/api/v1/",addOnRouter) 
app.use("/api/v1/",serviceTypeRouter) 
app.use("/api/v1/",providerRouter) 

app.get("/", async (req, res) => {
  try {
    res.send("Helloooo");
  } catch (error) {
    res.send(error);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Call connectFirebase with a callback function
// connectFirebase((error) => {
//   if (error) {
//     // Handle connection error
//     console.error("Failed to connect to the database:", error);
//   } else {
//     // Connection is successful, you can proceed with your application logic
//     console.log("Database connection successful");

//     // Start your Express.js server after the database connection is established
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   }
// });
