import dayjs from 'dayjs';
import { parseDateTime } from '@/lib/parse';

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
  const party = url.searchParams.get('party') || '2';

  const dt = parseDateTime(speech);
  if (!dt) {
    const retry = twiml(`
      <Gather input="speech" action="${base}/datetime?name=${encodeURIComponent(name)}&party=${party}" method="POST" timeout="6" speechTimeout="auto" language="en-US">
        <Say voice="Polly.Joanna">Sorry, please say the date and time again.</Say>
      </Gather>
      <Say voice="Polly.Joanna">Let's try again.</Say>
      <Redirect method="POST">${base}</Redirect>
    `);
    return new Response(retry, { headers: { 'content-type': 'text/xml' } });
  }

  const iso = dt.toISOString();
  const friendly = dayjs(dt).format('dddd, MMMM D [at] h:mm A');
  const action = `${base}/confirm?name=${encodeURIComponent(name)}&party=${party}&iso=${encodeURIComponent(iso)}`;
  const xml = twiml(`
    <Gather input="speech" action="${action}" method="POST" timeout="5" speechTimeout="auto" language="en-US">
      <Say voice="Polly.Joanna">Confirming, ${name}, party of ${party} on ${friendly}. Say confirm to book or say change.</Say>
    </Gather>
    <Say voice="Polly.Joanna">Sorry, I didn't get that.</Say>
    <Redirect method="POST">${base}</Redirect>
  `);
  return new Response(xml, { headers: { 'content-type': 'text/xml' } });
}

export async function GET(req: Request) {
  return POST(req);
}
