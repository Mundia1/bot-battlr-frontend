// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8001;

// Middleware to enable CORS
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

const DB_PATH = path.join(__dirname, 'db.json');

// Helper function to read data from db.json
const readData = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { bots: [], armies: {} }; // Initialize with empty arrays/objects
  }
};

// Helper function to write data to db.json
const writeData = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};

// GET /bots - Get all bots
app.get('/bots', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.bots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
});

// GET /bots/:id - Get a specific bot by ID
app.get('/bots/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData();
    const bot = data.bots.find((b) => b.id === parseInt(id));
    if (bot) {
      res.json(bot);
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
});

// DELETE /bots/:id - Delete a specific bot by ID
app.delete('/bots/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await readData();
    const initialBotCount = data.bots.length;
    data.bots = data.bots.filter((b) => b.id !== parseInt(id));
    if (data.bots.length < initialBotCount) {
      await writeData(data);
      res.json({ message: 'Bot deleted successfully' });
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bot' });
  }
});

// Example route for enlisting a bot (you'll likely need more logic here)
app.post('/armies/:botId', async (req, res) => {
  const { botId } = req.params;
  try {
    const data = await readData();
    const botToAdd = data.bots.find((bot) => bot.id === parseInt(botId));
    if (botToAdd) {
      if (!data.armies[req.body.userId]) {
        data.armies[req.body.userId] = [];
      }
      if (!data.armies[req.body.userId].some(bot => bot.id === botToAdd.id)) {
        data.armies[req.body.userId].push(botToAdd);
        await writeData(data);
        res.json({ message: `Bot ${botToAdd.name} enlisted successfully` });
      } else {
        res.status(400).json({ error: `Bot ${botToAdd.name} is already in the army` });
      }
    } else {
      res.status(404).json({ error: 'Bot not found' });
    }
  } catch (error) {
    console.error('Error enlisting bot:', error);
    res.status(500).json({ error: 'Failed to enlist bot' });
  }
});

// Example route for releasing a bot from the army
app.delete('/armies/:botId/:userId', async (req, res) => {
  const { botId, userId } = req.params;
  try {
    const data = await readData();
    if (data.armies[userId]) {
      const initialArmySize = data.armies[userId].length;
      data.armies[userId] = data.armies[userId].filter(bot => bot.id !== parseInt(botId));
      if (data.armies[userId].length < initialArmySize) {
        await writeData(data);
        res.json({ message: `Bot ${botId} released from army` });
      } else {
        res.status(404).json({ error: 'Bot not found in army' });
      }
    } else {
      res.status(404).json({ error: 'Army not found for user' });
    }
  } catch (error) {
    console.error('Error releasing bot:', error);
    res.status(500).json({ error: 'Failed to release bot' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});