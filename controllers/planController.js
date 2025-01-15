// controllers/planController.js
const User = require('../models/userModel');
const MenuItem = require('../models/menuItemModel');

exports.generatePlan = async (req, res) => {
  try {
    const { 
      name, 
      weight, 
      height, 
      goal, 
      dailyBudget, 
      dietaryRestrictions 
    } = req.body;

    // 1. For simplicity, let's create a user entry each time. 
    //    In production, you'd likely have user authentication and store a user ID, etc.
    const user = new User({
      name,
      weight,
      height,
      goal,
      dailyBudget,
      dietaryRestrictions
    });
    await user.save();

    // 2. Calculate daily caloric needs (very simplified approach).
    //    In reality, you’d consider age, gender, activity, etc.
    let baseCalories = 22 * weight; // rough multiplier
    if (goal === 'lose') {
      baseCalories -= 300; // mild deficit
    } else if (goal === 'gain') {
      baseCalories += 300; // mild surplus
    }

    // 3. Get today's date (rounded to midnight)
    const today = new Date();
    today.setHours(0,0,0,0);

    // 4. Fetch menu items from the DB for "today"
    //    (Because we set `date` to new Date() in the service, we compare >= today's midnight)
    const menuItems = await MenuItem.find({ 
      date: { $gte: today }
    });

    // 5. Filter items by dietary restrictions (example: if user typed "Vegan")
    //    This depends heavily on how we identify each item’s dietary category.
    //    Here, we do a very naive check.
    let filteredItems = menuItems;
    if (dietaryRestrictions && dietaryRestrictions.toLowerCase().includes('vegan')) {
      filteredItems = filteredItems.filter((item) => {
        // exclude items with 'chicken', 'beef', 'meat', etc. 
        // This is obviously simplistic and not accurate for real use.
        const lowerName = item.name.toLowerCase();
        if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('meat') || lowerName.includes('fish')) {
          return false;
        }
        return true;
      });
    }
    // you could add more logic for Halal, Vegetarian, etc.

    // 6. Build a plan that tries to keep total cost <= dailyBudget
    //    and total calories close to baseCalories. This is extremely naive.
    let plan = [];
    let totalCalories = 0;
    let totalSpent = 0;

    // Sort items by price ascending maybe (so we pick cheaper items first) or by protein content, etc.
    // This is purely optional. 
    filteredItems.sort((a, b) => a.price - b.price);

    for (const item of filteredItems) {
      // If we can afford this item and we haven't exceeded our calorie target by too much
      if ((totalSpent + item.price) <= dailyBudget && (totalCalories + item.calories) <= (baseCalories + 200)) {
        plan.push(item);
        totalSpent += item.price;
        totalCalories += item.calories;
      }
      // Simple break conditions
      if (totalSpent >= dailyBudget || totalCalories >= baseCalories) {
        break;
      }
    }

    // 7. Return the final plan to the client
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        dailyBudget: user.dailyBudget,
        goal: user.goal,
        baseCalories,
        totalCalories,
        totalSpent
      },
      plan
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ message: 'Error generating plan', error });
  }
};
