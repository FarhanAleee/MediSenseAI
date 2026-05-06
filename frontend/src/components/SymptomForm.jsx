import { useState, useEffect, useRef } from "react";
import { listAllSymptoms } from "../services/api";

const regionCities = {
  Pakistan: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Hyderabad", "Peshawar", "Sukkur", "Ghotki"],
  India: ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata"],
  Afghanistan: ["Kabul", "Herat", "Kandahar", "Mazar-i-Sharif"],
  Africa: ["Nairobi", "Cairo", "Johannesburg", "Lagos", "Accra"],
  Sudan: ["Khartoum", "Omdurman", "Port Sudan", "Nyala"],
  Global: ["Any City"],
};

const fallbackSymptoms = [
  "fever", "cough", "headache", "fatigue", "body ache", "chills", "sore throat",
  "runny nose", "shortness of breath", "chest pain", "nausea", "vomiting",
  "diarrhea", "abdominal pain", "dizziness", "muscle pain", "rash", "loss of taste",
  "loss of smell", "weakness", "joint pain", "sweating", "eye pain", "red eyes",
  "congestion", "sneezing", "coughing", "wheezing", "loss of appetite"
];

export default function SymptomForm({ onSubmit, loading }) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState([]);
  const [region, setRegion] = useState("Pakistan");
  const [city, setCity] = useState(regionCities["Pakistan"][0]);
  const [allSymptoms, setAllSymptoms] = useState(fallbackSymptoms);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    listAllSymptoms()
      .then(d => {
        const symptoms = d.symptoms || [];
        if (symptoms.length > 0) {
          setAllSymptoms(symptoms);
          console.log("Symptoms loaded from backend:", symptoms.length);
        } else {
          console.warn("No symptoms from backend, using fallback");
          setAllSymptoms(fallbackSymptoms);
        }
      })
      .catch(err => {
        console.error("Failed to load symptoms:", err);
        setAllSymptoms(fallbackSymptoms);
      });
  }, []);

  const handleInput = (val) => {
    setInput(val);
    if (val.length < 1) {
      setSuggestions([]);
      return;
    }
    const q = val.toLowerCase().trim();
    const filtered = allSymptoms
      .filter(s => s && s.toLowerCase().includes(q) && !selected.includes(s))
      .slice(0, 8);
    setSuggestions(filtered);
  };

  const addSymptom = (sym) => {
    if (!selected.includes(sym)) {
      setSelected(prev => [...prev, sym]);
    }
    setInput("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const addRaw = () => {
    const trimmed = input.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
    }
    setInput("");
    setSuggestions([]);
  };

  const removeSymptom = (sym) => setSelected(prev => prev.filter(s => s !== sym));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addRaw();
    if (e.key === "Escape") setSuggestions([]);
  };

  return (
    <div className="symptom-form">
      <div className="form-group">
        <label>Search & Add Symptoms</label>
        <div className="input-with-button">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. fever, headache, cough…"
          />
          <button className="btn btn-secondary" type="button" onClick={addRaw}>
            Add
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map(sym => (
              <button key={sym} type="button" className="suggestion-item" onClick={() => addSymptom(sym)}>
                {sym}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="tag-list">
          {selected.map(sym => (
            <span className="tag-pill" key={sym}>
              {sym}
              <button type="button" onClick={() => removeSymptom(sym)}>×</button>
            </span>
          ))}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>Region</label>
          <select
            value={region}
            onChange={e => {
              const nextRegion = e.target.value;
              setRegion(nextRegion);
              setCity(regionCities[nextRegion]?.[0] || "");
            }}
          >
            {Object.keys(regionCities).map(regionName => (
              <option key={regionName} value={regionName}>{regionName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>City</label>
          <select value={city} onChange={e => setCity(e.target.value)}>
            {(regionCities[region] || ["Any City"]).map(cityOption => (
              <option key={cityOption} value={cityOption}>{cityOption}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary fill-width" disabled={selected.length === 0 || loading} onClick={() => onSubmit(selected, region, city)}>
        {loading ? "Analyzing your symptoms…" : `⚕ Analyze Symptoms (${selected.length})`}
      </button>
    </div>
  );
}
