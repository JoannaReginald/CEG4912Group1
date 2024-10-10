// Import necessary modules
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Get the MongoDB URI from the environment variables or default to an empty string
const uri = process.env.ATLAS_URI || "";

// Create a new MongoClient instance
const client = new MongoClient(uri);

let connectedClient, db;

// Function to connect to MongoDB
async function connectToMDB() {
    try {
        connectedClient = await client.connect(); // Establish a connection to MongoDB
        console.log("Connected to MongoDB"); // Log a success message
    } catch (e) {
        console.log(e); // Log any errors that occur during connection
    } finally {
        db = connectedClient.db("myDatabase"); // Specify the database to use
    }
}

// Set the app to listen on port 3000
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});

// Connect to MongoDB as soon as the app starts
connectToMDB();

// Test API Endpoint to get users from the database
app.get('/users', async (req, res) => {
    try {
        // Access the 'users' collection from the database
        let collection = db.collection("users");
        
        // Find all users and convert them to an array
        let users = await collection.find().toArray();

        // Send the users array as a JSON response with a 200 OK status
        res.status(200).json(users);
    } catch (e) {
        // If there is an error, send a 500 response with an error message
        res.status(500).json({ error: "Users could not be returned." });
    }
});
