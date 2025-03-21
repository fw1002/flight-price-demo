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

  // Step 2: Parse query parameter (city keyword)
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword');

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'Missing city keyword' }), { status: 400 });
  }

  // Step 3: Call Amadeus Location API
  const locationResponse = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?keyword=${keyword}&subType=CITY,AIRPORT`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const locationData = await locationResponse.json();

  // Step 4: Return matching locations
  return new Response(JSON.stringify(locationData), {
    headers: { 'Content-Type': 'application/json' }
  });
}
