import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type ChatGPTRequest = {
  message: string;
};

type ChatGPTResponse = {
  response: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<ChatGPTResponse | { error: string }>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body as ChatGPTRequest;
    console.log(req.body)

    // Check if message is provided
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required and cannot be empty' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key is missing' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
};

export default handler;
