import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Check, X, HelpCircle, User, Zap, ArrowRight, ArrowLeft, Settings } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════
 * ruchi - AI MEAL PLANNING SYSTEM
 * "Smart Nutrition. Human Touch."
 * ═══════════════════════════════════════════════════════════
 * 
 * Version: 5.1.0 (Testing Build)
 * Date: October 14, 2025
 * 
 * COMPLETE INTEGRATED SYSTEM:
 * - Screen 1: Client Intake + AI Generation + Detox Selection
 * - Screen 2: Meal Planner + Natural Language + JPG Export
 * 
 * DESIGN: Dark theme (#0A0A0A) + Mint green accent (#10B981)
 * BRAND: ruchi● - Smart Nutrition. Human Touch.
 */

// ═══════════════════════════════════════════════════════════
// 🎨 DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════

const theme = {
  colors: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    primary: '#10B981',
    primaryHover: '#059669',
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#2A2A2A',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981'
  }
};

const styles = {
  card: {
    background: theme.colors.surface,
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${theme.colors.border}`
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    color: theme.colors.textPrimary,
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    background: theme.colors.primary,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    transition: 'all 0.2s',
    width: '100%'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    color: theme.colors.textPrimary,
    outline: 'none',
    cursor: 'pointer'
  }
};

// ═══════════════════════════════════════════════════════════
// 📊 DETOX PLANS DATABASE
// ═══════════════════════════════════════════════════════════

const DETOX_PLANS = {
  normal: { id: 'normal', name: 'Normal Day', emoji: '', color: '#6B7280', breakfast: null, lunch: null, dinner: null },
  free_breakfast: { id: 'free_breakfast', name: 'Free Breakfast', emoji: '🆓', color: '#8B5CF6', breakfast: 'Free Breakfast', lunch: null, dinner: null },
  free_lunch: { id: 'free_lunch', name: 'Free Lunch', emoji: '🆓', color: '#8B5CF6', breakfast: null, lunch: 'Free Lunch', dinner: null },
  free_dinner: { id: 'free_dinner', name: 'Free Dinner', emoji: '🆓', color: '#8B5CF6', breakfast: null, lunch: null, dinner: 'Free Dinner' },
  egg: { id: 'egg', name: 'Egg Plan', emoji: '🥚', color: '#3B82F6', breakfast: '2 Boiled Eggs', lunch: '2 Egg Omelette with veggies', dinner: '2 Egg Bhurji' },
  moong: { id: 'moong', name: 'Moong Dal Chilla', emoji: '🥜', color: '#F59E0B', breakfast: 'Moong Dal Chilla (2 pcs)', lunch: 'Moong Dal Chilla (2 pcs)', dinner: 'Moong Dal Chilla (2 pcs)' },
  liquid: { id: 'liquid', name: 'Liquid Diet', emoji: '💧', color: '#06B6D4', breakfast: 'Veg Soup (1 bowl)', lunch: 'Coconut Water (1 glass)', dinner: 'Veg Soup (1 bowl)' },
  milk_banana: { id: 'milk_banana', name: 'Milk Banana', emoji: '🍌', color: '#EAB308', breakfast: 'Banana (1) + Milk (1 glass)', lunch: 'Banana (1) + Milk (1 glass)', dinner: 'Banana (1) + Milk (1 glass)' },
  lauki: { id: 'lauki', name: 'Lauki Soup', emoji: '🥒', color: '#22C55E', breakfast: 'Lauki Soup (1 bowl)', lunch: 'Lauki Soup (1 bowl)', dinner: 'Lauki Soup (1 bowl)' },
  cabbage: { id: 'cabbage', name: 'Cabbage Soup', emoji: '🥬', color: '#10B981', breakfast: 'Cabbage Soup (1 bowl)', lunch: 'Cabbage Soup (1 bowl)', dinner: 'Cabbage Soup (1 bowl)' },
  melon: { id: 'melon', name: 'Melon Day', emoji: '🍈', color: '#84CC16', breakfast: 'Melon (1 cup)', lunch: 'Melon (1 cup)', dinner: 'Melon (1 cup)' },
  papaya: { id: 'papaya', name: 'Papaya Day', emoji: '🍑', color: '#FB923C', breakfast: 'Papaya (1 bowl)', lunch: 'Papaya (1 bowl)', dinner: 'Papaya (1 bowl)' },
  tomato: { id: 'tomato', name: 'Tomato Soup', emoji: '🍅', color: '#EF4444', breakfast: 'Tomato Soup (1 bowl)', lunch: 'Tomato Soup (1 bowl)', dinner: 'Tomato Soup (1 bowl)' },
  toast: { id: 'toast', name: 'Toast Day', emoji: '🍞', color: '#D97706', breakfast: 'Brown Toast (2 pcs)', lunch: 'Brown Toast (2 pcs)', dinner: 'Brown Toast (2 pcs)' },
  apple: { id: 'apple', name: 'Apple Day', emoji: '🍎', color: '#DC2626', breakfast: 'Apple (1)', lunch: 'Apple (1)', dinner: 'Apple (1)' },
  buttermilk: { id: 'buttermilk', name: 'Buttermilk', emoji: '🥛', color: '#A78BFA', breakfast: 'Buttermilk (1 glass)', lunch: 'Buttermilk (1 glass)', dinner: 'Buttermilk (1 glass)' },
  paneer: { id: 'paneer', name: 'Paneer Day', emoji: '🧀', color: '#FBBF24', breakfast: 'Paneer Bhurji (100g)', lunch: 'Paneer Curry (100g)', dinner: 'Grilled Paneer (100g)' }
};

// ═══════════════════════════════════════════════════════════
// 📱 CLIENT INTAKE SCREEN
// ═══════════════════════════════════════════════════════════

function ClientIntakeScreen({ onProceed }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [planNumber, setPlanNumber] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [age, setAge] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('female');
  const [activity, setActivity] = useState('moderate');
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [targetCalories, setTargetCalories] = useState(0);
  const [detoxDays, setDetoxDays] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnchors, setGeneratedAnchors] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const calculateCalories = () => {
    const w = parseFloat(currentWeight);
    const h = parseFloat(height);
    const a = parseInt(age);
    
    if (!w || !h || !a) {
      alert('Please fill in age, weight, and height first!');
      return;
    }

    let calculatedBmr = 0;
    if (gender === 'female') {
      calculatedBmr = 655 + (9.6 * w) + (1.8 * h) - (4.7 * a);
    } else {
      calculatedBmr = 66 + (13.7 * w) + (5 * h) - (6.8 * a);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const calculatedTdee = calculatedBmr * activityMultipliers[activity];
    const calculatedTarget = calculatedTdee - 500;

    setBmr(Math.round(calculatedBmr));
    setTdee(Math.round(calculatedTdee));
    setTargetCalories(Math.round(calculatedTarget));
  };

  const getDayLabel = (day) => {
    if (!startDate) return `Day ${day}`;
    const date = new Date(startDate);
    date.setDate(date.getDate() + (day - 1));
    const dayNames = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    return `Day ${day} (${dayNames[date.getDay()]})`;
  };

  const generateMealsWithAI = async () => {
    if (!targetCalories || targetCalories === 0) {
      alert('Please calculate calorie target first!');
      return;
    }

    setIsGenerating(true);
    setStep(2);

    try {
      const detoxInfo = Object.entries(detoxDays)
        .filter(([_, planId]) => planId !== 'normal')
        .map(([day, planId]) => {
          const plan = DETOX_PLANS[planId];
          return `Day ${day}: ${plan.emoji} ${plan.name}`;
        })
        .join(', ');

      const prompt = `You are a nutritionist AI creating a 10-day meal plan for a client.

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

      const response = await fetch("/.netlify/functions/generate-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCalories: targetCalories,
          detoxInfo: detoxInfo
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const mealsData = data.meals;
      
      // Apply detox plans
      Object.entries(detoxDays).forEach(([day, planId]) => {
        if (planId !== 'normal') {
          const plan = DETOX_PLANS[planId];
          const dayKey = `day${day}`;
          if (plan.breakfast) mealsData[dayKey].breakfast = plan.breakfast;
          if (plan.lunch) mealsData[dayKey].lunch = plan.lunch;
          if (plan.dinner) mealsData[dayKey].dinner = plan.dinner;
        }
      });

      setGeneratedAnchors(mealsData);
      setStep(3);
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Failed to generate meals. Please try again.');
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', fontFamily: 'Inter, -apple-system, sans-serif'}}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{...styles.card, marginBottom: '24px', textAlign: 'center'}}>
          <h1 style={{margin: '0 0 8px 0', fontSize: '36px', fontWeight: '800', background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #a78bfa 50%, #ec4899 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>ruchi●</h1>
          <p style={{margin: '0 0 4px 0', color: theme.colors.primary, fontSize: '14px', fontWeight: '500'}}>Smart Nutrition. Human Touch.</p>
          <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: '14px' }}>Step {step} of 3 • AI Meal Planning</p>
        </div>

        {/* Progress Bar */}
        <div style={{...styles.card, marginBottom: '24px', padding: '16px'}}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{flex: 1, height: '6px', borderRadius: '3px', background: step >= s ? theme.colors.primary : theme.colors.border}} />
            ))}
          </div>
        </div>

        {/* Step 1: Client Intake */}
        {step === 1 && (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '22px', color: theme.colors.textPrimary, fontWeight: '700'}}>Client Information</h2>
              <button onClick={() => setShowHelp(true)} style={{background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', padding: '8px'}}>
                <HelpCircle size={20} />
              </button>
            </div>

            {/* Metadata Section */}
            <div style={{background: theme.colors.background, padding: '20px', borderRadius: '8px', marginBottom: '24px', border: `2px solid ${theme.colors.primary}`}}>
              <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: theme.colors.primary, fontWeight: '600'}}>Plan Details</h3>
              
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Client Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter client name" style={styles.input} />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Plan Number *</label>
                  <input type="text" value={planNumber} onChange={(e) => setPlanNumber(e.target.value)} placeholder="1" style={styles.input} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Start Date *</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.input} />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Age *</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" style={styles.input} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Gender *</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.select}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Current Weight (kg) *</label>
                <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} placeholder="70" style={styles.input} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Target Weight (kg)</label>
                <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="65" style={styles.input} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Height (cm) *</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="165" style={styles.input} />
              </div>
            </div>

            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '500'}}>Activity Level *</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)} style={styles.select}>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="veryActive">Very Active (intense exercise daily)</option>
              </select>
            </div>

            {/* Calorie Display */}
            {targetCalories > 0 && (
              <div style={{background: theme.colors.background, padding: '16px', borderRadius: '8px', marginBottom: '24px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center'}}>
                  <div>
                    <div style={{fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px'}}>BMR</div>
                    <div style={{fontSize: '20px', fontWeight: '700', color: theme.colors.textPrimary}}>{bmr}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px'}}>TDEE</div>
                    <div style={{fontSize: '20px', fontWeight: '700', color: theme.colors.textPrimary}}>{tdee}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px'}}>Target</div>
                    <div style={{fontSize: '20px', fontWeight: '700', color: theme.colors.primary}}>{targetCalories}</div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={calculateCalories} style={{...styles.button, background: theme.colors.background, color: theme.colors.primary, border: `2px solid ${theme.colors.primary}`, marginBottom: '16px'}}>
              <Zap size={20} />
              Calculate Calorie Target
            </button>

            {/* Detox Days Section */}
            {targetCalories > 0 && (
              <div style={{marginTop: '24px', padding: '20px', background: theme.colors.background, borderRadius: '8px'}}>
                <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: theme.colors.textPrimary, fontWeight: '600'}}>Detox Days (Optional)</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  {days.map(day => (
                    <div key={day}>
                      <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', color: theme.colors.textSecondary}}>{getDayLabel(day)}</label>
                      <select 
                        value={detoxDays[day] || 'normal'} 
                        onChange={(e) => setDetoxDays({...detoxDays, [day]: e.target.value})}
                        style={{...styles.select, fontSize: '13px', padding: '8px 12px'}}
                      >
                        {Object.values(DETOX_PLANS).map(plan => (
                          <option key={plan.id} value={plan.id}>
                            {plan.emoji} {plan.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button 
              onClick={generateMealsWithAI} 
              disabled={!targetCalories || !name || !startDate}
              style={{...styles.button, marginTop: '24px', opacity: (!targetCalories || !name || !startDate) ? 0.5 : 1}}
            >
              <Sparkles size={20} />
              Generate 30 Anchor Meals with AI
            </button>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === 2 && (
          <div style={{...styles.card, textAlign: 'center', padding: '60px 24px'}}>
            <div style={{marginBottom: '24px'}}>
              <div style={{width: '80px', height: '80px', margin: '0 auto', border: `4px solid ${theme.colors.primary}`, borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
            </div>
            <h2 style={{fontSize: '24px', color: theme.colors.textPrimary, marginBottom: '12px', fontWeight: '700'}}>AI is creating your meal plan...</h2>
            <p style={{color: theme.colors.textSecondary, fontSize: '15px'}}>This may take 10-15 seconds</p>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && generatedAnchors && (
          <div style={styles.card}>
            <h2 style={{margin: '0 0 8px 0', fontSize: '22px', color: theme.colors.textPrimary, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Check size={24} style={{color: theme.colors.success}} />
              30 Anchor Meals Generated!
            </h2>
            <p style={{margin: '0 0 24px 0', color: theme.colors.textSecondary, fontSize: '14px'}}>Review the meals below, then proceed to the meal planner</p>

            <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '24px'}}>
              {days.map(day => {
                const dayKey = `day${day}`;
                const meals = generatedAnchors[dayKey];
                const isDetox = detoxDays[day] && detoxDays[day] !== 'normal';
                const detoxPlan = isDetox ? DETOX_PLANS[detoxDays[day]] : null;
                return (
                  <div key={dayKey} style={{marginBottom: '14px', padding: '14px', background: isDetox ? `${detoxPlan.color}15` : theme.colors.surface, borderRadius: '10px', borderLeft: isDetox ? `4px solid ${detoxPlan.color}` : `4px solid ${theme.colors.primary}`}}>
                    <div style={{ color: isDetox ? detoxPlan.color : theme.colors.primary, fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>
                      {getDayLabel(day)} {isDetox && `${detoxPlan.emoji} ${detoxPlan.name}`}
                    </div>
                    <div style={{ color: theme.colors.textPrimary, fontSize: '13px', lineHeight: '1.7' }}>
                      <div><strong>Breakfast:</strong> {meals.breakfast}</div>
                      <div style={{marginTop:'6px'}}><strong>Lunch:</strong> {meals.lunch}</div>
                      <div style={{marginTop:'6px'}}><strong>Dinner:</strong> {meals.dinner}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => onProceed(generatedAnchors, { name, targetCalories, planNumber, startDate }, detoxDays)} style={styles.button}>
              Open Meal Planner
              <ArrowRight size={22} />
            </button>
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'}}>
            <div style={{...styles.card, maxWidth: '600px', width: '100%'}}>
              <h2 style={{margin: '0 0 16px 0', fontSize: '22px', color: theme.colors.textPrimary, fontWeight: '700'}}>How It Works</h2>
              <div style={{color: theme.colors.textSecondary, fontSize: '14px', lineHeight: '1.7', marginBottom: '24px'}}>
                <p><strong style={{color: theme.colors.primary}}>Step 1:</strong> Fill in client details and calculate calorie target</p>
                <p><strong style={{color: theme.colors.primary}}>Step 2:</strong> Optionally select detox days (egg plan, liquid diet, etc.)</p>
                <p><strong style={{color: theme.colors.primary}}>Step 3:</strong> AI generates 30 anchor meals (Breakfast, Lunch, Dinner for 10 days)</p>
                <p><strong style={{color: theme.colors.primary}}>Step 4:</strong> Review and proceed to meal planner to add remaining meals</p>
              </div>
              <button onClick={() => setShowHelp(false)} style={styles.button}>Got it!</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 📱 MEAL PLANNER SCREEN
// ═══════════════════════════════════════════════════════════

function MealPlannerScreen({ initialAnchors, clientProfile, detoxDaysInitial, onBack }) {
  const [clientName] = useState(clientProfile.name || '');
  const [planNumber] = useState(clientProfile.planNumber || '1');
  const [startDate] = useState(clientProfile.startDate || '');
  const [mealPlan, setMealPlan] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [detoxDays, setDetoxDays] = useState(detoxDaysInitial || {});
  const [showDetoxDropdown, setShowDetoxDropdown] = useState(null);
  const [headerNotes, setHeaderNotes] = useState({});
  const [editingHeader, setEditingHeader] = useState(null);
  const [headerEditValue, setHeaderEditValue] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [aiInterpretedMeals, setAiInterpretedMeals] = useState([]);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [downloadCounter, setDownloadCounter] = useState(0);
  
  const tableRef = useRef(null);

  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const mealTimes = [
    { key: 'em', name: 'Early Morning', type: 'constant' },
    { key: 'bb', name: 'Before Breakfast', type: 'constant' },
    { key: 'bf', name: 'Breakfast', type: 'anchor' },
    { key: 'md', name: 'Midday', type: 'constant' },
    { key: 'lu', name: 'Lunch', type: 'anchor' },
    { key: 'pl', name: 'Post-Lunch', type: 'constant' },
    { key: 'ev', name: 'Evening', type: 'constant' },
    { key: 'dn', name: 'Dinner', type: 'anchor' },
    { key: 'bt', name: 'Bedtime', type: 'constant' }
  ];

  React.useEffect(() => {
    if (initialAnchors) {
      const newPlan = {};
      days.forEach(day => {
        const dayKey = `day${day}`;
        const meals = initialAnchors[dayKey];
        if (meals) {
          newPlan[`${day}-bf`] = meals.breakfast || '';
          newPlan[`${day}-lu`] = meals.lunch || '';
          newPlan[`${day}-dn`] = meals.dinner || '';
        }
      });
      setMealPlan(newPlan);
      setSuccessMessage('✅ Welcome! 30 anchor meals loaded. Add constant meals using natural language below.');
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [initialAnchors]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDetoxPlanChange = (day, newPlanId) => {
    const plan = DETOX_PLANS[newPlanId];
    setDetoxDays(prev => ({...prev, [day]: newPlanId}));
    setMealPlan(prev => ({
      ...prev, 
      [`${day}-bf`]: plan.breakfast || '', 
      [`${day}-lu`]: plan.lunch || '', 
      [`${day}-dn`]: plan.dinner || ''
    }));
    setShowDetoxDropdown(null);
    showSuccess(newPlanId === 'normal' ? `✅ Day ${day} changed to Normal Day` : `✅ Day ${day} changed to ${plan.emoji} ${plan.name}`);
  };

  const handleHeaderEdit = (mealTimeKey) => {
    setEditingHeader(mealTimeKey);
    setHeaderEditValue(headerNotes[mealTimeKey] || '');
  };

  const saveHeaderEdit = () => {
    if (editingHeader) {
      setHeaderNotes(prev => ({...prev, [editingHeader]: headerEditValue}));
      setEditingHeader(null);
      setHeaderEditValue('');
      showSuccess('✅ Header note saved!');
    }
  };

  const calculateStatus = () => {
    const constants = mealTimes.filter(mt => mt.type === 'constant');
    const anchors = mealTimes.filter(mt => mt.type === 'anchor');
    let constantsComplete = 0;
    constants.forEach(mt => {
      const allDaysFilled = days.every(day => mealPlan[`${day}-${mt.key}`]);
      if (allDaysFilled) constantsComplete++;
    });
    let anchorsFilled = 0;
    days.forEach(day => {
      anchors.forEach(mt => {
        if (mealPlan[`${day}-${mt.key}`]) anchorsFilled++;
      });
    });
    const totalCells = 90;
    const filledCells = (constantsComplete * 10) + anchorsFilled;
    return {
      constantsComplete,
      constantsTotal: constants.length,
      anchorsFilled,
      anchorsTotal: anchors.length * 10,
      filledCells,
      totalCells,
      percentage: Math.round((filledCells / totalCells) * 100)
    };
  };

  const status = calculateStatus();

  const interpretWithAI = async () => {
    const input = manualInput.trim();
    if (!input) { 
      showSuccess('❌ Please enter a command first!'); 
      return; 
    }
    
    setIsInterpreting(true);
    try {
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

      const response = await fetch("/.netlify/functions/interpret-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input })
      });

      const data = await response.json();

      if (data.error) {
        setAiInterpretedMeals([{type: 'error', message: data.error}]);
        setShowAIPreview(true);
        return;
      }

      const interpreted = data.interpreted;
      setAiInterpretedMeals(interpreted);
      setShowAIPreview(true);
    } catch (error) {
      console.error('AI Interpretation Error:', error);
      setAiInterpretedMeals([{type: 'error', message: 'Could not interpret command. Please try again.'}]);
      setShowAIPreview(true);
    } finally {
      setIsInterpreting(false);
    }
  };

  const confirmAIInterpretation = () => {
    const newPlan = { ...mealPlan };
    let totalAdded = 0;
    
    aiInterpretedMeals.forEach(meal => {
      if (meal.type === 'error') return;
      
      const mealTimeObj = mealTimes.find(mt => mt.name.toLowerCase() === meal.mealTime.toLowerCase());
      if (!mealTimeObj) return;

      if (meal.type === 'constant') {
        days.forEach(day => {
          const cellKey = `${day}-${mealTimeObj.key}`;
          if (meal.action === 'append' && newPlan[cellKey]) {
            newPlan[cellKey] = `${newPlan[cellKey]}, ${meal.food}`;
          } else {
            newPlan[cellKey] = meal.food;
          }
        });
        totalAdded += 10;
      } else if (meal.type === 'anchor') {
        const day = meal.day || 1;
        const cellKey = `${day}-${mealTimeObj.key}`;
        newPlan[cellKey] = meal.food;
        totalAdded++;
      }
    });

    setMealPlan(newPlan);
    setShowAIPreview(false);
    setAiInterpretedMeals([]);
    setManualInput('');
    showSuccess(`✅ Added ${totalAdded} meal${totalAdded > 1 ? 's' : ''}!`);
  };

  const getDayName = (dayNumber) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    const dayNames = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    return dayNames[date.getDay()];
  };

  const handleCellClick = (cellKey) => {
    // All cells are now editable - detox meals just pre-populate values
    setEditMode(cellKey);
    setEditValue(mealPlan[cellKey] || '');
  };

  const saveCellEdit = () => {
    if (editMode) {
      setMealPlan(prev => ({...prev, [editMode]: editValue}));
      setEditMode(null);
      setEditValue('');
      showSuccess('✅ Meal saved!');
    }
  };

  const downloadAsJPG = async () => {
    console.log('🎬 STEP 1: Starting JPG download process...');
    setIsCapturing(true);
    
    try {
      // Check if html2canvas exists
      console.log('🎬 STEP 2: Checking html2canvas library...');
      if (!window.html2canvas) {
        console.log('⚠️ html2canvas not found, loading from CDN...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('✅ html2canvas loaded successfully!');
            resolve();
          };
          script.onerror = () => {
            console.error('❌ Failed to load html2canvas from CDN');
            reject(new Error('Failed to load html2canvas'));
          };
          document.body.appendChild(script);
        });
      } else {
        console.log('✅ html2canvas already loaded!');
      }

      console.log('🎬 STEP 3: Getting table element...');
      const element = tableRef.current;
      if (!element) {
        throw new Error('Table element not found');
      }
      console.log('✅ Table element found:', element);
      
      // Create a clone
      console.log('🎬 STEP 4: Creating clone of table...');
      const clonedTable = element.cloneNode(true);
      clonedTable.style.position = 'absolute';
      clonedTable.style.left = '-9999px';
      clonedTable.style.width = '1900px';
      clonedTable.style.minWidth = '1900px';
      clonedTable.style.maxWidth = '1900px';
      clonedTable.style.padding = '0px'; // No padding - fill entire canvas
      clonedTable.style.borderRadius = '0'; // Remove border radius
      console.log('✅ Clone created');
      
      // Hide gear icons in clone
      console.log('🎬 STEP 5: Hiding gear icons in clone...');
      const gearIcons = clonedTable.querySelectorAll('[data-gear-icon]');
      console.log(`Found ${gearIcons.length} gear icons to hide`);
      gearIcons.forEach(icon => icon.style.display = 'none');
      
      // Adjust header in clone - Aptos 28px ALL CAPS
      console.log('🎬 STEP 6a: Adjusting header styling...');
      const headerContainer = clonedTable.querySelector('div[style*="gradient"]');
      if (headerContainer) {
        headerContainer.style.marginTop = '0';
        headerContainer.style.marginLeft = '0';
        headerContainer.style.marginRight = '0';
        headerContainer.style.borderRadius = '0';
        headerContainer.style.padding = '16px';
      }
      const header = clonedTable.querySelector('h1');
      if (header) {
        header.style.fontSize = '28px';
        header.style.fontFamily = "'Aptos', 'Segoe UI', Arial, sans-serif";
        header.style.textTransform = 'uppercase'; // ALL CAPS
      }
      
      // Adjust table in clone - Aptos font
      console.log('🎬 STEP 6b: Adjusting table styling...');
      const table = clonedTable.querySelector('table');
      if (table) {
        table.style.width = '100%';
        table.style.tableLayout = 'fixed';
        table.style.fontSize = '16px'; // Meals text - Aptos 16
        table.style.fontFamily = "'Aptos', 'Segoe UI', Arial, sans-serif";
        table.style.marginTop = '0';
        console.log('✅ Table styles applied');
      }
      
      // Adjust all header cells - Aptos 18px
      console.log('🎬 STEP 6c: Adjusting header cells...');
      const headerCells = clonedTable.querySelectorAll('thead th');
      headerCells.forEach(cell => {
        cell.style.padding = '14px 10px';
        cell.style.fontSize = '18px'; // Column headers - Aptos 18
        cell.style.fontFamily = "'Aptos', 'Segoe UI', Arial, sans-serif";
        cell.style.lineHeight = '1.3';
      });
      
      // Adjust all body cells - Aptos 16px for meals
      console.log('🎬 STEP 6d: Adjusting body cells...');
      const bodyCells = clonedTable.querySelectorAll('tbody td');
      console.log(`Adjusting ${bodyCells.length} body cells...`);
      bodyCells.forEach(cell => {
        cell.style.padding = '10px 8px';
        cell.style.fontSize = '16px'; // Meals text - Aptos 16
        cell.style.fontFamily = "'Aptos', 'Segoe UI', Arial, sans-serif";
        cell.style.lineHeight = '1.3';
      });
      
      // CRITICAL: Make ALL text in Day column the same size - Aptos 16px
      console.log('🎬 STEP 6e: Uniforming Day column text...');
      const dayCells = clonedTable.querySelectorAll('tbody td:first-child');
      dayCells.forEach(cell => {
        const allDivs = cell.querySelectorAll('div');
        allDivs.forEach(div => {
          div.style.fontSize = '16px'; // Day column - Aptos 16
          div.style.fontFamily = "'Aptos', 'Segoe UI', Arial, sans-serif";
          div.style.fontWeight = '700';
          div.style.color = '#000';
          div.style.lineHeight = '1.3';
        });
      });
      
      // Adjust footer - Segoe UI 18px
      const footerDivs = clonedTable.querySelectorAll('div');
      footerDivs.forEach(div => {
        if (div.textContent.includes('Ruchi Gurnani')) {
          div.style.fontSize = '18px'; // Footer logo - Segoe UI 18
          div.style.fontFamily = "'Segoe UI', 'Aptos', Arial, sans-serif";
          div.style.padding = '14px 18px';
        }
      });
      
      // Append clone to body
      console.log('🎬 STEP 7: Appending clone to body...');
      document.body.appendChild(clonedTable);
      console.log('✅ Clone appended');
      
      // Wait for clone to render
      console.log('🎬 STEP 8: Waiting for clone to render...');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('✅ Clone rendered');
      
      // Capture the clone
      console.log('🎬 STEP 9: Capturing with html2canvas...');
      const canvas = await window.html2canvas(clonedTable, {
        scale: 1,
        width: 1900,
        height: 1150,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      console.log('✅ Canvas captured:', canvas.width, 'x', canvas.height);
      
      // Remove clone
      console.log('🎬 STEP 10: Removing clone...');
      document.body.removeChild(clonedTable);
      console.log('✅ Clone removed');
      
      // Convert to blob and download using more reliable method
      console.log('🎬 STEP 11: Converting to blob and triggering download...');
      
      // Increment download counter for unique filenames
      const currentCount = downloadCounter + 1;
      setDownloadCounter(currentCount);
      console.log(`📊 Download counter: ${currentCount}`);
      
      canvas.toBlob((blob) => {
        console.log('✅ Blob created, size:', blob.size, 'bytes');
        
        const url = URL.createObjectURL(blob);
        console.log('✅ Blob URL created');
        
        const link = document.createElement('a');
        const planMonth = startDate ? (() => {
          const date = new Date(startDate);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const year = date.getFullYear().toString().slice(-2);
          return `${months[date.getMonth()]}${String.fromCharCode(8217)}${year}`;
        })() : 'Plan';
        const filename = `${clientName || 'Client'} - Plan ${planNumber} ${planMonth} (${currentCount}).jpg`;
        
        link.href = url;
        link.download = filename;
        
        // CRITICAL: Append to DOM before clicking
        console.log('🎬 STEP 11a: Appending link to DOM...');
        document.body.appendChild(link);
        console.log('✅ Link appended to DOM');
        
        console.log('🎬 STEP 11b: Triggering click...');
        link.click();
        console.log('✅ Download triggered:', filename);
        
        // Cleanup
        console.log('🎬 STEP 11c: Cleaning up...');
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('✅ Cleanup complete');
        
        showSuccess(`✅ JPG downloaded: ${filename}`);
      }, 'image/jpeg', 0.95);
      
      console.log('🎬 STEP 12: Blob conversion initiated');
    } catch (error) {
      console.error('❌ ERROR OCCURRED:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to export JPG. Error: ${error.message}\n\nCheck browser console for details.`);
    } finally {
      // Add delay to ensure state updates properly
      console.log('🎬 STEP 13: Resetting capturing flag with delay...');
      setTimeout(() => {
        setIsCapturing(false);
        console.log('✅ Capturing flag reset, button re-enabled');
      }, 200);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: '80px'}}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{...styles.card, marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1 style={{margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #a78bfa 50%, #ec4899 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>ruchi●</h1>
              <p style={{margin: '0', color: theme.colors.textSecondary, fontSize: '13px'}}>
                📊 <strong>Client:</strong> {clientName} | <strong>Plan:</strong> {planNumber} | <strong>Start:</strong> {startDate ? (() => {
                  const date = new Date(startDate);
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const day = date.getDate();
                  const year = date.getFullYear();
                  return `${months[date.getMonth()]} ${day}, ${year}`;
                })() : 'Not set'}
              </p>
            </div>
            <button onClick={onBack} style={{...styles.button, width: 'auto', background: 'transparent', border: `2px solid ${theme.colors.border}`, color: theme.colors.textSecondary}}>
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{...styles.card, marginBottom: '20px', background: theme.colors.success + '20', border: `1px solid ${theme.colors.success}`, animation: 'slideIn 0.3s ease-out'}}>
            <p style={{margin: 0, color: theme.colors.success, fontSize: '14px', fontWeight: '600'}}>{successMessage}</p>
          </div>
        )}

        {/* Welcome Banner */}
        {showWelcome && (
          <div style={{...styles.card, marginBottom: '20px', background: `linear-gradient(135deg, ${theme.colors.primary}20 0%, #a78bfa20 100%)`, border: `1px solid ${theme.colors.primary}`, animation: 'slideIn 0.5s ease-out'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
              <div>
                <h3 style={{margin: '0 0 8px 0', fontSize: '16px', color: theme.colors.primary, fontWeight: '700'}}>Welcome to Meal Planner! 🎉</h3>
                <p style={{margin: 0, color: theme.colors.textSecondary, fontSize: '13px', lineHeight: '1.6'}}>
                  ✅ 30 anchor meals loaded • Use natural language below to add constant meals • Click cells to edit • Click headers for timing notes
                </p>
              </div>
              <button onClick={() => setShowWelcome(false)} style={{background: 'none', border: 'none', color: theme.colors.textSecondary, cursor: 'pointer', padding: '4px'}}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Natural Language Input */}
        <div style={{...styles.card, marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <h3 style={{margin: 0, fontSize: '16px', color: theme.colors.textPrimary, fontWeight: '700'}}>Add Meals with Natural Language</h3>
            <button onClick={() => setShowHelp(true)} style={{background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', padding: '4px'}}>
              <HelpCircle size={18} />
            </button>
          </div>
          <div style={{display: 'flex', gap: '12px', marginBottom: '12px'}}>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && interpretWithAI()}
              placeholder="e.g., 'Early morning jeera water, midday coconut water' or 'Day 1 breakfast poha'"
              style={{...styles.input, flex: 1}}
            />
            <button onClick={interpretWithAI} disabled={isInterpreting} style={{...styles.button, width: 'auto', opacity: isInterpreting ? 0.5 : 1}}>
              <Sparkles size={18} />
              {isInterpreting ? 'Interpreting...' : 'Interpret'}
            </button>
          </div>
          <p style={{margin: 0, color: theme.colors.textSecondary, fontSize: '12px'}}>
            💡 Tip: Use "daily" for constants (all 10 days) or "day X" for specific anchor meals
          </p>
        </div>

        {/* Status Widget */}
        <div style={{...styles.card, marginBottom: '20px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', textAlign: 'center'}}>
            <div>
              <div style={{fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px'}}>Constants</div>
              <div style={{fontSize: '18px', fontWeight: '700', color: theme.colors.textPrimary}}>{status.constantsComplete}/{status.constantsTotal}</div>
            </div>
            <div>
              <div style={{fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px'}}>Anchors</div>
              <div style={{fontSize: '18px', fontWeight: '700', color: theme.colors.textPrimary}}>{status.anchorsFilled}/{status.anchorsTotal}</div>
            </div>
            <div>
              <div style={{fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px'}}>Total Cells</div>
              <div style={{fontSize: '18px', fontWeight: '700', color: theme.colors.textPrimary}}>{status.filledCells}/{status.totalCells}</div>
            </div>
            <div>
              <div style={{fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px'}}>Completion</div>
              <div style={{fontSize: '18px', fontWeight: '700', color: theme.colors.primary}}>{status.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Download Button - Moved Above Table */}
        <div style={{marginBottom: '20px'}}>
          <button onClick={downloadAsJPG} disabled={isCapturing} style={{...styles.button, opacity: isCapturing ? 0.6 : 1, cursor: isCapturing ? 'not-allowed' : 'pointer'}}>
            <Camera size={20} />
            {isCapturing ? 'Creating JPG... Please wait' : '📸 Download JPG (1900×1150)'}
          </button>
          {isCapturing && (
            <div style={{marginTop: '12px', padding: '12px', background: theme.colors.primary + '20', border: `1px solid ${theme.colors.primary}`, borderRadius: '8px', textAlign: 'center'}}>
              <div style={{display: 'inline-block', width: '20px', height: '20px', border: `3px solid ${theme.colors.primary}`, borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '12px'}}></div>
              <span style={{color: theme.colors.primary, fontSize: '14px', fontWeight: '600'}}>Processing... This takes a few seconds</span>
            </div>
          )}
        </div>

        {/* Meal Plan Table */}
        <div ref={tableRef} style={{backgroundColor: 'white', padding: '15px', borderRadius: '10px', overflowX: 'auto', marginBottom: '20px'}}>
          <div style={{textAlign: 'center', marginBottom: '12px', padding: '12px', background: 'linear-gradient(135deg, #5B7C99 0%, #4A6B8A 100%)', borderRadius: '8px 8px 0 0', marginTop: '-15px', marginLeft: '-15px', marginRight: '-15px'}}>
            <h1 style={{margin: 0, fontSize: '18px', color: '#FFFFFF', fontWeight: '700'}}>
              {clientName || 'Client'} - Plan {planNumber} {startDate ? (() => {
                const date = new Date(startDate);
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const year = date.getFullYear().toString().slice(-2);
                return `${months[date.getMonth()]}${String.fromCharCode(8217)}${year}`;
              })() : ''}
            </h1>
          </div>

          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginTop: '12px'}}>
            <thead>
              <tr style={{background: '#F4A460'}}>
                <th style={{border: '1px solid #ddd', padding: '8px 6px', fontWeight: '700', fontSize: '10px', color: '#000', width: '8%'}}>Day</th>
                {mealTimes.map(mt => {
                  const isEditing = editingHeader === mt.key;
                  return (
                    <th key={mt.key} style={{border: '1px solid #ddd', padding: '8px 6px', fontWeight: '700', fontSize: '10px', color: '#000', position: 'relative', cursor: 'pointer', width: '10.2%'}} onClick={() => !isCapturing && handleHeaderEdit(mt.key)}>
                      <div>{mt.name}</div>
                      {headerNotes[mt.key] && !isEditing && <div style={{fontSize: '8px', color: '#000', fontWeight: '400', marginTop: '2px'}}>{headerNotes[mt.key]}</div>}
                      {isEditing && !isCapturing && (
                        <div onClick={(e) => e.stopPropagation()} style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ddd', padding: '4px', zIndex: 10, marginTop: '2px'}}>
                          <input type="text" value={headerEditValue} onChange={(e) => setHeaderEditValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && saveHeaderEdit()} placeholder="Add timing note" style={{width: '100%', padding: '4px', fontSize: '9px', border: '1px solid #ddd', borderRadius: '2px'}} autoFocus />
                          <div style={{display: 'flex', gap: '4px', marginTop: '4px'}}>
                            <button onClick={saveHeaderEdit} style={{flex: 1, padding: '4px', background: '#10B981', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '9px'}}>Save</button>
                            <button onClick={() => { setEditingHeader(null); setHeaderEditValue(''); }} style={{flex: 1, padding: '4px', background: '#999', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '9px'}}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {days.map(day => {
                const detoxPlanId = detoxDays[day];
                const isDetoxDay = detoxPlanId && detoxPlanId !== 'normal';
                const detoxPlan = isDetoxDay ? DETOX_PLANS[detoxPlanId] : null;
                const dayName = getDayName(day);
                
                return (
                  <tr key={day} style={{background: 'white'}}>
                    <td style={{border: '1px solid #ddd', padding: '8px 6px', fontWeight: '700', fontSize: '10px', color: '#000', position: 'relative', textAlign: 'center', background: '#F4A460'}}>
                      <div>Day {day}</div>
                      {dayName && <div style={{fontSize: '10px', fontWeight: '700', color: '#000'}}>({dayName})</div>}
                      {isDetoxDay && <div style={{fontSize: '10px', color: '#000', marginTop: '2px', fontWeight: '700'}}>{detoxPlan.emoji} {detoxPlan.name}</div>}
                      {!isCapturing && (
                        <button data-gear-icon onClick={(e) => { e.stopPropagation(); setShowDetoxDropdown(showDetoxDropdown === day ? null : day); }} style={{position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#999'}}>
                          <Settings size={12} />
                        </button>
                      )}
                      {showDetoxDropdown === day && !isCapturing && (
                        <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '4px', zIndex: 20, marginTop: '2px', maxHeight: '200px', overflowY: 'auto'}}>
                          {Object.values(DETOX_PLANS).map(plan => (
                            <div key={plan.id} onClick={() => handleDetoxPlanChange(day, plan.id)} style={{padding: '6px 8px', cursor: 'pointer', fontSize: '9px', borderBottom: '1px solid #eee', background: detoxPlanId === plan.id ? '#f0f0f0' : 'white'}} onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8f8'} onMouseLeave={(e) => e.currentTarget.style.background = detoxPlanId === plan.id ? '#f0f0f0' : 'white'}>
                              {plan.emoji} {plan.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    {mealTimes.map(mt => {
                      const cellKey = `${day}-${mt.key}`;
                      const meal = mealPlan[cellKey];
                      const isEditing = editMode === cellKey;
                      
                      return (
                        <td key={cellKey} onClick={() => !isCapturing && handleCellClick(cellKey)} style={{border: '1px solid #ddd', padding: '8px 6px', fontSize: '10px', color: '#000', cursor: 'pointer', background: 'white', verticalAlign: 'top'}}>
                          {isEditing && !isCapturing ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{width: '100%', minHeight: '45px', padding: '4px', fontSize: '9px', border: '1px solid #ddd', borderRadius: '2px', resize: 'vertical'}} autoFocus />
                              <div style={{display: 'flex', gap: '4px', marginTop: '4px'}}>
                                <button onClick={saveCellEdit} style={{padding: '4px 8px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', fontWeight: '600'}}>Save</button>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditMode(null); }} style={{padding: '4px 8px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', fontWeight: '600'}}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ minHeight: '45px' }}>
                              {meal ? (
                                <div style={{ whiteSpace: 'pre-wrap' }}>{meal}</div>
                              ) : (
                                !isCapturing && <div style={{ color: '#999', fontStyle: 'italic', fontSize: '10px' }}>Click to add</div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{textAlign: 'right', padding: '12px 16px', color: '#D97706', fontSize: '13px', fontStyle: 'italic', borderTop: '1px solid #ccc', marginTop: '2px', borderRadius: '0 0 8px 8px'}}>Ruchi Gurnani — Certified Nutritionist</div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '20px'}}>
            <div style={{...styles.card, maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto'}}>
              <h2 style={{margin: '0 0 16px 0', fontSize: '22px', color: theme.colors.textPrimary, fontWeight: '700'}}>Natural Language Guide</h2>
              <div style={{color: theme.colors.textSecondary, fontSize: '14px', lineHeight: '1.8', marginBottom: '24px'}}>
                <p><strong style={{color: theme.colors.primary}}>Constants (all 10 days):</strong></p>
                <p>• "Early morning jeera water, midday coconut water"</p>
                <p>• "Evening green tea"</p>
                <p>• "Bedtime warm milk"</p>
                
                <p style={{marginTop: '16px'}}><strong style={{color: theme.colors.primary}}>Anchors (specific day):</strong></p>
                <p>• "Day 1 breakfast poha, lunch dal rice, dinner roti sabzi"</p>
                <p>• "Day 3 lunch grilled chicken"</p>
                
                <p style={{marginTop: '16px'}}><strong style={{color: theme.colors.primary}}>Features:</strong></p>
                <p>• Click any cell to edit manually</p>
                <p>• Click meal time headers to add timing notes</p>
                <p>• Click gear icon ⚙️ to change detox plans</p>
                <p>• All cells are editable, including pre-filled detox meals</p>
              </div>
              <button onClick={() => setShowHelp(false)} style={styles.button}>Got it!</button>
            </div>
          </div>
        )}

        {/* AI Preview Modal */}
        {showAIPreview && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002, padding: '20px'}}>
            <div style={{...styles.card, maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto'}}>
              <h2 style={{margin: '0 0 8px 0', fontSize: '22px', color: theme.colors.textPrimary, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Sparkles size={24} style={{ color: theme.colors.primary }} />
                AI Interpretation
              </h2>
              <div style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '24px' }}>
                Detected {aiInterpretedMeals.filter(m => m.type !== 'error').length} meal{aiInterpretedMeals.filter(m => m.type !== 'error').length !== 1 ? 's' : ''}
              </div>

              <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '24px'}}>
                {aiInterpretedMeals.map((meal, idx) => {
                  if (meal.type === 'error') {
                    return (
                      <div key={idx} style={{padding: '12px', background: `${theme.colors.error}20`, border: `1px solid ${theme.colors.error}`, borderRadius: '8px', marginBottom: '12px'}}>
                        <p style={{margin: 0, color: theme.colors.error, fontSize: '14px'}}>❌ {meal.message}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} style={{padding: '14px', background: theme.colors.surface, borderRadius: '8px', marginBottom: '12px', border: `1px solid ${theme.colors.border}`}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                        <span style={{padding: '4px 8px', background: meal.type === 'constant' ? theme.colors.primary + '30' : theme.colors.warning + '30', color: meal.type === 'constant' ? theme.colors.primary : theme.colors.warning, borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>
                          {meal.type === 'constant' ? 'CONSTANT (10 days)' : `ANCHOR (Day ${meal.day})`}
                        </span>
                        <span style={{padding: '4px 8px', background: theme.colors.background, color: theme.colors.textSecondary, borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>
                          {meal.action === 'append' ? 'APPEND' : 'REPLACE'}
                        </span>
                      </div>
                      <div style={{color: theme.colors.textPrimary, fontSize: '14px', marginBottom: '4px'}}>
                        <strong>{meal.mealTime}:</strong> {meal.food}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{display: 'flex', gap: '12px'}}>
                <button onClick={() => { setShowAIPreview(false); setAiInterpretedMeals([]); }} style={{...styles.button, flex: 1, background: theme.colors.background, color: theme.colors.textSecondary, border: `2px solid ${theme.colors.border}`}}>
                  <X size={18} />
                  Cancel
                </button>
                <button onClick={confirmAIInterpretation} disabled={aiInterpretedMeals.some(m => m.type === 'error')} style={{...styles.button, flex: 1, opacity: aiInterpretedMeals.some(m => m.type === 'error') ? 0.5 : 1}}>
                  <Check size={18} />
                  Confirm & Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn { 
          from { transform: translateX(400px); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 🎯 MAIN APP
// ═══════════════════════════════════════════════════════════

export default function MealPlanApp() {
  const [currentScreen, setCurrentScreen] = useState('intake');
  const [generatedAnchors, setGeneratedAnchors] = useState(null);
  const [clientProfile, setClientProfile] = useState({ name: '', targetCalories: 0, planNumber: '1', startDate: '' });
  const [detoxDays, setDetoxDays] = useState({});

  const handleProceedToPlanner = (anchors, profile, detox) => {
    setGeneratedAnchors(anchors);
    setClientProfile(profile);
    setDetoxDays(detox);
    setCurrentScreen('planner');
  };

  const handleBackToIntake = () => {
    setCurrentScreen('intake');
  };

  return (
    <>
      {currentScreen === 'intake' ? (
        <ClientIntakeScreen onProceed={handleProceedToPlanner} />
      ) : (
        <MealPlannerScreen 
          initialAnchors={generatedAnchors}
          clientProfile={clientProfile}
          detoxDaysInitial={detoxDays}
          onBack={handleBackToIntake}
        />
      )}
    </>
  );
}