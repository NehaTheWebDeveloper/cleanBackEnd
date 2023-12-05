const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} = require("firebase/auth");
  const {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    exists,
  } = require("firebase/firestore");
const { auth, db } = require("../../../../Database/Firebase");
const config = require("../../../../Database/config");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const randomstring = require("randomstring");
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const { email, password, name, mobile } = userData;

    // Check if a user with the same email already exists
    const usersCollection = collection(db, "users");
    const emailQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      // A user with the same email already exists
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create a new user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create a user document in Firestore
    const docRef = await addDoc(usersCollection, {
      name,
      email,
      password,
      mobile,
    });
    // Send a verification email to the user

    await sendEmailVerification(user);

    res.status(201).json({
      message:
        "User registered successfully. Please verify your email if needed.",
      userId: docRef.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Unable to create user" });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const usersCollection = collection(db, "users");

    // Get all user documents from the "users" collection
    const querySnapshot = await getDocs(usersCollection);
    const usersList = [];

    querySnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(usersList);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Unable to fetch users" });
  }
};

// Define a route to get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection, userId);

    // Get the user document by ID
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnapshot.data();
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Unable to fetch user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body; // New user data to update

    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection, userId);

    // Check if the user document exists
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user document with the new data
    await updateDoc(userDoc, userData);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user by ID:", error);
    res
      .status(500)
      .json({ error: "Unable to update user", details: error.message });
  }
};

const renewToken = async (uid) => {
  try {
    const secret_jwt = config.secret_jwt;
    const newSecretJwt = randomstring.generate();

    fs.readFile("Database/config.js", "utf-8", (error, data) => {
      if (error) throw error;

      var newValue = data.replace(new RegExp(secret_jwt, "g"), newSecretJwt);

      fs.writeFile("Database/config.js", newValue, "utf-8", (error, data) => {
        if (error) throw error;
        console.log("Done!");
      });
    });
    const token = await jwt.sign({ uid: uid }, newSecretJwt);
    console.log(token, "Generated Token"); // Add this line for debugging
    return token;
  } catch (error) {
    console.log(error, "Error in renewToken");
  }
};


exports.refreshToken = async (req, res) => {
  const uid = req.body.uid; // Get the UID from the request
console.log("Why I am NOt runnng")
  try {
    console.log("whats going on")
    // Check if the UID is available and not empty
    if (!uid) {
      return res.status(400).json({ error: "UID is missing in the request" });
    }

    // Query Firestore to find the user document based on the UID
    const usersCollection = collection(db, "users");
    const userDocRef = doc(usersCollection, uid);

    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // User document with matching UID found, retrieve its data
      const userData = userDocSnapshot.data();

      if (userData) {
        userData.uid = uid;

        console.log(userData.uid, "userData.uid");
        const tokenData = await renewToken(userData.uid);
        // Send the user data as the response
        console.log(tokenData, "TokenData");
        res.status(200).json({
          message: "User data retrieved successfully",
          user: tokenData,
        });
      }
    } else {
      // User document with matching UID not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ error: "Unable to retrieve user data" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check if the user's email is verified (optional)
    if (!user.emailVerified) {
      return res.status(401).json({
        error:
          "Email not verified. Please check your email for a verification link.",
      });
    }

    // Create a JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      config.secret_jwt,
      { expiresIn: '1d' } // Set token expiration to 1 hour
    );

    // Return the JWT token as part of the response
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error logging in:", error);

    // Handle the case where the user is not found
    if (error.code === "auth/user-not-found") {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare the hashed password
    if (error.code === "auth/wrong-password") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(500).json({ error: "Unable to login" });
  }
};

