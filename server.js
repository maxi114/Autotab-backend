import express from 'express'
import {GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import cors from 'cors'
import { getGeminiResponse } from './gemini.js'
// Load environment variables
dotenv.config()
const Message = {
    role: ["system", "user", "assistant"], // Possible roles
    content: "", // Placeholder for content
  };
  
// Initialize Express app
const app = express()
const port = process.env.PORT || 3000
// Middleware
app.use(cors())
app.use(express.json())
// Initialize Gemini
const genAI = new GoogleGenerativeAI (process.env.GEMINI_API_KEY || '')
// Gemini chat endpoint
app.post('/api/chat', async (req, res) => {
try {
const { message, context = {} } = req.body
if (!message) {
return res.status(400).json({ error: 'Message is required' })
}
const messages = [
    {
      role: "system",
      content: `You are an AI writing assistant. Complete the user's text naturally, continuing their thought.
  
  Current webpage context:
  ${JSON.stringify(context)}
  `
    },
    {
      role: "user",
      content: message
    }
  ];
  
console.log(messages)
// Generate response
const result = await getGeminiResponse(messages)
res.json({response: result })
} catch (error) {
console.error('Error in chat endpoint:', error)
res.status(500).json({ error: 'Internal server error' })
}
})
// Start server
app.listen(port, () => {
console.log(`Server running on port ${port}`)
})