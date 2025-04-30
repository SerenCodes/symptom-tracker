import React, { useState, useEffect } from "react";
import SymptomForm from "./components/SymptomForm";
import "./App.css";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [editingSymptom, setEditingSymptom] = useState(null);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedSymptoms = JSON.parse(localStorage.getItem("symptoms"));
    if (savedSymptoms) {
      setSymptoms(savedSymptoms);
    }
  }, []);

  // Save to localStorage whenever symptoms change
  useEffect(() => {
    localStorage.setItem("symptoms", JSON.stringify(symptoms));
  }, [symptoms]);

  const handleAddSymptom = (entry) => {
    setSymptoms((prev) => [entry, ...prev]);
  };

  const handleDeleteSymptom = (id) => {
    setSymptoms((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditSymptom = (id) => {
    const symptomToEdit = symptoms.find((item) => item.id === id);
    setEditingSymptom(symptomToEdit);
  };

  const handleSaveEditedSymptom = (editedSymptom) => {
    setSymptoms((prev) =>
      prev.map((item) => (item.id === editedSymptom.id ? editedSymptom : item))
    );
    setEditingSymptom(null);
  };

  const handleSaveToReport = (id) => {
    setSymptoms((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, savedToReport: true } : item
      )
    );
  };

  return (
    <div className="app-container">
      <h1 className="title">🩺 Symptom Tracker</h1>

      <input
        className="filter-date"
        type="date"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />

      <SymptomForm
        onAddSymptom={handleAddSymptom}
        editingSymptom={editingSymptom}
        onSaveEditedSymptom={handleSaveEditedSymptom}
      />

      <ul className="symptom-list">
        {symptoms
          .filter((item) => {
            if (!filterValue) return true;
            return item.date === filterValue;
          })
          .map((item) => (
            <li
              key={item.id}
              className={`symptom-item ${item.savedToReport ? "saved" : ""}`}
            >
              <div className="symptom-text">
                <strong>{item.date}</strong>: {item.symptom}
                <br />
                <span className={`severity severity-${item.severity}`}>
                  Severity: {item.severity}
                </span>
                {item.savedToReport && (
                  <div className="report-tag">📄 Saved to Report</div>
                )}
              </div>
              <div className="symptom-actions">
                <button
                  className="btn edit"
                  onClick={() => handleEditSymptom(item.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn delete"
                  onClick={() => handleDeleteSymptom(item.id)}
                >
                  🗑️ Delete
                </button>
                {!item.savedToReport && (
                  <button
                    className="btn report"
                    onClick={() => handleSaveToReport(item.id)}
                  >
                    📄 Save to Report
                  </button>
                )}
              </div>
            </li>
          ))}
        {symptoms.length === 0 && (
          <p className="no-symptoms">No symptoms to display yet.</p>
        )}
      </ul>
    </div>
  );
}

export default App;

