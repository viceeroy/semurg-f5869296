
export async function makeOpenAIRequest(apiKey: string, requestBody: any, maxRetries: number = 3): Promise<Response> {
  let retries = 0;
  let response: Response;

  while (retries <= maxRetries) {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      break;
    }

    if (response.status === 429 && retries < maxRetries) {
      console.log(`Rate limited, retrying in ${(retries + 1) * 2} seconds...`);
      await new Promise(resolve => setTimeout(resolve, (retries + 1) * 2000));
      retries++;
      continue;
    }

    // Handle other errors
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    
    const errorText = await response.text();
    console.error('OpenAI API error:', errorText);
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  return response;
}

export async function makeRetryRequest(apiKey: string, imageUrl: string): Promise<any> {
  const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a wildlife expert. CRITICAL: Only identify REAL wildlife species. If the image shows anything else (people, objects, buildings, food, vehicles, etc.), you MUST respond with a category of "not_wildlife". Return ONLY a valid JSON object with comprehensive species information. No other text.`
        },
        {
          role: 'user',
          content: `Please identify this wildlife species and return ONLY valid JSON with this exact structure. Provide extremely detailed information for each field (80-120 words per section):
{
  "species_name": "Common name",
  "scientific_name": "Scientific name", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "Comprehensive introduction to this species with evolutionary history, ecosystem role, unique characteristics, and significance. Write at least 80-120 words with detailed scientific information",
  "habitat": "Detailed description of habitat requirements, geographical distribution, climate preferences, elevation ranges, and ecosystem relationships. Provide at least 80-100 words with specific ecological details",
  "diet": "Comprehensive description of feeding behaviors, food sources, hunting techniques, seasonal variations, and role in food webs. Write at least 80-100 words with detailed nutritional ecology", 
  "behavior": "Detailed account of social structures, mating rituals, communication, territorial habits, learning abilities, and unique behaviors. Provide at least 80-100 words with behavioral ecology details",
  "conservation_status": "Current conservation status with population trends, threats, conservation efforts, historical changes, and future projections. Write at least 80-100 words with comprehensive conservation information",
  "interesting_facts": "5-6 fascinating, verified facts about unique adaptations, abilities, cultural significance, and remarkable characteristics. Provide at least 100-120 words with specific details and measurements",
  "identification_notes": "Detailed diagnostic features, physical measurements, distinguishing characteristics, and field identification tips. Write at least 70-90 words with precise identification details"
}

IMPORTANT: If this is not a real wildlife species, set category to "not_wildlife"

Image: ${imageUrl}`
        }
      ],
      max_tokens: 1800,
      temperature: 0.2
    }),
  });

  if (!retryResponse.ok) {
    throw new Error('Retry request failed');
  }

  return retryResponse.json();
}
