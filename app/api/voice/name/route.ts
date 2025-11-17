export const runtime = 'nodejs';

function twiml(xmlInner: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${xmlInner}</Response>`;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const base = `${url.origin}/api/voice`;
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const speech = (params.get('SpeechResult') || '').trim();
  const name = encodeURIComponent(speech || 'Guest');

  const action = `${base}/party?name=${name}`;
  const xml = twiml(`
    <Gather input="speech" action="${action}" method="POST" timeout="5" speechTimeout="auto" language="en-US">
      <Say voice="Polly.Joanna">Hi ${speech || 'there'}. How many people are in your party?</Say>
    </Gather>
    <Say voice="Polly.Joanna">Sorry, I didn't get that.</Say>
    <Redirect method="POST">${base}</Redirect>
  `);
  return new Response(xml, { headers: { 'content-type': 'text/xml' } });
}

export async function GET(req: Request) {
  return POST(req);
}
