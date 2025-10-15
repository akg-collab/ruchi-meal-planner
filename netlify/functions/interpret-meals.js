exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { input } = JSON.parse(event.body);

    const prompt = `You are a meal plan interpreter. Extract meal information from natural language commands.

The user is a nutritionist creating a 10-day meal plan. There are 9 meal times:

CONSTANTS (auto-fill all 10 days):
- Early Morning, Before Breakfast, Midday, Post-Lunch, Evening, Bedtime

ANCHORS (specific day only):
- Breakfast, Lunch, Dinner

Rules:
1. If the command includes "daily" or no day number, classify as CONSTANT (fills all 10 days)
2. If the command includes "day X" for Breakfast/Lunch/Dinner, classify as ANCHOR for that specific day
3. Handle slash (/) as "or" alternatives
4. Handle plus (+) as additions
5. Extract food descriptions after meal time names

Command: "${input}"

Respond with ONLY valid JSON (no markdown, no backticks):
[
  {
    "type": "constant" or "anchor",
    "mealTime": "Early Morning" or "Breakfast" etc,
    "day": 1 (only for anchors),
    "food": "extracted food description",
    "action": "replace" or "append"
  }
]`;

    let interpreted = null;
    let usedAPI = '';

    // TRY PERPLEXITY FIRST
    try {
      const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (perplexityResponse.ok) {
        const data = await perplexityResponse.json();
        let responseText = data.choices[0].message.content;
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        interpreted = JSON.parse(responseText);
        usedAPI = 'Perplexity';
      } else {
        throw new Error(`Perplexity failed: ${perplexityResponse.status}`);
      }
    } catch (perplexityError) {
      // FALLBACK TO CHATGPT
      try {
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI failed: ${openaiResponse.status}`);
        }

        const data = await openaiResponse.json();
        let responseText = data.choices[0].message.content;
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        interpreted = JSON.parse(responseText);
        usedAPI = 'ChatGPT (fallback)';
      } catch (openaiError) {
        throw new Error('Both Perplexity and ChatGPT APIs failed');
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        interpreted: interpreted,
        apiUsed: usedAPI
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Could not interpret command. Please try again.',
        details: error.message 
      })
    };
  }
};