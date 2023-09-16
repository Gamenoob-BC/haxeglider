const express = require('express');
const cors = require('cors');
const axios = require('axios');
const tf = require('@tensorflow/tfjs-node');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const model = tf.sequential();

// Define a function to fetch Haxe instructions from the API
const fetchHaxeInstructions = async () => {
  try {
    const response = await axios.get('https://haxe-api-url.com'); // Replace with the actual Haxe API URL
    if (response.status === 200) {
      return response.data.instructions; // Assuming the API returns instructions
    } else {
      throw new Error('Failed to fetch Haxe instructions');
    }
  } catch (error) {
    console.error('Error fetching Haxe instructions:', error.message);
    return [];
  }
};

// Define a function to preprocess and prepare the training data
const prepareTrainingData = async () => {
  const haxeInstructions = await fetchHaxeInstructions();
  if (haxeInstructions.length === 0) {
    throw new Error('No Haxe instructions available for training');
  }

  const inputTensor = tf.tensor(haxeInstructions.map((instruction) => [instruction]));
  const outputTensor = tf.tensor(haxeInstructions.map(() => [1])); // You can adjust the output as needed

  return { inputTensor, outputTensor };
};

// Define a function to train the neural network with TensorFlow.js
const trainNeuralNetwork = async () => {
  try {
    const { inputTensor, outputTensor } = await prepareTrainingData();

    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    await model.fit(inputTensor, outputTensor, { epochs: 100 });

    console.log('Model training complete');
  } catch (error) {
    console.error('Error training neural network:', error.message);
  }
};

// Train the neural network when the server starts
trainNeuralNetwork();

app.get('/predict', async (req, res) => {
  const inputInstruction = req.query.instruction;

  if (!inputInstruction) {
    return res.status(400).json({ error: 'Missing instruction parameter' });
  }

  try {
    const inputTensor = tf.tensor([[inputInstruction]]);
    const prediction = await model.predict(inputTensor).data();

    res.json({ prediction: prediction[0] });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ error: 'Failed to make a prediction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
