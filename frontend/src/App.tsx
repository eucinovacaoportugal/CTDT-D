import { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';
import AuthModal from './AuthModal';
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
            <X 
              className="absolute top-1 left-1 w-4 h-4 cursor-pointer" 
              style={{ color: '#000080' }} 
              onClick={() => setIsVisible(false)}
            />
            <div className="ml-5 mt-2">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function MainContent() {
  const [components, setComponents] = useState<ComponentData[]>([{ name: '', type: '', consumption: 0, lifespan: 0 }]);
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // const componentDetails = [
  //   {
  //     type: "Algorithm",
  //     description: "This is the V0.1 prototype of the Digital Twin Deployment Algorithm."
  //   }
  // ];

  const tooltips = {
    finalScore: "The algorithm calculates the final score using weighted components: Component Efficiency (20%), Energy Source (25%), Reusability (20%), and Waste Management (20%). Scores range from 0-100, with ≥75 classified as 'Ecologic', ≥50 as 'Moderate', and <50 as 'Not ecologic'.",
    componentEfficiency: "Component efficiency is calculated by summing the energy consumption (kWh/day) of all components and normalizing it per component. The score starts at 100 and decreases based on average consumption, ensuring higher efficiency results in better scores.",
    energySource: "Energy source score directly reflects the percentage of renewable energy used (0-100%). This considers your local energy grid's renewable energy mix, with higher renewable percentages resulting in better scores.",
    reusability: "Reusability is a binary score: 100 points if the components are reusable, 0 if not. This encourages designs that consider end-of-life component recovery and reuse in other applications.",
    waste: "Waste score starts at 100 and decreases by 10 points per kg of waste generated. The algorithm caps the minimum score at 0 and the maximum at 100, encouraging minimal waste production.",
    consumption: "Enter the daily energy consumption in kilowatt-hours (kWh/day). This value directly impacts the component efficiency score - lower consumption leads to higher scores in the final evaluation.",
    lifespan: "Component lifespan in years affects the overall sustainability assessment. Longer lifespans typically indicate better sustainability as they reduce the need for frequent replacements.",
  };

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
    } catch (error) {
      console.error('Error evaluating digital twin:', error);
      alert('Failed to evaluate digital twin. Please check the input and server connection.');
    }
  };

  // const togglePopup = () => {
  //   setPopupOpen(!popupOpen);
  // };

  return (
    <div className="App">
      <header>
        <div className="header-content">
          <div className="header-logos">
            <img src="/up2circ.png" alt="Up2Circ Logo" className="up2circ-logo" />
            <img src="/ctdt-c.png" alt="CTDT-C Logo" className="ctdt-logo" />
          </div>
          <h1>Circular Transformation in Digital Twin Deployment</h1>
        </div>
        <div className="header-actions">
          <AuthModal />
          {/* <button 
            className="info-btn" 
            onClick={togglePopup} 
            style={{ fontSize: '1rem', fontWeight: 'bold'}}>
            ⓘ
          </button>         */}
        </div>
      </header>

      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            {/* <div className="popup-header">
              <button className="close-btn" onClick={togglePopup}>✕</button>
            </div> */}
            {/* {componentDetails.map((detail, index) => (
              <div key={index}>
                <h3>{detail.type}</h3>
                <p>{detail.description}</p>
              </div>
            ))} */}
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
            <div className="consumption-lifespan">
                <Tooltip content={tooltips.consumption}>
                  <label>Consumption (kWh/day):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={component.consumption}
                    onChange={(e) => handleComponentChange(index, 'consumption', parseFloat(e.target.value))}
                  />
                </Tooltip>

                <Tooltip content={tooltips.lifespan}>
                  <label>Lifespan (years):</label>
                  <input
                    type="number"
                    step="1"
                    value={component.lifespan}
                    onChange={(e) => handleComponentChange(index, 'lifespan', parseFloat(e.target.value))}
                  />
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
          <p>Your system has been evaluated based on several sustainability metrics.</p>

          <h3>Overall Score: {results.final_score}</h3>
          <p>This score represents the overall sustainability of your digital twin. Higher scores indicate a more efficient and environmentally friendly setup.</p>

          <h3>Classification: {results.classification}</h3>
          <p>The classification helps understand how well your system aligns with sustainability goals:</p>
          <ul>
            <li><strong>Ecologic (75+):</strong> Your system is highly sustainable and optimized for minimal environmental impact.</li>
            <li><strong>Moderate (50-74):</strong> There are areas for improvement, particularly in efficiency, reusability, or energy source.</li>
            <li><strong>Not Ecologic (&lt;50):</strong> Significant optimizations are required to enhance sustainability.</li>
          </ul>

          <h3>Detailed Breakdown</h3>
          <ul>
            <li><strong>Component Efficiency:</strong> {results.detailed_scores['component_efficiency']} - A high score indicates efficient energy usage and minimal waste.</li>
            <li><strong>Energy Source:</strong> {results.detailed_scores['energy_source']} - This reflects the proportion of renewable energy used. Consider increasing renewable energy sources to improve sustainability.</li>
            <li><strong>Reusability:</strong> {results.detailed_scores['reusability']} - A higher score means more components are reusable, reducing waste.</li>
            <li><strong>Waste Management:</strong> {results.detailed_scores['waste']} - Lower scores indicate high waste production; improving recycling strategies can enhance sustainability.</li>
          </ul>

          <h3>Suggestions for Improvement</h3>
          <p>Based on your scores, consider the following recommendations:</p>
          <ul>
            <li>Optimize component efficiency by reducing unnecessary energy consumption.</li>
            <li>Increase reliance on renewable energy sources where possible.</li>
            <li>Design components for reusability to minimize electronic waste.</li>
            <li>Improve waste management strategies by incorporating recycling and sustainable materials.</li>
          </ul>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <img src="/eulogo.png" alt="EU Logo" className="eu-logo" />
          <p>This is the V0.1 prototype of the Digital Twin Deployment Algorithm.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <MainContent />
  );
}

export default App;