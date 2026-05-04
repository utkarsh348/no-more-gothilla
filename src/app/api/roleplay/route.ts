export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const endpoint = process.env.ROLEPLAY_LLM_ENDPOINT;
  const apiKey = process.env.ROLEPLAY_LLM_API_KEY;

  if (!endpoint || !apiKey) {
    return Response.json(
      {
        configured: false,
        message:
          "Optional LLM mode is not configured. Scripted Conversation Dojo is fully available offline.",
      },
      { status: 200 },
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      task: "Evaluate a Kannada learner roleplay reply. Be brief and supportive.",
      input: body,
    }),
  });

  if (!response.ok) {
    return Response.json(
      {
        configured: true,
        message: "LLM endpoint did not return a usable evaluation. Use scripted feedback.",
      },
      { status: 200 },
    );
  }

  const data = await response.json().catch(() => null);
  return Response.json({
    configured: true,
    message: data?.message ?? data?.output_text ?? "LLM feedback received.",
    raw: data,
  });
}
