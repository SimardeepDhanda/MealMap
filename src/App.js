// src/App.js
import React, { useState } from 'react';
import UserForm from './components/UserForm';
import PlanDisplay from './components/PlanDisplay'; 

function App() {
  const [planResponse, setPlanResponse] = useState(null);

  const handlePlanGenerated = (responseData) => {
    // This is the entire object we get from the backend:
    // { user: { ... }, plan: [ ... ] }
    setPlanResponse(responseData);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>McMaster Campus Meal Planner</h1>
      <UserForm onPlanGenerated={handlePlanGenerated} />

      {planResponse && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Plan for {planResponse.user.name}</h2>
          <p>Daily Budget: ${planResponse.user.dailyBudget}</p>
          <p>Calorie Goal: ~{planResponse.user.baseCalories} kcal</p>
          <p>Total Calories in Plan: {planResponse.user.totalCalories} kcal</p>
          <p>Total Spent: ${planResponse.user.totalSpent.toFixed(2)}</p>
          <PlanDisplay plan={planResponse.plan} />
        </div>
      )}
    </div>
  );
}

export default App;
