// src/components/Layout/Sidebar/Sidebar.js
import React, { useState, useContext } from 'react';
import './Sidebar.css';
import { AppContext } from '../../../contexts/AppContext';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const {
    templates,
    currentTemplateName,
    setCurrentTemplateName,
    addTemplate,
    clients,
    setCurrentClientId,
    currentClientId,
  } = useContext(AppContext);

  const [templateSearch, setTemplateSearch] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const toggleSidebar = () => {
    setIsHidden(!isHidden);
  };

  const handleTemplateSearch = (e) => {
    setTemplateSearch(e.target.value);
  };

  const filteredTemplates = Object.keys(templates).filter((templateName) =>
    templateName.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const handleAddTemplate = () => {
    if (newTemplateName.trim() !== '') {
      addTemplate(newTemplateName.trim());
      setCurrentTemplateName(newTemplateName.trim());
      setNewTemplateName('');
    }
  };

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`
      .toLowerCase()
      .includes(clientSearch.toLowerCase())
  );

  return (
    <div className={`sidebar ${isHidden ? 'hidden' : ''}`}>
      {!isHidden && (
        <div className="menu">
          {/* Client Search */}
          <div className="menu-section">
            <h3>Clients</h3>
            <input
              type="text"
              className="search-box"
              placeholder="Search Clients..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
            />
            <ul className="client-list">
              {filteredClients.map((client) => (
                <li
                  key={client.id}
                  className={client.id === currentClientId ? 'active' : ''}
                  onClick={() => setCurrentClientId(client.id)}
                >
                  {client.firstName} {client.lastName}
                </li>
              ))}
              {filteredClients.length === 0 && <li>No clients found.</li>}
            </ul>
          </div>

          {/* Templates Menu */}
          <div className="menu-section">
            <h3>Templates</h3>
            <input
              type="text"
              className="search-box"
              placeholder="Search Templates..."
              value={templateSearch}
              onChange={handleTemplateSearch}
            />
            <ul className="template-list">
              {filteredTemplates.map((templateName) => (
                <li
                  key={templateName}
                  className={templateName === currentTemplateName ? 'active' : ''}
                  onClick={() => setCurrentTemplateName(templateName)}
                >
                  {templateName}
                </li>
              ))}
              {filteredTemplates.length === 0 && <li>No templates found.</li>}
            </ul>
            <div className="add-template">
              <input
                type="text"
                placeholder="New Template Name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
              <button onClick={handleAddTemplate}>
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Additional sections like Settings and Help can be added here */}
        </div>
      )}
      {/* Sidebar Toggle Button at the Bottom */}
      <div className="toggle-button" onClick={toggleSidebar}>
        {isHidden ? <FiChevronRight /> : <FiChevronLeft />}
      </div>
    </div>
  );
};

export default Sidebar;
