export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET,
    MPESA_SHORTCODE,
    MPESA_PASSKEY,
    MPESA_CALLBACK_URL
  } = process.env;

  const { phone, amount } = req.body;

  // Step 1: Get access token
  const auth = Buffer.from(`${jVGlb9e1fYlLASHam93bc8GxOJNdDjgkzkVT1UmYDfoW2EAY}:${7eBx4Sf7DzweraTRURMGmWRhxToYwDBIIxwP6ReGIjANvETAXzqEigXIR4EJrHfq}`).toString('base64');

  const tokenRes = await fetch(`https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  const { access_token } = await tokenRes.json();

  // Step 2: Generate timestamp and password
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  // Step 3: Send STK Push request
  const stkRes = await fetch(`https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: "Brits-Academy",
      TransactionDesc: "Course Payment"
    })
  });

  const stkData = await stkRes.json();

  return res.status(200).json(stkData);
}
