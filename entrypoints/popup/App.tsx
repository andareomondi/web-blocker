import { useState, useEffect } from 'react';
import { blockerStorage } from '@/utils/storage';
import type { BlockedSite, GracePeriod } from '@/types';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [activeGracePeriods, setActiveGracePeriods] = useState<GracePeriod[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [gracePeriodCount, setGracePeriodCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const data = await blockerStorage.get();
    setBlockedSites(data.blockedSites);
    setActiveGracePeriods(data.activeGracePeriods.filter(gp => gp.expiresAt > Date.now()));
    const count = await blockerStorage.getGracePeriodCount();
    setGracePeriodCount(count);
    setLoading(false);
  };

  const addSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    await blockerStorage.addBlockedSite(newUrl.trim());
    setNewUrl('');
    loadData();
  };

  const removeSite = async (id: string) => {
    await blockerStorage.removeBlockedSite(id);
    loadData();
  };

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const seconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  if (loading) {
    return (
      <div className="popup">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup">
      <header className="header">
        <h1>🚫 Website Blocker</h1>
        <div className="grace-counter">
          Grace Periods: {gracePeriodCount}/3 this hour
        </div>
      </header>

      <div className="content">
        <section className="section">
          <h2>Add Blocked Site</h2>
          <form onSubmit={addSite} className="add-form">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="example.com or https://example.com"
              className="input"
            />
            <button type="submit" className="btn btn-primary">
              Add Site
            </button>
          </form>
        </section>

        <section className="section">
          <h2>Blocked Sites ({blockedSites.length})</h2>
          {blockedSites.length === 0 ? (
            <p className="empty-state">No sites blocked yet</p>
          ) : (
            <ul className="site-list">
              {blockedSites.map((site) => (
                <li key={site.id} className="site-item">
                  <div className="site-info">
                    <span className="site-url">{site.url}</span>
                    <span className="site-date">
                      Added {new Date(site.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => removeSite(site.id)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section">
          <h2>Active Grace Periods ({activeGracePeriods.length})</h2>
          {activeGracePeriods.length === 0 ? (
            <p className="empty-state">No active grace periods</p>
          ) : (
            <ul className="grace-list">
              {activeGracePeriods.map((gp) => (
                <li key={gp.key} className="grace-item">
                  <div className="grace-info">
                    <div className="grace-url">{gp.url}</div>
                    <div className="grace-key">Key: {gp.key}</div>
                    <div className="grace-time">
                      Expires in: {formatTimeRemaining(gp.expiresAt)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section info-section">
          <h3>ℹ️ How it works</h3>
          <ul className="info-list">
            <li>Add websites you want to block</li>
            <li>When visiting a blocked site, you'll see a block screen</li>
            <li>Request a grace period (30s - 9min random duration)</li>
            <li>Save the unique key to unlock the site later</li>
            <li>Maximum 3 grace periods per hour</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
