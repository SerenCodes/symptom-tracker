import React, { useState, useEffect } from "react";
import "./SymptomForm.css";

function SymptomForm({ onAddSymptom, editingSymptom, onSaveEditedSymptom }) {
  const [date, setDate] = useState("");
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("mild");

  useEffect(() => {
    if (editingSymptom) {
      setDate(editingSymptom.date);
      setSymptom(editingSymptom.symptom);
      setSeverity(editingSymptom.severity);
    }
  }, [editingSymptom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !symptom) {
      alert("Please fill in both date and symptom.");
      return;
    }

    const newEntry = {
      id: editingSymptom ? editingSymptom.id : Date.now(),
      date,
      symptom,
      severity,
    };

    if (editingSymptom) {
      onSaveEditedSymptom(newEntry);
    } else {
      onAddSymptom(newEntry);
    }

    // Reset form
    setDate("");
    setSymptom("");
    setSeverity("mild");
  };

  return (
    <div className="form-container">
      <h2>{editingSymptom ? "Edit Symptom" : "Add New Symptom"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter symptom"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          {editingSymptom ? "Save Changes" : "Add"}
        </button>
      </form>
    </div>
  );
}

export default SymptomForm;
