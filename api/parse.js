// Vercel Serverless Function — Upstage Document Parse Proxy
// 경로: /api/parse
// 클라이언트가 보낸 multipart/form-data를 그대로 Upstage API로 포워딩하여
// CORS 정책 우회를 처리합니다.

export const config = {
  api: {
    bodyParser: false, // multipart는 그대로 stream
  },
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: 'Missing Authorization header. Send "Bearer <UPSTAGE_API_KEY>".' });
  }

  try {
    // Pipe the raw request body to Upstage
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const upstageRes = await fetch('https://api.upstage.ai/v1/document-digitization', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': req.headers['content-type'] || 'multipart/form-data',
      },
      body,
    });

    const contentType = upstageRes.headers.get('content-type') || 'application/json';
    const text = await upstageRes.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.status(upstageRes.status).send(text);
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Proxy error', detail: String(err) });
  }
}
