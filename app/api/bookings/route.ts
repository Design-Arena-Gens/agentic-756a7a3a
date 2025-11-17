export const runtime = 'nodejs';

type Booking = {
  id: string;
  name: string;
  partySize: number;
  isoDateTime: string;
  phone: string;
};

// WARNING: In-memory. Ephemeral and per-instance.
const memory: { bookings: Booking[] } = { bookings: [] };

export async function GET() {
  return new Response(JSON.stringify({ bookings: memory.bookings }), {
    headers: { 'content-type': 'application/json' }
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  const b: Booking = body;
  memory.bookings.push(b);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' }
  });
}
