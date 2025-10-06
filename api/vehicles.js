addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const apiUrl = `https://carapi.app/api/v1/vehicles/search?${url.search}`;
  try {
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' }
    });
    return new Response(response.body, {
      status: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'CarAPI fetch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
