export default function SetupPage() {
  const domainHint = typeof window !== 'undefined' ? window.location.origin : 'https://YOUR_DOMAIN';
  return (
    <div className="card">
      <h2>Setup</h2>
      <ol>
        <li>Buy a Twilio phone number with Voice.</li>
        <li>Set Voice webhook (A Call Comes In) to <span className="code">{domainHint}/api/voice</span>.</li>
        <li>Call your number. Speak your name, party size, and desired date/time.</li>
      </ol>
      <p>
        This starter confirms bookings by voice. To persist reservations, connect a database
        or webhook in <span className="code">/app/api/voice/confirm/route.ts</span>.
      </p>
    </div>
  );
}
