export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');
  const { amount, phone } = req.body;

  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  try {
    // 1. Get access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    const { access_token } = await tokenRes.json();

    // 2. STK Push request
    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: "https://example.com/callback", // Replace or remove in sandbox
        AccountReference: "Brits-Academy",
        TransactionDesc: "Payment for course"
      })
    });

    const stkData = await stkRes.json();
    res.status(200).json(stkData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "MPESA request failed", details: err.message });
  }
}
