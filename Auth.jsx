
import React, { useState } from 'react';
import { supabase } from './supabase';

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: fullName.trim() }
          }
        });

        if (error) throw error;

        if (!data.session) {
          setMessage(
            'Account created. Check your email to confirm your account, then sign in.'
          );
        } else {
          onAuthenticated?.(data.session);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) throw error;

        onAuthenticated?.(data.session);
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.logo}>🎓</div>
        <h1>ScholarTrack</h1>
        <p style={styles.subtitle}>
          Student Scholarship Monitoring and Academic Compliance System
        </p>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setMessage('');
            }}
            style={mode === 'login' ? styles.activeTab : styles.tab}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setMessage('');
            }}
            style={mode === 'signup' ? styles.activeTab : styles.tab}
          >
            Create Scholar Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label style={styles.label}>
              Full Name
              <input
                style={styles.input}
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </label>
          )}

          <label style={styles.label}>
            Email Address
            <input
              style={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
            />
          </label>

          {message && <p role="status" style={styles.message}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            style={styles.submit}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Scholar Account'}
          </button>
        </form>

        <p style={styles.footer}>
          {mode === 'login'
            ? 'Use your registered Staff or Scholar account.'
            : 'New registrations create Scholar accounts only.'}
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    background: '#f3f5fb',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: 440,
    padding: 32,
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 8px 30px rgba(20, 35, 70, 0.10)'
  },
  logo: { fontSize: 42, textAlign: 'center' },
  subtitle: {
    color: '#68738a',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: 14,
    marginBottom: 24
  },
  tabs: { display: 'flex', gap: 8, marginBottom: 22 },
  tab: {
    flex: 1,
    padding: 11,
    border: '1px solid #dce2ee',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer'
  },
  activeTab: {
    flex: 1,
    padding: 11,
    border: '1px solid #3549a8',
    borderRadius: 8,
    background: '#3549a8',
    color: '#fff',
    cursor: 'pointer'
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16
  },
  input: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: 12,
    marginTop: 7,
    border: '1px solid #d5dbea',
    borderRadius: 8,
    fontSize: 15
  },
  submit: {
    width: '100%',
    padding: 13,
    border: 0,
    borderRadius: 8,
    background: '#3549a8',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer'
  },
  message: {
    color: '#b42318',
    background: '#fff1f0',
    padding: 10,
    borderRadius: 7,
    fontSize: 13,
    overflowWrap: 'anywhere'
  },
  footer: {
    marginTop: 20,
    color: '#68738a',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 1.5
  }
};
