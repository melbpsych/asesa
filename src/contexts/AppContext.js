// src/contexts/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // Templates
  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('templates');
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    } else {
      // Initial templates with categories and subcategories for forensic reports
      return {
        'Forensic Assessment': {
          clientData: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            sex: '',
            dateOfBirth: '',
            occupation: '',
            relationshipStatus: '',
            informedConsent: false,
            priorDiagnoses: '',
            medicalConditions: '',
            lawyer: null,
            dateRangeOfOffending: { from: '', to: '' },
            listOfCharges: [],
            interviews: [],
            collateralInformation: [],
            pdfs: [],
          },
          assessmentPlan: {
            categories: [
              {
                id: 'family-background',
                name: 'Family Background',
                questions: [
                  'Can you describe your family structure?',
                  'What is your relationship like with your parents?',
                ],
              },
              // Other categories...
            ],
          },
          reportCategories: [
            {
              id: 'background',
              name: 'Background Information',
              subcategories: [
                { id: 'family-history', name: 'Family History' },
                { id: 'education', name: 'Education' },
                // Other subcategories...
              ],
            },
            // Other main categories...
          ],
        },
      };
    }
  });

  // Current Template
  const [currentTemplateName, setCurrentTemplateName] = useState('Forensic Assessment');
  const currentTemplate = templates[currentTemplateName] || {
    clientData: {},
    assessmentPlan: { categories: [] },
    reportCategories: [],
  };

  // State synchronized with the current template
  const [clientData, setClientData] = useState(currentTemplate.clientData);
  const [assessmentPlan, setAssessmentPlan] = useState(currentTemplate.assessmentPlan);
  const [reportCategories, setReportCategories] = useState(currentTemplate.reportCategories);
  const [notes, setNotes] = useState([]);

  // Lawyers data
  const [lawyers, setLawyers] = useState(() => {
    const savedLawyers = localStorage.getItem('lawyers');
    return savedLawyers ? JSON.parse(savedLawyers) : [];
  });

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  // Save lawyers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lawyers', JSON.stringify(lawyers));
  }, [lawyers]);

  // Autosave feature
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      localStorage.setItem('autosave', JSON.stringify({ clientData, notes }));
    }, 5000); // Autosave every 5 seconds

    return () => clearInterval(autosaveInterval);
  }, [clientData, notes]);

  // Update template when relevant data changes
  useEffect(() => {
    setTemplates((prevTemplates) => ({
      ...prevTemplates,
      [currentTemplateName]: {
        clientData,
        assessmentPlan,
        reportCategories,
      },
    }));
  }, [clientData, assessmentPlan, reportCategories, currentTemplateName]);

  // Clients Data
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });

  const [currentClientId, setCurrentClientId] = useState(null);
  const currentClient = clients.find((client) => client.id === currentClientId) || {};

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  // Function to update client data
  const updateClientData = (data) => {
    setClients((prevClients) => {
      const clientIndex = prevClients.findIndex((client) => client.id === currentClientId);
      if (clientIndex !== -1) {
        const updatedClients = [...prevClients];
        updatedClients[clientIndex] = { ...updatedClients[clientIndex], ...data };
        return updatedClients;
      } else {
        // Add new client
        const newClient = { id: Date.now(), ...data };
        setCurrentClientId(newClient.id);
        return [...prevClients, newClient];
      }
    });
  };

  // Function to add a new template
  const addTemplate = (templateName) => {
    if (!templates[templateName]) {
      setTemplates((prevTemplates) => ({
        ...prevTemplates,
        [templateName]: {
          clientData: {},
          assessmentPlan: { categories: [] },
          reportCategories: [],
        },
      }));
    } else {
      alert('Template already exists!');
    }
  };

  return (
    <AppContext.Provider
      value={{
        templates,
        setTemplates,
        currentTemplateName,
        setCurrentTemplateName,
        clientData: currentClient,
        setClientData: updateClientData,
        assessmentPlan,
        setAssessmentPlan,
        reportCategories,
        setReportCategories,
        notes,
        setNotes,
        addTemplate,
        clients,
        setClients,
        currentClientId,
        setCurrentClientId,
        lawyers,
        setLawyers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
