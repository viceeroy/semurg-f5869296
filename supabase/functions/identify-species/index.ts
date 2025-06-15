
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
    const { imageUrl, language = 'uzbek' } = await req.json();

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
            content: `Siz yovvoyi tabiat mutaxassisisiz. MUHIM: Faqat HAQIQIY yovvoyi tabiat turlarini (qushlar, sutemizuvchilar, sudralib yuruvchilar, amfibiyalar, baliqlar, hasharotlar, o'simliklar, qo'ziqorinlar, dengiz hayoti) aniqlang. Agar rasmda boshqa narsa ko'rsatilgan bo'lsa (odamlar, narsalar, binolar, ovqat, transport vositalari va h.k.), siz ALBATTA "not_wildlife" kategoriyasi bilan javob berishingiz KERAK.

MUHIM: BARCHA ma'lumotlarni O'ZBEK tilida taqdim eting. Barcha matn maydonlari o'zbek tilida bo'lishi kerak, faqat scientific_name latin tilida qoladi.

Rasmni tahlil qiling va turlar haqida keng qamrovli, batafsil ma'lumotlarni JSON formatida taqdim eting:
{
  "species_name": "Turning umumiy nomi",
  "scientific_name": "Ilmiy nomi", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "Bu turga keng qamrovli kirish - ularning ekotizimda ahamiyati, umumiy xususiyatlari, ularni noyob qiladigan narsa, tabiatdagi roli va nima uchun muhimligi haqida yozing. Kamida 50-60 so'z bilan o'quvchini jalb qiladigan, ta'limiy mazmun yozing",
  "habitat": "Odatiy muhit va geografik hududning batafsil tavsifi - aniq joylar, iqlim afzalliklari, balandlik oralig'i, yashash joyi talablari, mavsumiy ko'chishlar va ular o'z muhitiga qanday moslashishlari haqida. Ular yashaydigan ekotizim va u bilan aloqalarini tasvirlab bering. Kamida 45-55 so'z yozing",
  "diet": "Turlar nima yeishi, oziqlanish xatti-harakatlari, ov qilish yoki oziq-ovqat qidirish usullari, mavsumiy oziq-ovqat o'zgarishlari, oziqlanish jadvali va oziq-ovqat zanjirida ularning roli haqida keng qamrovli tavsif. Aniq oziq-ovqat manbalari, oziqlanish shakllari va ularning oziq-ovqatining ekotizimga ta'sirini kiriting. Kamida 45-55 so'z yozing", 
  "behavior": "Diqqatga sazovor xatti-harakatlar, ijtimoiy tuzilmalar, juftlashish marosimlari, hududiy odatlar, kundalik faoliyat, aloqa usullari, migratsiya shakllari, ota-ona g'amxo'rligi va bu turni belgilaydigan noyob xususiyatlarning batafsil hisoboti. Mavsumiy xatti-harakatlar va boshqa turlar bilan o'zaro ta'sirni kiriting. Kamida 45-55 so'z yozing",
  "conservation_status": "Aholi tendensiyalari, ular duch keladigan aniq tahdidlar, davom etayotgan tabiatni muhofaza qilish sa'y-harakatlari, tarixiy aholi o'zgarishlari va ularning omon qolishiga ta'sir qiluvchi omillar haqida batafsil kontekst bilan joriy muhofaza holati. Inson ta'sirini va muhofaza muvaffaqiyat hikoyalarini mavjud bo'lsa kiriting. Kamida 35-45 so'z yozing",
  "interesting_facts": "Turlarning noyob qobiliyatlari, rekord xususiyatlari, tarixiy ahamiyati, ajoyib moslashuvlari yoki hayratlanarli xatti-harakatlarini ko'rsatadigan 3-4 ta qiziqarli, aniq faktlar. Bularni qiziqarli, ta'limiy va esda qolarli qiling. Aniq raqamlar, taqqoslashlar yoki g'ayrioddiy xususiyatlarni kiriting. Kamida 50-60 so'z yozing",
  "identification_notes": "Bu turni aniqlashga yordam bergan batafsil asosiy xususiyatlar - jismoniy xususiyatlar, ajralib turadigan belgilar, o'lcham taqqoslashlari, rang naqshlari, tana shakli va o'xshash turlardan farqlovchi xususiyatlar. Ko'rinadigan yosh, jins yoki mavsumiy o'zgarishlarni eslatib o'ting. Kamida 35-45 so'z yozing"
}

MUHIM QOIDALAR:
1. Agar siz odam, narsa, bino, oziq-ovqat, transport vositasi yoki yovvoyi tabiat turi bo'lmagan boshqa narsalarni ko'rsangiz, kategoriyani "not_wildlife" qilib belgilang
2. Faqat tabiiy shaklda aniq tirik organizmni ko'ra olsangiz, yovvoyi tabiat kategoriyalaridan foydalaning
3. Juda ehtiyotkor bo'ling - shubha bo'lsa, "not_wildlife"dan foydalaning
4. Logotip, chizma yoki sun'iy tasvirlarda yovvoyi tabiatni aniqlashga urinmang

Har doim yaroqli JSON qaytaring. JSON ob'ektidan oldin yoki keyin hech qanday matn kiritmang.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Iltimos, bu yovvoyi tabiat turini aniqlang va batafsil ma\'lumot bering.'
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
          error: "Yovvoyi tabiat turlarini aniqlash va kashf qilishda yordam berish uchun hayvon, qush yoki o'simlik rasmini yuklang."
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
            content: `Siz yovvoyi tabiat mutaxassisisiz. MUHIM: Faqat HAQIQIY yovvoyi tabiat turlarini aniqlang. Agar rasmda boshqa narsa ko'rsatilgan bo'lsa (odamlar, narsalar, binolar, ovqat, transport vositalari va h.k.), siz ALBATTA "not_wildlife" kategoriyasi bilan javob berishingiz KERAK. Faqat turlar ma'lumotlari bilan yaroqli JSON ob'ektini qaytaring. Boshqa matn yo'q.`
            },
            {
              role: 'user',
              content: `Iltimos, bu yovvoyi tabiat turini aniqlang va faqat shu aniq tuzilish bilan yaroqli JSON qaytaring:
{
  "species_name": "Umumiy nomi",
  "scientific_name": "Ilmiy nomi", 
  "category": "bird/mammal/reptile/amphibian/fish/insect/plant/fungi/marine_life/not_wildlife",
  "confidence": "high/medium/low",
  "description": "Bu turga keng qamrovli kirish - ekotizimda ahamiyati, umumiy xususiyatlari, noyob jihatlari, tabiatdagi roli va ahamiyati. Kamida 50-60 so'z bilan ta'limiy mazmun yozing",
  "habitat": "Odatiy muhit va geografik hududning batafsil tavsifi - aniq joylar, iqlim afzalliklari, balandlik oralig'i, yashash joyi talablari va muhitga moslashishi. Kamida 45-55 so'z",
  "diet": "Turlar nima yeishi, oziqlanish xatti-harakatlari, ov usullari, mavsumiy oziq-ovqat o'zgarishlari va oziq-ovqat zanjirida roli. Kamida 45-55 so'z", 
  "behavior": "Diqqatga sazovor xatti-harakatlar, ijtimoiy tuzilmalar, juftlashish marosimlari, hududiy odatlar, kundalik faoliyat va noyob xususiyatlarning batafsil hisoboti. Kamida 45-55 so'z",
  "conservation_status": "Aholi tendensiyalari, tahdidlar, muhofaza sa'y-harakatlari va omon qolishga ta'sir qiluvchi omillar haqida batafsil kontekst bilan joriy muhofaza holati. Kamida 35-45 so'z",
  "interesting_facts": "Turlarning noyob qobiliyatlari, moslashuvlari yoki hayratlanarli xatti-harakatlarini ko'rsatadigan 3-4 ta qiziqarli, aniq faktlar. Kamida 50-60 so'z",
  "identification_notes": "Bu turni aniqlashga yordam bergan batafsil asosiy xususiyatlar - jismoniy xususiyatlar, ajralib turadigan belgilar va farqlovchi xususiyatlar. Kamida 35-45 so'z"
}

MUHIM: Agar bu haqiqiy yovvoyi tabiat turi bo'lmasa, kategoriyani "not_wildlife" qilib belgilang

Rasm: ${imageUrl}`
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
              error: "Yovvoyi tabiat turlarini aniqlash va kashf qilishda yordam berish uchun hayvon, qush yoki o'simlik rasmini yuklang."
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
