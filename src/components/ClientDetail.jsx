// src/components/ClientDetail.jsx - Complete Client Detail View
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  ArrowLeft, Edit, Trash2, ChefHat, User, Heart, Briefcase, 
  Utensils, Calendar, Activity, Clock, AlertCircle, CheckCircle 
} from 'lucide-react';

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
    warning: '#FFA500',
    info: '#3B82F6'
  }
};

const styles = {
  card: {
    background: theme.colors.surface,
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${theme.colors.border}`
  },
  button: {
    padding: '12px 20px',
    fontSize: '14px',
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
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${theme.colors.border}`
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: '14px'
  },
  value: {
    color: theme.colors.textPrimary,
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'right'
  }
};

const ClientDetail = ({ clientId, onBack, onEdit }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      
      // Parse array fields that might be stored as strings or JSON strings
      const parseArrayField = (field) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        
        // If it's a string, try to parse as JSON first
        if (typeof field === 'string') {
          try {
            const parsed = JSON.parse(field);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {
            // If JSON parse fails, try comma-separated
            return field.split(',').map(item => item.trim()).filter(Boolean);
          }
        }
        return [];
      };

      // Parse all array fields
      const parsedData = {
        ...data,
        medical_conditions: parseArrayField(data.medical_conditions),
        food_allergies: parseArrayField(data.food_allergies),
        digestive_issues: parseArrayField(data.digestive_issues),
        snacking_habits: parseArrayField(data.snacking_habits),
        favorite_foods: parseArrayField(data.favorite_foods),
        disliked_foods: parseArrayField(data.disliked_foods),
        energy_levels: parseArrayField(data.energy_levels),
        meal_skipping_tendency: parseArrayField(data.meal_skipping_tendency),
        pure_veg_days: parseArrayField(data.pure_veg_days),
        fasting_days: parseArrayField(data.fasting_days)
      };
      
      setClient(parsedData);
    } catch (error) {
      console.error('Error fetching client:', error);
      alert('Error loading client details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      alert('Client deleted successfully');
      onBack();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: theme.colors.textPrimary, fontSize: '18px' }}>Loading client details...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ minHeight: '100vh', background: theme.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: theme.colors.textPrimary, fontSize: '18px' }}>Client not found</div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: theme.colors.primary + '20', color: theme.colors.primary, icon: CheckCircle },
      draft: { bg: theme.colors.warning + '20', color: theme.colors.warning, icon: AlertCircle },
      paused: { bg: theme.colors.info + '20', color: theme.colors.info, icon: Clock },
      inactive: { bg: theme.colors.border, color: theme.colors.textSecondary, icon: AlertCircle },
      completed: { bg: theme.colors.primary + '20', color: theme.colors.primary, icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span style={{ ...styles.badge, background: config.bg, color: config.color }}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'lifestyle', label: 'Lifestyle', icon: Briefcase },
    { id: 'diet', label: 'Diet & Meals', icon: Utensils },
    { id: 'package', label: 'Package', icon: Calendar }
  ];

  const InfoRow = ({ label, value }) => (
    <div style={styles.infoRow}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value || 'Not specified'}</span>
    </div>
  );

  const ArrayDisplay = ({ items, asText = false }) => {
    // Safely handle different data types including JSON strings
    let itemsArray = [];
    
    if (!items) {
      itemsArray = [];
    } else if (Array.isArray(items)) {
      itemsArray = items;
    } else if (typeof items === 'string') {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(items);
        itemsArray = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // If JSON parse fails, try comma-separated
        itemsArray = items.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    // If asText is true, display as comma-separated text instead of badges
    if (asText) {
      return (
        <p style={{ color: theme.colors.textPrimary, fontSize: '14px', margin: 0 }}>
          {itemsArray.length > 0 ? itemsArray.join(', ') : 'None'}
        </p>
      );
    }
    
    // Otherwise display as badges
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {itemsArray.length > 0 ? itemsArray.map((item, idx) => (
          <span key={idx} style={{
            padding: '8px 14px',
            background: theme.colors.primary + '15',
            border: `1px solid ${theme.colors.primary}40`,
            borderRadius: '8px',
            fontSize: '13px',
            color: theme.colors.textPrimary,
            fontWeight: '500'
          }}>
            {item}
          </span>
        )) : <span style={{ color: theme.colors.textSecondary, fontSize: '13px' }}>None</span>}
      </div>
    );
  };

  const renderOverview = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Profile Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ ...styles.card, padding: '20px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Current Weight</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.primary }}>{client.current_weight_kg} kg</div>
        </div>
        <div style={{ ...styles.card, padding: '20px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Target Weight</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.textPrimary }}>{client.target_weight_kg || '--'} kg</div>
        </div>
        <div style={{ ...styles.card, padding: '20px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Goal</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textPrimary, marginTop: '8px' }}>{client.primary_health_goal}</div>
        </div>
      </div>

      {/* Basic Info */}
      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Basic Information
        </h3>
        <InfoRow label="Phone Number" value={client.phone_number} />
        <InfoRow label="Age" value={client.age ? `${client.age} years` : null} />
        <InfoRow label="Gender" value={client.gender} />
        <InfoRow label="Height" value={client.height} />
        <InfoRow label="Blood Group" value={client.blood_group} />
        <InfoRow label="Location" value={client.location} />
      </div>

      {/* Calculated Metrics */}
      {(client.bmr || client.tdee) && (
        <div style={styles.card}>
          <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            Metabolic Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '4px' }}>BMR (Basal Metabolic Rate)</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.primary }}>{client.bmr} kcal/day</div>
            </div>
            <div>
              <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '4px' }}>TDEE (Total Daily Energy)</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.primary }}>{client.tdee} kcal/day</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHealth = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Medical Conditions
        </h3>
        <ArrayDisplay items={client.medical_conditions} asText={true} />
      </div>

      {client.current_medications && (
        <div style={styles.card}>
          <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            Current Medications
          </h3>
          <p style={{ color: theme.colors.textPrimary, fontSize: '14px' }}>{client.current_medications}</p>
        </div>
      )}

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Food Allergies
        </h3>
        <ArrayDisplay items={client.food_allergies} asText={true} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Digestive Issues
        </h3>
        <ArrayDisplay items={client.digestive_issues} asText={true} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Health Goals & Notes
        </h3>
        <p style={{ color: theme.colors.textPrimary, fontSize: '14px', lineHeight: '1.6' }}>
          {client.health_goals || client.additional_notes || 'No additional notes provided'}
        </p>
      </div>
    </div>
  );

  const renderLifestyle = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Work & Occupation
        </h3>
        <InfoRow label="Occupation" value={client.occupation} />
        <InfoRow label="Work Schedule" value={client.work_schedule} />
        <InfoRow label="Work Type" value={client.work_type} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Activity & Exercise
        </h3>
        <InfoRow label="Activity Level" value={client.activity_level} />
        <InfoRow label="Exercise Timing" value={client.exercise_timing} />
        <InfoRow label="Exercise Duration" value={client.exercise_duration} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Sleep & Habits
        </h3>
        <InfoRow label="Sleep Pattern" value={client.sleep_pattern} />
        <InfoRow label="Smoking Habit" value={client.smoking_habit} />
        <InfoRow label="Alcohol Consumption" value={client.alcohol_consumption} />
        <InfoRow label="Stress Eating" value={client.stress_eating} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Energy & Hunger Patterns
        </h3>
        <InfoRow label="Hunger Pattern" value={client.hunger_pattern} />
        <InfoRow label="Time Before Hungry Again" value={client.satiety_duration} />
        <InfoRow label="Meal Preference" value={client.meal_preference} />
        <div style={{ marginTop: '16px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>Energy Levels</div>
          <ArrayDisplay items={client.energy_levels} asText={true} />
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>Meal Skipping Tendency</div>
          <ArrayDisplay items={client.meal_skipping_tendency} asText={true} />
        </div>
      </div>
    </div>
  );

  const renderDiet = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Diet Preferences
        </h3>
        <InfoRow label="Diet Type" value={client.diet_type} />
        <InfoRow label="Regional Cuisine" value={client.regional_cuisine} />
        <InfoRow label="Cooking Skills" value={client.cooking_skills} />
        <InfoRow label="Time for Cooking" value={client.time_for_cooking} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Favorite Foods
        </h3>
        <ArrayDisplay items={client.favorite_foods} asText={true} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Disliked Foods
        </h3>
        <ArrayDisplay items={client.disliked_foods} asText={true} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Meal Timings
        </h3>
        <InfoRow label="Wake Up Time" value={client.wake_up_time} />
        <InfoRow label="Breakfast Time" value={client.breakfast_time} />
        <InfoRow label="Lunch Time" value={client.lunch_time} />
        <InfoRow label="Dinner Time" value={client.dinner_time} />
        <InfoRow label="Bedtime Snack" value={client.bedtime_snack_time} />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Eating Habits
        </h3>
        <InfoRow label="Water Intake" value={client.water_intake} />
        <InfoRow label="Eating Out Frequency" value={client.eating_out_frequency} />
        <InfoRow label="Previous Diet Experience" value={client.previous_diet_experience} />
        <div style={{ marginTop: '16px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>Snacking Habits</div>
          <ArrayDisplay items={client.snacking_habits} asText={true} />
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Special Days
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>Pure Veg Days</div>
          <ArrayDisplay items={client.pure_veg_days} asText={true} />
        </div>
        <div>
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '8px' }}>Fasting Days</div>
          <ArrayDisplay items={client.fasting_days} asText={true} />
        </div>
      </div>
    </div>
  );

  const renderPackage = () => {
    const startDate = client.package_start_date ? new Date(client.package_start_date) : null;
    const endDate = client.package_end_date ? new Date(client.package_end_date) : null;
    const today = new Date();
    const daysRemaining = endDate ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : null;

    return (
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ ...styles.card, padding: '20px' }}>
            <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Package Duration</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.primary }}>
              {client.package_duration === 0 ? 'Trial' : `${client.package_duration} Month${client.package_duration > 1 ? 's' : ''}`}
            </div>
          </div>
          <div style={{ ...styles.card, padding: '20px' }}>
            <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Total Plans</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.primary }}>{client.total_plans_required || 0}</div>
          </div>
          <div style={{ ...styles.card, padding: '20px' }}>
            <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Days Remaining</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: daysRemaining > 0 ? theme.colors.primary : theme.colors.error }}>
              {daysRemaining !== null ? daysRemaining : '--'}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            Package Details
          </h3>
          <InfoRow label="Start Date" value={startDate ? startDate.toLocaleDateString() : 'Not set'} />
          <InfoRow label="End Date" value={endDate ? endDate.toLocaleDateString() : 'Not set'} />
          <InfoRow label="Status" value={<div style={{ textAlign: 'right' }}>{getStatusBadge(client.status)}</div>} />
        </div>

        {client.break_start_date && (
          <div style={styles.card}>
            <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Break Information
            </h3>
            <InfoRow label="Break Start Date" value={new Date(client.break_start_date).toLocaleDateString()} />
            <InfoRow label="Break Days Used This Month" value={client.break_days_used_this_month || 0} />
          </div>
        )}

        {client.additional_notes && (
          <div style={styles.card}>
            <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Additional Notes
            </h3>
            <p style={{ color: theme.colors.textPrimary, fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {client.additional_notes}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Draft Banner */}
        {client.status === 'draft' && (
          <div style={{
            background: theme.colors.warning + '20',
            border: `2px solid ${theme.colors.warning}`,
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={24} style={{ color: theme.colors.warning }} />
            <div>
              <div style={{ color: theme.colors.warning, fontWeight: '600', fontSize: '15px' }}>⚠️ Incomplete Profile</div>
              <div style={{ color: theme.colors.textSecondary, fontSize: '13px', marginTop: '4px' }}>
                This client profile is incomplete. Click Edit to complete all required information.
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: theme.colors.textPrimary }}>
                  {client.full_name}
                </h1>
                {getStatusBadge(client.status)}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>
                  <Activity size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {client.age} years | {client.gender}
                </span>
                <span style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>
                  📍 {client.location}
                </span>
                <span style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>
                  📞 {client.phone_number}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onBack}
                style={{ ...styles.button, background: 'transparent', border: `2px solid ${theme.colors.border}`, color: theme.colors.textSecondary }}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                onClick={() => onEdit(client)}
                style={{ ...styles.button, background: theme.colors.info }}
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{ ...styles.button, background: theme.colors.error }}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>

          {/* Generate Plan Button - Prominent */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${theme.colors.border}` }}>
            <button
              disabled
              style={{
                ...styles.button,
                width: '100%',
                justifyContent: 'center',
                padding: '16px',
                fontSize: '16px',
                background: theme.colors.border,
                cursor: 'not-allowed',
                opacity: 0.6
              }}
            >
              <ChefHat size={20} />
              Generate Meal Plan (Coming Soon in Phase 2C)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ ...styles.card, padding: '0', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `2px solid ${theme.colors.border}` }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    background: isActive ? theme.colors.background : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
                    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'health' && renderHealth()}
          {activeTab === 'lifestyle' && renderLifestyle()}
          {activeTab === 'diet' && renderDiet()}
          {activeTab === 'package' && renderPackage()}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{ ...styles.card, maxWidth: '400px', padding: '32px' }}>
              <h3 style={{ color: theme.colors.textPrimary, marginBottom: '16px', fontSize: '20px' }}>
                Delete Client?
              </h3>
              <p style={{ color: theme.colors.textSecondary, marginBottom: '24px', lineHeight: '1.6' }}>
                Are you sure you want to delete <strong style={{ color: theme.colors.textPrimary }}>{client.full_name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ ...styles.button, flex: 1, background: theme.colors.background, border: `2px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  style={{ ...styles.button, flex: 1, background: theme.colors.error }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;