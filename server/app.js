import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { GrammarResponse } from './zodSchema.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;


const users = [];


app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});




const JWT_SECRET = process.env.JWT_SECRET;



const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


app.post('/api/users/register', async (req, res) => {
  const { username, password } = req.body;
  


  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  


  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  

  const newUser = {
    id: users.length + 1,
    username,
    password: hash
  };
  


  users.push(newUser);
  

  const token = jwt.sign(
    { user: { id: newUser.id } },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { user: { id: user.id } },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});
app.post('/api/grammar/check', 
    authMiddleware,
     async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  try {
    const words = text.split(/\s+/);
    let positions = [];
    let currentPos = 0;
    


    words.forEach(word => {
      positions.push({
        word,
        start: text.indexOf(word, currentPos),
        length: word.length
      });
      currentPos = text.indexOf(word, currentPos) + word.length;
    });

    console.log(text, positions);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: `You are a grammar checking assistant.
          Always analyze the text to identify grammatical errors. Find and list all errors in the text.
          The text has been pre-processed and word positions are provided.
          Return errors ONLY for the exact words provided, using their exact positions.
          

          Input text: ${text}
          
          Word positions: ${JSON.stringify(positions)}
          
          Return errors in this format:
          {
            "word": "exact word from positions array",
            "position": "use position from positions array",
            "length": "use length from positions array", 
            "suggestion": "suggested correction",
            "reason": "Brief explanation of why this is an error",
            "confidence_score": "confidence score for the error"
          }`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: zodResponseFormat(GrammarResponse, "reasoning")
    });

    
    const result = completion.choices[0].message;

    if (result.parsed.errors) {
      result.parsed.errors = result.parsed.errors.map(error => {
        const matchingWord = positions.find(p => p.word === error.word);
        if (matchingWord) {
          return {
            ...error,
            position: matchingWord.start,
            length: matchingWord.length
          };
        }
        return error;
      });
    }

    if (result.refusal) {
      console.error('Refusal reason:', result.refusal);
      return res.status(400).json({ message: 'Unable to analyze text', error: 'Model refusal' });
    } else {
      console.log('Result:', result.parsed.errors);
      res.json({ errors: result.parsed.errors });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error grammar', 
      error: error.message 
    });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; 