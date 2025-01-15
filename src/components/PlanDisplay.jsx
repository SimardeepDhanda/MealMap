// src/components/PlanDisplay.jsx
import React from 'react';

function PlanDisplay({ plan }) {
  if (!plan || !plan.length) {
    return <div>No meal items selected for your plan.</div>;
  }

  return (
    <div>
      <h3>Selected Meals</h3>
      {plan.map((item, index) => (
        <div 
          key={index} 
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          <h4>{item.name}</h4>
          <p>Calories: {item.calories} kcal</p>
          <p>Protein: {item.protein} g</p>
          <p>Carbs: {item.carbs} g</p>
          <p>Fat: {item.fat} g</p>
          <p>Location: {item.location}</p>
          <p>Price: ${item.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default PlanDisplay;
