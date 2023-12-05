const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { db, auth } = require("../../../../Database/Firebase");
const {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");
const jwt = require("jsonwebtoken")

// // Create a new admin
// exports.createAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Create a new admin user in Firebase Authentication
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const admin = userCredential.user;

//     // Add admin details to a "admins" collection in your Firestore database
//     const adminsCollection = collection(db, "admins");
//     const docRef = await addDoc(adminsCollection, { uid: admin.uid, email: admin.email });

//     res.status(201).json({ message: "Admin created successfully", adminId: docRef.id });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     res.status(500).json({ error: "Unable to create admin" });
//   }
// };

// // Get a list of all admins
// exports.getAllAdmins = async (req, res) => {
//   try {
//     const adminsCollection = collection(db, "admins");
//     const querySnapshot = await getDocs(adminsCollection);
//     const adminsList = [];

//     querySnapshot.forEach((doc) => {
//       adminsList.push({ id: doc.id, ...doc.data() });
//     });

//     res.status(200).json(adminsList);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     res.status(500).json({ error: "Unable to fetch admins" });
//   }
// };

// // Get an admin by ID
// exports.getAdminById = async (req, res) => {
//   try {
//     const adminId = req.params.adminId;
//     const adminsCollection = collection(db, "admins");
//     const adminDoc = doc(adminsCollection, adminId);
//     const adminSnapshot = await getDoc(adminDoc);

//     if (!adminSnapshot.exists()) {
//       return res.status(404).json({ error: "Admin not found" });
//     }

//     const adminData = adminSnapshot.data();
//     res.status(200).json(adminData);
//   } catch (error) {
//     console.error("Error fetching admin by ID:", error);
//     res.status(500).json({ error: "Unable to fetch admin" });
//   }
// };

// // Update an admin by ID
// exports.updateAdminById = async (req, res) => {
//   try {
//     const adminId = req.params.adminId;
//     const adminData = req.body;
//     const adminsCollection = collection(db, "admins");
//     const adminDoc = doc(adminsCollection, adminId);

//     // Check if the admin document exists
//     const adminSnapshot = await getDoc(adminDoc);

//     if (!adminSnapshot.exists()) {
//       return res.status(404).json({ error: "Admin not found" });
//     }

//     // Update the admin document with the new data
//     await updateDoc(adminDoc, adminData);

//     res.status(200).json({ message: "Admin updated successfully" });
//   } catch (error) {
//     console.error("Error updating admin by ID:", error);
//     res.status(500).json({ error: "Unable to update admin" });
//   }
// };

// // Delete an admin by ID
// exports.deleteAdminById = async (req, res) => {
//   try {
//     const adminId = req.params.adminId;
//     const adminsCollection = collection(db, "admins");
//     const adminDoc = doc(adminsCollection, adminId);

//     // Check if the admin document exists
//     const adminSnapshot = await getDoc(adminDoc);

//     if (!adminSnapshot.exists()) {
//       return res.status(404).json({ error: "Admin not found" });
//     }

//     // Delete the admin document
//     await deleteDoc(adminDoc);

//     res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting admin by ID:", error);
//     res.status(500).json({ error: "Unable to delete admin" });
//   }
// };



exports.adminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate the user using Firebase Authentication
    const adminCredential = await signInWithEmailAndPassword(auth, email, password);
    const admin = adminCredential.user;


    // Create a JWT token
    const token = jwt.sign({ uid: admin.uid, email: admin.email }, config.secret_jwt);

    // Return the JWT token as part of the response
    res.status(200).json({ message: 'Login successful', admin, token });
  } catch (error) {
    console.error('Error logging in:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.status(500).json({ error: 'Unable to login' });
    }
  }
};

