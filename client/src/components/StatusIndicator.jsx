import React from 'react';
import { CheckCircle, XCircle, Clock, Database, Zap, BarChart } from 'lucide-react';

const STATUS_MESSAGES = {
  running: 'Initializing optimization...',
  generating_strategies: 'Generating index strategies...',
  creating_forks: 'Creating zero-copy database forks...',
  applying_strategies: 'Applying index strategies to forks...',
  running_tests: 'Running performance tests...',
  analyzing_results: 'Analyzing results and generating recommendations...',
  completed: 'Optimization completed successfully!',
  failed: 'Optimization failed'
};

const STATUS_ICONS = {
  running: Clock,
  generating_strategies: Zap,
  creating_forks: Database,
  applying_strategies: Database,
  running_tests: BarChart,
  analyzing_results: BarChart,
  completed: CheckCircle,
  failed: XCircle
};

function StatusIndicator({ isRunning, optimization }) {
  if (!isRunning && !optimization) return null;

  const status = optimization?.status || 'running';
  const Icon = STATUS_ICONS[status] || Clock;
  const message = STATUS_MESSAGES[status] || 'Processing...';

  const getStatusClass = () => {
    if (status === 'completed') return 'status-completed';
    if (status === 'failed') return 'status-failed';
    return 'status-running';
  };

  return (
    <div className="space-y-4">
      <div className={`status-indicator ${getStatusClass()}`}>
        <Icon size={20} />
        <span>{message}</span>
        {isRunning && <div className="loading-spinner ml-2" />}
      </div>

      {optimization?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
          <p className="text-red-700">{optimization.error}</p>
        </div>
      )}

      {optimization?.results?.forks && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Fork Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Strategy A Fork:</span>
              <code className="ml-2 text-blue-700">{optimization.results.forks.forkA}</code>
            </div>
            <div>
              <span className="font-medium">Strategy B Fork:</span>
              <code className="ml-2 text-blue-700">{optimization.results.forks.forkB}</code>
            </div>
          </div>
        </div>
      )}

      {optimization && (
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Started:</span>
            <span>{new Date(optimization.startTime).toLocaleTimeString()}</span>
          </div>
          {optimization.endTime && (
            <div className="flex justify-between">
              <span>Completed:</span>
              <span>{new Date(optimization.endTime).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusIndicator;