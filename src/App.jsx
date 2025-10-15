// src/App.jsx - Ruchi v2.0 Client Management System
import React, { useState } from 'react';
import ClientList from './components/ClientList';

/**
 * ═══════════════════════════════════════════════════════════
 * RUCHI v2.0 - CLIENT MANAGEMENT SYSTEM
 * "Smart Nutrition. Human Touch."
 * ═══════════════════════════════════════════════════════════
 * 
 * Version: 2.0.0
 * Date: October 16, 2025
 * Branch: v2.0-dev
 * 
 * ARCHITECTURE:
 * - Screen-based navigation (no router)
 * - Supabase backend
 * - 62-field client intake system
 * 
 * SCREENS:
 * 1. clientList - Main dashboard (HOME)
 * 2. clientForm - Multi-step intake form (NEW/EDIT)
 * 3. clientDetail - View full client profile
 * 4. mealPlanner - Create meal plans (coming soon)
 */

function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('clientList'); // clientList | clientForm | clientDetail | mealPlanner
  const [selectedClient, setSelectedClient] = useState(null);
  const [formMode, setFormMode] = useState('create'); // create | edit

  // Navigation handlers
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setCurrentScreen('clientDetail');
  };

  const handleCreateNew = () => {
    setSelectedClient(null);
    setFormMode('create');
    setCurrentScreen('clientForm');
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormMode('edit');
    setCurrentScreen('clientForm');
  };

  const handleBackToList = () => {
    setSelectedClient(null);
    setCurrentScreen('clientList');
  };

  const handleFormSuccess = (savedClient) => {
    setSelectedClient(savedClient);
    setCurrentScreen('clientDetail');
  };

  const handleCreatePlan = (client) => {
    setSelectedClient(client);
    setCurrentScreen('mealPlanner');
  };

  // Screen rendering
  const renderScreen = () => {
    switch (currentScreen) {
      case 'clientList':
        return (
          <ClientList
            onSelectClient={handleSelectClient}
            onCreateNew={handleCreateNew}
          />
        );

      case 'clientForm':
        return (
          <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#1A1A1A', padding: '48px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
              <h2 style={{ color: '#FFFFFF', marginBottom: '12px' }}>Multi-Step Form Coming Soon!</h2>
              <p style={{ color: '#A3A3A3', marginBottom: '24px' }}>
                {formMode === 'create' ? 'Creating new client' : `Editing ${selectedClient?.full_name}`}
              </p>
              <button 
                onClick={handleBackToList}
                style={{
                  padding: '12px 24px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                ← Back to Client List
              </button>
            </div>
          </div>
        );

      case 'clientDetail':
        return (
          <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#1A1A1A', padding: '48px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
              <h2 style={{ color: '#FFFFFF', marginBottom: '12px' }}>Client Detail View Coming Soon!</h2>
              <p style={{ color: '#A3A3A3', marginBottom: '24px' }}>
                Viewing: {selectedClient?.full_name}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={handleBackToList}
                  style={{
                    padding: '12px 24px',
                    background: '#1A1A1A',
                    color: '#FFFFFF',
                    border: '2px solid #2A2A2A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  ← Back to List
                </button>
                <button 
                  onClick={() => handleEditClient(selectedClient)}
                  style={{
                    padding: '12px 24px',
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  Edit Client
                </button>
              </div>
            </div>
          </div>
        );

      case 'mealPlanner':
        return (
          <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#1A1A1A', padding: '48px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
              <h2 style={{ color: '#FFFFFF', marginBottom: '12px' }}>Meal Planner Coming Soon!</h2>
              <p style={{ color: '#A3A3A3', marginBottom: '24px' }}>
                Creating meal plan for: {selectedClient?.full_name}
              </p>
              <button 
                onClick={handleBackToList}
                style={{
                  padding: '12px 24px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                ← Back to Client List
              </button>
            </div>
          </div>
        );

      default:
        return <ClientList onSelectClient={handleSelectClient} onCreateNew={handleCreateNew} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;