addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // Proxy CarAPI.app requests
  if (url.pathname.startsWith('/api/vehicles')) {
    const apiUrl = `https://carapi.app${url.pathname.replace('/api', '/api/v1')}${url.search}`;
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' },
    });
    return new Response(response.body, {
      status: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Serve static assets from Workers Sites
  return await fetch(request);
}
