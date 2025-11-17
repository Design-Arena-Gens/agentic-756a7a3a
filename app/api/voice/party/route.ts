import { parsePartySize } from '@/lib/parse';

export const runtime = 'nodejs';

function twiml(xmlInner: string) {
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response>${xmlInner}</Response>`;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const base = `${url.origin}/api/voice`;
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const speech = (params.get('SpeechResult') || '').trim();
  const name = url.searchParams.get('name') || 'Guest';

  const size = parsePartySize(speech);
  if (!size) {
    const retry = twiml(`
      <Gather input="speech" action="${base}/party?name=${encodeURIComponent(name)}" method="POST" timeout="5" speechTimeout="auto" language="en-US">
        <Say voice="Polly.Joanna">Please say a number for party size.</Say>
      </Gather>
      <Say voice="Polly.Joanna">Let's try again.</Say>
      <Redirect method="POST">${base}</Redirect>
    `);
    return new Response(retry, { headers: { 'content-type': 'text/xml' } });
  }

  const action = `${base}/datetime?name=${encodeURIComponent(name)}&party=${size}`;
  const xml = twiml(`
    <Gather input="speech" action="${action}" method="POST" timeout="6" speechTimeout="auto" language="en-US">
      <Say voice="Polly.Joanna">Great. What date and time would you like?</Say>
    </Gather>
    <Say voice="Polly.Joanna">Sorry, I didn't get that.</Say>
    <Redirect method="POST">${base}</Redirect>
  `);
  return new Response(xml, { headers: { 'content-type': 'text/xml' } });
}

export async function GET(req: Request) {
  return POST(req);
}
