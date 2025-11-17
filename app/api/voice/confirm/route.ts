import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

function twiml(xmlInner: string) {
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response>${xmlInner}</Response>`;
}

async function saveBooking(baseUrl: string, booking: {
  id: string;
  name: string;
  partySize: number;
  isoDateTime: string;
  phone: string;
}) {
  // Best-effort: store in ephemeral in-memory endpoint
  try {
    await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(booking)
    });
  } catch {
    // ignore
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const base = `${origin}/api/voice`;
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const spoken = (params.get('SpeechResult') || '').toLowerCase();
  const from = params.get('From') || '';
  const name = decodeURIComponent(url.searchParams.get('name') || 'Guest');
  const party = parseInt(url.searchParams.get('party') || '2', 10);
  const iso = decodeURIComponent(url.searchParams.get('iso') || new Date().toISOString());

  if (spoken.includes('change') || spoken.includes('no')) {
    const restart = twiml(`
      <Say voice=\"Polly.Joanna\">No problem. Let's start over.</Say>
      <Redirect method=\"POST\">${base}</Redirect>
    `);
    return new Response(restart, { headers: { 'content-type': 'text/xml' } });
  }

  const booking = { id: randomUUID(), name, partySize: party, isoDateTime: iso, phone: from };
  await saveBooking(origin, booking);

  const xml = twiml(`
    <Say voice=\"Polly.Joanna\">You're all set, ${name}. Party of ${party} on ${new Date(iso).toLocaleString()}.</Say>
    <Say voice=\"Polly.Joanna\">We look forward to seeing you. Goodbye!</Say>
    <Hangup />
  `);
  return new Response(xml, { headers: { 'content-type': 'text/xml' } });
}

export async function GET(req: Request) {
  return POST(req);
}
