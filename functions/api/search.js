export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams;
  const origin = params.get('origin');
  const destination = params.get('destination');
  const departureDate = params.get('departureDate');

  // Step 1: Get Access Token
  const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&client_id=${env.API_KEY}&client_secret=${env.API_SECRET}`
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  // Step 2: Query Flight Offers
  const flightRes = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=20`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const flightData = await flightRes.json();

  return new Response(JSON.stringify(flightData), {
    headers: { 'Content-Type': 'application/json' }
  });
}
const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: `grant_type=client_credentials&client_id=${env.API_KEY}&client_secret=${env.API_SECRET}`
});
const tokenData = await tokenRes.json();

// Log 出 token 回傳
console.log("Token Response:", tokenData);

const token = tokenData.access_token;
