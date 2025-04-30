import axios from 'axios';
import { generateMockImage } from './mockImageGeneration';

// Maximum allowed prompt length
const MAX_PROMPT_LENGTH = 500;

// Function to generate an image based on a text prompt using Hugging Face API
export async function generateImage(prompt: string): Promise<string> {
  try {
    // Validate prompt length
    if (prompt.length > MAX_PROMPT_LENGTH) {
      console.warn(`Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters, truncating...`);
      prompt = prompt.substring(0, MAX_PROMPT_LENGTH);
    }

    // Get API URL and key from environment variables
    const API_URL = process.env.HUGGING_FACE_API_URL;
    const API_KEY = process.env.HUGGING_FACE_API_KEY;

    if (!API_KEY || !API_URL) {
      console.warn('API_KEY or API_URL is not defined, using mock image service');
      return generateMockImage(prompt);
    }

    console.log(`Sending request to ${API_URL} with prompt: "${prompt}"`);

    // Include proper formatting for the prompt
    const formattedPrompt = JSON.stringify(prompt);

    const response = await axios({
      url: API_URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        inputs: formattedPrompt,
      },
      responseType: 'arraybuffer',
      validateStatus: (status) => true, // Don't throw on any status code
      timeout: 30000, // 30 second timeout (increased from 15s)
    });

    // Check if we got an error response
    if (response.status !== 200) {
      console.error('API Error:', {
        status: response.status, 
        statusText: response.statusText,
        headers: response.headers,
        data: response.data ? response.data.toString().substring(0, 200) : 'No data'
      });
      // Fall back to mock image generation
      return generateMockImage(prompt);
    }

    // Check if we got a valid image response
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('image')) {
      console.error('API did not return an image:', {
        contentType,
        headers: response.headers,
        dataSize: response.data ? response.data.length : 0
      });
      return generateMockImage(prompt);
    }

    console.log(`Successfully generated image with content type: ${contentType}`);

    // Convert the image buffer to Base64
    const imageBase64 = Buffer.from(response.data).toString('base64');
    return `data:${contentType};base64,${imageBase64}`;
  } catch (error) {
    console.error('Error generating image:', error);
    // Fall back to mock image generation
    return generateMockImage(prompt);
  }
}