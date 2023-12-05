const { auth, db } = require("../../../../Database/Firebase");
const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} = require("firebase/firestore");

// Create Add-On
exports.addAddOn = async (req, res) => {
  try {
    const { addons, price, perVisit, serviceTypeId ,serviceType} = req.body;

    // Add a new add-on to the "addons" collection
    const docRef = await addDoc(collection(db, "addons"), {
      addons,
      price,
      perVisit,
      serviceType,
      serviceTypeId, // Reference to the associated service type
    });

    res.status(201).json({
      message: "Add-On added successfully",
      addonId: docRef.id,
    });
  } catch (error) {
    console.error("Error creating Add-On:", error);
    res.status(500).json({ error: "Unable to create Add-On" });
  }
};

// Read All Add-Ons
exports.getAllAddOns = async (req, res) => {
  try {
    const addonsCollection = collection(db, "addons");
    const querySnapshot = await getDocs(addonsCollection);
    const addonsList = [];

    querySnapshot.forEach((doc) => {
      addonsList.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(addonsList);
  } catch (error) {
    console.error("Error fetching Add-Ons:", error);
    res.status(500).json({ error: "Unable to fetch Add-Ons" });
  }
};

// Read Add-On by ID
exports.getAddOnById = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    const addonDoc = doc(db, "addons", addonId);
    const addonSnapshot = await getDoc(addonDoc);

    if (!addonSnapshot.exists()) {
      return res.status(404).json({ error: "Add-On not found" });
    }

    const addonData = addonSnapshot.data();
    res.status(200).json(addonData);
  } catch (error) {
    console.error("Error fetching Add-On by ID:", error);
    res.status(500).json({ error: "Unable to fetch Add-On" });
  }
};

// Update Add-On by ID
exports.updateAddOnById = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    const addonData = req.body;
    const addonDoc = doc(db, "addons", addonId);

    // Check if the Add-On document exists
    const addonSnapshot = await getDoc(addonDoc);

    if (!addonSnapshot.exists()) {
      return res.status(404).json({ error: "Add-On not found" });
    }

    // Update the Add-On document with the new data
    await updateDoc(addonDoc, addonData);

    res.status(200).json({ message: "Add-On updated successfully" });
  } catch (error) {
    console.error("Error updating Add-On by ID:", error);
    res.status(500).json({ error: "Unable to update Add-On" });
  }
};

// Delete Add-On by ID
exports.deleteAddOnById = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    const addonDoc = doc(db, "addons", addonId);

    // Check if the Add-On document exists
    const addonSnapshot = await getDoc(addonDoc);

    if (!addonSnapshot.exists()) {
      return res.status(404).json({ error: "Add-On not found" });
    }

    // Delete the Add-On document
    await deleteDoc(addonDoc);

    res.status(200).json({ message: "Add-On deleted successfully" });
  } catch (error) {
    console.error("Error deleting Add-On by ID:", error);
    res.status(500).json({ error: "Unable to delete Add-On" });
  }
};

// Create Add-On
// exports.addAddOn = async (req, res) => {
//     try {
//       const { name, price,perVisit, serviceTypeId } = req.body;
  
//       // Add a new add-on to the "addons" collection
//       const docRef = await addDoc(collection(db, "addons"), {
//         name,
//         price,
//         perVisit,
//         serviceTypeId, // Reference to the associated service type
//       });
  
//       res.status(201).json({
//         message: "Add-On added successfully",
//         addonId: docRef.id,
//       });
//     } catch (error) {
//       console.error("Error creating Add-On:", error);
//       res.status(500).json({ error: "Unable to create Add-On" });
//     }
//   };
  
  