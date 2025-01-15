// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const planRoutes = require('./routes/planRoutes');
const { getDailyMenu } = require('./services/mcMasterMenuService');
const MenuItem = require('./models/menuItemModel');

const app = express();

// Enable CORS (so React on a different port can call this server)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// -- 1. Connect to MongoDB --
mongoose.connect('mongodb://localhost:27017/mcMasterMealPlanner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB...');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// -- 2. Function to update today's menu in the DB --
async function updateDailyMenu() {
  try {
    console.log('Updating daily menu from McMaster website...');
    const todayMenu = await getDailyMenu();
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    // Remove old entries for "today" if any (so we don’t duplicate)
    await MenuItem.deleteMany({
      date: { 
        $gte: currentDate  // this is a simplification
      }
    });

    // Insert new items
    for (const item of todayMenu) {
      await MenuItem.create({
        ...item,
        date: new Date()  // store date as "today"
      });
    }

    console.log('Daily menu updated successfully. Total items:', todayMenu.length);
  } catch (error) {
    console.error('Error updating daily menu:', error);
  }
}

// -- 3. Call updateDailyMenu once at server start for demonstration --
updateDailyMenu();

// Optionally, you could schedule it daily using node-cron or a similar library
// e.g., using node-cron: 
// const cron = require('node-cron');
// cron.schedule('0 0 * * *', () => updateDailyMenu());

// -- 4. Define routes --
app.use('/api/plan', planRoutes);

// -- 5. Start the server --
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
