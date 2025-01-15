// src/components/UserForm.jsx
import React, { useState } from 'react';
import { submitUserData } from '../services/api';

function UserForm({ onPlanGenerated }) {
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    goal: 'maintain',
    dailyBudget: 20,
    dietaryRestrictions: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = await submitUserData(formData);
      onPlanGenerated(planData);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate plan. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name: </label><br/>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Weight (kg): </label><br/>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Height (cm): </label><br/>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Goal: </label><br/>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Daily Budget (CAD): </label><br/>
        <input
          type="number"
          name="dailyBudget"
          value={formData.dailyBudget}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Dietary Restrictions: </label><br/>
        <input
          type="text"
          name="dietaryRestrictions"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          style={{ width: '100%' }}
          placeholder="e.g., Vegan, Halal"
        />
      </div>

      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        Generate Plan
      </button>
    </form>
  );
}

export default UserForm;
