
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
        model: 'gpt-4o-mini', // Faster, cheaper model
        messages: [
          {
            role: 'system',
            content: `You are a wildlife expert. CRITICAL: Only identify REAL wildlife species (birds, mammals, reptiles, amphibians, fish, insects, plants, fungi, marine life). If the image shows anything else (people, objects, buildings, food, vehicles, etc.), you MUST respond with a category of "not_wildlife".

${language === 'uzbek' || language === 'uz' ? 
  'Barcha ma\'lumotlarni O\'zbek tilida bering.' : 
  'Provide all information in English.'}

Analyze the image and provide comprehensive, detailed information about the species in JSON format:
{
  "species_name": "${language === 'uzbek' || language === 'uz' ? 'Turning umumiy nomi' : 'Common name of the species'}",
  "scientific_name": "${language === 'uzbek' || language === 'uz' ? 'Ilmiy nomi' : 'Scientific name'}", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "${language === 'uzbek' || language === 'uz' ? 
    'Bu turga keng qamrovli kirish - ularning ekotizimda ahamiyati, umumiy xususiyatlari, ularni noyob qiladigan narsalar, tabiatdagi roli va nima uchun muhimligini kiriting. O\'quvchini qiziqtiruvchi va ta\'limiy mazmun bilan kamida 50-60 so\'z yozing' : 
    'Comprehensive introduction to this species - include their significance in the ecosystem, general characteristics, what makes them unique, their role in nature, and why they are important. Write at least 50-60 words with engaging, educational content that captivates the reader'}",
  "habitat": "${language === 'uzbek' || language === 'uz' ? 
    'Odatdagi muhit va geografik diapazoning batafsil tavsifi - aniq joylar, iqlim afzalliklari, balandlik oralig\'i, yashash joy talablari, mavsumiy harakatlar va ular o\'z muhitiga qanday moslashishi. Ular yashaydigan ekotizim va u bilan aloqasini tasvirlab bering. Kamida 45-55 so\'z yozing' : 
    'Detailed description of typical environment and geographical range - include specific locations, climate preferences, elevation ranges, habitat requirements, seasonal movements, and how they adapt to their environment. Describe the ecosystem they live in and their relationship with it. Provide at least 45-55 words'}",
  "diet": "${language === 'uzbek' || language === 'uz' ? 
    'Tur nima iste\'mol qilishi, ovqatlanish xatti-harakatlari, ov yoki qidiruv usullari, mavsumiy ovqatlanish o\'zgarishlari, ovqatlanish jadvali va oziq-ovqat zanjirida ularning rolining keng tavsifi. Aniq oziq-ovqat manbalari, ovqatlanish usullari va ularning dietasi ekotizimga qanday ta\'sir qilishini kiriting. Kamida 45-55 so\'z yozing' : 
    'Comprehensive description of what the species eats, feeding behaviors, hunting or foraging techniques, seasonal dietary changes, feeding schedule, and their role in the food chain. Include specific food sources, feeding patterns, and how their diet affects the ecosystem. Write at least 45-55 words'}",
  "behavior": "${language === 'uzbek' || language === 'uz' ? 
    'Diqqatga sazovor xatti-harakatlar, ijtimoiy tuzilmalar, juftlashish marosimlari, hududiy odatlar, kundalik faoliyat, aloqa usullari, migratsiya namunalari, ota-ona g\'amxo\'rligi va bu turni belgilaydigan noyob xususiyatlarning batafsil hisobi. Mavsumiy xatti-harakatlar va boshqa turlar bilan o\'zaro ta\'sirni kiriting. Kamida 45-55 so\'z bering' : 
    'Detailed account of notable behaviors, social structures, mating rituals, territorial habits, daily activities, communication methods, migration patterns, parental care, and unique characteristics that define this species. Include seasonal behaviors and interactions with other species. Provide at least 45-55 words'}",
  "conservation_status": "${language === 'uzbek' || language === 'uz' ? 
    'Populyatsiya tendentsiyalari, ular duch keladigan aniq tahdidlar, davom etayotgan tabiatni muhofaza qilish sa\'y-harakatlari, populyatsiya tarixiy o\'zgarishlari va ularning omon qolishiga ta\'sir qiluvchi omillar haqida batafsil kontekst bilan hozirgi muhofaza holati. Inson ta\'siri va tabiatni muhofaza qilishning muvaffaqiyat hikoyalarini kiriting. Kamida 35-45 so\'z yozing' : 
    'Current conservation status with detailed context about population trends, specific threats they face, ongoing conservation efforts, historical population changes, and what factors affect their survival. Include human impact and conservation success stories if applicable. Write at least 35-45 words'}",
  "interesting_facts": "${language === 'uzbek' || language === 'uz' ? 
    'Turning noyob qobiliyatlari, rekord qiyadigan xususiyatlari, tarixiy ahamiyati, ajoyib moslashuvlari yoki hayratlanarli xatti-harakatlarini ta\'kidlaydigan 3-4 ta ajoyib, aniq fakt. Bularni qiziqarli, ta\'limiy va esda qolarli qiling. Aniq raqamlar, taqqoslashlar yoki g\'ayrioddiy xususiyatlarni kiriting. Kamida 50-60 so\'z bering' : 
    '3-4 fascinating, specific facts about the species that highlight their unique abilities, record-breaking characteristics, historical significance, remarkable adaptations, or surprising behaviors. Make these engaging, educational, and memorable. Include specific numbers, comparisons, or unusual traits. Provide at least 50-60 words'}",
  "identification_notes": "${language === 'uzbek' || language === 'uz' ? 
    'Bu turni aniqlashga yordam bergan batafsil asosiy xususiyatlar - jismoniy xususiyatlar, o\'ziga xos belgilar, o\'lcham taqqoslashlari, rang naqshlari, tana shakli va o\'xshash turlardan ajralib turadigan xususiyatlar. Agar ko\'rinadigan bo\'lsa, yosh, jins yoki mavsumiy o\'zgarishlarni eslatib o\'ting. Kamida 35-45 so\'z yozing' : 
    'Detailed key features that helped identify this species - include physical characteristics, distinctive markings, size comparisons, coloration patterns, body shape, and distinguishing features from similar species. Mention age, gender, or seasonal variations if visible. Write at least 35-45 words'}"
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
                text: language === 'uzbek' || language === 'uz' ? 
                  'Iltimos, bu yovvoyi tabiat turini aniqlang va batafsil ma\'lumot bering.' :
                  'Please identify this wildlife species and provide detailed information.'
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
        max_tokens: 1200, // Reduced from 1500
        temperature: 0.1 // Reduced for faster, more consistent responses
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
            model: 'gpt-4o-mini', // Use faster model for retry too
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
          max_tokens: 1000, // Reduced for retry
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
