require('dotenv').config();
const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const playstoreRoutes = require('./routes/playstore');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Health check route (ADD HERE)
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Prysm Backend Running" });
});

// Routes
app.use('/api/playstore', playstoreRoutes);

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
