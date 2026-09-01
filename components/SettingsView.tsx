'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  User,
  Building,
  Database,
  Sparkles,
  Bell,
  Shield,
  CheckCircle2,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { USER_AVATAR_URL } from './Sidebar';

export default function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState<
    'PROFILE' | 'WORKSPACE' | 'DATA_SOURCES' | 'AI_PREFS' | 'SECURITY'
  >('PROFILE');

  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Jenkins');
  const [email, setEmail] = useState('sarah.jenkins@acmecorp.com');
  const [role, setRole] = useState('VP of Sales Operations');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [isSaved, setIsSaved] = useState(false);

  const [aiScoring, setAiScoring] = useState(true);
  const [generativeSummaries, setGenerativeSummaries] = useState(true);
  const [provenanceBadges, setProvenanceBadges] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const navItems = [
    { id: 'PROFILE', label: 'General Profile', icon: User },
    { id: 'WORKSPACE', label: 'Workspace & Team', icon: Building },
    { id: 'DATA_SOURCES', label: 'Data Sources & Integrations', icon: Database },
    { id: 'AI_PREFS', label: 'AI Intelligence Preferences', icon: Sparkles },
    { id: 'SECURITY', label: 'Security & Access', icon: Shield },
  ];

  return (
    <div id="settings-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138] uppercase tracking-wider">
            Workspace Configuration
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">Settings</h2>
      </div>

      {/* Main Settings 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sub-nav */}
        <div className="bg-white rounded-2xl border border-[#E5E5E1] p-3 shadow-xs space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                id={`settings-subtab-${item.id.toLowerCase()}`}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#005138] text-white font-semibold shadow-xs'
                    : 'text-[#3F4943] hover:bg-[#F4F4F2] hover:text-[#1a1c1b]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-[#A4F3CC]' : 'text-[#8A8F98]'}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Content */}
        <div className="md:col-span-3">
          {activeSubTab === 'PROFILE' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-6">
              <div className="border-b border-[#E5E5E1] pb-4">
                <h3 className="text-base font-bold text-[#1a1c1b]">General Profile</h3>
                <p className="text-xs text-[#8A8F98]">
                  Manage your personal user credentials and executive role.
                </p>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#E5E5E1] shadow-xs">
                  <Image
                    src={USER_AVATAR_URL}
                    alt="Sarah Jenkins"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[#005138] text-white text-xs font-semibold hover:bg-[#176B4D]"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E1] text-[#3F4943] text-xs font-medium hover:bg-[#F4F4F2]"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8A8F98]">JPG, PNG or GIF up to 5MB.</p>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1a1c1b]">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1a1c1b]">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1a1c1b]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1a1c1b]">Role Title</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1a1c1b]">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] outline-none cursor-pointer"
                    >
                      <option value="America/Los_Angeles">Pacific Time (US & Canada) (GMT-8)</option>
                      <option value="America/New_York">Eastern Time (US & Canada) (GMT-5)</option>
                      <option value="America/Chicago">Central Time (US & Canada) (GMT-6)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#E5E5E1]">
                  <span className="text-xs text-[#237A52] font-medium flex items-center gap-1">
                    {isSaved && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Profile changes saved successfully</span>
                      </>
                    )}
                  </span>
                  <button
                    type="submit"
                    id="save-profile-btn"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSubTab === 'DATA_SOURCES' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-6">
              <div className="border-b border-[#E5E5E1] pb-4">
                <h3 className="text-base font-bold text-[#1a1c1b]">Data Sources & Integrations</h3>
                <p className="text-xs text-[#8A8F98]">
                  Connect external CRMs and firmographic providers for bi-directional synchronization.
                </p>
              </div>

              <div className="space-y-4">
                {/* Salesforce */}
                <div className="p-4 rounded-xl border border-[#E5E5E1] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#315F9B]/10 flex items-center justify-center font-bold text-xs text-[#315F9B]">
                      SFDC
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1c1b]">Salesforce CRM</h4>
                      <p className="text-[11px] text-[#8A8F98]">
                        Two-way sync active • Last synced 5 mins ago
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    CONNECTED
                  </span>
                </div>

                {/* LinkedIn */}
                <div className="p-4 rounded-xl border border-[#E5E5E1] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#005138]/10 flex items-center justify-center font-bold text-xs text-[#005138]">
                      IN
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1c1b]">
                        LinkedIn Sales Navigator
                      </h4>
                      <p className="text-[11px] text-[#8A8F98]">
                        Real-time executive moves & hiring triggers
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    ACTIVE
                  </span>
                </div>

                {/* HubSpot */}
                <div className="p-4 rounded-xl border border-[#E5E5E1] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#A66A00]/10 flex items-center justify-center font-bold text-xs text-[#A66A00]">
                      HS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1c1b]">HubSpot Enterprise</h4>
                      <p className="text-[11px] text-[#8A8F98]">
                        Export qualified cohorts directly into contact pipelines
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-[#005138] text-white text-xs font-semibold hover:bg-[#176B4D]">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'AI_PREFS' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-6">
              <div className="border-b border-[#E5E5E1] pb-4">
                <h3 className="text-base font-bold text-[#1a1c1b]">AI Intelligence Preferences</h3>
                <p className="text-xs text-[#8A8F98]">
                  Configure automated lead qualification algorithms and generative narrative models.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1]">
                  <div>
                    <h4 className="text-xs font-bold text-[#1a1c1b]">
                      Automated Multi-Factor Lead Scoring (0-100)
                    </h4>
                    <p className="text-[11px] text-[#8A8F98]">
                      Continuously computes ICP fit, hiring velocity, and recent business triggers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiScoring}
                    onChange={(e) => setAiScoring(e.target.checked)}
                    className="w-4 h-4 text-[#005138] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1]">
                  <div>
                    <h4 className="text-xs font-bold text-[#1a1c1b]">
                      Generative Intelligence Dossiers (Gemini 3.7)
                    </h4>
                    <p className="text-[11px] text-[#8A8F98]">
                      Synthesizes real-time why-this-lead reasons and customized outreach hooks.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={generativeSummaries}
                    onChange={(e) => setGenerativeSummaries(e.target.checked)}
                    className="w-4 h-4 text-[#005138] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1]">
                  <div>
                    <h4 className="text-xs font-bold text-[#1a1c1b]">
                      Strict Data Provenance Labels [ AI ANALYSIS ]
                    </h4>
                    <p className="text-[11px] text-[#8A8F98]">
                      Explicitly badges AI-synthesized intelligence vs verified SEC filings.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={provenanceBadges}
                    onChange={(e) => setProvenanceBadges(e.target.checked)}
                    className="w-4 h-4 text-[#005138] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {(activeSubTab === 'WORKSPACE' || activeSubTab === 'SECURITY') && (
            <div className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1a1c1b]">
                {activeSubTab === 'WORKSPACE' ? 'Workspace & Team Hierarchy' : 'Security & Encryption'}
              </h3>
              <p className="text-xs text-[#3F4943] leading-relaxed">
                Enterprise plan active for Acme Corp Enterprise Sales organization. SOC2 Type II audit report available for download upon request.
              </p>
              <div className="p-4 rounded-xl bg-[#A4F3CC]/20 border border-[#A4F3CC] text-xs text-[#005138] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All tenant records are encrypted in transit and at rest with customer-managed keys (CMEK).</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
