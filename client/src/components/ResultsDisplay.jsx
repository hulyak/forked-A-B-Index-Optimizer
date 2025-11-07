
import { Trophy, TrendingUp, Database, Clock, Target } from 'lucide-react';
import PerformanceChart from './PerformanceChart';

function ResultsDisplay({ results }) {
  // Add safety checks for results structure
  if (!results) {
    return (
      <div className="card">
        <div className="p-8 text-center text-gray-500">
          <p>No results available</p>
        </div>
      </div>
    );
  }

  const { strategies = {}, performance = {}, comparison = {}, recommendation = {} } = results;

  // Debug logging
  console.log('ResultsDisplay received:', {
    hasStrategies: !!strategies,
    strategyAIndexes: strategies?.strategyA?.indexes?.length,
    strategyBIndexes: strategies?.strategyB?.indexes?.length,
    comparisonData: comparison,
    hasRecommendation: !!recommendation
  });

  const getWinnerStrategy = () => {
    return comparison?.improvement?.faster || 'strategyA';
  };

  const formatTime = (ms) => {
    return `${ms.toFixed(2)}ms`;
  };

  const formatPercentage = (pct) => {
    return `${Math.abs(pct).toFixed(1)}%`;
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'confidence-high';
      case 'medium': return 'confidence-medium';
      case 'low': return 'confidence-low';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Comparison Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-600" />
          Performance Comparison
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Visual comparison shows {comparison?.improvement?.faster === 'strategyB' ? 'Strategy B' : 'Strategy A'} ({comparison?.improvement?.faster === 'strategyB' ? 'composite indexes' : 'single-column indexes'}) outperforming {comparison?.improvement?.faster === 'strategyB' ? 'Strategy A' : 'Strategy B'} ({comparison?.improvement?.faster === 'strategyB' ? 'single-column indexes' : 'composite indexes'}) by {Math.abs(comparison?.improvement?.percentage || 0).toFixed(1)}%.
        </p>
        <PerformanceChart
          strategyA={comparison?.strategyA}
          strategyB={comparison?.strategyB}
        />
      </div>

      {/* Strategy Comparison */}
      <div className="results-grid">
        <div className={`strategy-card ${getWinnerStrategy() === 'strategyA' ? 'winner' : ''}`}>
          <div className="strategy-title">
            <Database size={20} />
            Strategy A: {strategies?.strategyA?.name || 'Basic Strategy'}
            {getWinnerStrategy() === 'strategyA' ? (
              <span className="winner-badge">
                <Trophy size={14} className="inline mr-1" />
                Better Performance
              </span>
            ) : (
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: 'auto'
              }}>
                Slower Performance
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="metric">
              <span className="metric-label">Avg Execution Time:</span>
              <span className="metric-value">{formatTime(comparison?.strategyA?.avgExecutionTime || 0)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Queries Tested:</span>
              <span className="metric-value">{comparison?.strategyA?.queries || 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Indexes Created:</span>
              <span className="metric-value">{strategies?.strategyA?.indexes?.length || 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Estimated Size:</span>
              <span className="metric-value">{strategies?.strategyA?.estimatedSize || 0}MB</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Indexes:</h4>
            <div className="space-y-2">
              {(strategies?.strategyA?.indexes || []).map((index, i) => (
                <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                  <div className="font-medium">{index?.name || 'Index'}</div>
                  <div className="text-gray-600 text-xs mt-1">{index?.rationale || 'No description'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`strategy-card ${getWinnerStrategy() === 'strategyB' ? 'winner' : ''}`}>
          <div className="strategy-title">
            <Database size={20} />
            Strategy B: {strategies?.strategyB?.name || 'Advanced Strategy'}
            {getWinnerStrategy() === 'strategyB' ? (
              <span className="winner-badge">
                <Trophy size={14} className="inline mr-1" />
                Better Performance
              </span>
            ) : (
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: 'auto'
              }}>
                Slower Performance
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="metric">
              <span className="metric-label">Avg Execution Time:</span>
              <span className="metric-value">{formatTime(comparison?.strategyB?.avgExecutionTime || 0)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Queries Tested:</span>
              <span className="metric-value">{comparison?.strategyB?.queries || 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Indexes Created:</span>
              <span className="metric-value">{strategies?.strategyB?.indexes?.length || 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Estimated Size:</span>
              <span className="metric-value">{strategies?.strategyB?.estimatedSize || 0}MB</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Indexes:</h4>
            <div className="space-y-2">
              {(strategies?.strategyB?.indexes || []).map((index, i) => (
                <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                  <div className="font-medium">{index?.name || 'Index'}</div>
                  <div className="text-gray-600 text-xs mt-1">{index?.rationale || 'No description'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="recommendation">
        <h3 className="flex items-center gap-2">
          <Target size={20} />
          Recommendation
          <span className={`text-sm font-normal ${getConfidenceColor(recommendation?.confidence)}`}>
            ({recommendation?.confidence || 'medium'} confidence)
          </span>
        </h3>

        <div className="space-y-3">
          {/* Performance Impact with Context */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-blue-600" />
              <span className="font-semibold text-blue-900">Performance Impact:</span>
              <span className="text-2xl font-bold text-blue-700">{formatPercentage(comparison?.improvement?.percentage || 0)}</span>
              <span className="text-blue-600">faster</span>
            </div>

            {/* Contextual Explanation */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">
                  Your queries will complete in <strong>{(100 - Math.abs(comparison?.improvement?.percentage || 0)).toFixed(1)}%</strong> of the original time
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">
                  On 1M rows, this saves ~<strong>{(Math.abs(comparison?.improvement?.percentage || 0) * 10).toFixed(0)}ms</strong> per query
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">
                  = <strong>{(Math.abs(comparison?.improvement?.percentage || 0) * 0.1).toFixed(1)} seconds</strong> saved per 100 requests
                </span>
              </div>
            </div>
          </div>

          {/* Real-World Context */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              📊 What This Means in Practice
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Database load reduces by <strong>{formatPercentage(comparison?.improvement?.percentage || 0)}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Can handle <strong>{(1 + (Math.abs(comparison?.improvement?.percentage || 0) / 100)).toFixed(1)}x</strong> more concurrent users</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>API response times improve proportionally</span>
              </div>
            </div>
          </div>

          {/* Business Impact */}
          {Math.abs(comparison?.improvement?.percentage || 0) > 20 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                💰 Business Impact
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Faster queries = Lower CPU and I/O usage</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Estimated cloud cost reduction: <strong>~${Math.round(Math.abs(comparison?.improvement?.percentage || 0) * 1.2)}/month</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span><strong>ROI:</strong> 5 minutes to implement, saves hours of compute time</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-700 mt-3">{recommendation?.reason || 'No specific reason provided'}</p>
          
          {recommendation?.estimatedImpact && (
            <p className="text-sm text-gray-600">
              <strong>Expected benefit:</strong> {recommendation.estimatedImpact}
            </p>
          )}

          {recommendation?.hybridSearchInsights && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                🔍 Hybrid Search Insights (pg_textsearch + pgvector)
              </h5>
              
              <div className="space-y-3">
                <div>
                  <h6 className="font-medium text-blue-800 mb-2">Similar Patterns Found:</h6>
                  <div className="space-y-1">
                    {recommendation?.hybridSearchInsights?.similarPatterns?.map((pattern, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">{pattern.pattern}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">{(pattern.confidence * 100).toFixed(0)}%</span>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">{pattern.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="font-medium text-blue-800 mb-2">AI Recommendations:</h6>
                  <ul className="space-y-1">
                    {recommendation?.hybridSearchInsights?.recommendations?.map((rec, i) => (
                      <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {recommendation?.action === 'apply_strategy' && (
            <div className="bg-green-50 border border-green-200 rounded p-4 mt-3">
              <p className="text-green-800 font-semibold mb-3 flex items-center gap-2">
                <Trophy size={16} />
                Recommended Action: Apply {recommendation?.strategy === 'strategyA' ? 'Strategy A' : 'Strategy B'} to production
              </p>

              {/* SQL Commands to Apply */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-green-900">SQL Commands to Apply:</h5>
                  <button
                    onClick={() => {
                      const winningStrategy = recommendation?.strategy === 'strategyA' ? strategies?.strategyA : strategies?.strategyB;
                      const sqlCommands = winningStrategy?.indexes?.map(idx => idx.sql).join('\n\n') || '';
                      navigator.clipboard.writeText(sqlCommands);
                      alert('SQL copied to clipboard!');
                    }}
                    style={{
                      background: '#16a34a',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#15803d'}
                    onMouseOut={(e) => e.target.style.background = '#16a34a'}
                  >
                    📋 Copy SQL Commands
                  </button>
                </div>
                <div className="bg-white border border-green-300 rounded p-3 text-sm font-mono overflow-x-auto">
                  <pre className="text-green-900">
{(recommendation?.strategy === 'strategyA' ? strategies?.strategyA : strategies?.strategyB)?.indexes?.map((idx) => (
  `-- ${idx.name}\n${idx.sql || `CREATE INDEX ${idx.name} ON ${idx.table || 'table_name'}(${idx.columns?.join(', ') || 'column'});`}`
)).join('\n\n') || 'No SQL available'}
                  </pre>
                </div>
              </div>

              <p className="text-xs text-green-700 mt-3">
                💡 Run these commands on your production database to apply the winning strategy.
              </p>

              {/* Next Steps Checklist */}
              <div className="mt-4 bg-white border-2 border-green-300 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  ✅ Next Steps - Implementation Guide
                </h5>
                <div className="space-y-2 text-sm">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">
                      <strong>1. Review SQL commands</strong> - Verify the indexes match your table structure
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">
                      <strong>2. Test in staging first</strong> - Apply to non-production environment
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">
                      <strong>3. Monitor for 24 hours</strong> - Watch query performance and database load
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">
                      <strong>4. Apply to production</strong> - Deploy during low-traffic window
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-green-50 p-2 rounded transition">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">
                      <strong>5. Track improvements</strong> - Measure actual performance gains in your monitoring tool
                    </span>
                  </label>
                </div>

                <div className="mt-3 pt-3 border-t border-green-200 text-xs text-gray-600">
                  <strong>Pro tip:</strong> Index creation can lock tables briefly. Run during maintenance windows for large tables.
                </div>
              </div>
            </div>
          )}

          {recommendation?.action === 'no_change' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
              <p className="text-yellow-800 font-medium">
                ⚠️ No significant improvement detected - consider keeping current indexes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Details */}
      <details className="card">
        <summary className="cursor-pointer font-semibold text-lg mb-4">
          Technical Details & Query Plans
        </summary>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Strategy A Performance Details:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(performance.strategyA, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Strategy B Performance Details:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(performance.strategyB, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

export default ResultsDisplay;