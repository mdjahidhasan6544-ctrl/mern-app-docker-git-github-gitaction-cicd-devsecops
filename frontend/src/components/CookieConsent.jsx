import React, { useState } from 'react';

const STORAGE_KEY = 'craftweave-cookie-preferences';

const defaultPrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const getInitialCookieState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { visible: true, prefs: defaultPrefs };
  }

  try {
    return { visible: false, prefs: { ...defaultPrefs, ...JSON.parse(saved) } };
  } catch {
    return { visible: true, prefs: defaultPrefs };
  }
};

const CookieConsent = () => {
  const [initialState] = useState(getInitialCookieState);
  const [visible, setVisible] = useState(initialState.visible);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState(initialState.prefs);

  const savePrefs = (nextPrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPrefs));
    setPrefs(nextPrefs);
    setVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => savePrefs({ necessary: true, analytics: true, marketing: true });
  const rejectOptional = () => savePrefs({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => savePrefs({ ...prefs, necessary: true });

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[70] border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl p-5 md:p-6 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-8">
          <div className="flex-1">
            <p className="section-label mb-2">UK Cookie Notice</p>
            <h3 className="font-['Cormorant_Garamond'] text-3xl text-[var(--fg)] mb-2">We use cookies</h3>
            <p className="text-sm text-[var(--fg-muted)] font-light leading-relaxed">
              We use strictly necessary cookies to make this site work, and optional analytics and marketing cookies to improve your experience. You can accept all, reject optional cookies, or manage your preferences.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:min-w-fit">
            <button type="button" onClick={() => setShowSettings(true)} className="btn-outline" style={{ width: 'auto' }}>
              Manage cookies
            </button>
            <button type="button" onClick={rejectOptional} className="btn-outline" style={{ width: 'auto' }}>
              Reject optional
            </button>
            <button type="button" onClick={acceptAll} className="btn-primary" style={{ width: 'auto' }}>
              Accept all
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="section-label mb-2">Cookie preferences</p>
                <h3 className="font-['Cormorant_Garamond'] text-3xl text-[var(--fg)]">Manage cookie settings</h3>
              </div>
              <button type="button" onClick={() => setShowSettings(false)} className="text-sm uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--fg)]">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-[var(--border)] p-4 bg-[var(--bg-muted)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--fg)]">Strictly necessary cookies</p>
                    <p className="text-xs text-[var(--fg-muted)] font-light mt-1">Required for core functionality such as navigation, security, and checkout.</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[var(--accent)]">Always active</span>
                </div>
              </div>

              <div className="border border-[var(--border)] p-4 bg-[var(--bg-card)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--fg)]">Analytics cookies</p>
                    <p className="text-xs text-[var(--fg-muted)] font-light mt-1">Help us understand how UK visitors use the site so we can improve performance and experience.</p>
                  </div>
                  <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs((prev) => ({ ...prev, analytics: e.target.checked }))} className="w-4 h-4 accent-[var(--accent)]" />
                </div>
              </div>

              <div className="border border-[var(--border)] p-4 bg-[var(--bg-card)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--fg)]">Marketing cookies</p>
                    <p className="text-xs text-[var(--fg-muted)] font-light mt-1">Used for personalised promotions, advertising relevance, and campaign performance measurement.</p>
                  </div>
                  <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs((prev) => ({ ...prev, marketing: e.target.checked }))} className="w-4 h-4 accent-[var(--accent)]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8">
              <button type="button" onClick={rejectOptional} className="btn-outline" style={{ width: 'auto' }}>Reject optional</button>
              <button type="button" onClick={saveCustom} className="btn-primary" style={{ width: 'auto' }}>Save preferences</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
