import { useEffect, useState } from 'react';
import { Bot, Brain, Database, CheckCircle, AlertCircle, Clock } from 'lucide-react';

function AgentActivity({ logs, isRunning }) {
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    if (isRunning) {
      // Clear previous logs when starting new optimization
      setActivityLogs([]);
      
      // Simulate agent activity logs
      const simulatedLogs = [
        { agent: 'Orchestrator', action: 'Initializing optimization workflow', status: 'completed', timestamp: Date.now() - 5000 },
        { agent: 'Index-Tuner', action: 'Analyzing query patterns', status: 'completed', timestamp: Date.now() - 4000 },
        { agent: 'Index-Tuner', action: 'Generating strategy A: Single-column indexes', status: 'completed', timestamp: Date.now() - 3000 },
        { agent: 'Index-Tuner', action: 'Generating strategy B: Composite indexes', status: 'completed', timestamp: Date.now() - 2000 },
        { agent: 'Orchestrator', action: 'Creating zero-copy fork: strategy-a', status: 'running', timestamp: Date.now() - 1000 },
        { agent: 'Orchestrator', action: 'Creating zero-copy fork: strategy-b', status: 'pending', timestamp: Date.now() },
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < simulatedLogs.length) {
          const logEntry = simulatedLogs[currentIndex];
          if (logEntry && logEntry.agent && logEntry.action) {
            setActivityLogs(prev => [...prev, logEntry]);
          }
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getAgentIcon = (agent) => {
    switch (agent) {
      case 'Orchestrator': return Bot;
      case 'Index-Tuner': return Brain;
      case 'Validator': return Database;
      default: return Bot;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'running': return Clock;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {activityLogs.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-4">
          <Bot size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Agent activity will appear during optimization</p>
        </div>
      )}

      {activityLogs.filter(log => log && log.agent && log.action).map((log, index) => {
        const AgentIcon = getAgentIcon(log.agent);
        const StatusIcon = getStatusIcon(log.status);
        
        return (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
          >
            <div className="flex-shrink-0">
              <AgentIcon size={20} className="text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">{log.agent}</span>
                <StatusIcon size={16} className={getStatusColor(log.status)} />
              </div>
              <p className="text-sm text-gray-700">{log.action}</p>
              <p className="text-xs text-gray-500 mt-1">
                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Now'}
              </p>
            </div>
          </div>
        );
      })}

      {isRunning && activityLogs.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <div className="loading-spinner" />
          <span className="text-sm text-blue-700">Agents are working...</span>
        </div>
      )}
    </div>
  );
}

export default AgentActivity;