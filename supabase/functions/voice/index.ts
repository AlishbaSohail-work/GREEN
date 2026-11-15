// Natural Urdu/English voice for GREEN. Keeps your Azure key secret on the server.
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const { text, lang } = await req.json()
  if (!text || text.length > 700) return new Response('bad request', { status: 400, headers: cors })
  const v = lang === 'ur' ? ['ur-PK', 'ur-PK-UzmaNeural'] : ['en-IN', 'en-IN-NeerjaNeural']
  const safe = String(text).replace(/[<>&]/g, '').replace(/[۔.!?]/g, (m) => m + '<break time="350ms"/>')
  const ssml = `<speak version="1.0" xml:lang="${v[0]}"><voice name="${v[1]}"><prosody rate="-6%">${safe}</prosody></voice></speak>`
  const r = await fetch(`https://${Deno.env.get('AZURE_REGION')}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': Deno.env.get('AZURE_SPEECH_KEY')!, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'green-app' },
    body: ssml,
  })
  if (!r.ok) return new Response('tts failed', { status: 502, headers: cors })
  return new Response(r.body, { headers: { ...cors, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' } })
})
