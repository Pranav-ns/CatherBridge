const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// Load knowledge base
const kbPath = path.join(__dirname, '../data/knowledgeBase.json');
let knowledgeBase = [];
try {
  knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
} catch (error) {
  console.error('Error loading knowledge base:', error);
}

exports.processChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gemini API key is missing. Please add GEMINI_API_KEY to your backend .env file.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Very simple "RAG" keyword matching to find relevant context
    // In a production app, you'd use embeddings and a vector database (like MongoDB Atlas Vector Search)
    const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
    let relevantContext = '';
    
    knowledgeBase.forEach(item => {
      const match = keywords.some(kw => 
        item.topic.toLowerCase().includes(kw) || 
        item.content.toLowerCase().includes(kw)
      );
      if (match) {
        relevantContext += `\nTopic: ${item.topic}\nInfo: ${item.content}\n`;
      }
    });

    // Construct prompt
    const prompt = `
You are the friendly, helpful AI customer support agent for "CaterBridge", a platform that connects customers with local tiffin and catering services.
Keep your answers concise, friendly, and directly address the user's question.

Here is some context from the CaterBridge knowledge base that might help answer the user's question:
${relevantContext || "No specific internal context found for this query."}

User's query: "${message}"

Answer the user directly based ONLY on the provided context if it's related to platform rules. If the user greets you, greet them back warmly. If they ask a general food question, you can answer it generally.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      reply: response.text
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    next(error);
  }
};
