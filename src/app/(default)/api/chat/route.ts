export async function POST(request: Request) {
  const { wallet, message } = await request.json();

  const response = await fetch('https://chat-api.awakeborn.com/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet, message }),
  });

  const data = await response.json();

  return Response.json(data);
}
