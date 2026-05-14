const fetch = require('node-fetch'); // or just use native fetch in node 18+

async function test() {
  const systemPrompt = "You are a helpful assistant for Christian Retreat Centre.";
  const userMessage = "hi, how was your day?";

  const res = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'openai'
    })
  });
  
  const text = await res.text();
  console.log("RESPONSE:", text);
}

test();
