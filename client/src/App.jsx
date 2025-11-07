import React, { useState } from 'react';
import { Zap, Clock, Brain, GitBranch, Activity } from 'lucide-react';
import QueryForm from './components/QueryForm';
import ResultsDisplay from './components/ResultsDisplay';
import StatusIndicator from './components/StatusIndicator';
import FeatureShowcase from './components/FeatureShowcase';
import AgentActivity from './components/AgentActivity';
import MetricsDashboard from './components/MetricsDashboard';
import DemoModeToggle from './components/DemoModeToggle';
import LoadingState from './components/LoadingState';
import NotificationToast from './components/NotificationToast';

function App() {
  const [optimization, setOptimization] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [agentLogs] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [demoMode, setDemoMode] = useState(true); // Start in demo mode for hackathon
  const [notification, setNotification] = useState(null);

  const handleOptimizationStart = async (queries, options) => {
    setIsRunning(true);
    setOptimization(null);

    try {
      // Show start notification
      setNotification({
        type: 'info',
        title: demoMode ? 'Demo Mode Active' : 'Starting Optimization',
        message: demoMode ? 'Running simulated A/B testing for demonstration' : 'Connecting to Tiger Data and creating forks...',
        duration: 3000
      });

      if (demoMode) {
        // Demo mode - simulate the optimization process
        await runDemoOptimization(queries, options);
      } else {
        // Live mode - try backend first, fallback to demo
        try {
          await runLiveOptimization(queries, options);
        } catch (backendError) {
          setNotification({
            type: 'warning',
            title: 'Switched to Demo Mode',
            message: 'Backend unavailable, running simulation instead',
            duration: 4000
          });
          setDemoMode(true);
          await runDemoOptimization(queries, options);
        }
      }
    } catch (error) {
      setOptimization({
        status: 'failed',
        error: error.message,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      });
      setIsRunning(false);
      
      // Show error notification
      setNotification({
        type: 'error',
        title: 'Optimization Failed',
        message: error.message,
        duration: 5000
      });
    }
  };

  const runDemoOptimization = async (queries, options) => {
    try {
      const startTime = new Date().toISOString();

      // Import demo utilities
      const demoModule = await import('./utils/demoData.js');
      const { generateDemoOptimizationResult, simulateOptimizationProgress } = demoModule;

      // Simulate the optimization process
      simulateOptimizationProgress((status) => {
        setOptimization(prev => ({
          ...prev,
          status: status.status,
          startTime,
          results: null,
          error: null
        }));
      });

      // Generate demo results after simulation completes
      setTimeout(() => {
        try {
          const demoResults = generateDemoOptimizationResult(queries);

          setOptimization({
            status: 'completed',
            startTime,
            endTime: new Date().toISOString(),
            results: demoResults,
            error: null
          });
          setIsRunning(false);
          
          // Show success notification
          const improvement = Math.abs(demoResults.comparison?.improvement?.percentage || 25);
          setNotification({
            type: 'success',
            title: 'Optimization Complete!',
            message: `Found ${improvement.toFixed(1)}% performance improvement`,
            duration: 5000
          });
        } catch (resultsError) {
          console.error('Error generating demo results:', resultsError);
          setOptimization({
            status: 'failed',
            error: 'Demo simulation failed',
            startTime,
            endTime: new Date().toISOString()
          });
          setIsRunning(false);
        }
      }, 8000); // Total demo time: 8 seconds
    } catch (error) {
      setOptimization({
        status: 'failed',
        error: 'Demo mode unavailable',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      });
      setIsRunning(false);
      throw error;
    }
  };

  const runLiveOptimization = async (queries, options) => {
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queries, tableName: options.tableName || options }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const { jobId } = await response.json();
      
      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/optimize/${jobId}`);
          
          if (!statusResponse.ok) {
            throw new Error('Status check failed');
          }
          
          const status = await statusResponse.json();

          if (status.status === 'completed') {
            setOptimization(status);
            setIsRunning(false);
            clearInterval(pollInterval);
          } else if (status.status === 'failed') {
            setOptimization(status);
            setIsRunning(false);
            clearInterval(pollInterval);
          }
        } catch (error) {
          // Fallback to demo mode if backend fails
          setDemoMode(true);
          clearInterval(pollInterval);
          await runDemoOptimization(queries, options);
        }
      }, 2000);

      // Cleanup after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isRunning) {
          setIsRunning(false);
        }
      }, 300000);

    } catch (error) {
      // Fallback to demo mode
      setDemoMode(true);
      await runDemoOptimization(queries, options);
    }
  };

  return (
    <div className="container">
      <DemoModeToggle
        demoMode={demoMode}
        onToggle={() => setDemoMode(!demoMode)}
      />

      {/* Hackathon Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '24px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
          🏆 Agentic Postgres Challenge Submission
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          Powered by <strong>Tiger Data</strong> • Zero-Copy Forks • Multi-Agent MCP • Hybrid Search
        </div>
      </div>

      <header className="header">
        <h1>
          <GitBranch size={48} />
          Forked A/B Index Optimizer
        </h1>
        <p>
          AI-powered database optimization using Agentic Postgres zero-copy forks and MCP agents
        </p>
        <div className="subtitle">
          <span className="tech-badge">🐅 Tiger Data</span>
          <span className="tech-badge">🤖 Multi-Agent System</span>
          <span className="tech-badge">🔍 Hybrid Search</span>
          <span className="tech-badge">⚡ Zero-Copy Forks</span>
        </div>
      </header>

      <FeatureShowcase />

      <main>
        <div className="card">
          <div className="card-header">
            <Brain size={28} className="text-blue-600" />
            <h2 className="card-title">AI-Powered Query Optimization</h2>
          </div>
          
          <QueryForm 
            onSubmit={handleOptimizationStart}
            isRunning={isRunning}
            onAdvancedToggle={() => setShowAdvanced(!showAdvanced)}
            showAdvanced={showAdvanced}
          />
        </div>

        {isRunning && (
          <LoadingState 
            isRunning={isRunning}
            currentStatus={optimization?.status}
          />
        )}

        {(isRunning || optimization) && (
          <>
            {/* Compact Metrics Bar */}
            <div className="metrics-bar">
              <div className="metrics-header">
                <Activity size={18} className="text-indigo-600" />
                <h3 className="metrics-title">Live Metrics</h3>
              </div>
              <MetricsDashboard
                isRunning={isRunning}
                results={optimization?.results}
              />
            </div>

            <div className="grid status-grid">
              <div className="card compact">
                <div className="card-header">
                  <Clock size={20} className="text-orange-600" />
                  <h2 className="card-title">Optimization Progress</h2>
                </div>

                <StatusIndicator
                  isRunning={isRunning}
                  optimization={optimization}
                />
              </div>

              <div className="card compact">
                <div className="card-header">
                  <Zap size={20} className="text-green-600" />
                  <h2 className="card-title">Agent Activity</h2>
                </div>

                <AgentActivity
                  logs={agentLogs}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </>
        )}

        {optimization && optimization.results && (
          <ResultsDisplay results={optimization.results} />
        )}
      </main>

      <footer className="text-center mt-8 text-black-600">
        <p>
          Built for the Agentic Postgres Challenge • 
          <a 
            href="https://github.com/hulyak/forked-A-B-Index-Optimizer" 
            className="ml-2 text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
        </p>
      </footer>

      <NotificationToast 
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default App;