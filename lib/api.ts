export async function sendChatMessage({
    messages,
    model,
    systemPrompt,
    temperature,
    maxTokens,
  }: {
    messages: { role: 'user' | 'assistant'; content: string }[];
    model: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        systemPrompt,
        temperature,
        maxTokens,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  
    return response.body;
  }