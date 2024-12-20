import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.sender || !body.content) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.log(new URL('dnd-game', process.env.NEXT_PUBLIC_API_GATEWAY_URL))

    // Forward the request to the Lambda function
    const lambdaResponse = await fetch(new URL('default/dnd-game', process.env.NEXT_PUBLIC_API_GATEWAY_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text();
      return NextResponse.json(
        { error: `Lambda responded with ${lambdaResponse.status}: ${errorText}` },
        { status: lambdaResponse.status }
      );
    }

    const data = await lambdaResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
