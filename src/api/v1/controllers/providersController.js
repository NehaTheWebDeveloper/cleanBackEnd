const express = require("express");
const { auth ,db}= require("../../../../Database/Firebase");
const { collection, addDoc, getDocs, doc, getDoc, updateDoc } = require("firebase/firestore");

// Create a new provider
exports.addProviders = async (req, res) => {
  try {
    const providerData = req.body;
    const providersCollection = collection(db, "providers");

    // Add a new document with the provider data
    const docRef = await addDoc(providersCollection, providerData);

    res
      .status(201)
      .json({ message: "Provider added successfully", providerId: docRef.id });
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ error: "Unable to create provider" });
  }
};

// Get a list of all providers
exports.getAllProviders = async (req, res) => {
  try {
    const providersCollection = collection(db, "providers");
    const querySnapshot = await getDocs(providersCollection);
    const providersList = [];

    querySnapshot.forEach((doc) => {
      providersList.push({ id: doc.id, ...doc.data() });
    });

    const totalItems = providersList.length; // Calculate the total items

    res.status(200).json({ providersList, totalItems }); // Include totalItems in the response
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ error: "Unable to fetch providers" });
  }
};

// Get a provider by ID
exports.getProviderById = async(req, res) => {
  try {
    const providerId = req.params.providerId;
    const providersCollection = collection(db, "providers");
    const providerDoc = doc(providersCollection, providerId);
    const providerSnapshot = await getDoc(providerDoc);

    if (!providerSnapshot.exists()) {
      return res.status(404).json({ error: "Provider not found" });
    }

    const providerData = providerSnapshot.data();
    res.status(200).json(providerData);
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    res.status(500).json({ error: "Unable to fetch provider" });
  }
};

// Update a provider by ID
exports.updateProviderById = async(req, res) => {
  try {
    const providerId = req.params.providerId;
    const providerData = req.body;
    const providersCollection = collection(db, "providers");
    const providerDoc = doc(providersCollection, providerId);

    // Check if the provider document exists
    const providerSnapshot = await getDoc(providerDoc);

    if (!providerSnapshot.exists()) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Update the provider document with the new data
    await updateDoc(providerDoc, providerData);

    res.status(200).json({ message: "Provider updated successfully" });
  } catch (error) {
    console.error("Error updating provider by ID:", error);
    res.status(500).json({ error: "Unable to update provider" });
  }
};
// Delete a provider by ID
exports.deleteProviderById = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const providersCollection = collection(db, "providers");
    const providerDoc = doc(providersCollection, providerId);

    // Check if the provider document exists
    const providerSnapshot = await getDoc(providerDoc);

    if (!providerSnapshot.exists()) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Delete the provider document
    await deleteDoc(providerDoc);

    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (error) {
    console.error("Error deleting provider by ID:", error);
    res.status(500).json({ error: "Unable to delete provider" });
  }
};
