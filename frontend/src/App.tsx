import { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthPage } from './AuthPage';
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

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative inline-flex items-center" ref={tooltipRef}>
      <div className="flex items-center gap-1">
        {children}
        <HelpCircle 
          className="w-4 h-4 cursor-pointer" 
          style={{ color: '#000080' }} 
          onClick={toggleTooltip}
        />
      </div>
      {isVisible && (
        <div className="tooltip-overlay">
          <div className="tooltip-content">
            <button 
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" style={{ color: '#000080' }} />
            </button>
            <div className="pr-8">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function MainContent() {
  const { user, logout } = useAuth();
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

  const tooltips = {
    finalScore: "The final score is calculated by weighing multiple factors: component efficiency (30%), energy source (25%), reusability (25%), and waste management (20%). Scores range from 0-100.",
    componentEfficiency: "Measures how efficiently components use energy compared to industry standards. Higher efficiency results in better scores.",
    energySource: "Evaluates the environmental impact of the power source used. Renewable energy sources score higher.",
    reusability: "Assesses how easily components can be reused or repurposed at end-of-life. Longer lifespans and modular designs score better.",
    waste: "Measures the environmental impact of component disposal and any hazardous materials used.",
    consumption: "Daily energy consumption in kilowatt-hours (kWh). Lower consumption indicates better energy efficiency.",
    lifespan: "Expected operational lifetime in years. Longer lifespans generally indicate better sustainability.",
  };

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
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <div className="header-content">
          <div className="header-logos">
            <img src="/up2circ.png" alt="Up2Circ Logo" className="up2circ-logo" />
            <img src="/ctdt-c.png" alt="CTDT-C Logo" className="ctdt-logo" />
          </div>
          <h1>Ecological Evaluator</h1>
        </div>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
          <button className="info-btn" onClick={togglePopup} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ⓘ</button>
        </div>
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
            <div className="flex items-center gap-2">
              <Tooltip content={tooltips.consumption}>
                <div>
                  <label>Consumption (kWh/day):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={component.consumption}
                    onChange={(e) => handleComponentChange(index, 'consumption', parseFloat(e.target.value))}
                  />
                </div>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content={tooltips.lifespan}>
                <div>
                  <label>Lifespan (years):</label>
                  <input
                    type="number"
                    step="1"
                    value={component.lifespan}
                    onChange={(e) => handleComponentChange(index, 'lifespan', parseFloat(e.target.value))}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        ))}
        <button type="button" onClick={addComponent}>Add Component</button>
        <button type="button" onClick={evaluateTwin}>Evaluate</button>
      </form>

      {results && (
        <div className="results">
          <h2>Results</h2>
          <Tooltip content={tooltips.finalScore}>
            <p>Final Score: {results.final_score}</p>
          </Tooltip>
          <p>Classification: {results.classification}</p>
          <h3>Detailed Scores:</h3>
          <Tooltip content={tooltips.componentEfficiency}>
            <p>Component Efficiency: {results.detailed_scores['component_efficiency']}</p>
          </Tooltip>
          <Tooltip content={tooltips.energySource}>
            <p>Energy Source: {results.detailed_scores['energy_source']}</p>
          </Tooltip>
          <Tooltip content={tooltips.reusability}>
            <p>Reusability: {results.detailed_scores['reusability']}</p>
          </Tooltip>
          <Tooltip content={tooltips.waste}>
            <p>Waste: {results.detailed_scores['waste']}</p>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <MainContent />;
}

export default App;