// This is a fallback service that provides mock images when the real API fails

export async function generateMockImage(prompt: string): Promise<string> {
  // Create a placeholder image URL with the prompt encoded
  const encodedPrompt = encodeURIComponent(prompt);
  const imageText = `AI+Image:+${encodedPrompt.substring(0, 30)}${encodedPrompt.length > 30 ? '...' : ''}`;
  
  // Generate random colors for variety
  const colors = [
    '3B82F6', // blue
    '10B981', // green
    '8B5CF6', // purple
    'F59E0B', // amber
    'EF4444', // red
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Return a placeholder image with the prompt text
  return `https://placehold.co/800x600/${randomColor}/FFFFFF?text=${imageText}`;
} 