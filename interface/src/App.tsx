import { useState } from 'react'
import './App.css'

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
  const [application, setApplication] = useState('satellite');
  const [components, setComponents] = useState<ComponentData[]>([{ name: '', type: '', consumption: 0, lifespan: 0 }]);
  const [results, setResults] = useState<EvaluationResults | null>(null);

  const addComponent = () => {
    setComponents([...components, {name: '', type: '', consumption: 0, lifespan: 0}]);
  }

  const handleComponentChange = (index: number, key: keyof ComponentData, value: string | number) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [key]: value };
    setComponents(updatedComponents);
  };

  const evaluateTwin = async () => {
    const response = await fetch('http://localhost:5000/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application, components })
    });
    const data = await response.json();
    setResults(data);
  };

  return (
  <div className='App'>
    <h1>Digital Twin Evaluator</h1>
    <form>
      <label>Application Type:</label>
      <select value={application} onChange={(e) => setApplication(e.target.value)}>
        <option value="satellite">Satellite</option>
        <option value="rehabilitation">Rehabilitation</option>
      </select>

      <h2>Components</h2>
      {components.map((component, index) => (
        <div key={index}>
          <input 
            type='text'
            placeholder='Name'
            value={component.name}
            onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
          />
          <input 
            type='text'
            placeholder='Type'
            value={component.type}
            onChange={(e) => handleComponentChange(index, 'name', e.target.value)} 
          />
          <input 
            type='number' 
            placeholder='Consumption (kWh/day)'
            value={component.consumption}
            onChange={(e) => handleComponentChange(index, 'lifespan', parseFloat(e.target.value))} 
          />
        </div>
      ))}
      <button type='button' onClick={addComponent}>Add Component</button>
      <button type='button' onClick={evaluateTwin}>Evaluate</button>
    </form>

    {results && (
      <div className='results'>
        <h2>Results</h2>
        <p>Final Score: {results.final_score}</p>
        <p>Classification: {results.classification}</p>
        <h3>Detailed Scores:</h3>
        {Object.entries(results.detailed_scores).map(([key, value]) => (
          <p key={key}>{key}: {value}</p>
        ))}
      </div>
    )}
  </div>
  );
}

export default App
