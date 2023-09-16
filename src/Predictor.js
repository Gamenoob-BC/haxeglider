// In your React component file, e.g., src/components/YourComponent.js

import React, { useState, useEffect } from 'react';

function Predictor() {
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    // Make a GET request to your Node.js server
    fetch(`/predict?instruction=${document.getElementById('helper')}`) // Replace with your instruction
      .then((response) => response.json())
      .then((data) => {
        setPrediction(data.prediction);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
      <p>Prediction: {prediction}</p>
    </div>
  );
}

export default Predictor;
