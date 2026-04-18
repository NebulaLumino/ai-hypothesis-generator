import { NextRequest, NextResponse } from 'next/server';
let _clientPromise: Promise<any> | null = null;
async function getClient() {
  if (!_clientPromise) { _clientPromise = (async () => { const { default: OpenAI } = await import('openai'); return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: 'https://api.deepseek.com/v1' }); })(); }
  return _clientPromise;
}
export async function POST(req: NextRequest) {
  try {
    const { research_field, literature_summary, anomalies } = await req.json();
    const client = await getClient();
    const completion = await client.chat.completions.create({ model: 'deepseek-chat', messages: [{ role: 'user', content: `You are an expert research scientist with deep expertise across multiple disciplines. Generate novel, testable research hypotheses based on the following context.

Research Field: ${research_field}
Current Literature Summary: ${literature_summary}
Anomalies / Unexplained Observations: ${anomalies}

Provide 3-5 innovative hypotheses that:
1. Address the unexplained anomalies while fitting existing evidence
2. Are specific and falsifiable (can be proven wrong)
3. Suggest measurable predictions and experimental approaches
4. Identify key control experiments needed
5. Discuss potential confounding variables
6. Estimate feasibility (difficulty, cost, timeline in broad terms)
7. Suggest how each hypothesis, if true, would advance the field

Frame hypotheses as formal if-then statements. Be bold but scientifically grounded.` }] });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}