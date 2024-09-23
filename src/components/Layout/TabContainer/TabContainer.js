// src/components/Layout/TabContainer/TabContainer.js
import React, { useState } from 'react';
import './TabContainer.css';

const TabContainer = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`tab-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="tab" onClick={handleTabClick}>
        <span className="tab-text">{title}</span>
      </div>
      <div className="content">
        {children}
        {/* Temporary debug section */}
        <div className="debug-section">
          <h4>Debug Data</h4>
          <pre>{JSON.stringify(children.props.data, null, 2)}</pre>
          <p>Access this data in the next column via `AppContext`.</p>
        </div>
      </div>
    </div>
  );
};

export default TabContainer;
