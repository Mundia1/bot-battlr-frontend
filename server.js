// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8001; // Use environment port or default

// Middleware to enable CORS
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// MongoDB Connection URI (Store in Vercel Environment Variables)
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('botbattlr'); // Replace with your database name
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

let db;
connectDB().then(database => {
  db = database;
});

// GET /bots - Get all bots from MongoDB
app.get('/bots', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const bots = await db.collection('bots').find().toArray();
    res.json(bots);
  } catch (error) {
    console.error('Error fetching bots from MongoDB', error);
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
});

// GET /bots/:id - Get a specific bot by ID from MongoDB
app.get('/bots/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const bot = await db.collection('bots').findOne({ id: parseInt(id) });
    if (bot) {
      res.json(bot);
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    console.error('Error fetching bot from MongoDB', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
});

// DELETE /bots/:id - Delete a specific bot by ID from MongoDB
app.delete('/bots/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.collection('bots').deleteOne({ id: parseInt(id) });
    if (result.deletedCount > 0) {
      res.json({ message: 'Bot deleted successfully' });
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    console.error('Error deleting bot from MongoDB', error);
    res.status(500).json({ error: 'Failed to delete bot' });
  }
});

// POST /armies/:botId - Enlist a bot (update user's army in MongoDB)
app.post('/armies/:botId', async (req, res) => {
  const { botId } = req.params;
  const { userId } = req.body;

  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const botToAdd = await db.collection('bots').findOne({ id: parseInt(botId) });
    if (!botToAdd) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    const userArmyCollection = db.collection('armies');
    const userArmy = await userArmyCollection.findOne({ userId });

    if (userArmy) {
      if (!userArmy.bots.some(b => b.id === botToAdd.id)) {
        await userArmyCollection.updateOne(
          { userId },
          { $push: { bots: botToAdd } }
        );
        res.json({ message: `Bot ${botToAdd.name} enlisted successfully` });
      } else {
        res.status(400).json({ error: `Bot ${botToAdd.name} is already in the army` });
      }
    } else {
      await userArmyCollection.insertOne({ userId, bots: [botToAdd] });
      res.json({ message: `Bot ${botToAdd.name} enlisted successfully` });
    }
  } catch (error) {
    console.error('Error enlisting bot in MongoDB', error);
    res.status(500).json({ error: 'Failed to enlist bot' });
  }
});

// DELETE /armies/:botId/:userId - Release a bot from the army (update user's army in MongoDB)
app.delete('/armies/:botId/:userId', async (req, res) => {
  const { botId, userId } = req.params;

  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const userArmyCollection = db.collection('armies');
    const result = await userArmyCollection.updateOne(
      { userId },
      { $pull: { bots: { id: parseInt(botId) } } }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: `Bot ${botId} released from army` });
    } else {
      res.status(404).json({ error: 'Bot not found in army' });
    }
  } catch (error) {
    console.error('Error releasing bot from MongoDB', error);
    res.status(500).json({ error: 'Failed to release bot' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});