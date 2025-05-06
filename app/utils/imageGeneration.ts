import { OpenAI } from 'openai';
import { generateMockImage } from './mockImageGeneration';

// Maximum allowed prompt length
const MAX_PROMPT_LENGTH = 1000;
// Base timeout in milliseconds
const TIMEOUT = 60000; // 60 seconds

// Function to generate an image based on a text prompt using OpenAI's DALL-E
export async function generateImage(prompt: string): Promise<string> {
  try {
    // Validate and trim prompt length if needed
    const originalLength = prompt.length;
    if (originalLength > MAX_PROMPT_LENGTH) {
      console.warn(`Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters, truncating...`);
      prompt = prompt.substring(0, MAX_PROMPT_LENGTH);
    }

    // Get API key from environment variables
    const API_KEY = process.env.OPENAI_API_KEY;

    if (!API_KEY) {
      console.warn('OPENAI_API_KEY is not defined, using mock image service');
      return generateMockImage(prompt);
    }

    console.log(`Sending request to OpenAI with prompt length: ${prompt.length} chars`);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), TIMEOUT);
    });

    // Create the image generation promise
    const imagePromise = openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    });

    // Race the promises to handle timeout
    const response = await Promise.race([imagePromise, timeoutPromise]) as Awaited<typeof imagePromise>;

    // Check if we got a valid response
    if (!response.data || response.data.length === 0) {
      console.error('OpenAI did not return image data');
      return generateMockImage(prompt);
    }

    const imageData = response.data[0];
    
    if (!imageData.b64_json) {
      console.error('OpenAI response missing b64_json data');
      return generateMockImage(prompt);
    }

    console.log(`Successfully generated image with OpenAI's DALL-E`);

    // Return the base64 image data with appropriate MIME type
    return `data:image/png;base64,${imageData.b64_json}`;
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    
    // For very long prompts that cause issues, we might want to retry with a shorter version
    if (prompt.length > 400 && error instanceof Error && (
      error.message.includes('timeout') || 
      error.message.includes('rate') || 
      error.message.includes('capacity')
    )) {
      console.log('Error occurred with long prompt, retrying with shorter version...');
      const shortenedPrompt = prompt.substring(0, Math.floor(prompt.length * 0.7)); // Use 70% of original
      return generateImage(shortenedPrompt);
    }
    
    // Fall back to mock image generation
    return generateMockImage(prompt);
  }
}