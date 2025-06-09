
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
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a wildlife expert. Analyze the image and provide detailed information about the species in JSON format:
{
  "species_name": "Common name of the species",
  "scientific_name": "Scientific name", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/etc",
  "confidence": "high/medium/low",
  "description": "Detailed description including habitat, behavior, diet, conservation status, and interesting facts. Make it educational and engaging.",
  "identification_notes": "Key features that helped identify this species"
}

Please identify this wildlife species and provide detailed information.`
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
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const speciesInfo = JSON.parse(content);
      return new Response(JSON.stringify({ success: true, data: speciesInfo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return new Response(JSON.stringify({ 
        success: true, 
        data: {
          species_name: "Unknown Species",
          scientific_name: "Unknown",
          category: "unknown",
          confidence: "low",
          description: content,
          identification_notes: "AI analysis provided"
        }
      }), {
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
