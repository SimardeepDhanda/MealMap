from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import pandas as pd

# Set up Selenium WebDriver
driver = webdriver.Chrome()

# Open the website
url = "https://macnutrition.mcmaster.ca"
driver.get(url)


# Wait for the table to load (adjust the class or ID selector to match an element on your table)
try:
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CLASS_NAME, "nutritionReport"))
    )
except Exception as e:
    print("Error: ", e)
    driver.quit()

# JavaScript code to extract the table rows
script = """
    let rows = document.querySelectorAll('tbody tr'); // Grabbing all rows in the table body
    let data = [];
    
    rows.forEach((row) => {
        let description = row.querySelector('.description') ? row.querySelector('.description').innerText.trim() : "N/A";
        let portion = row.querySelector('.uom') ? row.querySelector('.uom').innerText.trim() : "N/A";
        let price = row.querySelector('.itemPrice') ? row.querySelector('.itemPrice').innerText.trim() : "N/A";
        
        let calories = row.querySelector('.nutCellOdd') ? row.querySelector('.nutCellOdd').innerText.trim() : "N/A";
        let protein = row.querySelector('.nutCellEven') ? row.querySelector('.nutCellEven').innerText.trim() : "N/A";
        
        data.push([description, portion, price, calories, protein]);
    });
    
    return data;
"""

# Execute the JavaScript and retrieve the data
table_data = driver.execute_script(script)

# Debug: Check if the table data is correctly extracted
print(table_data)

# Write the data to a CSV file
with open('menu_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # Write headers
    writer.writerow(['Food Item', 'Portion', 'Price', 'Calories', 'Protein'])
    
    # Write the table data
    writer.writerows(table_data)

# Read the CSV to inspect the results
menu_data = pd.read_csv('menu_data.csv')
print(menu_data)

# Close the browser
driver.quit()
