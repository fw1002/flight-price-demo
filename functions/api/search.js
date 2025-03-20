import { Hono } from 'hono';
import { env } from 'hono/adapter';

const app = new Hono();

app.get('/api/search', async (c) => {
  const { API_KEY, API_SECRET } = env(c);
  const { origin, destination, departureDate, returnDate, nonStop } = c.req.query();

  try {
    // 1. 取得 Token
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. 呼叫航班API
    let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=20&currencyCode=EUR`;
    if (returnDate) url += `&returnDate=${returnDate}`;
    if (nonStop === 'true') url += `&nonStop=true`;

    const flightRes = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const flightData = await flightRes.json();

    // 3. 取得匯率
    const rateRes = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=TWD');
    const rateData = await rateRes.json();

    return c.json({
      flights: flightData,
      exchangeRate: rateData.rates.TWD
    });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
