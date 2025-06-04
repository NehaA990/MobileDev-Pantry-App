// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ Incoming ${req.method} request to ${req.url} with body:`, req.body);
  next();
});

// MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://nmegha82:Megha123@pantrycluster.thf2jrp.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { dbName: 'pantryDB' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  purchaseDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
});

const Item = mongoose.model('Item', itemSchema);

// Add item route
app.post('/add-item', async (req, res) => {
  try {
    const { name, category = '', quantity, purchaseDate, expirationDate } = req.body;

    if (!name || !quantity || !purchaseDate || !expirationDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const purchase = new Date(purchaseDate);
    const expiration = new Date(expirationDate);

    if (isNaN(purchase) || isNaN(expiration)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const newItem = new Item({
      name,
      category,
      quantity,
      purchaseDate: purchase,
      expirationDate: expiration,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ message: 'Error adding item', error: err.message });
  }
});

// Get all items
app.get('/getItems', async (req, res) => {
  try {
    const items = await Item.find().sort({ expirationDate: 1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// ✅ Get expired items (expirationDate < today)
app.get('/expired-items', async (req, res) => {
  try {
    const today = new Date();
    const expiredItems = await Item.find({ expirationDate: { $lt: today } }).sort({ expirationDate: 1 });
    res.json(expiredItems);
  } catch (err) {
    console.error('Error fetching expired items:', err);
    res.status(500).json({ message: 'Error fetching expired items' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAe2S9uqerLUhdJ9lvnMTm30awHhDi1dsE");

app.get('/get-recipe', async (req, res) => {
  try {
    const today = new Date();
    const expiredItems = await Item.find({ expirationDate: { $lt: today } });

    const itemNames = expiredItems.map(item => item.name);
    if (itemNames.length === 0) {
      return res.status(200).json({ recipe: 'No expired items to suggest a recipe for.' });
    }

    const prompt = `Suggest a simple recipe using the following expired or near-expiry ingredients: ${itemNames.join(', ')}. 
Make sure the recipe is concise, beginner-friendly, and uses common pantry items.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipe = response.text();

    res.json({ recipe });
  } catch (err) {
    console.error('Error generating recipe:', err);
    res.status(500).json({ message: 'Failed to generate recipe', error: err.message });
  }
});
