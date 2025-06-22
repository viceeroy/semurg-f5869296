
export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables');
    throw new Error('OpenAI API key not configured');
  }
}
