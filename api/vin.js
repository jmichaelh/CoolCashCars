addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const vin = url.searchParams.get('vin');
  const apiUrl = `https://carapi.app/api/v1/vin/decode?vin=${vin}`;
  try {
    const response = await fetch(apiUrl);
    return new Response(response.body, {
      status: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'VIN decode failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
