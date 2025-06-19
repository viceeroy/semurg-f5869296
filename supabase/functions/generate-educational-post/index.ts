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

    // Get language from request body
    const { language = 'english' } = await req.json().catch(() => ({}));

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a random educational post using OpenAI
    const topics = [
      'animals', 'birds', 'plants', 'marine life', 'insects', 'trees', 
      'wildlife behavior', 'nature conservation', 'ecology', 'botany'
    ];
    
    const postTypes = [
      { type: 'did-you-know', instruction: 'Create a "Did you know?" fact' },
      { type: 'interesting-fact', instruction: 'Share an interesting fact' },
      { type: 'how-to', instruction: 'Write a "How to" guide' },
      { type: 'where-to-find', instruction: 'Explain where to find something in nature' }
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomPostType = postTypes[Math.floor(Math.random() * postTypes.length)];

    const isUzbek = language === 'uzbek' || language === 'uz';
    const langInstruction = isUzbek ? 'O\'zbek tilida yozing.' : 'Write in English.';
    
    const prompt = `${randomPostType.instruction} about ${randomTopic}. ${langInstruction}
    
    Requirements:
    - Title should be engaging and start appropriately (like "Did you know...", "Interesting fact:", "How to...", "Where to find...")
    - Content should be 150-250 words
    - Include fascinating, educational information that would interest nature lovers
    - Make it engaging and easy to understand
    - Focus on specific, memorable details
    ${isUzbek ? '- Barcha matnni O\'zbek tilida yozing' : ''}
    
    Format your response as JSON:
    {
      "title": "Your engaging title here",
      "content": "Your detailed content here", 
      "category": "animals|birds|plants",
      "tags": ["tag1", "tag2", "tag3"]
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
            content: `You are a nature education expert who creates engaging, factual content about wildlife, plants, and nature. Always respond with valid JSON. ${isUzbek ? 'Barcha javoblarni O\'zbek tilida bering.' : 'Write all responses in English.'}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON response
    let postData;
    try {
      postData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      throw new Error('Invalid AI response format');
    }

    // Insert the new post into the database
    const { data: insertedPost, error: insertError } = await supabaseClient
      .from('educational_posts')
      .insert({
        title: postData.title,
        content: postData.content,
        category: postData.category,
        post_type: randomPostType.type,
        tags: postData.tags || [],
        language: language
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save post to database');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: insertedPost,
        message: 'New educational post generated successfully!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-educational-post function:', error);
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