export async function onRequest({ request, env }) {
  const { API_KEY, API_SECRET } = env;

  // Step 1: Get access token
  const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Failed to get access token', details: tokenData }), { status: 500 });
  }

  // Step 2: Parse query parameters
  const url = new URL(request.url);
  const origin = url.searchParams.get('origin');
  const destination = url.searchParams.get('destination');
  const departureDate = url.searchParams.get('departureDate');
  const returnDate = url.searchParams.get('returnDate');
  const nonStop = url.searchParams.get('nonStop');

  if (!origin || !destination || !departureDate) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
  }

  // Step 3: Construct API URL
  let apiUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=20&currencyCode=EUR`;
  if (returnDate) apiUrl += `&returnDate=${returnDate}`;
  if (nonStop === 'true') apiUrl += `&nonStop=true`;

  // Step 4: Fetch flight offers
  const searchResponse = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const searchData = await searchResponse.json();

  // Step 5: Fetch exchange rate
  let exchangeRate = 1;
  try {
    const rateResponse = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=TWD');
    const rateData = await rateResponse.json();
    exchangeRate = rateData.rates.TWD || 1;
  } catch (err) {
    console.error('Failed to fetch exchange rate', err);
  }

  // Step 6: Return combined data
  return new Response(JSON.stringify({
    flights: searchData,
    exchangeRate
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
