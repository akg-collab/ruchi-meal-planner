// src/App.jsx - Complete Updated Version
import { useState } from 'react';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import ClientDetail from './components/ClientDetail';

export default function App() {
  // Track which screen to show
  const [currentView, setCurrentView] = useState('list'); // Can be: 'list', 'form', 'detail'
  const [selectedClient, setSelectedClient] = useState(null);
  const [formMode, setFormMode] = useState('create'); // Can be: 'create' or 'edit'

  // When user clicks "Add New Client" button
  const handleAddNewClient = () => {
    setSelectedClient(null);
    setFormMode('create');
    setCurrentView('form');
  };

  // When user clicks on a client name to view details
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setCurrentView('detail');
  };

  // When user clicks Edit button in detail view
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormMode('edit');
    setCurrentView('form');
  };

  // When user successfully saves form
  const handleFormSuccess = () => {
    setSelectedClient(null);
    setCurrentView('list');
  };

  // When user cancels form
  const handleFormCancel = () => {
    setSelectedClient(null);
    setCurrentView('list');
  };

  // When user clicks Back button
  const handleBackToList = () => {
    setSelectedClient(null);
    setCurrentView('list');
  };

  // Show the right screen based on currentView
  return (
    <>
      {currentView === 'list' && (
        <ClientList 
          onViewClient={handleViewClient}
          onAddNew={handleAddNewClient}
        />
      )}

      {currentView === 'form' && (
        <ClientForm 
          client={selectedClient}
          mode={formMode}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {currentView === 'detail' && selectedClient && (
        <ClientDetail 
          clientId={selectedClient.id}
          onBack={handleBackToList}
          onEdit={handleEditClient}
        />
      )}
    </>
  );
}