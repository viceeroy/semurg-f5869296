
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
        model: 'gpt-4o', // Use more powerful model for better detailed responses
        messages: [
          {
            role: 'system',
            content: `You are a world-class wildlife biologist and taxonomist with extensive knowledge of global biodiversity. CRITICAL: Only identify REAL wildlife species (birds, mammals, reptiles, amphibians, fish, insects, plants, fungi, marine life). If the image shows anything else (people, objects, buildings, food, vehicles, etc.), you MUST respond with a category of "not_wildlife".

${language === 'uzbek' || language === 'uz' ? 
  'Barcha ma\'lumotlarni O\'zbek tilida bering. Har bir bo\'lim uchun kam katta 80-120 so\'z yozing.' : 
  'Provide all information in English. Write at least 80-120 words for each section to ensure comprehensive coverage.'}

Analyze the image with scientific precision and provide extremely detailed, comprehensive information about the species in JSON format. Each section should be thorough and educational:

{
  "species_name": "${language === 'uzbek' || language === 'uz' ? 'Turning umumiy nomi' : 'Common name of the species'}",
  "scientific_name": "${language === 'uzbek' || language === 'uz' ? 'To\'liq ilmiy nomi (genus va species)' : 'Complete scientific name (genus and species)'}", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "${language === 'uzbek' || language === 'uz' ? 
    'Bu turning batafsil, ilmiy tavsifi - ularning evolyutsiya tarixi, ekotizimda muhim roli, noyob biologik xususiyatlari, boshqa turlar bilan munosabatlari, tabiatdagi ahamiyati va nima uchun muhimligini batafsil tushuntiring. Turning ajoyib xususiyatlari va moslashuvlarini kiriting. Kamida 80-120 so\'z yozing.' : 
    'Comprehensive, scientific description of this species - include their evolutionary history, crucial role in the ecosystem, unique biological characteristics, relationships with other species, significance in nature, and why they are important. Include fascinating adaptations and remarkable features of the species. Write at least 80-120 words with engaging, detailed educational content.'}",
  "habitat": "${language === 'uzbek' || language === 'uz' ? 
    'Turning yashash muhitining batafsil tavsifi - aniq geografik tarqalishi, iqlim talablari, balandlik oralig\'i, tuproq turlari, o\'simliklar hamjamiyatlari, mavsumiy migratsiya, muhit o\'zgarishlariga moslashuvi va ular yashaydigan ekotizimning tuzilishi. Muhitni tanlash sabablari va boshqa turlar bilan yashash joylarini taqsimlashni kiriting. Kamida 80-100 so\'z yozing.' : 
    'Detailed description of habitat preferences and environmental requirements - include specific geographical distribution, climate requirements, elevation ranges, soil types, plant communities, seasonal movements, adaptation to environmental changes, and ecosystem structure they inhabit. Include habitat selection reasons and niche partitioning with other species. Provide at least 80-100 words with specific ecological details.'}",
  "diet": "${language === 'uzbek' || language === 'uz' ? 
    'Turning ovqatlanish xatti-harakatlari va dietasining keng tavsifi - aniq oziq-ovqat manbalari, ovqat qidirish usullari, ov texnikalari, hazm qilish tizimi, mavsumiy ovqatlanish o\'zgarishlari, ovqatlanish vaqti, oziq-ovqat zanjirida roli va boshqa turlar bilan raqobat. Metabolizm tezligi va energiya talablarini kiriting. Kamida 80-100 so\'z bering.' : 
    'Comprehensive description of feeding behaviors and dietary habits - include specific food sources, foraging strategies, hunting techniques, digestive adaptations, seasonal dietary variations, feeding schedules, role in food webs, and competition with other species. Include metabolic rates and energy requirements. Provide at least 80-100 words with detailed nutritional ecology information.'}",
  "behavior": "${language === 'uzbek' || language === 'uz' ? 
    'Turning murakkab xatti-harakatlari va ijtimoiy tuzilmalarining batafsil tahlili - juftlashish marosimlari, ota-ona g\'amxo\'rligi, hududiy xatti-harakatlar, aloqa usullari, to\'da dinamikasi, o\'rganish qobiliyatlari, kognitiv qobiliyatlar, stress reaktsiyalari va muhit o\'zgarishlariga moslashish. Noyob xatti-harakatlar va intellektual qobiliyatlarni kiriting. Kamida 80-100 so\'z bering.' : 
    'Detailed analysis of complex behaviors and social structures - include mating rituals, parental care, territorial behaviors, communication methods, group dynamics, learning capabilities, cognitive abilities, stress responses, and adaptation to environmental changes. Include unique behavioral patterns and intelligence displays. Provide at least 80-100 words with comprehensive behavioral ecology details.'}",
  "conservation_status": "${language === 'uzbek' || language === 'uz' ? 
    'Hozirgi muhofaza holati va populyatsiya dinamikasining batafsil tahlili - aniq populyatsiya soni, tarixiy o\'zgarishlar, asosiy tahdidlar (iqlim o\'zgarishi, habitat yo\'qolishi, ifloslanish), muhofaza sa\'y-harakatlari, muvaffaqiyatli tiklanish dasturlari, xalqaro himoya holati va kelajak prognozlari. Inson ta\'siri va himoya choralarini batafsil kiriting. Kamida 80-100 so\'z yozing.' : 
    'Detailed analysis of current conservation status and population dynamics - include specific population numbers, historical changes, major threats (climate change, habitat loss, pollution), conservation efforts, successful recovery programs, international protection status, and future projections. Include detailed human impact assessments and protection measures. Write at least 80-100 words with comprehensive conservation information.'}",
  "interesting_facts": "${language === 'uzbek' || language === 'uz' ? 
    '5-6 ta hayratlanarli, aniq va tekshirilgan faktlar - noyob fiziologik moslashuvlar, rekord qiyadigan xususiyatlar, ajoyib qobiliyatlar, madaniy ahamiyati, tarixiy voqealar, ilmiy kashfiyotlar va g\'ayrioddiy xatti-harakatlar. Aniq raqamlar, o\'lchovlar va taqqoslashlarni kiriting. Har bir fakt qiziq va ta\'limiy bo\'lishi kerak. Kamida 100-120 so\'z bering.' : 
    '5-6 fascinating, specific and verified facts - include unique physiological adaptations, record-breaking characteristics, amazing abilities, cultural significance, historical events, scientific discoveries, and extraordinary behaviors. Include specific numbers, measurements, and comparisons. Each fact should be captivating and educational. Provide at least 100-120 words with remarkable and scientifically accurate information.'}",
  "identification_notes": "${language === 'uzbek' || language === 'uz' ? 
    'Bu turni aniqlash uchun muhim diagnostik xususiyatlarning batafsil tavsifi - jismoniy o\'lchovlar, morfologik belgilar, rang naqshlari, tuzilish xususiyatlari, o\'xshash turlardan farqlar, jinsiy dimorfizm, yosh o\'zgarishlari, mavsumiy o\'zgarishlar va aniq identifikatsiya mezonlari. Dalada aniqlash uchun amaliy maslahatlar bering. Kamida 70-90 so\'z yozing.' : 
    'Detailed description of key diagnostic features for species identification - include physical measurements, morphological characteristics, coloration patterns, structural features, differences from similar species, sexual dimorphism, age variations, seasonal changes, and specific identification criteria. Provide practical field identification tips. Write at least 70-90 words with precise taxonomic identification details.'}"
}

IMPORTANT RULES:
1. If you see a person, object, building, food item, vehicle, or anything that is NOT a living wildlife species, set category to "not_wildlife"
2. Only use wildlife categories if you can clearly see an actual living organism in its natural form
3. Be very conservative - when in doubt, use "not_wildlife"
4. Do not try to identify wildlife in logos, drawings, or artificial representations
5. PROVIDE EXTREMELY DETAILED INFORMATION - each section should be comprehensive and educational
6. Use scientific precision and accuracy in all descriptions
7. Include specific measurements, numbers, and scientific data wherever possible

Always return valid JSON. Do not include any text before or after the JSON object.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: language === 'uzbek' || language === 'uz' ? 
                  'Iltimos, bu yovvoyi tabiat turini aniqlang va har bir bo\'lim uchun batafsil, keng qamrovli ma\'lumot bering. Ilmiy aniqlik va to\'liq ma\'lumot bering.' :
                  'Please identify this wildlife species and provide detailed, comprehensive information for each section. Provide scientific accuracy and complete information.'
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
        max_tokens: 2000, // Increased for more comprehensive responses
        temperature: 0.2 // Slightly increased for more detailed, varied responses
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
            model: 'gpt-4o', // Use more powerful model for retry too
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
          max_tokens: 1800, // Increased for retry
          temperature: 0.2
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
