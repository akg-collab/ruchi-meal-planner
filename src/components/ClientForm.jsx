// src/components/ClientForm.jsx - FIXED v2.0 with Save Progress
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ArrowLeft, ArrowRight, Check, User, Activity, Heart, Briefcase, Utensils, Calendar, Save } from 'lucide-react';

const theme = {
  colors: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    primary: '#10B981',
    primaryHover: '#059669',
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#2A2A2A',
    error: '#EF4444'
  }
};

const styles = {
  card: {
    background: theme.colors.surface,
    borderRadius: '12px',
    padding: '32px',
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
    outline: 'none'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.colors.textSecondary,
    fontWeight: '500'
  },
  checkbox: {
    padding: '10px 14px',
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    color: theme.colors.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
    transition: 'all 0.2s'
  }
};

const ClientForm = ({ client = null, mode = 'create', onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentMode, setCurrentMode] = useState(mode); // Track if we've switched to edit
  const [currentClientId, setCurrentClientId] = useState(client?.id || null); // Track client ID
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    age: '',
    gender: 'Female',
    height_feet: '5',
    height_inches: '0',
    current_weight_kg: '',
    target_weight_kg: '',
    blood_group: 'O+',
    location: 'India',
    primary_health_goal: 'Weight Loss',
    medical_conditions: [],
    medications_diabetes: 'no',
    medications_bp: 'no',
    medications_thyroid: 'no',
    food_allergies: [],
    digestive_issues: [],
    occupation: '',
    work_schedule: 'Regular',
    work_type: 'Desk Job',
    activity_level: 'Lightly Active',
    exercise_timing: 'Morning',
    exercise_duration: '15-30 min',
    sleep_pattern: '6-7h',
    diet_type: 'Vegetarian',
    regional_cuisine: 'North Indian',
    cooking_skills: 'Intermediate',
    time_for_cooking: '30-45 min',
    wake_up_time: '07:00',
    breakfast_time: '08:00',
    lunch_time: '13:00',
    dinner_time: '20:00',
    bedtime_snack_time: '22:00',
    snacking_habits: [],
    water_intake: '6-8 glasses',
    eating_out_frequency: 'Occasionally',
    favorite_foods: [],
    disliked_foods: [],
    health_goals: '',
    previous_diet_experience: 'None',
    hunger_pattern: 'Consistent Throughout',
    energy_levels: [],
    meal_preference: 'Lunch Heavy',
    meal_skipping_tendency: [],
    satiety_duration: '3-4 hours', // FIXED: Changed from time_before_hungry
    stress_eating: 'Sometimes',
    smoking_habit: 'Never',
    alcohol_consumption: 'Never',
    pure_veg_days: [],
    fasting_days: [],
    package_duration: '1',
    package_start_date: '',
    package_end_date: '',
    total_plans_required: '',
    status: 'active',
    additional_notes: '',
    bmr: null,
    tdee: null
  });

  // Load existing client data if editing
  useEffect(() => {
    if (client && mode === 'edit') {
      const heightMatch = client.height?.match(/(\d+)'(\d+)/);
      const feet = heightMatch ? heightMatch[1] : '5';
      const inches = heightMatch ? heightMatch[2] : '0';
      
      setFormData({
        ...formData,
        ...client,
        height_feet: feet,
        height_inches: inches,
        medical_conditions: Array.isArray(client.medical_conditions) ? client.medical_conditions : [],
        food_allergies: Array.isArray(client.food_allergies) ? client.food_allergies : [],
        digestive_issues: Array.isArray(client.digestive_issues) ? client.digestive_issues : [],
        snacking_habits: Array.isArray(client.snacking_habits) ? client.snacking_habits : [],
        favorite_foods: Array.isArray(client.favorite_foods) ? client.favorite_foods : [],
        disliked_foods: Array.isArray(client.disliked_foods) ? client.disliked_foods : [],
        energy_levels: Array.isArray(client.energy_levels) ? client.energy_levels : [],
        meal_skipping_tendency: Array.isArray(client.meal_skipping_tendency) ? client.meal_skipping_tendency : [],
        pure_veg_days: Array.isArray(client.pure_veg_days) ? client.pure_veg_days : [],
        fasting_days: Array.isArray(client.fasting_days) ? client.fasting_days : [],
        wake_up_time: client.wake_up_time?.substring(0, 5) || '07:00',
        breakfast_time: client.breakfast_time?.substring(0, 5) || '08:00',
        lunch_time: client.lunch_time?.substring(0, 5) || '13:00',
        dinner_time: client.dinner_time?.substring(0, 5) || '20:00',
        bedtime_snack_time: client.bedtime_snack_time?.substring(0, 5) || '22:00'
      });
    }
  }, [client, mode]);

  // Auto-calculate package end date and total plans
  useEffect(() => {
    if (formData.package_start_date && formData.package_duration) {
      const startDate = new Date(formData.package_start_date);
      const duration = formData.package_duration;
      
      let days, plans;
      if (duration === 'trial') {
        days = 3;
        plans = 1;
      } else {
        const months = parseInt(duration);
        days = months * 30;
        plans = months * 3;
      }
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
      
      setFormData(prev => ({
        ...prev,
        package_end_date: endDate.toISOString().split('T')[0],
        total_plans_required: plans.toString()
      }));
    }
  }, [formData.package_start_date, formData.package_duration]);

  // Auto-calculate BMR and TDEE
  useEffect(() => {
    if (formData.age && formData.current_weight_kg && formData.height_feet) {
      const weight = parseFloat(formData.current_weight_kg);
      const age = parseInt(formData.age);
      const heightCm = (parseInt(formData.height_feet) * 30.48) + (parseInt(formData.height_inches) * 2.54);
      
      let bmr;
      if (formData.gender === 'Female') {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
      } else {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
      }
      
      const activityMultipliers = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Extremely Active': 1.9
      };
      
      const tdee = bmr * (activityMultipliers[formData.activity_level] || 1.375);
      
      setFormData(prev => ({
        ...prev,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
      }));
    }
  }, [formData.age, formData.current_weight_kg, formData.height_feet, formData.height_inches, formData.gender, formData.activity_level]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
        if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone is required';
        if (!formData.age || formData.age < 1 || formData.age > 120) newErrors.age = 'Valid age is required';
        break;
      
      case 2:
        if (!formData.current_weight_kg || formData.current_weight_kg < 1) newErrors.current_weight_kg = 'Current weight is required';
        break;

      case 3:
        if (!formData.primary_health_goal) newErrors.primary_health_goal = 'Health goal is required';
        break;

      case 6:
        if (!formData.package_duration) newErrors.package_duration = 'Package duration is required';
        if (!formData.package_start_date) newErrors.package_start_date = 'Start date is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // NEW: Save Progress Function (no validation)
  const handleSaveProgress = async () => {
    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        height: `${formData.height_feet}'${formData.height_inches}"`,
        age: parseInt(formData.age) || null,
        current_weight_kg: parseFloat(formData.current_weight_kg) || null,
        target_weight_kg: parseFloat(formData.target_weight_kg) || null,
        package_duration: formData.package_duration === 'trial' ? 0 : parseInt(formData.package_duration),
        total_plans_required: parseInt(formData.total_plans_required) || null,
        status: 'draft', // Save as draft
        medical_conditions: formData.medical_conditions,
        food_allergies: formData.food_allergies,
        digestive_issues: formData.digestive_issues,
        snacking_habits: formData.snacking_habits,
        favorite_foods: formData.favorite_foods,
        disliked_foods: formData.disliked_foods,
        energy_levels: formData.energy_levels,
        meal_skipping_tendency: formData.meal_skipping_tendency,
        pure_veg_days: formData.pure_veg_days,
        fasting_days: formData.fasting_days,
        current_medications: [
          formData.medications_diabetes === 'yes' ? 'Diabetes medication' : null,
          formData.medications_bp === 'yes' ? 'BP medication' : null,
          formData.medications_thyroid === 'yes' ? 'Thyroid medication' : null
        ].filter(Boolean).join(', ') || null
      };

      delete submitData.height_feet;
      delete submitData.height_inches;
      delete submitData.medications_diabetes;
      delete submitData.medications_bp;
      delete submitData.medications_thyroid;

      let result;
      
      if (currentMode === 'edit' && currentClientId) {
        // Update existing
        const { data, error } = await supabase
          .from('clients')
          .update(submitData)
          .eq('id', currentClientId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('clients')
          .insert([submitData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        // Switch to edit mode and store the ID
        setCurrentMode('edit');
        setCurrentClientId(result.id);
      }

      alert('✅ Progress saved! You can continue later.');
      
    } catch (error) {
      console.error('Error saving progress:', error);
      alert(`❌ Error saving progress: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        height: `${formData.height_feet}'${formData.height_inches}"`,
        age: parseInt(formData.age) || null,
        current_weight_kg: parseFloat(formData.current_weight_kg) || null,
        target_weight_kg: parseFloat(formData.target_weight_kg) || null,
        package_duration: formData.package_duration === 'trial' ? 0 : parseInt(formData.package_duration),
        total_plans_required: parseInt(formData.total_plans_required) || null,
        // Keep the status from formData (user's choice: active/paused/inactive/completed)
        medical_conditions: formData.medical_conditions,
        food_allergies: formData.food_allergies,
        digestive_issues: formData.digestive_issues,
        snacking_habits: formData.snacking_habits,
        favorite_foods: formData.favorite_foods,
        disliked_foods: formData.disliked_foods,
        energy_levels: formData.energy_levels,
        meal_skipping_tendency: formData.meal_skipping_tendency,
        pure_veg_days: formData.pure_veg_days,
        fasting_days: formData.fasting_days,
        current_medications: [
          formData.medications_diabetes === 'yes' ? 'Diabetes medication' : null,
          formData.medications_bp === 'yes' ? 'BP medication' : null,
          formData.medications_thyroid === 'yes' ? 'Thyroid medication' : null
        ].filter(Boolean).join(', ') || null
      };

      delete submitData.height_feet;
      delete submitData.height_inches;
      delete submitData.medications_diabetes;
      delete submitData.medications_bp;
      delete submitData.medications_thyroid;

      let result;
      
      if (currentMode === 'edit' && currentClientId) {
        const { data, error } = await supabase
          .from('clients')
          .update(submitData)
          .eq('id', currentClientId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('clients')
          .insert([submitData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      onSuccess(result);
      
    } catch (error) {
      console.error('Error saving client:', error);
      alert(`Error saving client: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const stepIcons = [
    { icon: User, label: 'Basic Info' },
    { icon: Activity, label: 'Physical' },
    { icon: Heart, label: 'Health' },
    { icon: Briefcase, label: 'Lifestyle' },
    { icon: Utensils, label: 'Diet' },
    { icon: Calendar, label: 'Package' }
  ];

  const renderStep1 = () => (
    <div>
      <h3 style={{ color: theme.colors.textPrimary, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        Basic Information
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Enter full name"
            style={{ ...styles.input, borderColor: errors.full_name ? theme.colors.error : theme.colors.border }}
          />
          {errors.full_name && <p style={{ color: theme.colors.error, fontSize: '13px', marginTop: '4px' }}>{errors.full_name}</p>}
        </div>

        <div>
          <label style={styles.label}>Phone Number *</label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            placeholder="10-digit mobile number"
            style={{ ...styles.input, borderColor: errors.phone_number ? theme.colors.error : theme.colors.border }}
          />
          {errors.phone_number && <p style={{ color: theme.colors.error, fontSize: '13px', marginTop: '4px' }}>{errors.phone_number}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Age in years"
              min="1"
              max="120"
              style={{ ...styles.input, borderColor: errors.age ? theme.colors.error : theme.colors.border }}
            />
            {errors.age && <p style={{ color: theme.colors.error, fontSize: '13px', marginTop: '4px' }}>{errors.age}</p>}
          </div>

          <div>
            <label style={styles.label}>Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              style={styles.input}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label style={styles.label}>Location</label>
          <select
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            style={styles.input}
          >
            <option value="India">India</option>
            <option value="Outside India">Outside India</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 style={{ color: theme.colors.textPrimary, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        Physical Profile
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={styles.label}>Height *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select
              value={formData.height_feet}
              onChange={(e) => handleInputChange('height_feet', e.target.value)}
              style={styles.input}
            >
              <option value="4">4 feet</option>
              <option value="5">5 feet</option>
              <option value="6">6 feet</option>
              <option value="7">7 feet</option>
            </select>
            <select
              value={formData.height_inches}
              onChange={(e) => handleInputChange('height_inches', e.target.value)}
              style={styles.input}
            >
              {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                <option key={i} value={i}>{i} inches</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Current Weight (kg) *</label>
            <input
              type="number"
              value={formData.current_weight_kg}
              onChange={(e) => handleInputChange('current_weight_kg', e.target.value)}
              placeholder="70"
              step="0.1"
              style={{ ...styles.input, borderColor: errors.current_weight_kg ? theme.colors.error : theme.colors.border }}
            />
            {errors.current_weight_kg && <p style={{ color: theme.colors.error, fontSize: '13px', marginTop: '4px' }}>{errors.current_weight_kg}</p>}
          </div>

          <div>
            <label style={styles.label}>Target Weight (kg)</label>
            <input
              type="number"
              value={formData.target_weight_kg}
              onChange={(e) => handleInputChange('target_weight_kg', e.target.value)}
              placeholder="65"
              step="0.1"
              style={styles.input}
            />
          </div>
        </div>

        <div>
          <label style={styles.label}>Blood Group</label>
          <select
            value={formData.blood_group}
            onChange={(e) => handleInputChange('blood_group', e.target.value)}
            style={styles.input}
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {formData.bmr && formData.tdee && (
          <div style={{ background: theme.colors.background, padding: '16px', borderRadius: '8px', border: `1px solid ${theme.colors.primary}` }}>
            <h4 style={{ color: theme.colors.primary, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
              📊 Calculated Metrics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>
                <span style={{ color: theme.colors.textSecondary }}>BMR:</span>
                <strong style={{ color: theme.colors.textPrimary, marginLeft: '8px' }}>{formData.bmr} kcal/day</strong>
              </div>
              <div>
                <span style={{ color: theme.colors.textSecondary }}>TDEE:</span>
                <strong style={{ color: theme.colors.textPrimary, marginLeft: '8px' }}>{formData.tdee} kcal/day</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 style={{ color: theme.colors.textPrimary, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        Health & Medical Information
      </h3>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <label style={styles.label}>Primary Health Goal *</label>
          <select
            value={formData.primary_health_goal}
            onChange={(e) => handleInputChange('primary_health_goal', e.target.value)}
            style={styles.input}
          >
            <option value="Weight Loss">Weight Loss</option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Muscle Building">Muscle Building</option>
            <option value="General Wellness">General Wellness</option>
            <option value="Medical Management">Medical Management</option>
            <option value="Disease Management">Disease Management</option>
            <option value="Pregnancy/Postpartum">Pregnancy/Postpartum</option>
            <option value="Sports Nutrition">Sports Nutrition</option>
            <option value="Senior Health">Senior Health</option>
            <option value="Pediatric Nutrition">Pediatric Nutrition</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Medical Conditions</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '8px' }}>
            {['None', 'High Blood Pressure', 'Diabetes', 'Thyroid', 'PCOS', 'PCOD', 'Insulin Resistant', 
              'Heart Disease', 'Kidney Issues', 'Liver Issues', 'Arthritis/Joint Pain', 'Asthma', 
              'IBS/IBD', 'Gastric Issues', 'Anemia', 'Menopause', 'Perimenopause', 
              'Pregnant/Postpartum (not a medical condition)'].map(condition => (
              <label key={condition} style={{
                ...styles.checkbox,
                background: formData.medical_conditions.includes(condition) ? theme.colors.primary + '20' : theme.colors.background,
                borderColor: formData.medical_conditions.includes(condition) ? theme.colors.primary : theme.colors.border
              }}>
                <input
                  type="checkbox"
                  checked={formData.medical_conditions.includes(condition)}
                  onChange={() => handleCheckboxChange('medical_conditions', condition)}
                  style={{ width: '16px', height: '16px' }}
                />
                {condition}
              </label>
            ))}
          </div>
        </div>

        {/* FIXED: Separate medication questions for each condition */}
        {(formData.medical_conditions.includes('Diabetes') || 
          formData.medical_conditions.includes('High Blood Pressure') || 
          formData.medical_conditions.includes('Thyroid')) && (
          <div style={{ background: theme.colors.background, padding: '16px', borderRadius: '8px', border: `1px solid ${theme.colors.border}` }}>
            <h4 style={{ color: theme.colors.textPrimary, marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
              Medications
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {formData.medical_conditions.includes('Diabetes') && (
                <div>
                  <label style={{ ...styles.label, marginBottom: '8px' }}>Taking diabetes medication?</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ ...styles.checkbox, flex: 1, background: formData.medications_diabetes === 'yes' ? theme.colors.primary + '20' : theme.colors.background }}>
                      <input type="radio" name="med_diabetes" checked={formData.medications_diabetes === 'yes'} onChange={() => handleInputChange('medications_diabetes', 'yes')} />
                      Yes
                    </label>
                    <label style={{ ...styles.checkbox, flex: 1, background: formData.medications_diabetes === 'no' ? theme.colors.primary + '20' : theme.colors.background }}>
                      <input type="radio" name="med_diabetes" checked={formData.medications_diabetes === 'no'} onChange={() => handleInputChange('medications_diabetes', 'no')} />
                      No
                    </label>
                  </div>
                </div>
              )}
              
              {formData.medical_conditions.includes('High Blood Pressure') && (
                <div>
                  <label style={{ ...styles.label, marginBottom: '8px' }}>Taking BP medication?</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ ...styles.checkbox, flex: 1, background: formData.medications_bp === 'yes' ? theme.colors.primary + '20' : theme.colors.background }}>
                      <input type="radio" name="med_bp" checked={formData.medications_bp === 'yes'} onChange={() => handleInputChange('medications_bp', 'yes')} />
                      Yes
                    </label>
                    <label style={{ ...styles.checkbox, flex: 1, background: formData.medications_bp === 'no' ? theme.colors.primary + '20' : theme.colors.background }}>
                      <input type="radio" name="med_bp" checked={formData.medications_bp === 'no'} onChange={() => handleInputChange('medications_bp', 'no')} />
                      No
                    </label>
                  </div>
                </div>
              )}
              
              {formData.medical_conditions.includes('Thyroid') && (
                <div>
                  <label style={{ ...styles.label, marginBottom: '8px' }}>Taking thyroid medication?</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ ...styles.checkbox, flex: 1, background: formData.medications_thyroid === 'yes' ? theme.colors.primary + '20' : theme.colors.background }}>
                      <input type="radio" name="med_thyroid" checked={formData.medications_thyroid === 'yes'} onChange={() => handleInputChange('medications_thyroid', 'yes')} />
                      Yes
                    </label>
                    <label style={{ ...styles.checkbox, flex: 1, background: formData.medications_thyroid === 'no' ? theme.colors.primary + '20' : theme.colors.background }}>
                      <input type="radio" name="med_thyroid" checked={formData.medications_thyroid === 'no'} onChange={() => handleInputChange('medications_thyroid', 'no')} />
                      No
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label style={styles.label}>Food Allergies</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
            {['None', 'Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Eggs', 'Tree Nuts'].map(allergy => (
              <label key={allergy} style={{
                ...styles.checkbox,
                background: formData.food_allergies.includes(allergy) ? theme.colors.primary + '20' : theme.colors.background,
                borderColor: formData.food_allergies.includes(allergy) ? theme.colors.primary : theme.colors.border
              }}>
                <input
                  type="checkbox"
                  checked={formData.food_allergies.includes(allergy)}
                  onChange={() => handleCheckboxChange('food_allergies', allergy)}
                  style={{ width: '16px', height: '16px' }}
                />
                {allergy}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Digestive Issues</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '8px' }}>
            {['None', 'Bloating', 'Gas', 'Constipation', 'Diarrhea', 'Acid Reflux', 'IBS'].map(issue => (
              <label key={issue} style={{
                ...styles.checkbox,
                background: formData.digestive_issues.includes(issue) ? theme.colors.primary + '20' : theme.colors.background,
                borderColor: formData.digestive_issues.includes(issue) ? theme.colors.primary : theme.colors.border
              }}>
                <input
                  type="checkbox"
                  checked={formData.digestive_issues.includes(issue)}
                  onChange={() => handleCheckboxChange('digestive_issues', issue)}
                  style={{ width: '16px', height: '16px' }}
                />
                {issue}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h3 style={{ color: theme.colors.textPrimary, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        Lifestyle & Activity
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={styles.label}>Occupation</label>
          <select
            value={formData.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            style={styles.input}
          >
            <option value="">Select occupation</option>
            <option value="Teacher">Teacher</option>
            <option value="Engineer">Engineer</option>
            <option value="Doctor">Doctor</option>
            <option value="Business Owner">Business Owner</option>
            <option value="Homemaker">Homemaker</option>
            <option value="Student">Student</option>
            <option value="Retired">Retired</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Work Schedule *</label>
            <select
              value={formData.work_schedule}
              onChange={(e) => handleInputChange('work_schedule', e.target.value)}
              style={styles.input}
            >
              <option value="Regular">Regular</option>
              <option value="Night Shift">Night Shift</option>
              <option value="Rotating Shifts">Rotating Shifts</option>
              <option value="Flexible Hours">Flexible Hours</option>
              <option value="No Fixed Schedule">No Fixed Schedule</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Work Type</label>
            <select
              value={formData.work_type}
              onChange={(e) => handleInputChange('work_type', e.target.value)}
              style={styles.input}
            >
              <option value="Desk Job">Desk Job</option>
              <option value="Standing Job">Standing Job</option>
              <option value="Physical/Active Job">Physical/Active Job</option>
              <option value="Mixed">Mixed</option>
              <option value="No Job">No Job</option>
            </select>
          </div>
        </div>

        <div>
          <label style={styles.label}>Activity Level *</label>
          <select
            value={formData.activity_level}
            onChange={(e) => handleInputChange('activity_level', e.target.value)}
            style={styles.input}
          >
            <option value="Sedentary">Sedentary (little or no exercise)</option>
            <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
            <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
            <option value="Very Active">Very Active (6-7 days/week)</option>
            <option value="Extremely Active">Extremely Active (physical job + exercise)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Exercise Timing</label>
            <select
              value={formData.exercise_timing}
              onChange={(e) => handleInputChange('exercise_timing', e.target.value)}
              style={styles.input}
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
              <option value="No Fixed Time">No Fixed Time</option>
              <option value="Don't Exercise">Don't Exercise</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Exercise Duration</label>
            <select
              value={formData.exercise_duration}
              onChange={(e) => handleInputChange('exercise_duration', e.target.value)}
              style={styles.input}
              disabled={formData.exercise_timing === "Don't Exercise"}
            >
              <option value="None">None</option>
              <option value="Less than 15 min">Less than 15 min</option>
              <option value="15-30 min">15-30 min</option>
              <option value="30-45 min">30-45 min</option>
              <option value="45-60 min">45-60 min</option>
              <option value="1+ hour">1+ hour</option>
            </select>
          </div>
        </div>

        <div>
          <label style={styles.label}>Sleep Pattern *</label>
          <select
            value={formData.sleep_pattern}
            onChange={(e) => handleInputChange('sleep_pattern', e.target.value)}
            style={styles.input}
          >
            <option value="Regular 7-8h">Regular 7-8h</option>
            <option value="Less than 6h">Less than 6h</option>
            <option value="6-7h">6-7h</option>
            <option value="More than 9h">More than 9h</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div>
      <h3 style={{ color: theme.colors.textPrimary, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        Diet Preferences & Meal Timings
      </h3>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Diet Type *</label>
            <select
              value={formData.diet_type}
              onChange={(e) => handleInputChange('diet_type', e.target.value)}
              style={styles.input}
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
              <option value="Fasting Compatible">Fasting Compatible</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Regional Cuisine *</label>
            <select
              value={formData.regional_cuisine}
              onChange={(e) => handleInputChange('regional_cuisine', e.target.value)}
              style={styles.input}
            >
              <option value="North Indian">North Indian</option>
              <option value="South Indian">South Indian</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Maharashtrian">Maharashtrian</option>
              <option value="Bengali">Bengali</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Cooking Skills *</label>
            <select
              value={formData.cooking_skills}
              onChange={(e) => handleInputChange('cooking_skills', e.target.value)}
              style={styles.input}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="No Cooking">No Cooking</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Time for Cooking</label>
            <select
              value={formData.time_for_cooking}
              onChange={(e) => handleInputChange('time_for_cooking', e.target.value)}
              style={styles.input}
            >
              <option value="Less than 15 min">Less than 15 min</option>
              <option value="15-30 min">15-30 min</option>
              <option value="30-45 min">30-45 min</option>
              <option value="45-60 min">45-60 min</option>
              <option value="1+ hour">1+ hour</option>
              <option value="Don't Cook">Don't Cook</option>
            </select>
          </div>
        </div>

        <div>
          <label style={styles.label}>Favorite Foods</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
            {['Roti/Chapati', 'Rice/Biryani', 'Dal', 'Paneer', 'Curd/Yogurt', 'Chicken', 'Fish', 'Eggs', 
              'Salads', 'Fruits', 'Dry Fruits/Nuts', 'South Indian', 'Fast Food'].map(food => (
              <label key={food} style={{
                ...styles.checkbox,
                background: formData.favorite_foods.includes(food) ? theme.colors.primary + '20' : theme.colors.background,
                borderColor: formData.favorite_foods.includes(food) ? theme.colors.primary : theme.colors.border
              }}>
                <input
                  type="checkbox"
                  checked={formData.favorite_foods.includes(food)}
                  onChange={() => handleCheckboxChange('favorite_foods', food)}
                  style={{ width: '16px', height: '16px' }}
                />
                {food}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Disliked Foods</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '8px' }}>
            {['Green Vegetables', 'Fish/Seafood', 'Eggs', 'Mushrooms', 'Spicy Food', 
              'Oily/Fried Food', 'Bland Food', 'Boiled Food'].map(food => (
              <label key={food} style={{
                ...styles.checkbox,
                background: formData.disliked_foods.includes(food) ? theme.colors.primary + '20' : theme.colors.background,
                borderColor: formData.disliked_foods.includes(food) ? theme.colors.primary : theme.colors.border
              }}>
                <input
                  type="checkbox"
                  checked={formData.disliked_foods.includes(food)}
                  onChange={() => handleCheckboxChange('disliked_foods', food)}
                  style={{ width: '16px', height: '16px' }}
                />
                {food}
              </label>
            ))}
          </div>
        </div>

        <div style={{ background: theme.colors.background, padding: '16px', borderRadius: '8px', border: `1px solid ${theme.colors.border}` }}>
          <h4 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '16px' }}>Meal Timings</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ ...styles.label, fontSize: '13px' }}>Wake Up</label>
              <input
                type="time"
                value={formData.wake_up_time}
                onChange={(e) => handleInputChange('wake_up_time', e.target.value)}
                style={{ ...styles.input, padding: '10px 12px' }}
              />
            </div>

            <div>
              <label style={{ ...styles.label, fontSize: '13px' }}>Breakfast</label>
              <input
                type="time"
                value={formData.breakfast_time}
                onChange={(e) => handleInputChange('breakfast_time', e.target.value)}
                style={{ ...styles.input, padding: '10px 12px' }}
              />
            </div>

            <div>
              <label style={{ ...styles.label, fontSize: '13px' }}>Lunch</label>
              <input
                type="time"
                value={formData.lunch_time}
                onChange={(e) => handleInputChange('lunch_time', e.target.value)}
                style={{ ...styles.input, padding: '10px 12px' }}
              />
            </div>

            <div>
              <label style={{ ...styles.label, fontSize: '13px' }}>Dinner</label>
              <input
                type="time"
                value={formData.dinner_time}
                onChange={(e) => handleInputChange('dinner_time', e.target.value)}
                style={{ ...styles.input, padding: '10px 12px' }}
              />
            </div>

            <div>
              <label style={{ ...styles.label, fontSize: '13px' }}>Bedtime Snack</label>
              <input
                type="time"
                value={formData.bedtime_snack_time}
                onChange={(e) => handleInputChange('bedtime_snack_time', e.target.value)}
                style={{ ...styles.input, padding: '10px 12px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div>
      <h3 style={{ color: theme.colors.textPrimary, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
        Habits & Package Details
      </h3>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <label style={styles.label}>Snacking Habits</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '8px' }}>
            {['No snacking', 'Healthy snacker (fruits, nuts)', 'Tea/Coffee only', 'Sweet tooth', 
              'Savory lover', 'Whatever available', 'Time-based snacker', 'Stress snacker'].map(habit => (
              <label key={habit} style={{
                ...styles.checkbox,
                background: formData.snacking_habits.includes(habit) ? theme.colors.primary + '20' : theme.colors.background,
                borderColor: formData.snacking_habits.includes(habit) ? theme.colors.primary : theme.colors.border
              }}>
                <input
                  type="checkbox"
                  checked={formData.snacking_habits.includes(habit)}
                  onChange={() => handleCheckboxChange('snacking_habits', habit)}
                  style={{ width: '16px', height: '16px' }}
                />
                {habit}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Water Intake</label>
            <select
              value={formData.water_intake}
              onChange={(e) => handleInputChange('water_intake', e.target.value)}
              style={styles.input}
            >
              <option value="Less than 4 glasses">Less than 4 glasses</option>
              <option value="4-6 glasses">4-6 glasses</option>
              <option value="6-8 glasses">6-8 glasses</option>
              <option value="8-10 glasses">8-10 glasses</option>
              <option value="10+ glasses">10+ glasses</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Eating Out</label>
            <select
              value={formData.eating_out_frequency}
              onChange={(e) => handleInputChange('eating_out_frequency', e.target.value)}
              style={styles.input}
            >
              <option value="Rarely/Never">Rarely/Never</option>
              <option value="Once a week">Once a week</option>
              <option value="2-3 times a week">2-3 times/week</option>
              <option value="Daily">Daily</option>
              <option value="Multiple times daily">Multiple times daily</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Meal Preference</label>
            <select
              value={formData.meal_preference}
              onChange={(e) => handleInputChange('meal_preference', e.target.value)}
              style={styles.input}
            >
              <option value="Breakfast Heavy">Breakfast Heavy</option>
              <option value="Lunch Heavy">Lunch Heavy</option>
              <option value="Dinner Heavy">Dinner Heavy</option>
              <option value="Evening Heavy">Evening Heavy</option>
              <option value="Consistent">Consistent</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Hunger Pattern</label>
            <select
              value={formData.hunger_pattern}
              onChange={(e) => handleInputChange('hunger_pattern', e.target.value)}
              style={styles.input}
            >
              <option value="Morning Heavy">Morning Heavy</option>
              <option value="Evening Heavy">Evening Heavy</option>
              <option value="Night Heavy">Night Heavy</option>
              <option value="Consistent Throughout">Consistent Throughout</option>
              <option value="Irregular">Irregular</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Time Before Hungry Again</label>
            <select
              value={formData.satiety_duration}
              onChange={(e) => handleInputChange('satiety_duration', e.target.value)}
              style={styles.input}
            >
              <option value="1-2 hours">1-2 hours</option>
              <option value="2-3 hours">2-3 hours</option>
              <option value="3-4 hours">3-4 hours</option>
              <option value="4-5 hours">4-5 hours</option>
              <option value="5+ hours">5+ hours</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Stress Eating</label>
            <select
              value={formData.stress_eating}
              onChange={(e) => handleInputChange('stress_eating', e.target.value)}
              style={styles.input}
            >
              <option value="Never">Never</option>
              <option value="Rarely">Rarely</option>
              <option value="Sometimes">Sometimes</option>
              <option value="Often">Often</option>
              <option value="Always">Always</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Smoking</label>
            <select
              value={formData.smoking_habit}
              onChange={(e) => handleInputChange('smoking_habit', e.target.value)}
              style={styles.input}
            >
              <option value="Never">Never</option>
              <option value="Quit">Quit</option>
              <option value="Occasionally">Occasionally</option>
              <option value="Regularly">Regularly</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Alcohol</label>
            <select
              value={formData.alcohol_consumption}
              onChange={(e) => handleInputChange('alcohol_consumption', e.target.value)}
              style={styles.input}
            >
              <option value="Never">Never</option>
              <option value="Rarely">Rarely</option>
              <option value="Weekly">Weekly</option>
              <option value="2-3 times/week">2-3 times/week</option>
              <option value="Daily">Daily</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Previous Diet Experience</label>
            <select
              value={formData.previous_diet_experience}
              onChange={(e) => handleInputChange('previous_diet_experience', e.target.value)}
              style={styles.input}
            >
              <option value="None">None</option>
              <option value="Tried 1-2 diets">Tried 1-2 diets</option>
              <option value="Tried multiple">Tried multiple</option>
              <option value="Currently on diet">Currently on diet</option>
            </select>
          </div>
        </div>

        <div style={{ background: theme.colors.background, padding: '20px', borderRadius: '8px', border: `2px solid ${theme.colors.primary}` }}>
          <h4 style={{ color: theme.colors.primary, marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Package Information</h4>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div>
                <label style={{ ...styles.label, fontSize: '13px' }}>Duration *</label>
                <select
                  value={formData.package_duration}
                  onChange={(e) => handleInputChange('package_duration', e.target.value)}
                  style={styles.input}
                >
                  <option value="trial">Trial (3 days)</option>
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                </select>
              </div>

              <div>
                <label style={{ ...styles.label, fontSize: '13px' }}>Start Date *</label>
                <input
                  type="date"
                  value={formData.package_start_date}
                  onChange={(e) => handleInputChange('package_start_date', e.target.value)}
                  style={{ ...styles.input, borderColor: errors.package_start_date ? theme.colors.error : theme.colors.border }}
                />
                {errors.package_start_date && <p style={{ color: theme.colors.error, fontSize: '12px', marginTop: '4px' }}>{errors.package_start_date}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ ...styles.label, fontSize: '13px' }}>End Date (auto-calculated)</label>
                <input
                  type="date"
                  value={formData.package_end_date}
                  readOnly
                  style={{ ...styles.input, background: theme.colors.surface, cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label style={{ ...styles.label, fontSize: '13px' }}>Total Plans (auto-calculated)</label>
                <input
                  type="text"
                  value={formData.total_plans_required || ''}
                  readOnly
                  style={{ ...styles.input, background: theme.colors.surface, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div>
              <label style={{ ...styles.label, fontSize: '13px' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                style={styles.input}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label style={styles.label}>Health Goals & Additional Notes</label>
          <textarea
            value={formData.additional_notes}
            onChange={(e) => handleInputChange('additional_notes', e.target.value)}
            placeholder="Any specific health goals, dietary restrictions, or notes..."
            rows="4"
            style={{ ...styles.input, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #a78bfa 50%, #ec4899 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {currentMode === 'edit' ? 'Edit Client' : 'New Client'}
              </h1>
              <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: '14px' }}>
                {currentMode === 'edit' ? `Editing: ${formData.full_name || client?.full_name}` : 'Complete client intake form'}
              </p>
            </div>
            <button 
              onClick={onCancel}
              style={{ ...styles.button, background: 'transparent', border: `2px solid ${theme.colors.border}`, color: theme.colors.textSecondary }}
            >
              <ArrowLeft size={18} />
              Cancel
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            {stepIcons.map((step, index) => {
              const StepIcon = step.icon;
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <div key={stepNumber} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    margin: '0 auto 8px', 
                    borderRadius: '50%', 
                    background: isCompleted ? theme.colors.primary : isCurrent ? theme.colors.primary + '30' : theme.colors.background,
                    border: `2px solid ${isCompleted || isCurrent ? theme.colors.primary : theme.colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}>
                    {isCompleted ? (
                      <Check size={24} style={{ color: '#FFFFFF' }} />
                    ) : (
                      <StepIcon size={24} style={{ color: isCurrent ? theme.colors.primary : theme.colors.textSecondary }} />
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: isCurrent ? theme.colors.primary : theme.colors.textSecondary, fontWeight: isCurrent ? '600' : '400' }}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ height: '6px', background: theme.colors.background, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${(currentStep / 6) * 100}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, ${theme.colors.primary} 0%, #a78bfa 100%)`,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Form Content */}
        <div style={styles.card}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}

          {/* Navigation Buttons - UPDATED with Save Progress */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${theme.colors.border}` }}>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                style={{ ...styles.button, flex: 1, background: theme.colors.background, border: `2px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
              >
                <ArrowLeft size={18} />
                Previous
              </button>
            )}
            
            {/* NEW: Save Progress Button */}
            <button
              onClick={handleSaveProgress}
              disabled={loading}
              style={{ 
                ...styles.button, 
                flex: 1,
                background: '#FFA500',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Progress'}
            </button>
            
            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                style={{ ...styles.button, flex: 1 }}
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ 
                  ...styles.button, 
                  flex: 1, 
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : currentMode === 'edit' ? 'Update Client' : 'Create Client'}
                <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;