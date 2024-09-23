// src/components/Columns/Column4/Column4.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiEdit2 } from 'react-icons/fi';
import './Column4.css';

const Column4 = () => {
  const {
    reportCategories,
    setReportCategories,
    notes,
    setNotes,
    templates,
    setTemplates,
    currentTemplateName,
  } = useContext(AppContext);
  const [expandedSections, setExpandedSections] = useState([]);
  const [editorContent, setEditorContent] = useState({});
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'category') {
      const categories = Array.from(reportCategories);
      const [moved] = categories.splice(source.index, 1);
      categories.splice(destination.index, 0, moved);
      setReportCategories(categories);
    } else if (type === 'note') {
      const sourceCategoryId = source.droppableId;
      const destCategoryId = destination.droppableId;
      const noteId = parseInt(result.draggableId);

      const updatedNotes = Array.from(notes);
      const noteIndex = updatedNotes.findIndex((note) => note.id === noteId);
      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        category: destCategoryId,
      };
      setNotes(updatedNotes);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prevState) =>
      prevState.includes(sectionId)
        ? prevState.filter((id) => id !== sectionId)
        : [...prevState, sectionId]
    );
  };

  const getNotesForSection = (sectionId) => {
    return notes
      .filter((note) => note.category === sectionId && !note.archived)
      .sort((a, b) => a.order - b.order || 0);
  };

  const editSectionContent = (sectionId) => {
    setActiveSectionId(sectionId);
    const combinedContent = getNotesForSection(sectionId)
      .map((note) => note.text)
      .join('\n');
    setEditorContent({ [sectionId]: combinedContent });
  };

  const saveSectionContent = (sectionId) => {
    // Save the edited content back to notes or elsewhere as needed
    setActiveSectionId(null);
  };

  const saveToTemplate = () => {
    setTemplates((prevTemplates) => ({
      ...prevTemplates,
      [currentTemplateName]: {
        ...prevTemplates[currentTemplateName],
        reportCategories,
      },
    }));
    alert('Report Categories saved to template!');
  };

  return (
    <div className="column4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="reportCategories" type="category">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="sections-list">
              {reportCategories.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      className="section-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="section-header" {...provided.dragHandleProps}>
                        <h3 onClick={() => toggleSection(section.id)}>{section.name}</h3>
                        <button onClick={() => editSectionContent(section.id)}>
                          <FiEdit2 />
                        </button>
                      </div>
                      {expandedSections.includes(section.id) && (
                        <Droppable droppableId={section.id} type="note">
                          {(provided) => (
                            <div
                              className="notes-list"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {getNotesForSection(section.id).map((note, noteIndex) => (
                                <Draggable
                                  key={note.id}
                                  draggableId={String(note.id)}
                                  index={noteIndex}
                                >
                                  {(provided) => (
                                    <div
                                      className="note-item"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <p>{note.text}</p>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                      {activeSectionId === section.id && (
                        <div className="editor">
                          <ReactQuill
                            theme="snow"
                            value={editorContent[section.id]}
                            onChange={(content) =>
                              setEditorContent({ [section.id]: content })
                            }
                          />
                          <button onClick={() => saveSectionContent(section.id)}>
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={saveToTemplate} className="save-template-button">
        Save as Template
      </button>
    </div>
  );
};

export default Column4;
