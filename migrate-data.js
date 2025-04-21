// migrate-data.js
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/botbattlr'; //  Include the database name

// Path to your db.json file
const DB_PATH = path.join(__dirname, 'db.json');

async function readData() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from db.json:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

async function migrateData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(); //  Get the database instance
    const data = await readData();

    // Ensure that data.bots exists and is an array
    if (!data.bots || !Array.isArray(data.bots)) {
      console.warn("Warning: data.bots is not an array or doesn't exist. Skipping bot migration.");
    } else {
        const botsCollection = db.collection('bots');
        // Delete all existing bots
        await botsCollection.deleteMany({});
        console.log('Cleared existing bots collection');
    
        // Insert the new bots
        const botInsertResult = await botsCollection.insertMany(data.bots);
        console.log(`${botInsertResult.insertedCount} bots inserted`);
    }


    // Ensure that data.armies exists and is an array
    if (!data.armies || !Array.isArray(data.armies)) {
        console.warn("Warning: data.armies is not an array or doesn't exist. Skipping armies migration.");
    } else {
        const armiesCollection = db.collection('armies');
         // Delete all existing armies
        await armiesCollection.deleteMany({});
        console.log('Cleared existing armies collection');

        // Insert the armies data.
        const armiesInsertResult = await armiesCollection.insertMany(data.armies);
        console.log(`${armiesInsertResult.insertedCount} armies inserted`);
    }

    console.log('Data migration complete');

  } catch (error) {
    console.error('Error during data migration:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateData().catch(err => console.error("Migration failed:", err));
