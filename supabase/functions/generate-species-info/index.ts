import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { speciesName } = await req.json();

    if (!speciesName?.trim()) {
      throw new Error('Species name is required');
    }

    const prompt = `Provide comprehensive information about "${speciesName}". 
    
    Requirements:
    - Title should be the common name of the species
    - Content should be 200-300 words of detailed information
    - Include scientific classification, habitat, behavior, diet, and conservation status
    - Make it educational and engaging for nature enthusiasts
    - If the species doesn't exist or is unclear, provide information about the closest match
    
    Format your response as JSON:
    {
      "title": "Common name of the species",
      "content": "Detailed educational content about the species",
      "category": "animals|birds|plants|insects|marine",
      "tags": ["tag1", "tag2", "tag3", "tag4"],
      "scientific_name": "Scientific name if available"
    }`;

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
            content: 'You are a wildlife and nature expert who provides accurate, educational information about species. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON response
    let speciesData;
    try {
      speciesData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      throw new Error('Invalid AI response format');
    }

    // Insert the species information as an educational post
    const { data: insertedPost, error: insertError } = await supabaseClient
      .from('educational_posts')
      .insert({
        title: speciesData.title,
        content: speciesData.content,
        category: speciesData.category || 'animals',
        post_type: 'species-info',
        tags: speciesData.tags || [speciesName.toLowerCase()]
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save species information to database');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: insertedPost,
        message: `Information about ${speciesData.title} found!`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-species-info function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});