// src/components/ClientList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, Plus, User, Calendar, Target, Phone } from 'lucide-react';

const theme = {
  colors: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    primary: '#10B981',
    primaryHover: '#059669',
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#2A2A2A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    blue: '#3B82F6'
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
    padding: '12px 16px 12px 44px',
    fontSize: '15px',
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    color: theme.colors.textPrimary,
    outline: 'none'
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

const ClientList = ({ onSelectClient, onCreateNew }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients from Supabase
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(data || []);
      setFilteredClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search and status
  useEffect(() => {
    let filtered = clients;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Filter by search term (name or phone)
    if (searchTerm.trim()) {
      filtered = filtered.filter(client =>
        client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone_number?.includes(searchTerm)
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, statusFilter, clients]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'paused':
        return theme.colors.warning;
      case 'inactive':
        return theme.colors.textSecondary;
      case 'completed':
        return theme.colors.blue;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'paused':
        return '🟡';
      case 'inactive':
        return '⚫';
      case 'completed':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: theme.colors.textSecondary, fontSize: '16px' }}>Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ ...styles.card, maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ color: theme.colors.error, marginBottom: '12px' }}>Error Loading Clients</h2>
          <p style={{ color: theme.colors.textSecondary, marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchClients} style={styles.button}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.colors.background, padding: '30px 20px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #a78bfa 50%, #ec4899 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ruchi●
              </h1>
              <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: '14px' }}>
                Client Management • {clients.length} Total Client{clients.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={onCreateNew} style={{ ...styles.button, background: theme.colors.primary }}>
              <Plus size={20} />
              New Client
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
            
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...styles.input, width: '200px', paddingLeft: '16px', cursor: 'pointer' }}
            >
              <option value="all">All Status</option>
              <option value="active">🟢 Active</option>
              <option value="paused">🟡 Paused</option>
              <option value="inactive">⚫ Inactive</option>
              <option value="completed">🔵 Completed</option>
            </select>
          </div>

          {/* Results count */}
          {(searchTerm || statusFilter !== 'all') && (
            <p style={{ margin: '16px 0 0 0', color: theme.colors.textSecondary, fontSize: '14px' }}>
              Showing {filteredClients.length} of {clients.length} clients
            </p>
          )}
        </div>

        {/* Client List */}
        {filteredClients.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: theme.colors.textPrimary, marginBottom: '8px' }}>No clients found</h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: '24px' }}>
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first client to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button onClick={onCreateNew} style={styles.button}>
                <Plus size={20} />
                Create First Client
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => onSelectClient(client)}
                style={{
                  ...styles.card,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: `4px solid ${getStatusColor(client.status)}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', flexWrap: 'wrap' }}>
                  
                  {/* Left: Client Info */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: theme.colors.primary + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} style={{ color: theme.colors.primary }} />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: theme.colors.textPrimary, fontWeight: '600' }}>
                          {client.full_name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} style={{ color: theme.colors.textSecondary }} />
                          <span style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>
                            {client.phone_number}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>Age • Gender</div>
                        <div style={{ fontSize: '14px', color: theme.colors.textPrimary, fontWeight: '500' }}>
                          {client.age} • {client.gender}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                          <Target size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Goal
                        </div>
                        <div style={{ fontSize: '14px', color: theme.colors.textPrimary, fontWeight: '500' }}>
                          {client.primary_health_goal || 'Not set'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                          <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Start Date
                        </div>
                        <div style={{ fontSize: '14px', color: theme.colors.textPrimary, fontWeight: '500' }}>
                          {formatDate(client.package_start_date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: getStatusColor(client.status) + '20', borderRadius: '8px', border: `1px solid ${getStatusColor(client.status)}` }}>
                      <span style={{ fontSize: '18px' }}>{getStatusEmoji(client.status)}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: getStatusColor(client.status), textTransform: 'capitalize' }}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;