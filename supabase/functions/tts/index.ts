import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
Deno.serve(async (req)=>{
  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const { word } = await req.json();
    if (!word) {
      return new Response(JSON.stringify({
        error: "No word provided"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    /*
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    const resp = await fetch("https://api.elevenlabs.io/v1/text-to-speech/JbBDjTmcKUtcTTwM38eA", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text: word,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    */

const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
console.log("ELEVENLABS KEY EXISTS:", !!apiKey);

if (!apiKey) {
  throw new Error("Missing ELEVENLABS_API_KEY in Supabase secrets");
}

const resp = await fetch(
  "https://api.elevenlabs.io/v1/text-to-speech/DODLEQrClDo8wCz460ld", //where to change voice
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text: word,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  }
);

  if (!resp.ok) {
    const errorText = await resp.text();
    console.error("ElevenLabs error:", resp.status, errorText);
    return new Response(errorText, {
      status: 500,
      headers: corsHeaders
   });
  }
    const audioBuffer = await resp.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
