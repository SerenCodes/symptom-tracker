import React, { useState, useEffect } from "react";
import SymptomForm from "./components/SymptomForm";
import "./App.css";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [editingSymptom, setEditingSymptom] = useState(null);

  // Load symptoms from localStorage
  useEffect(() => {
    const savedSymptoms = JSON.parse(localStorage.getItem("symptoms"));
    if (savedSymptoms) {
      setSymptoms(savedSymptoms);
    }
  }, []);

  // Save to localStorage on every change
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
    const toEdit = symptoms.find((item) => item.id === id);
    setEditingSymptom(toEdit);
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

  const downloadCSV = () => {
    if (symptoms.length === 0) {
      alert("No symptoms to download.");
      return;
    }

    const headers = ["Date", "Symptom", "Severity"];
    const rows = symptoms.map((s) => [s.date, s.symptom, s.severity]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "symptom_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* 🔹 Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="title-container">
            <span className="title-icon">➕</span>
            <span className="title-text">Symptom Tracker</span>
          </div>
          <p className="subtitle">Keep track of your health day by day</p>
        </div>
      </div>

      {/* 🔹 Main App Container */}
      <div className="app-container">
        <button className="btn download-btn" onClick={downloadCSV}>
          ⬇️ Download Report (CSV)
        </button>

        <input
          className="filter-date"
          type="date"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />

        {/* 🔹 Symptom Form */}
        <SymptomForm
          onAddSymptom={handleAddSymptom}
          editingSymptom={editingSymptom}
          onSaveEditedSymptom={handleSaveEditedSymptom}
        />

        {/* 🔹 Symptom List */}
        <ul className="symptom-list">
          {symptoms
            .filter((item) => !filterValue || item.date === filterValue)
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
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDeleteSymptom(item.id)}
                  >
                    Delete
                  </button>
                  {!item.savedToReport && (
                    <button
                      className="btn report"
                      onClick={() => handleSaveToReport(item.id)}
                    >
                      Save to Report
                    </button>
                  )}
                </div>
              </li>
            ))}

          {/* 🔹 No symptoms message */}
          {symptoms.length === 0 && (
            <p className="no-symptoms">No symptoms to display yet.</p>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;