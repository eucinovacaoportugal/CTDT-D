import { useState, useEffect } from 'react';
import './App.css';

interface ComponentData {
  name: string;
  type: string;
  consumption: number;
  lifespan: number;
}

interface EvaluationResults {
  final_score: number;
  classification: string;
  detailed_scores: Record<string, number>;
}

function App() {
  const [components, setComponents] = useState<ComponentData[]>([{ name: '', type: '', consumption: 0, lifespan: 0 }]);
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [history, setHistory] = useState<EvaluationResults[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const componentDetails = [
    {
      type: "Wearable Sensors",
      description: "Typically low-power devices using microcontrollers and specialized energy-efficient sensors, advanced designs use Bluetooth Low Energy to minimize power drain."
    },
    {
      type: "3D Motion Capture Systems",
      description: "Higher energy consumption, professional systems use specialized GPUs and computers with high power requirements."
    },
    {
      type: "Haptic Feedback Devices",
      description: "Energy consumption varies by complexity, battery-powered versions optimize energy efficiency through pulse-width modulation."
    },
    {
      type: "Portable Ultrasound Machines",
      description: "Battery-powered models last 1-2 hours per charge, components like transducers and signal processors contribute to energy consumption."
    },
    {
      type: "Wireless Communication Devices",
      description: "Modern devices use adaptive power management to reduce overall energy use, highest power consumption up to 5 W."
    }
  ];

  useEffect(() => {
    const savedHistory = localStorage.getItem('evaluationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('evaluationHistory', JSON.stringify(history));
  }, [history]);

  const addComponent = () => {
    setComponents([...components, { name: '', type: '', consumption: 0, lifespan: 0 }]);
  };

  const handleComponentChange = (index: number, key: keyof ComponentData, value: string | number) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [key]: value };
    setComponents(updatedComponents);
  };

  const evaluateTwin = async () => {
    try {
      const response = await fetch('https://ctdt-d.onrender.com/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: 'custom',
          components: components,
        }),
      });      

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data: EvaluationResults = await response.json();
      setResults(data);
      const updatedHistory = [...history, data];
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error evaluating digital twin:', error);
      alert('Failed to evaluate digital twin. Please check the input and server connection.');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('evaluationHistory');
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  return (
    <div className="App">
      <header>
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '☰' : '☰'}
        </button>
        <h1>Ecological Evaluator</h1>
        <button className="info-btn" onClick={togglePopup} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ⓘ</button>
      </header>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              Score: {entry.final_score} - {entry.classification}
            </li>
          ))}
        </ul>
        <button onClick={clearHistory}>Clear History</button>
      </div>

      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Component Overview</h2>
              <button className="close-btn" onClick={togglePopup}>✕</button>
            </div>
            {componentDetails.map((detail, index) => (
              <div key={index}>
                <h3>{detail.type}</h3>
                <p>{detail.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form>
        <h2>Components</h2>
        {components.map((component, index) => (
          <div key={index} className="component-group">
            <h3>#{index + 1}</h3>
            <label>Name:</label>
            <input
              type="text"
              placeholder="Name"
              value={component.name}
              onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
            />
            <label>Type:</label>
            <input
              type="text"
              placeholder="Type"
              value={component.type}
              onChange={(e) => handleComponentChange(index, 'type', e.target.value)}
            />
            <label>Consumption (kWh/day):</label>
            <input
              type="number"
              step="0.5"
              value={component.consumption}
              onChange={(e) => handleComponentChange(index, 'consumption', parseFloat(e.target.value))}
            />
            <label>Lifespan (years):</label>
            <input
              type="number"
              step="1"
              value={component.lifespan}
              onChange={(e) => handleComponentChange(index, 'lifespan', parseFloat(e.target.value))}
            />
          </div>
        ))}
        <button type="button" onClick={addComponent}>Add Component</button>
        <button type="button" onClick={evaluateTwin}>Evaluate</button>
      </form>

      {results && (
        <div className="results">
          <h2>Results</h2>
          <p>Final Score: {results.final_score}</p>
          <p>Classification: {results.classification}</p>
          <h3>Detailed Scores:</h3>
          <p>Component Efficiency: {results.detailed_scores['component_efficiency']}</p>
          <p>Energy Source: {results.detailed_scores['energy_source']}</p>
          <p>Reusability: {results.detailed_scores['reusability']}</p>
          <p>Waste: {results.detailed_scores['waste']}</p>
        </div>
      )}
    </div>
  );
}

export default App;
