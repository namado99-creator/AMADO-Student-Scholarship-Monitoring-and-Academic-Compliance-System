
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Auth from './Auth.jsx';
import { supabase } from './supabase';
import './styles.css';

function Root() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile(currentSession) {
      if (!active) return;

      setError('');
      setSession(currentSession);
      setProfile(null);

      if (!currentSession) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, student_id, role')
        .eq('id', currentSession.user.id)
        .single();

      if (!active) return;

      if (error) {
        setError(
          'Your account profile could not be loaded. Check that your profile exists in Supabase.'
        );
        setLoading(false);
        return;
      }

      if (!['staff', 'scholar'].includes(data.role)) {
        setError('Your account does not have a valid assigned role.');
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (active) {
          setError(error.message);
          setLoading(false);
        }
        return;
      }

      loadProfile(data.session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      loadProfile(currentSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      setSession(null);
      setProfile(null);
      setError('');
    }
  }

  if (loading) {
    return <div className="auth-loading">Loading ScholarTrack...</div>;
  }

  if (!session) {
    return (
      <>
        {error && <p role="alert">{error}</p>}
        <Auth onAuthenticated={() => {}} />
      </>
    );
  }

  if (!profile) {
    return (
      <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
        <h2>Unable to load your profile</h2>
        <p>{error || 'Your profile has not been set up yet.'}</p>
        <button onClick={logout}>Sign out</button>
      </main>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 12,
          padding: '10px 20px',
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <span>
          Signed in as <strong>{profile.full_name || session.user.email}</strong>
          {' '}({profile.role})
        </span>
        <button onClick={logout}>Sign out</button>
      </div>

      <App />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
