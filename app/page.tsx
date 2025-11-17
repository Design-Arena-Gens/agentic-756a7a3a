export default function HomePage() {
  return (
    <div className="card">
      <h2>Phone-call AI that books tables</h2>
      <p>
        Connect your Twilio number to <span className="code">/api/voice</span>. The assistant will answer calls,
        collect details, and confirm a reservation.
      </p>
      <div className="section">
        <h3>How to test</h3>
        <ol>
          <li>Deploy this app (already configured for Vercel).</li>
          <li>In Twilio Console, set your Voice Webhook to <span className="code">https://YOUR_DOMAIN/api/voice</span>.</li>
          <li>Call your Twilio number to experience the AI receptionist.</li>
        </ol>
      </div>
      <div className="section">
        <a className="btn" href="/setup">View setup instructions</a>
      </div>
    </div>
  );
}
