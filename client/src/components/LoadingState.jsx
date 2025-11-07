import React from 'react';
import { Database, Zap, Brain, GitBranch } from 'lucide-react';

function LoadingState({ isRunning, currentStatus }) {
  const loadingSteps = [
    { 
      id: 'generating_strategies', 
      icon: Brain, 
      title: 'Analyzing Query Patterns', 
      description: 'AI agents examining WHERE clauses, JOINs, and ORDER BY patterns'
    },
    { 
      id: 'creating_forks', 
      icon: GitBranch, 
      title: 'Creating Zero-Copy Forks', 
      description: 'Spinning up isolated database environments for A/B testing'
    },
    { 
      id: 'applying_strategies', 
      icon: Database, 
      title: 'Applying Index Strategies', 
      description: 'Deploying different optimization approaches to each fork'
    },
    { 
      id: 'running_tests', 
      icon: Zap, 
      title: 'Performance Testing', 
      description: 'Running EXPLAIN ANALYZE on identical query sets'
    },
    { 
      id: 'analyzing_results', 
      icon: Brain, 
      title: 'Generating Recommendations', 
      description: 'Comparing results and creating evidence-based suggestions'
    }
  ];

  const currentStepIndex = loadingSteps.findIndex(step => step.id === currentStatus);
  
  if (!isRunning) return null;

  return (
    <div className="loading-state-container">
      <div className="loading-header">
        <div className="loading-title">
          <div className="loading-spinner-large"></div>
          <h3>Optimizing Your Database Performance</h3>
        </div>
        <p className="loading-subtitle">
          Our AI agents are working together to find the best index strategies for your queries
        </p>
      </div>

      <div className="loading-steps">
        {loadingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div 
              key={step.id}
              className={`loading-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
            >
              <div className="step-indicator">
                <div className="step-icon-wrapper">
                  <Icon size={20} className="step-icon" />
                </div>
                <div className="step-connector"></div>
              </div>
              
              <div className="step-content">
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.description}</p>
                {isActive && (
                  <div className="step-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="loading-stats">
        <div className="stat-item">
          <div className="stat-value">2</div>
          <div className="stat-label">Forks Created</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">3</div>
          <div className="stat-label">Agents Active</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">~30s</div>
          <div className="stat-label">Est. Time</div>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;