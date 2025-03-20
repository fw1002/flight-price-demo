import { Hono } from 'hono';
import { env } from 'hono/adapter';

const app = new Hono();

app.get('/api/search', async (c) => {
  const { API_KEY, API_SECRET } = env(c);
  const { origin, destination, departureDate, returnDate, nonStop } = c.req.query();

  try {
    // Step 1: Get Access Token
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Call Flight Offers API
    let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=20&currencyCode=EUR`;
    if (returnDate) url += `&returnDate=${returnDate}`;
    if (nonStop === 'true') url += `&nonStop=true`;

    const flightRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const flightData = await flightRes.json();

    // Step 3: Get exchange rate EUR to TWD
    const rateRes = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=TWD');
    const rateData = await rateRes.json();

    return c.json({
      flights: flightData,
      exchangeRate: rateData.rates.TWD
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
