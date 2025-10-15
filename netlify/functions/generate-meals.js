// ═══════════════════════════════════════════════════════════
// NETLIFY FUNCTION: AI MEAL GENERATOR WITH MEAL BANK
// Updated: Strictly uses meals from predefined meal bank only
// ═══════════════════════════════════════════════════════════

// MEAL BANK - All meals organized by category
const MEAL_BANK = {
  breakfast: [
    "2 egg whites omelette + 1 multigrain toast",
    "1 bread toast + Paneer bhurji (40 g paneer + 1 tsp oil + veggies)",
    "Tofu scramble (60 g tofu + 1/2 tsp oil + veggies) + 1 toast",
    "1 bread toast + cucumber/tomato slices",
    "2 bread slices + 50 g paneer bhurji",
    "1 multigrain toast + 1 tsp peanut butter",
    "1 bread toast + 1 tsp peanut butter + 1/2 banana slices",
    "1 multigrain toast + 30 g mashed avocado",
    "1 bread toast + 30 g avocado + 2 egg whites",
    "1 bread toast + 30 g avocado/ cheese + 3 tomato slices",
    "1 bread toast + 1 tsp almond butter",
    "1 bread toast + 2 tbsp besan batter spread and grill",
    "1 bread toast + 1 tsp butter",
    "1 bread toast + 1 tsp fruit jam",
    "1 bread toast + 1 tsp malai + 1/2 tsp honey",
    "1 katori poha",
    "1 katori upma + chutney",
    "1 katori vermicelli + chutney",
    "1 moong dal chilla + chutney",
    "1 besan chilla + chutney",
    "1 oats carrot chilla + chutney",
    "1 oats zucchini chilla + chutney",
    "2 egg mushroom omelette",
    "3 eggwhite tomato cheese omelette",
    "3 eggs scrambled + sauteed bell pepper",
    "2 ragi onion dosa + chutney",
    "2 plain dosa + chutney",
    "1 uttapam + chutney",
    "2 veg idli + chutney",
    "1 methi oats ki roti + chutney + 1/2 katori Dahi",
    "1 mooli oats roti + chutney + 1/2 katori Dahi",
    "1 missi onion roti + chutney + 1/2 katori Dahi",
    "1 palak oats ki roti + chutney + 1/2 katori Dahi",
    "1 dal ki roti + chutney + 1/2 katori Dahi",
    "200 gm Papaya + 1 tsp Sesame Seeds + 1/2 katori Curd",
    "500 gm Melon + 1 glass coconut water + 1 tsp Chia Seeds",
    "1 katori Chia Seeds + 1 Apple + 1 katori Curd",
    "1 katori Oatmeal + 1 Apple or 1 cup berries",
    "1 glass veg juice + 1 katori peanut chat",
    "1 katori peanut + 50 gm Paneer chat"
  ],
  lunch: [
    "1 oats roti (50 g flour) + paneer bhurji (60 g paneer + 1/2 tsp oil)",
    "1 jowar roti (50 g flour) + 3 egg whites bhurji",
    "1 oats roti (50 g flour) + tofu stir fry (80 g tofu + veggies + 1/2 tsp oil)",
    "1 katori Kadi + 1 katori Rice",
    "1 missi roti (50 g besan+wheat) + 1 katori raita",
    "1 oats roti (50 g) + 1 katori chicken curry",
    "1 oats roti (50 g) + 1 katori mutton curry",
    "1 oats roti (50 g) + 1 katori fish curry",
    "1 oats roti (50 g) + 1 katori paneer curry",
    "1 oats roti (50 g) + 1 katori rajma curry",
    "1 oats roti (50 g) + 1 katori Palak Paneer curry",
    "1 oats roti (50 g) + 1 katori mix veg",
    "2 Gobhi stuffed Roti + 1/2 katori Curd",
    "2 Aloo stuffed Roti + 1/2 katori Curd",
    "2 Paneer stuffed Roti + 1/2 katori Curd",
    "2 Mooli stuffed Roti + 1/2 katori Curd",
    "2 Methi Roti + 1/2 katori Curd",
    "1 katori arhar dal (30 g raw) + 1 katori rice (80 g cooked)",
    "2 katori Sabut Masar dal (30 g raw) + Salad",
    "2 katori Sabut Moong dal (30 g raw) + Salad",
    "1 katori rajma curry (60 g cooked) + 1/2 katori rice (80 g cooked)",
    "1 katori chole curry (60 g cooked) + 1/2 katori rice (80 g cooked)",
    "1 katori rice (80 g cooked) + 1/2 katori curd (100 g) + tadka",
    "1 katori Sambar + Rice / Idli",
    "1 katori Veg Oats + Salad",
    "1 Paneer Wrap",
    "1 Chicken Wrap",
    "1 Paneer Sandwich",
    "1 Chicken Sandwich",
    "1 katori Pulao + 1/2 katori Curd",
    "1 katori Chicken Biryani + 1/2 katori Curd",
    "2 plain dosa + chutney",
    "1 uttapam + chutney",
    "100 gm Grilled Paneer + 1 katori beetroot raita",
    "1 small kulcha + 1/2 katori matar curry",
    "Veg Burger - Small wholewheat bun + aloo tikki + salad",
    "Aloo Tikki - 1 medium tikki + chutney",
    "Vada Pav - 1 pav + batata vada",
    "Veg Kathi Roll - 1 roti + paneer/veg filling + chutney",
    "Mini Pao Bhaji - 1 pav + 1/2 katori bhaji",
    "Sabut Moong Dal Salad - 50 g raw moong (100 g cooked) + onion + tomato",
    "Kala Chana Salad - 50 g raw chana (100 g cooked) + cucumber + tomato",
    "White Lobia Salad - 50 g raw lobia (100 g cooked) + cucumber + onion",
    "Paneer Salad - 40 g paneer + cucumber + tomato",
    "Tofu Salad - 50 g tofu + lettuce + capsicum + sesame dressing",
    "Nut & Seed Salad - 8 almonds + 1 tsp seeds + 2 cucumber",
    "Egg White Salad - 2 boiled egg whites + cucumber + tomato",
    "Chicken Salad - 80 g grilled chicken + lettuce + cucumber"
  ],
  dinner: [
    "1 bowl Ragi mix veg soup + 1 bread toast",
    "1 katori Papaya bowl",
    "1 bowl Clear veg soup + 50 g paneer",
    "1 bowl Ghiya-tomato soup",
    "1 bowl Soup + sauteed paneer / 2 eggwhite",
    "1 katori Papaya bowl + 1 tsp pumpkin seeds",
    "100 gm Grilled paneer + salad",
    "3 Egg white bhurji + 1 bread toast",
    "2 slices Mushroom cheese sandwich",
    "1 katori Zucchini pasta",
    "1 bowl Vegetable soup + 1 multigrain toast",
    "1 bowl Ghiya tomato soup + 2 sourdough toast",
    "1 katori Steamed vegetables (light masala)",
    "1 bowl Clear veg soup",
    "1 katori sauteed veggies",
    "50 gm Sauteed paneer + 1 katori sauteed veg",
    "1 katori Milk Oats",
    "2 katori Tomato rasam",
    "1 bowl Clear lauki soup",
    "1 bowl Palak paneer",
    "100 gms chilli garlic Mushroom",
    "1 bowl Ghiya-tomato soup + 1 sourdough toast",
    "1 bowl Carrot-beet soup",
    "1 katori Ragi porridge (salted/buttermilk)",
    "1/2 katori rice + 1/2 katori curd",
    "1 bowl Moong Ghiya soup + 1 katori veg",
    "1 bowl Pumpkin soup",
    "50 g roasted Paneer tikka",
    "1 bowl Sauteed beans + Grilled Paneer (50gm)",
    "1 bowl Tomato-capsicum soup + 1 toast",
    "1 bowl Pumpkin-tomato soup + 2 eggwhite or Paneer 40 gms",
    "3 eggwhite any form",
    "100 gms Chicken Tikka",
    "1 bowl Chicken Soup",
    "1 bowl Mushroom Soup + 1 Toast",
    "Papaya Coconut Milk Smoothie - Papaya 100 g + 150 ml coconut milk",
    "Coconut Milk Smoothie - 150 ml coconut milk + 1/2 banana",
    "Sabut Moong Dal Salad - 50 g raw moong (100 g cooked) + onion + tomato",
    "Kala Chana Salad - 50 g raw chana (100 g cooked) + cucumber + tomato",
    "White Lobia Salad - 50 g raw lobia (100 g cooked) + cucumber + onion",
    "Paneer Salad - 40 g paneer + cucumber + tomato",
    "Tofu Salad - 50 g tofu + lettuce + capsicum + sesame dressing",
    "Nut & Seed Salad - 8 almonds + 1 tsp seeds + 2 cucumber",
    "Egg White Salad - 2 boiled egg whites + cucumber + tomato",
    "Chicken Salad - 80 g grilled chicken + lettuce + cucumber"
  ]
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { targetCalories, detoxInfo } = JSON.parse(event.body);

    // UPDATED PROMPT: Strictly enforces meal bank usage with Indian kitchen workflow
    const prompt = `You are a nutritionist AI creating a 10-day meal plan for an Indian household.

TARGET CALORIES: ${targetCalories} per day
DETOX DAYS: ${detoxInfo || 'None'}

🔐 CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:
1. You MUST select meals ONLY from the MEAL_BANK provided below
2. DO NOT create new meals, DO NOT search the web, DO NOT modify meal names
3. For BREAKFAST: ONLY pick from the breakfast array below
4. For LUNCH: ONLY pick from the lunch array below  
5. For DINNER: ONLY pick from the dinner array below
6. Use the EXACT meal text from the bank (copy it exactly as written)
7. Try to select meals that best match the target calories
8. For detox days, those meals are already specified and will override your selection

🍽️ VARIETY REQUIREMENTS - MAXIMUM VARIETY:
9. Each meal should appear ONLY ONCE in the entire 10-day plan
10. Do NOT repeat any breakfast across the 10 days
11. Do NOT repeat any lunch across the 10 days
12. Do NOT repeat any dinner across the 10 days
13. Aim for maximum variety in ingredients, flavors, and meal types

🏠 INDIAN KITCHEN WORKFLOW - PRACTICAL COOKING CONSIDERATIONS:
14. Client cooks ONLY in the morning (same day) OR late night (previous day)
15. Consider typical Indian kitchen setup and cooking patterns
16. Arrange meals to minimize cooking effort and time:
    - Pair simple breakfasts with complex lunches (e.g., if lunch has roti+curry, breakfast should be quick like poha/upma)
    - If breakfast requires preparation (chillas, dosas), keep lunch lighter (salads, wraps, simple dal-rice)
    - Dinner should generally be light and quick to prepare (soups, salads, simple dishes)
17. Group meal combinations that can be prepped together:
    - If lunch has rotis, other items can be prepared alongside
    - If morning breakfast is heavy (eggs, toast combinations), lunch should be simpler
18. Consider ingredient overlap for efficiency:
    - If paneer is used in lunch, avoid using it in breakfast same day
    - Spread protein sources across the day efficiently
19. Balance cooking complexity across the day:
    - EASY day: Simple breakfast + Simple lunch + Soup dinner
    - MODERATE day: Moderate breakfast + Moderate lunch + Light dinner
    - Avoid: Complex breakfast + Complex lunch + Complex dinner on same day

MEAL_BANK:
${JSON.stringify(MEAL_BANK, null, 2)}

Generate 30 meals total (Breakfast, Lunch, Dinner for 10 days).

RESPOND WITH ONLY VALID JSON (no markdown, no backticks):
{
  "day1": {"breakfast": "exact meal from breakfast array", "lunch": "exact meal from lunch array", "dinner": "exact meal from dinner array"},
  "day2": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day3": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day4": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day5": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day6": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day7": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day8": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day9": {"breakfast": "...", "lunch": "...", "dinner": "..."},
  "day10": {"breakfast": "...", "lunch": "...", "dinner": "..."}
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
