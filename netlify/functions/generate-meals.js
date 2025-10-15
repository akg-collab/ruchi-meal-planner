exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { targetCalories, detoxInfo } = JSON.parse(event.body);

    const prompt = `You are a nutritionist AI creating a 10-day meal plan.

TARGET CALORIES: ${targetCalories} per day
DETOX DAYS: ${detoxInfo || 'None'}

Generate ONLY the anchor meals (Breakfast, Lunch, Dinner) for each day (30 meals total).

RULES:
1. For normal days: Generate varied, healthy meals
2. For detox days: Use the specified detox plan meals
3. Format each meal with name + portion size
4. Ensure meals are practical and nutritious

Respond with ONLY valid JSON (no markdown, no backticks):
{
  "day1": {"breakfast": "Meal name + portion", "lunch": "...", "dinner": "..."},
  "day2": {...},
  ...
  "day10": {...}
}`;

    let mealsData = null;
    let usedAPI = '';

    // TRY PERPLEXITY FIRST
    try {
      console.log('Attempting Perplexity API...');
      const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (perplexityResponse.ok) {
        const data = await perplexityResponse.json();
        let responseText = data.choices[0].message.content;
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        mealsData = JSON.parse(responseText);
        usedAPI = 'Perplexity';
        console.log('✓ Perplexity succeeded');
      } else {
        throw new Error(`Perplexity failed: ${perplexityResponse.status}`);
      }
    } catch (perplexityError) {
      console.log('✗ Perplexity failed:', perplexityError.message);
      console.log('Falling back to ChatGPT...');

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
            max_tokens: 2000,
            temperature: 0.7
          })
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI failed: ${openaiResponse.status}`);
        }

        const data = await openaiResponse.json();
        let responseText = data.choices[0].message.content;
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        mealsData = JSON.parse(responseText);
        usedAPI = 'ChatGPT (fallback)';
        console.log('✓ ChatGPT fallback succeeded');
      } catch (openaiError) {
        console.log('✗ ChatGPT also failed:', openaiError.message);
        throw new Error('Both Perplexity and ChatGPT APIs failed');
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        meals: mealsData,
        apiUsed: usedAPI
      })
    };

  } catch (error) {
    console.error('Final error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Failed to generate meals. Please try again.',
        details: error.message 
      })
    };
  }
};