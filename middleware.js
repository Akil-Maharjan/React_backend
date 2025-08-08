// middleware.js
export function middleware(request) {
  const url = request.nextUrl.pathname;
  if (url.includes('git.new')) {
    return new Response(
      JSON.stringify({ error: 'Invalid path detected' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  return;
}
