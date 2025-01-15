// services/mcMasterMenuService.js
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes daily menu items from McMaster's website.
 * Returns an array of objects:
 *   [{ name, calories, protein, carbs, fat, price, location }, ...]
 */
async function getDailyMenu() {
  const url = 'https://macnutrition.mcmaster.ca/Nutrition/ServiceMenuReport/Today';
  try {
    // 1. Fetch the HTML
    const { data } = await axios.get(url);

    // 2. Load into cheerio
    const $ = cheerio.load(data);

    // 3. Parse items (this is hypothetical—adjust to real selectors)
    const menuItems = [];
    
    $('div.menuItemContainer').each((i, element) => {
      const name = $(element).find('.menuItemName').text().trim() || 'Unknown Meal';
      const calString = $(element).find('.menuItemCalories').text().trim();
      const proteinString = $(element).find('.menuItemProtein').text().trim();
      const carbString = $(element).find('.menuItemCarbs').text().trim();
      const fatString = $(element).find('.menuItemFat').text().trim();
      const priceString = $(element).find('.menuItemPrice').text().trim();
      const location = $(element).find('.menuItemLocation').text().trim() || 'Unknown Location';

      const calories = parseInt(calString) || 0;
      const protein = parseInt(proteinString) || 0;
      const carbs = parseInt(carbString) || 0;
      const fat = parseInt(fatString) || 0;
      const price = parseFloat(priceString.replace('$', '')) || 0;

      menuItems.push({ 
        name, 
        calories, 
        protein, 
        carbs, 
        fat, 
        price, 
        location 
      });
    });

    return menuItems;
  } catch (error) {
    console.error('Error fetching daily menu:', error);
    return [];
  }
}

module.exports = {
  getDailyMenu,
};
