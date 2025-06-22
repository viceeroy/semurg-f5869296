
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsRequest } from "./utils/corsHandler.ts";
import { validateApiKey } from "./utils/apiKeyValidator.ts";
import { buildOpenAIRequest } from "./utils/requestBuilder.ts";
import { parseOpenAIResponse } from "./utils/responseParser.ts";
import { validateSpeciesCategory, createNotWildlifeResponse } from "./utils/speciesValidator.ts";
import { makeOpenAIRequest, makeRetryRequest } from "./utils/apiClient.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  try {
    const { imageUrl, language = 'english' } = await req.json();

    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    validateApiKey(openAIApiKey);

    console.log('Making OpenAI API request with image...');

    const requestBody = buildOpenAIRequest(imageUrl, language);
    const response = await makeOpenAIRequest(openAIApiKey!, requestBody);

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const speciesInfo = parseOpenAIResponse(content);
      
      if (!validateSpeciesCategory(speciesInfo.category)) {
        return new Response(JSON.stringify(createNotWildlifeResponse()), {
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
      
      try {
        const retryData = await makeRetryRequest(openAIApiKey!, imageUrl);
        const retryContent = retryData.choices[0].message.content.trim();
        
        const retrySpeciesInfo = parseOpenAIResponse(retryContent);
        
        if (!validateSpeciesCategory(retrySpeciesInfo.category)) {
          return new Response(JSON.stringify(createNotWildlifeResponse()), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ success: true, data: retrySpeciesInfo }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (retryParseError) {
        console.error('Retry parsing also failed:', retryParseError);
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Unable to parse species identification results"
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
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
