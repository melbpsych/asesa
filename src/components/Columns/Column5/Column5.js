// src/components/Columns/Column5/Column5.js
import React, { useContext, useRef } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Column5.css';

const Column5 = () => {
  const { reportCategories, notes } = useContext(AppContext);
  const reportRef = useRef();

  const renderNotesForSection = (sectionId) => {
    return notes
      .filter((note) => note.category === sectionId && !note.archived)
      .map((note) => <p key={note.id}>{note.text}</p>);
  };

  const generatePDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };

  return (
    <div className="column5">
      <div className="report-container" ref={reportRef}>
        <div className="report-header">
          <h1>Psychological Assessment Report</h1>
          <p>Confidential</p>
        </div>
        {reportCategories.map((section) => (
          <div key={section.id} className="report-section">
            <h2>{section.name}</h2>
            {renderNotesForSection(section.id)}
          </div>
        ))}
        <div className="signature-section">
          <p>____________________________________</p>
          <p>Signature</p>
        </div>
      </div>
      <button className="download-button" onClick={generatePDF}>
        <FiDownload /> Download PDF
      </button>
    </div>
  );
};

export default Column5;
