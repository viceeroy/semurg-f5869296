
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, language = 'english' } = await req.json();

    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Making OpenAI API request with image...');

    // Add retry logic for rate limiting
    let retries = 0;
    const maxRetries = 3;
    let response;

    while (retries <= maxRetries) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a wildlife expert. CRITICAL: Only identify REAL wildlife species (birds, mammals, reptiles, amphibians, fish, insects, plants, fungi, marine life). If the image shows anything else (people, objects, buildings, food, vehicles, etc.), you MUST respond with a category of "not_wildlife".

${language.toLowerCase() === 'uzbek' ? 'IMPORTANT: Provide ALL information in UZBEK language (O\'zbek tilida). All text fields should be in Uzbek except scientific_name which should remain in Latin.' : 'Provide all information in English.'}

Analyze the image and provide comprehensive, detailed information about the species in JSON format:
{
  "species_name": "Common name of the species",
  "scientific_name": "Scientific name", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "Comprehensive introduction to this species - include their significance in the ecosystem, general characteristics, what makes them unique, their role in nature, and why they're important. Write at least 50-60 words with engaging, educational content that captivates the reader",
  "habitat": "Detailed description of typical environment and geographical range - include specific locations, climate preferences, elevation ranges, habitat requirements, seasonal movements, and how they adapt to their environment. Describe the ecosystem they live in and their relationship with it. Provide at least 45-55 words",
  "diet": "Comprehensive description of what the species eats, feeding behaviors, hunting or foraging techniques, seasonal dietary changes, feeding schedule, and their role in the food chain. Include specific food sources, feeding patterns, and how their diet affects the ecosystem. Write at least 45-55 words", 
  "behavior": "Detailed account of notable behaviors, social structures, mating rituals, territorial habits, daily activities, communication methods, migration patterns, parental care, and unique characteristics that define this species. Include seasonal behaviors and interactions with other species. Provide at least 45-55 words",
  "conservation_status": "Current conservation status with detailed context about population trends, specific threats they face, ongoing conservation efforts, historical population changes, and what factors affect their survival. Include human impact and conservation success stories if applicable. Write at least 35-45 words",
  "interesting_facts": "3-4 fascinating, specific facts about the species that highlight their unique abilities, record-breaking characteristics, historical significance, remarkable adaptations, or surprising behaviors. Make these engaging, educational, and memorable. Include specific numbers, comparisons, or unusual traits. Provide at least 50-60 words",
  "identification_notes": "Detailed key features that helped identify this species - include physical characteristics, distinctive markings, size comparisons, coloration patterns, body shape, and distinguishing features from similar species. Mention age, gender, or seasonal variations if visible. Write at least 35-45 words"
}

IMPORTANT RULES:
1. If you see a person, object, building, food item, vehicle, or anything that is NOT a living wildlife species, set category to "not_wildlife"
2. Only use wildlife categories if you can clearly see an actual living organism in its natural form
3. Be very conservative - when in doubt, use "not_wildlife"
4. Do not try to identify wildlife in logos, drawings, or artificial representations

Always return valid JSON. Do not include any text before or after the JSON object.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please identify this wildlife species and provide detailed information.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      }),
    });

      if (response.ok) {
        break; // Success, exit retry loop
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

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Try to extract JSON from the response, handling cases where OpenAI adds extra text
      let jsonContent = content.trim();
      
      // Look for JSON object in the response
      const jsonStart = jsonContent.indexOf('{');
      const jsonEnd = jsonContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
      }
      
      const speciesInfo = JSON.parse(jsonContent);
      
      // Validate that the identified species is wildlife (birds, animals, plants)
      const allowedCategories = ['bird', 'mammal', 'reptile', 'amphibian', 'fish', 'insect', 'plant', 'fungi', 'marine life'];
      const identifiedCategory = speciesInfo.category?.toLowerCase().replace('_', ' ') || '';
      
      if (!allowedCategories.includes(identifiedCategory) || identifiedCategory === 'not wildlife') {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Please upload a picture of an animal, bird, or plant to analyze and help you discover wildlife species."
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ success: true, data: speciesInfo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.log('Original content:', content);
      
      // Try to make another request with a more explicit prompt
      const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a wildlife expert. CRITICAL: Only identify REAL wildlife species. If the image shows anything else (people, objects, buildings, food, vehicles, etc.), you MUST respond with a category of "not_wildlife". Return ONLY a valid JSON object with species information. No other text.`
            },
            {
              role: 'user',
              content: `Please identify this wildlife species and return ONLY valid JSON with this exact structure:
{
  "species_name": "Common name",
  "scientific_name": "Scientific name", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "Comprehensive introduction to this species - include their significance in the ecosystem, general characteristics, what makes them unique, their role in nature, and why they're important. Write at least 50-60 words with engaging, educational content",
  "habitat": "Detailed description of typical environment and geographical range - include specific locations, climate preferences, elevation ranges, habitat requirements, and how they adapt to their environment. Provide at least 45-55 words",
  "diet": "Comprehensive description of what the species eats, feeding behaviors, hunting techniques, seasonal dietary changes, and their role in the food chain. Write at least 45-55 words", 
  "behavior": "Detailed account of notable behaviors, social structures, mating rituals, territorial habits, daily activities, and unique characteristics. Provide at least 45-55 words",
  "conservation_status": "Current conservation status with detailed context about population trends, threats, conservation efforts, and factors affecting survival. Write at least 35-45 words",
  "interesting_facts": "3-4 fascinating, specific facts about the species that highlight their unique abilities, adaptations, or surprising behaviors. Provide at least 50-60 words",
  "identification_notes": "Detailed key features that helped identify this species - include physical characteristics, distinctive markings, and distinguishing features. Write at least 35-45 words"
}

IMPORTANT: If this is not a real wildlife species, set category to "not_wildlife"

Image: ${imageUrl}`
            }
          ],
          max_tokens: 1200,
          temperature: 0.1
        }),
      });

      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        const retryContent = retryData.choices[0].message.content.trim();
        
        try {
          let retryJsonContent = retryContent;
          const retryJsonStart = retryJsonContent.indexOf('{');
          const retryJsonEnd = retryJsonContent.lastIndexOf('}');
          
          if (retryJsonStart !== -1 && retryJsonEnd !== -1 && retryJsonEnd > retryJsonStart) {
            retryJsonContent = retryJsonContent.substring(retryJsonStart, retryJsonEnd + 1);
          }
          
          const retrySpeciesInfo = JSON.parse(retryJsonContent);
          
          // Validate retry result as well
          const allowedCategories = ['bird', 'mammal', 'reptile', 'amphibian', 'fish', 'insect', 'plant', 'fungi', 'marine life'];
          const retryCategory = retrySpeciesInfo.category?.toLowerCase().replace('_', ' ') || '';
          
          if (!allowedCategories.includes(retryCategory) || retryCategory === 'not wildlife') {
            return new Response(JSON.stringify({ 
              success: false, 
              error: "Please upload a picture of an animal, bird, or plant to analyze and help you discover wildlife species."
            }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          return new Response(JSON.stringify({ success: true, data: retrySpeciesInfo }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (retryParseError) {
          console.error('Retry parsing also failed:', retryParseError);
        }
      }
      
      // Final fallback
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Unable to parse species identification results"
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in identify-species function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
