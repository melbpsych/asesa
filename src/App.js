// src/App.js
import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import Column1 from './components/Columns/Column1/Column1';
import Column2 from './components/Columns/Column2/Column2';
import Column3 from './components/Columns/Column3/Column3';
import Column4 from './components/Columns/Column4/Column4';
import Column5 from './components/Columns/Column5/Column5';

const App = () => {
  const [activeTabs, setActiveTabs] = useState([
    'Details and Collateral',
    'Assessment Planning',
    'Clinical Notes',
    'Report Writing',
    'Final Report',
  ]);

  const toggleTab = (tab) => {
    setActiveTabs((prevTabs) =>
      prevTabs.includes(tab)
        ? prevTabs.filter((t) => t !== tab)
        : [...prevTabs, tab]
    );
  };

  const renderColumn = (tab) => {
    switch (tab) {
      case 'Details and Collateral':
        return <Column1 />;
      case 'Assessment Planning':
        return <Column2 />;
      case 'Clinical Notes':
        return <Column3 />;
      case 'Report Writing':
        return <Column4 />;
      case 'Final Report':
        return <Column5 />;
      default:
        return null;
    }
  };

  const tabsOrder = [
    'Details and Collateral',
    'Assessment Planning',
    'Clinical Notes',
    'Report Writing',
    'Final Report',
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="tabs">
          {tabsOrder.map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTabs.includes(tab) ? 'active' : ''}`}
              onClick={() => toggleTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="columns-container">
          {tabsOrder.map((tab) =>
            activeTabs.includes(tab) ? (
              <div key={tab} className="column">
                {renderColumn(tab)}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
