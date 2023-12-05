const {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  where,
  query,
} = require("firebase/firestore");
const { db } = require("../../../../Database/Firebase");

exports.createBooking = async (req, res) => {
  try {
    // Extract data from the request body
    const { firstName, lastName, phone, email,status, address, state, homeType, bedrooms, bathrooms, noOfBedrooms, noOfBathrooms, additionalFeatures, houseMembers, pets, smoking, pestType, initialServicesRequested, addOns, areaOfFocus, storage, storageType, cleaningSupplies, cleaningEquipment, anticipatedStartDate, initialFrequencyofService, mentalEmotionalState, inCrisis, additionalNotes } = req.body;



// Now you have all the specified fields in the 'formData' object.
const bookingData = {
  firstName,
  lastName,
  phone,
  email,
  address,
  status,
  state,
  homeType,
  bedrooms,
  bathrooms,
  noOfBedrooms,
  noOfBathrooms,
  additionalFeatures,
  houseMembers,
  pets,
  smoking,
  pestType,
  initialServicesRequested,
  addOns,
  areaOfFocus,
  storage,
  storageType,
  cleaningSupplies,
  cleaningEquipment,
  anticipatedStartDate,
  initialFrequencyofService,
  mentalEmotionalState,
  inCrisis,
  additionalNotes,
};

    // Validate the data as needed

    // Create a new booking document in Firestore
 

    const bookingRef = await addDoc(collection(db, "bookings"), bookingData);

    // Respond with a success message or the newly created booking ID
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: bookingRef.id,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Unable to create booking" });
  }
};
// / Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookings = [];

    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    const totalItems = querySnapshot.size; // Calculate the total number of items

    res.status(200).json({
      totalItems: totalItems, // Include totalItems in the response
      bookings: bookings, // Include the bookings array
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Unable to fetch bookings" });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingDoc = await doc(db, "bookings", bookingId);
    const bookingSnapshot = await getDoc(bookingDoc);

    if (!bookingSnapshot.exists()) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ id: bookingSnapshot.id, ...bookingSnapshot.data() });
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({ error: "Unable to fetch booking" });
  }
};



exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { providerId, ...updatedFields } = req.body; // New field values including providerId

    // Check if providerId is provided in the request body
    if (!providerId) {
      return res.status(400).json({ error: "ProviderId is required in the request body" });
    }

    const bookingDoc = doc(db, "bookings", bookingId);
    const bookingSnapshot = await getDoc(bookingDoc);

    if (!bookingSnapshot.exists()) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Retrieve the existing providerIds array from the booking document
    const existingProviderIds = bookingSnapshot.data().providerIds || [];

    // Add the new providerId to the existing providerIds array
    const updatedProviderIds = [...existingProviderIds, providerId];

    // Update the booking document in Firestore with the updated providerIds array
    await updateDoc(bookingDoc, {
      ...updatedFields,
      providerIds: updatedProviderIds, // Set the providerIds array with the updated array
      assignedStatus: "assigned", // Update the status to "assigned" when a provider is assigned
    });

    // Now, let's also update the provider document
    const providerDoc = doc(db, "providers", providerId);
    const providerSnapshot = await getDoc(providerDoc);

    if (!providerSnapshot.exists()) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Add the "assigned" key to the provider document
    await updateDoc(providerDoc, {
      assigned: true,
    });

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Error updating booking by ID:", error);
    res.status(500).json({ error: "Unable to update booking" });
  }
};



// Update a booking by ID with providerId
// exports.updateBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.bookingId;
//     const { providerId, ...updatedFields } = req.body; // New field values including providerId

//     // Check if providerId is provided in the request body
//     if (!providerId) {
//       return res.status(400).json({ error: "ProviderId is required in the request body" });
//     }

//     const bookingDoc = doc(db, "bookings", bookingId);
//     const bookingSnapshot = await getDoc(bookingDoc);

//     if (!bookingSnapshot.exists()) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     // Check if the booking is already assigned to a provider
//     const currentProviderIds = bookingSnapshot.data().providerIds || []; // Initialize as an empty array
//     if (currentProviderIds.includes(providerId)) {
//       return res.status(400).json({ error: "Provider is already already to this booking" });
//     }

//     // Add the new providerId to the array of providerIds
//     currentProviderIds.push(providerId);

//     // Update the booking document in Firestore, including the providerIds array
//     await updateDoc(bookingDoc, {
//       ...updatedFields,
//       providerIds: currentProviderIds,
//       status: "assigned", // Update the status to "assigned" when a provider is assigned
//     });

//     res.status(200).json({ message: "Booking updated successfully" });
//   } catch (error) {
//     console.error("Error updating booking by ID:", error);
//     res.status(500).json({ error: "Unable to update booking" });
//   }
// };




// Delete a booking by ID
exports.deleteBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingDoc = await doc(db, "bookings", bookingId);
    const bookingSnapshot = await getDoc(bookingDoc);

    if (!bookingSnapshot.exists()) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete the booking document from Firestore
    await deleteDoc(bookingDoc);

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking by ID:", error);
    res.status(500).json({ error: "Unable to delete booking" });
  }
};

// Get Bookings By Status
exports.getBookingsByStatus = async (req, res) => {
  try {
    // Extract the status from the URL path
    const status = req.params.status;

    // Create a Firestore query
    const bookingsCollection = collection(db, "bookings");
    let q = query(bookingsCollection);

    // If a status is provided, add a where clause to filter by status
    if (status) {
      q = query(q, where("status", "==", status)); // Use the 'query' function to create a new query object with the 'where' clause
    }

    // Execute the query
    const querySnapshot = await getDocs(q);

    const bookings = [];
    querySnapshot.forEach((doc) => {
      const bookingData = doc.data();
      bookings.push({ id: doc.id, ...bookingData });
    });

    // Calculate the total number of items for status-wise data
    const totalItems = bookings.length;

    if (bookings.length === 0) {
      // No data found based on the provided status
      res.status(404).json({ message: "Sorry, Data not found" });
    } else {
      // Data found, send the results along with totalItems
      res.status(200).json({ totalItems: totalItems, bookings: bookings });
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Unable to fetch bookings" });
  }
};
