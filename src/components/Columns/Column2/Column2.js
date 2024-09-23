// src/components/Columns/Column2/Column2.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import './Column2.css';

const Column2 = () => {
  const { assessmentPlan, setAssessmentPlan, templates, setTemplates, currentTemplateName } =
    useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editedQuestions, setEditedQuestions] = useState({});

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'category') {
      const categories = Array.from(assessmentPlan.categories);
      const [moved] = categories.splice(source.index, 1);
      categories.splice(destination.index, 0, moved);
      setAssessmentPlan({ categories });
    } else if (type === 'question') {
      const sourceCategoryIndex = assessmentPlan.categories.findIndex(
        (cat) => cat.id === source.droppableId
      );
      const destCategoryIndex = assessmentPlan.categories.findIndex(
        (cat) => cat.id === destination.droppableId
      );

      const sourceQuestions = Array.from(assessmentPlan.categories[sourceCategoryIndex].questions);
      const [movedQuestion] = sourceQuestions.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceQuestions.splice(destination.index, 0, movedQuestion);
        const newCategories = [...assessmentPlan.categories];
        newCategories[sourceCategoryIndex].questions = sourceQuestions;
        setAssessmentPlan({ categories: newCategories });
      } else {
        const destQuestions = Array.from(
          assessmentPlan.categories[destCategoryIndex].questions
        );
        destQuestions.splice(destination.index, 0, movedQuestion);

        const newCategories = [...assessmentPlan.categories];
        newCategories[sourceCategoryIndex].questions = sourceQuestions;
        newCategories[destCategoryIndex].questions = destQuestions;
        setAssessmentPlan({ categories: newCategories });
      }
    }
  };

  const filteredCategories = assessmentPlan.categories
    .map((category) => {
      const filteredQuestions = category.questions.filter((question) =>
        question.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filteredQuestions.length > 0
      ) {
        return {
          ...category,
          questions: filteredQuestions,
        };
      }
      return null;
    })
    .filter(Boolean);

  const addCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      questions: [],
    };
    setAssessmentPlan((prev) => ({
      categories: [...prev.categories, newCategory],
    }));
    setNewCategoryName('');
  };

  const editCategory = (category) => {
    setEditCategoryId(category.id);
    setEditedCategoryName(category.name);
  };

  const saveCategory = (categoryId) => {
    setAssessmentPlan((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name: editedCategoryName } : cat
      ),
    }));
    setEditCategoryId(null);
    setEditedCategoryName('');
  };

  const deleteCategory = (categoryId) => {
    setAssessmentPlan((prev) => ({
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }));
  };

  const addQuestion = (categoryId) => {
    const questionText = prompt('Enter question text:');
    if (questionText) {
      setAssessmentPlan((prev) => ({
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, questions: [...cat.questions, questionText] }
            : cat
        ),
      }));
    }
  };

  const editQuestion = (categoryId, index) => {
    const questionText = prompt(
      'Edit question text:',
      assessmentPlan.categories.find((cat) => cat.id === categoryId).questions[index]
    );
    if (questionText !== null) {
      setAssessmentPlan((prev) => ({
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                questions: cat.questions.map((q, i) => (i === index ? questionText : q)),
              }
            : cat
        ),
      }));
    }
  };

  const deleteQuestion = (categoryId, index) => {
    setAssessmentPlan((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.filter((_, i) => i !== index),
            }
          : cat
      ),
    }));
  };

  const saveToTemplate = () => {
    setTemplates((prevTemplates) => ({
      ...prevTemplates,
      [currentTemplateName]: {
        ...prevTemplates[currentTemplateName],
        assessmentPlan,
      },
    }));
    alert('Assessment Plan saved to template!');
  };

  return (
    <div className="column2">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="question-search"
        />
      </div>
      <div className="add-category">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={addCategory}>
          <FiPlus />
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories" type="category">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {filteredCategories.map((category, index) => (
                <Draggable key={category.id} draggableId={category.id} index={index}>
                  {(provided) => (
                    <div
                      className="category-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="category-header" {...provided.dragHandleProps}>
                        {editCategoryId === category.id ? (
                          <>
                            <input
                              type="text"
                              value={editedCategoryName}
                              onChange={(e) => setEditedCategoryName(e.target.value)}
                            />
                            <button onClick={() => saveCategory(category.id)}>
                              <FiSave />
                            </button>
                          </>
                        ) : (
                          <>
                            <h3>{category.name}</h3>
                            <div className="category-actions">
                              <button onClick={() => editCategory(category)}>
                                <FiEdit2 />
                              </button>
                              <button onClick={() => deleteCategory(category.id)}>
                                <FiTrash2 />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <button onClick={() => addQuestion(category.id)} className="add-question-button">
                        <FiPlus /> Add Question
                      </button>
                      <Droppable droppableId={category.id} type="question">
                        {(provided) => (
                          <ul ref={provided.innerRef} {...provided.droppableProps}>
                            {category.questions.map((question, qIndex) => (
                              <Draggable
                                key={`${category.id}-${qIndex}`}
                                draggableId={`${category.id}-${qIndex}`}
                                index={qIndex}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {question}
                                    <div className="question-actions">
                                      <button onClick={() => editQuestion(category.id, qIndex)}>
                                        <FiEdit2 />
                                      </button>
                                      <button onClick={() => deleteQuestion(category.id, qIndex)}>
                                        <FiTrash2 />
                                      </button>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
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

export default Column2;
