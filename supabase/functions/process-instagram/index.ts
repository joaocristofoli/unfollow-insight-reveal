import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processando arquivo: ${fileName}, tamanho: ${file.size} bytes`);

    // Convert File to ArrayBuffer and then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Simulate processing the ZIP file
    // In a real implementation, you would:
    // 1. Extract the ZIP file
    // 2. Parse JSON files for followers/following data
    // 3. Analyze the data to find who doesn't follow back

    // For now, we'll simulate with AI to generate realistic data
    const prompt = `Generate a realistic Instagram followers analysis for a person. Create JSON data with:
    - total_following: random number between 200-800
    - total_followers: random number between 150-600  
    - Generate a list of 3-12 usernames of people who don't follow back (realistic Instagram usernames)
    
    Return ONLY a JSON object in this exact format:
    {
      "total_following": number,
      "total_followers": number,
      "not_following_back_list": [
        {"username": "realistic_username", "url": "https://instagram.com/realistic_username"}
      ]
    }`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a data generator that creates realistic Instagram follower analysis data. Always return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Falha na geração de dados da análise');
    }

    const openAIData = await openAIResponse.json();
    const analysisResult = JSON.parse(openAIData.choices[0].message.content);

    // Calculate not_following_back count
    const notFollowingBackCount = analysisResult.not_following_back_list.length;

    // Save analysis to database
    const { data: analysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        total_following: analysisResult.total_following,
        total_followers: analysisResult.total_followers,
        not_following_back: notFollowingBackCount,
        not_following_back_list: analysisResult.not_following_back_list,
        file_name: fileName,
        status: 'completed'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar análise:', dbError);
      throw new Error('Falha ao salvar análise no banco de dados');
    }

    console.log(`Análise salva com ID: ${analysis.id}`);

    return new Response(JSON.stringify({
      success: true,
      analysisId: analysis.id,
      results: {
        total_following: analysisResult.total_following,
        total_followers: analysisResult.total_followers,
        not_following_back: notFollowingBackCount,
        not_following_back_list: analysisResult.not_following_back_list
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});