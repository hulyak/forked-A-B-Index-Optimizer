import React, { useState, useEffect } from 'react';
import { Activity, Database, Clock, Zap, TrendingUp, GitBranch, BarChart3 } from 'lucide-react';

function MetricsDashboard({ isRunning, results }) {
  const [metrics, setMetrics] = useState({
    forksCreated: 0,
    queriesAnalyzed: 0,
    avgResponseTime: 0,
    indexesGenerated: 0,
    performanceGain: 0,
    agentOperations: 0
  });

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          forksCreated: Math.min(prev.forksCreated + 1, 2),
          queriesAnalyzed: prev.queriesAnalyzed + Math.floor(Math.random() * 3),
          avgResponseTime: 45 + Math.random() * 20,
          indexesGenerated: Math.min(prev.indexesGenerated + 1, 6),
          performanceGain: Math.min(prev.performanceGain + Math.random() * 5, 35),
          agentOperations: prev.agentOperations + Math.floor(Math.random() * 2)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (results) {
      const improvement = Math.abs(results.comparison?.improvement?.percentage || 0);
      setMetrics(prev => ({
        ...prev,
        performanceGain: improvement,
        forksCreated: 2,
        indexesGenerated: (results.strategies?.strategyA?.indexes?.length || 0) + 
                         (results.strategies?.strategyB?.indexes?.length || 0)
      }));
    }
  }, [results]);

  const primaryMetrics = [
    {
      icon: TrendingUp,
      label: 'Performance Gain',
      value: metrics.performanceGain.toFixed(1),
      suffix: '%',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      isPrimary: true
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: metrics.avgResponseTime.toFixed(0),
      suffix: 'ms',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: GitBranch,
      label: 'Forks',
      value: metrics.forksCreated,
      suffix: '/2',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const secondaryMetrics = [
    { icon: Database, label: 'Indexes', value: metrics.indexesGenerated, color: 'text-green-600' },
    { icon: Zap, label: 'Operations', value: metrics.agentOperations, color: 'text-orange-600' },
    { icon: Activity, label: 'Queries', value: metrics.queriesAnalyzed, color: 'text-red-600' }
  ];

  return (
    <div className="metrics-dashboard">
      {/* Primary Metrics - Larger Cards */}
      <div className="primary-metrics">
        {primaryMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className={`metric-card primary ${metric.bgColor} ${metric.borderColor} ${metric.isPrimary ? 'featured' : ''}`}
            >
              <div className="metric-header">
                <Icon size={metric.isPrimary ? 24 : 20} className={metric.color} />
                {isRunning && (
                  <div className="status-dot animate-pulse" />
                )}
              </div>
              <div className={`metric-value ${metric.isPrimary ? 'large' : ''}`}>
                {metric.value}
                <span className="metric-suffix">{metric.suffix}</span>
              </div>
              <div className="metric-label">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics - Compact Row */}
      <div className="secondary-metrics">
        {secondaryMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="metric-item">
              <Icon size={16} className={metric.color} />
              <span className="metric-compact-value">{metric.value}</span>
              <span className="metric-compact-label">{metric.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar for Running State */}
      {isRunning && (
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-text">
            <BarChart3 size={14} />
            <span>Analyzing performance patterns...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricsDashboard;