import { useState, useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import AuthModal from './AuthModal';
import Dropdown from './Dropdown';
import './App.css';

interface ComponentData {
  carbonFootprint: string;
  efficiency: string;
  infrastructureResilience: string;
  environmentalImpact: string;
  resourceOptimization: string;
  lifecycleManagement: string;
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

  return (
    <div ref={tooltipRef}>
      <div onClick={() => setIsVisible(!isVisible)}>
        {children}
      </div>
      {isVisible && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
};

function MainContent() {
  const [components, setComponents] = useState<ComponentData[]>([{
    name: '', type: '', consumption: 0, lifespan: 0,
    carbonFootprint: '',
    efficiency: '',
    infrastructureResilience: '',
    environmentalImpact: '',
    resourceOptimization: '',
    lifecycleManagement: ''
  }]);
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [digitalTwinStatus, setDigitalTwinStatus] = useState('');
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const videoRef = useRef<HTMLDivElement | null>(null);

  const tooltips  = {
    component: "To evaluate your system, describe it with values on the 'Description' field. Select the types of the values from your input, and click 'Evaluate'. To evaluate two systems at once, click 'Add System' and fill it with the same requirements.",
  };

  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    localStorage.setItem('evaluationHistory', JSON.stringify(history));
  }, [history]);

  const addComponent = () => {
    setComponents([...components, {
      name: '', type: '', consumption: 0, lifespan: 0,
      carbonFootprint: '',
      efficiency: '',
      infrastructureResilience: '',
      environmentalImpact: '',
      resourceOptimization: '',
      lifecycleManagement: ''
    }]);
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

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDigitalTwinStatus(e.target.value);
  };

  return (
    <div className="App">
      <header>
        <div className="header-content">
          <div className="header-logos">
            <img src="/up2circ.png" alt="Up2Circ Logo" className="up2circ-logo" />
            <img src="/ctdt-c.png" alt="CTDT-C Logo" className="ctdt-logo" />
          </div>
          <h1>Circular Transformation in Digital Twin Deployment</h1>
          <HelpCircle 
            className="w-6 h-6 cursor-pointer" 
            style={{ color: '#000080' }} 
            onClick={() => {
              setIsVideoVisible(true);
              scrollToVideo();
            }}
            aria-label="Help"
          />
        </div>
        <div className="header-actions">
          <AuthModal />
        </div>
      </header>

      <form>
        {components.map((component, index) => (
          <div key={index} className="component-group">
            <Tooltip content={tooltips.component} children={undefined}></Tooltip>
            <h3>#{index + 1}</h3>
            <label htmlFor="digitalTwinStatus">Select your digital twin status:</label>
            <select 
              id="digitalTwinStatus" 
              value={digitalTwinStatus} 
              onChange={handleSelectionChange} 
              required
            >
              <option value="" disabled>Select an option</option>
              <option value="deployed">I already have a deployed digital twin</option>
              <option value="planning">I'm planning my digital twin system</option>
            </select>
            <label>Description</label>
            <input type="text" placeholder="..." value={component.name} onChange={(e) => handleComponentChange(index, 'name', e.target.value)} />
            <div className="consumption-lifespan">
              <Dropdown
                label="Energy Efficiency"
                options={["Power Consumption", "Peak Power Usage", "Idle Power Usage", "Computation Time Distribution", "Cooling Energy Requirements", "Processing Efficiency", "Energy Storage Efficiency", "Power Factor", "Thermal Design Power"]}
                value={component.efficiency}
                onChange={(value) => handleComponentChange(index, 'efficiency', value)}
              />
              <Dropdown
                label="Carbon Footprint"
                options={["Direct CO2 Emissions", "Indirect CO2 Emissions", "Carbon Intensity", "Renewable Energy Percentage", "Carbon Offset Percentage", "Supply Chain Emissions", "E-waste Generation", "Water Usage"]}
                value={component.carbonFootprint}
                onChange={(value) => handleComponentChange(index, 'carbonFootprint', value)}
              />
            </div>
            <div className="consumption-lifespan">
              <Dropdown
                label="Resource Optimization"
                options={["Computing Resource Utilization", "Memory Usage Efficiency", "Storage Optimization Rate", "Network Bandwidth Efficiency", "Resource Scaling Accuracy", "Resource Recovery Time", "Resource Redundancy Level", "Hardware Utilization Rate"]}
                value={component.resourceOptimization}
                onChange={(value) => handleComponentChange(index, 'resourceOptimization', value)}
              />

              <Dropdown
                label="Lifecycle Management"
                options={["Data Compression Ratio", "Data Deduplication Rate", "Storage Efficiency", "Data Access Patterns", "Data Retention Optimization", "Update Frequency Efficiency", "Data Quality Score", "Archive Ratio"]}
                value={component.lifecycleManagement}
                onChange={(value) => handleComponentChange(index, 'lifecycleManagement', value)}
              />
            </div>
            <div className="consumption-lifespan">
              <Dropdown
                label="Environmental Impact"
                options={["Electronic Waste Generation", "Water Consumption", "Heat Generation", "Noise Pollution", "Material Recyclability", "Biodiversity Impact", "Land Use Efficiency", "Chemical Usage"]}
                value={component.environmentalImpact}
                onChange={(value) => handleComponentChange(index, 'environmentalImpact', value)}
              />
              <Dropdown
                label="Infrastructure Resilience"
                options={["System Reliability", "Fault Tolerance", "Recovery Time", "Maintenance Efficiency", "Upgrade Frequency", "Component Lifespan", "Redundancy Level", "Disaster Recovery Capability"]}
                value={component.infrastructureResilience}
                onChange={(value) => handleComponentChange(index, 'infrastructureResilience', value)}
              />
            </div>
          </div>
        ))}
        <div className="buttons">
          <button className="buttonc" type="button" onClick={addComponent}>Add System</button>
          <button type="button" onClick={evaluateTwin}>Evaluate</button>
        </div>
      </form>

      {isVideoVisible && (
        <div className="tutorial-video-overlay">
          <div className="tutorial-video-container">
            <button 
              className="tutorial-video-close"
              onClick={() => setIsVideoVisible(false)}
            >
              ×
            </button>
            <iframe
              className="tutorial-video-frame"
              src="https://www.youtube.com/embed/your_tutorial_video_id"
              title="Tutorial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {results && (
        <div className="results">
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