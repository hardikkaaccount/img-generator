import axios from 'axios';
import { generateMockImage } from './mockImageGeneration';

// Maximum allowed prompt length
const MAX_PROMPT_LENGTH = 1200;
// Base timeout in milliseconds (for shorter prompts)
const BASE_TIMEOUT = 30000; // 30 seconds
// Additional time per character for longer prompts
const TIMEOUT_PER_CHAR = 50; // 50ms per character

// Function to generate an image based on a text prompt using Hugging Face API
export async function generateImage(prompt: string): Promise<string> {
  try {
    // Validate and trim prompt length if needed
    const originalLength = prompt.length;
    if (originalLength > MAX_PROMPT_LENGTH) {
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

    // Calculate adaptive timeout based on prompt length
    // Longer prompts need more time to process
    const promptLength = prompt.length;
    const calculatedTimeout = Math.min(
      BASE_TIMEOUT + (promptLength * TIMEOUT_PER_CHAR),
      120000 // Cap at 2 minutes maximum
    );
    
    console.log(`Sending request to ${API_URL} with prompt length: ${promptLength} chars (timeout: ${calculatedTimeout}ms)`);

    // For very long prompts, we'll add a note about potential timeouts
    if (promptLength > 800) {
      console.log('Note: Very long prompts may take longer to process and could time out');
    }

    // Send request to the API
    const response = await axios({
      url: API_URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        inputs: prompt,
        options: {
          wait_for_model: true,
          use_cache: true // Try to use cached results when possible
        }
      },
      responseType: 'arraybuffer',
      validateStatus: (status: number) => true, // Don't throw on any status code
      timeout: calculatedTimeout,
    });

    // Check if we got an error response
    if (response.status !== 200) {
      console.error('API Error:', {
        status: response.status, 
        statusText: response.statusText,
        headers: response.headers,
        data: response.data ? Buffer.from(response.data as any).toString().substring(0, 200) : 'No data',
        promptLength
      });
      
      // For very long prompts that time out, we might want to retry with a shorter version
      if (response.status === 503 || (response as any).code === 'ECONNABORTED') {
        if (promptLength > 400) {
          console.log('Timeout occurred with long prompt, retrying with shorter version...');
          const shortenedPrompt = prompt.substring(0, Math.floor(promptLength * 0.7)); // Use 70% of original
          return generateImage(shortenedPrompt);
        }
      }
      
      // Fall back to mock image generation
      return generateMockImage(prompt);
    }

    // Check if we got a valid image response
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('image')) {
      console.error('API did not return an image:', {
        contentType,
        headers: response.headers,
        dataSize: response.data ? Buffer.from(response.data as any).length : 0
      });
      return generateMockImage(prompt);
    }

    console.log(`Successfully generated image with content type: ${contentType}`);

    // Convert the image buffer to Base64
    const imageBase64 = Buffer.from(response.data as any).toString('base64');
    return `data:${contentType};base64,${imageBase64}`;
  } catch (error) {
    console.error('Error generating image:', error);
    // Fall back to mock image generation
    return generateMockImage(prompt);
  }
}