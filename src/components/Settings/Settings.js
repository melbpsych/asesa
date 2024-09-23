import React, { useState } from 'react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="settings-container">
      <div className="settings-menu">
        <div onClick={() => setActiveSection('general')}>General Preferences</div>
        <div onClick={() => setActiveSection('column1')}>Details and Collateral</div>
        {/* Add more sections */}
      </div>
      <div className="settings-content">
        {activeSection === 'general' && (
          <div>
            <h3>Report Header and Footer</h3>
            <input type="file" accept="image/png" />
            {/* More settings */}
          </div>
        )}
        {/* Render other sections similarly */}
      </div>
    </div>
  );
};

export default Settings;
