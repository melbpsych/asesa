// src/components/Columns/Column3/Column3.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { WithContext as ReactTags } from 'react-tag-input';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiEdit2, FiArchive, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import './Column3.css';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const Column3 = () => {
  const {
    notes,
    setNotes,
    reportCategories,
    setReportCategories,
    templates,
    setTemplates,
    currentTemplateName,
  } = useContext(AppContext);
  const [noteText, setNoteText] = useState('');
  const [tags, setTags] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTag = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDragTag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const addOrUpdateNote = (categoryId = null) => {
    if (noteText.trim() !== '') {
      const extractedTags = [...noteText.matchAll(/#(\w+)/g)].map((match) => ({
        id: match[1],
        text: match[1],
      }));
      const combinedTags = [...tags, ...extractedTags];
      if (editNoteId) {
        const updatedNotes = notes.map((note) =>
          note.id === editNoteId
            ? {
                ...note,
                text: noteText.trim(),
                category: categoryId !== null ? categoryId : note.category,
                tags: combinedTags.map((tag) => tag.text),
              }
            : note
        );
        setNotes(updatedNotes);
        setEditNoteId(null);
      } else {
        const newNote = {
          id: Date.now(),
          text: noteText.trim(),
          category: categoryId,
          tags: combinedTags.map((tag) => tag.text),
          archived: false,
        };
        setNotes([...notes, newNote]);
      }
      setNoteText('');
      setTags([]);
    }
  };

  const editNote = (note) => {
    setEditNoteId(note.id);
    setNoteText(note.text);
    setTags(note.tags.map((tag) => ({ id: tag, text: tag })));
  };

  const archiveNote = (noteId) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, archived: true } : note
    );
    setNotes(updatedNotes);
  };

  const changeNoteCategory = (noteId, categoryId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, category: categoryId } : note
      )
    );
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prevState) =>
      prevState.includes(categoryId)
        ? prevState.filter((id) => id !== categoryId)
        : [...prevState, categoryId]
    );
  };

  const addCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      subcategories: [],
    };
    setReportCategories((prev) => [...prev, newCategory]);
    setNewCategoryName('');
  };

  const editCategory = (categoryId) => {
    const newName = prompt('Enter new category name:');
    if (newName) {
      setReportCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, name: newName } : cat
        )
      );
    }
  };

  const deleteCategory = (categoryId) => {
    setReportCategories((prev) =>
      prev.filter((cat) => cat.id !== categoryId)
    );
  };

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

  const saveToTemplate = () => {
    setTemplates((prevTemplates) => ({
      ...prevTemplates,
      [currentTemplateName]: {
        ...prevTemplates[currentTemplateName],
        reportCategories,
      },
    }));
    alert('Categories saved to template!');
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.text.toLowerCase().includes(searchTerm.toLowerCase()) && !note.archived
  );

  return (
    <div className="column3">
      <div className="note-entry">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note..."
          style={{ minHeight: '300px' }}
        ></textarea>
        <ReactTags
          tags={tags}
          handleDelete={handleDeleteTag}
          handleAddition={handleAdditionTag}
          handleDrag={handleDragTag}
          delimiters={[KeyCodes.comma, KeyCodes.enter]}
          placeholder="Add tags"
          classNames={{
            tags: 'tagsClass',
            tagInput: 'tagInputClass',
            tagInputField: 'tagInputFieldClass',
            selected: 'selectedClass',
            tag: 'tagClass',
            remove: 'removeClass',
            suggestions: 'suggestionsClass',
          }}
        />
        <div className="category-icons">
          {reportCategories.map((category) => (
            <button key={category.id} onClick={() => addOrUpdateNote(category.id)}>
              <FiPlus /> {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="note-search"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories" type="category">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {reportCategories.map((category, index) => (
                <Draggable key={category.id} draggableId={category.id} index={index}>
                  {(provided) => (
                    <div
                      className="category-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="category-header" {...provided.dragHandleProps}>
                        <h3 onClick={() => toggleCategory(category.id)}>{category.name}</h3>
                        <div className="category-actions">
                          <button onClick={() => editCategory(category.id)}>
                            <FiEdit2 />
                          </button>
                          <button onClick={() => deleteCategory(category.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      {expandedCategories.includes(category.id) && (
                        <Droppable droppableId={category.id} type="note">
                          {(provided) => (
                            <div
                              className="notes-list"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {filteredNotes
                                .filter((note) => note.category === category.id)
                                .map((note, noteIndex) => (
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
                                        <div className="tags">
                                          {note.tags.map((tag, index) => (
                                            <span key={index} className="tag">
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="note-actions">
                                          <button onClick={() => editNote(note)}>
                                            <FiEdit2 />
                                          </button>
                                          <button onClick={() => archiveNote(note.id)}>
                                            <FiArchive />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
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

      <div className="add-category">
        <input
          type="text"
          placeholder="New Category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={addCategory}>
          <FiPlus />
        </button>
      </div>

      <button onClick={saveToTemplate} className="save-template-button">
        Save as Template
      </button>
    </div>
  );
};

export default Column3;
