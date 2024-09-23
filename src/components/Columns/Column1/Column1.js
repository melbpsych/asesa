// src/components/Columns/Column1/Column1.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Column1.css';

const Column1 = () => {
  const { clientData, setClientData, lawyers, setLawyers } = useContext(AppContext);
  const [lawyerSearchTerm, setLawyerSearchTerm] = useState('');
  const [showLawyerForm, setShowLawyerForm] = useState(false);

  const prisons = [
    'Barwon Prison',
    'Dame Phyllis Frost Centre',
    // ... other prisons
  ];

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    sex: Yup.string().required('Required'),
    dateOfBirth: Yup.date().required('Required'),
  });

  const initialValues = {
    ...clientData,
    listOfCharges: clientData.listOfCharges || [],
    interviews: clientData.interviews || [],
    collateralInformation: clientData.collateralInformation || [],
    dateRangeOfOffending: clientData.dateRangeOfOffending || { from: '', to: '' },
  };

  const handleLawyerSelect = (lawyer) => {
    setClientData({ ...clientData, lawyer });
    setLawyerSearchTerm('');
  };

  const addLawyer = (values) => {
    setLawyers([...lawyers, { id: Date.now(), ...values }]);
    setShowLawyerForm(false);
  };

  return (
    <div className="column1">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setClientData(values);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="form-container">
            {/* Personal Details */}
            <div className="form-group">
              <label>First Name</label>
              <Field name="firstName" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <Field name="lastName" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <Field name="phoneNumber" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <Field name="email" type="email" />
            </div>
            <div className="form-group">
              <label>Sex</label>
              <Field as="select" name="sex">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <Field name="dateOfBirth">
                {({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => setFieldValue('dateOfBirth', date)}
                    dateFormat="dd/MM/yyyy"
                  />
                )}
              </Field>
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <Field name="occupation" />
            </div>
            <div className="form-group">
              <label>Relationship Status</label>
              <Field as="select" name="relationshipStatus">
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                {/* ... other options */}
              </Field>
            </div>
            <div className="form-group">
              <label>Informed Consent</label>
              <Field type="checkbox" name="informedConsent" />
            </div>
            <div className="form-group">
              <label>Prior Mental Health Diagnoses</label>
              <Field name="priorDiagnoses" as="textarea" />
            </div>
            <div className="form-group">
              <label>Medical Conditions</label>
              <Field name="medicalConditions" as="textarea" />
            </div>

            {/* Lawyer Details */}
            <div className="form-group">
              <label>Lawyer</label>
              <input
                type="text"
                placeholder="Search Lawyers..."
                value={lawyerSearchTerm}
                onChange={(e) => setLawyerSearchTerm(e.target.value)}
              />
              <ul className="lawyer-list">
                {lawyers
                  .filter(
                    (lawyer) =>
                      lawyer.firstName.toLowerCase().includes(lawyerSearchTerm.toLowerCase()) ||
                      lawyer.lastName.toLowerCase().includes(lawyerSearchTerm.toLowerCase())
                  )
                  .map((lawyer) => (
                    <li key={lawyer.id} onClick={() => handleLawyerSelect(lawyer)}>
                      {lawyer.firstName} {lawyer.lastName}
                    </li>
                  ))}
              </ul>
              <button type="button" onClick={() => setShowLawyerForm(true)}>
                Add New Lawyer
              </button>
              {showLawyerForm && (
                <div className="lawyer-form">
                  <Formik
                    initialValues={{
                      title: '',
                      firstName: '',
                      lastName: '',
                      address: '',
                      city: '',
                      state: '',
                      postcode: '',
                    }}
                    onSubmit={(lawyerValues) => addLawyer(lawyerValues)}
                  >
                    {() => (
                      <Form>
                        <div className="form-group">
                          <label>Title</label>
                          <Field name="title" />
                        </div>
                        <div className="form-group">
                          <label>First Name</label>
                          <Field name="firstName" />
                        </div>
                        <div className="form-group">
                          <label>Last Name</label>
                          <Field name="lastName" />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <Field name="address" />
                        </div>
                        <div className="form-group">
                          <label>City</label>
                          <Field name="city" />
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <Field name="state" />
                        </div>
                        <div className="form-group">
                          <label>Postcode</label>
                          <Field name="postcode" />
                        </div>
                        <button type="submit">Save Lawyer</button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>

            {/* Date Range of Offending */}
            <div className="form-group">
              <label>Date Range of Offending</label>
              <div className="date-range">
                <Field name="dateRangeOfOffending.from">
                  {({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => setFieldValue('dateRangeOfOffending.from', date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="From"
                    />
                  )}
                </Field>
                <Field name="dateRangeOfOffending.to">
                  {({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => setFieldValue('dateRangeOfOffending.to', date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="To"
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* List of Charges */}
            <div className="form-group">
              <label>List of Charges</label>
              <FieldArray name="listOfCharges">
                {({ remove, push }) => (
                  <div>
                    {values.listOfCharges.length > 0 ? (
                      values.listOfCharges.map((charge, index) => (
                        <div key={index} className="list-item">
                          <Field name={`listOfCharges.${index}`} />
                          <button type="button" onClick={() => remove(index)}>
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No charges yet</p>
                    )}
                    <button
                      type="button"
                      onClick={() => push('')}
                      className="add-item-button"
                    >
                      Add Charge
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Interviews */}
            <div className="form-group">
              <label>Interviews Conducted</label>
              <FieldArray name="interviews">
                {({ remove, push }) => (
                  <div>
                    {values.interviews.length > 0 ? (
                      values.interviews.map((interview, index) => (
                        <div key={index} className="interview-item">
                          <Field name={`interviews.${index}.location`} placeholder="Location" />
                          <Field name={`interviews.${index}.date`}>
                            {({ field }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) =>
                                  setFieldValue(`interviews.${index}.date`, date)
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Date"
                              />
                            )}
                          </Field>
                          <Field name={`interviews.${index}.startTime`} placeholder="Start Time" />
                          <Field name={`interviews.${index}.endTime`} placeholder="End Time" />
                          <button type="button" onClick={() => remove(index)}>
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No interviews yet</p>
                    )}
                    <button
                      type="button"
                      onClick={() => push({ location: '', date: '', startTime: '', endTime: '' })}
                      className="add-item-button"
                    >
                      Add Interview
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Collateral Information */}
            <div className="form-group">
              <label>Collateral Information Provided</label>
              <FieldArray name="collateralInformation">
                {({ remove, push }) => (
                  <div>
                    {values.collateralInformation.length > 0 ? (
                      values.collateralInformation.map((info, index) => (
                        <div key={index} className="collateral-item">
                          <Field
                            name={`collateralInformation.${index}.description`}
                            placeholder="Description"
                          />
                          <Field name={`collateralInformation.${index}.dateProvided`}>
                            {({ field }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) =>
                                  setFieldValue(`collateralInformation.${index}.dateProvided`, date)
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Date Provided"
                              />
                            )}
                          </Field>
                          <Field name={`collateralInformation.${index}.dateOfDocument`}>
                            {({ field }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) =>
                                  setFieldValue(
                                    `collateralInformation.${index}.dateOfDocument`,
                                    date
                                  )
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Date of Document"
                              />
                            )}
                          </Field>
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFieldValue(
                                `collateralInformation.${index}.fileLink`,
                                URL.createObjectURL(file)
                              );
                            }}
                          />
                          <button type="button" onClick={() => remove(index)}>
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No collateral information yet</p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          description: '',
                          dateProvided: '',
                          dateOfDocument: '',
                          fileLink: '',
                        })
                      }
                      className="add-item-button"
                    >
                      Add Collateral
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <button type="submit" className="save-button">
              Save Details
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Column1;
