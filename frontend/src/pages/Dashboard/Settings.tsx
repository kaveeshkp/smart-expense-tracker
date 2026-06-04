import React, { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile, useChangePassword, useDeleteAccount } from '../../hooks/useProfile';
import PageLayout from '../../components/ui/PageLayout';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { User, Lock, Trash2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync profile data to form
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setCurrency(profile.preferredCurrency || 'USD');
      setTimezone(profile.timezone || 'UTC');
    }
  }, [profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error('Full name is required');
    
    updateProfileMutation.mutate({
      fullName: fullName.trim(),
      preferredCurrency: currency,
      timezone: timezone,
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return toast.error('Current password is required');
    if (newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match');

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  const isSavingProfile = updateProfileMutation.isPending;
  const isChangingPassword = changePasswordMutation.isPending;

  return (
    <PageLayout title="Settings">
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: 250, borderRadius: 'var(--radius-lg)' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Profile Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} className="text-accent" /> Profile Information
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateProfile}>
                <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      className="input"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isSavingProfile}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      className="input"
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="currency">Preferred Currency</label>
                    <select
                      id="currency"
                      className="select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      disabled={isSavingProfile}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="timezone">Timezone</label>
                    <select
                      id="timezone"
                      className="select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      disabled={isSavingProfile}
                    >
                      <option value="UTC">UTC</option>
                      <option value="GMT">GMT</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                      <option value="IST">IST</option>
                      <option value="CET">CET</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
                  <button type="submit" className="btn btn-primary" disabled={isSavingProfile}>
                    {isSavingProfile ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={18} className="text-accent" /> Change Password
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleChangePassword}>
                <div className="input-group">
                  <label className="input-label" htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    className="input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      className="input"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      className="input"
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isChangingPassword}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
                  <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
                    {isChangingPassword ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div className="card-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.1)' }}>
              <h3 className="section-title text-danger" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)' }}>
                <Trash2 size={18} /> Danger Zone
              </h3>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                Deleting your account will immediately remove all expenses, budgets, recurring transactions, and profile data from our databases. This action is permanent and cannot be undone.
              </p>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account"
        message="Are you absolutely sure you want to delete your account? All of your financial logs and settings will be permanently lost."
        variant="danger"
      />
    </PageLayout>
  );
}
