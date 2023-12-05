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
} = require("firebase/firestore");

// Create a new service type
exports.addServiceType = async (req, res) => {
  try {
    const serviceTypeData = req.body;
    const serviceTypeCollection = collection(db, "serviceType");

    // Check if a service type with the same name already exists
    // const querySnapshot = await getDocs(
    //   query(serviceTypeCollection, where("name", "==", serviceTypeData.name))
    // );

    // if (!querySnapshot.empty) {
    //   // A service type with the same name already exists
    //   return res.status(400).json({ error: "Service Type already exists" });
    // }

    // If the service type doesn't exist, add a new document with the service type data
    const docRef = await addDoc(serviceTypeCollection, serviceTypeData);

    res
      .status(201)
      .json({ message: "Service Type added successfully", serviceTypeId: docRef.id });
  } catch (error) {
    console.error("Error creating Service Type:", error);
    res.status(500).json({ error: "Unable to create Service Type" });
  }
};




// Create Service Type
// exports.addServiceType = async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     // Add a new service type to the "serviceTypes" collection
//     const docRef = await addDoc(collection(db, "serviceTypes"), {
//       name,
//       description,
//     });

//     res.status(201).json({
//       message: "Service Type added successfully",
//       serviceTypeId: docRef.id,
//     });
//   } catch (error) {
//     console.error("Error creating Service Type:", error);
//     res.status(500).json({ error: "Unable to create Service Type" });
//   }
// };

// Get all Service Types
exports.getAllServiceType = async (req, res) => {
  try {
    const serviceTypesQuery = query(collection(db, "serviceType"));

    const serviceTypesSnapshot = await getDocs(serviceTypesQuery);
    const serviceTypes = [];

    serviceTypesSnapshot.forEach((doc) => {
      serviceTypes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(serviceTypes);
  } catch (error) {
    console.error("Error getting Service Types:", error);
    res.status(500).json({ error: "Unable to retrieve Service Types" });
  }
};

// Get Add-Ons by Service Type
exports.getServiceTypeById = async (req, res) => {
    try {
      const serviceTypeId = req.params.serviceTypeId;
  
      const serviceTypeCollection = collection(db, "serviceType");
      const serviceTypeDoc = doc(serviceTypeCollection, serviceTypeId);
  
      // Get the user document by ID
      const serviceTypeSnapshot = await getDoc(serviceTypeDoc);
  
      if (!serviceTypeSnapshot.exists()) {
        return res.status(404).json({ error: "Service Type not found" });
      }
  
      const serviceTypeData = serviceTypeSnapshot.data();
      res.status(200).json(serviceTypeData);
    } catch (error) {
      console.error("Error getting Service Type:", error);
      res.status(500).json({ error: "Unable to retrieve Service Type", details: error.message });
    }
  };
exports.updateServiceTypeById = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
  
      // Update the service type document
      const serviceTypeRef = doc(db, "serviceTypes", id);
      await updateDoc(serviceTypeRef, {
        name,
        description,
      });
  
      res.json({ message: "Service Type updated successfully" });
    } catch (error) {
      console.error("Error updating Service Type:", error);
      res.status(500).json({ error: "Unable to update Service Type" });
    }
  };
  // Delete Service Type
  exports.deleteServiceTypeById = async (req, res) => {
    try {
      const serviceTypeId = req.params.serviceTypeId;
  
      // Delete the service type document
      await deleteDoc(doc(db, "serviceType", serviceTypeId));
  
      res.json({ message: "Service Type deleted successfully" });
    } catch (error) {
      console.error("Error deleting Service Type:", error);
      res.status(500).json({ error: "Unable to delete Service Type" });
    }
  };
  


