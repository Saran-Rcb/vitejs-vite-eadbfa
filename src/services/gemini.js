import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const sanitizeAndParseJSON = (text) => {
  try {
    // Find the first '[' and last ']' to extract valid JSON array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']') + 1;
    if (start === -1 || end === 0) {
      throw new Error('Invalid JSON structure in response');
    }
    const jsonStr = text.slice(start, end);
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error('Failed to parse API response');
  }
};

export const generateTopics = async (course, level) => {
  try {
    const prompt = `Generate a structured learning path for ${course} at ${level} level. 
      Return ONLY a JSON array with exactly 5 topics in this format:
      [{"title": "Topic Name", "description": "Brief topic description"}]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from API');
    }
    
    return sanitizeAndParseJSON(text);
  } catch (error) {
    console.error('Error generating topics:', error);
    throw new Error('Failed to generate topics. Please try again.');
  }
};

export const generateQuestions = async (topic) => {
  try {
    const prompt = `Generate a mock test for "${topic}". 
      Return ONLY a JSON array with exactly 10 questions in this format:
      [{"question": "Question text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "correctAnswer": 0}]
      where correctAnswer is the index (0-3) of the correct option.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from API');
    }
    
    return sanitizeAndParseJSON(text);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
};