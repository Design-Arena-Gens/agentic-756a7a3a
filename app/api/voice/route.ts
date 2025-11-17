export const runtime = 'nodejs';

function twiml(xmlInner: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${xmlInner}</Response>`;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const base = `${url.origin}/api/voice`;

  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);
  const from = params.get('From') || '';

  const action = `${base}/name`;
  const xml = twiml(`
    <Say voice="Polly.Joanna">Welcome to Acme Restaurant. I'm your AI receptionist.</Say>
    <Gather input="speech" action="${action}" method="POST" timeout="5" speechTimeout="auto" language="en-US">
      <Say voice="Polly.Joanna">What's your name?</Say>
    </Gather>
    <Say voice="Polly.Joanna">Sorry, I didn't catch that.</Say>
    <Redirect method="POST">${base}</Redirect>
  `);

  return new Response(xml, { headers: { 'content-type': 'text/xml' } });
}

export async function GET(req: Request) {
  // Twilio may call GET for validation; respond with the same as POST
  return POST(req);
}
