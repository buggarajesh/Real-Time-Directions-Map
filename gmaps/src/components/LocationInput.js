import React from "react";
import "./Location.css";

const LocationInput = ({ label, value, onChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter coordinates (lat, lng)"
      />
    </div>
  );
};

export default LocationInput;