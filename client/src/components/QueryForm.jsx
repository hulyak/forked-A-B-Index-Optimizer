import { useState } from 'react';
import { Play, Settings, Search, Zap, Database, Brain } from 'lucide-react';

const SAMPLE_QUERIES = [
  "SELECT * FROM users WHERE email = 'user@example.com' ORDER BY created_at DESC;",
  "SELECT COUNT(*) FROM orders WHERE user_id = 123 AND status = 'completed';",
  "SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name ORDER BY order_count DESC;"
];

function QueryForm({ onSubmit, isRunning, onAdvancedToggle, showAdvanced }) {
  const [queries, setQueries] = useState('');
  const [tableName, setTableName] = useState('users');
  const [useHybridSearch, setUseHybridSearch] = useState(true);
  const [optimizationLevel, setOptimizationLevel] = useState('balanced');
  const [includePartialIndexes, setIncludePartialIndexes] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const queryList = queries
      .split('\n')
      .map(q => q.trim())
      .filter(q => q && !q.startsWith('--'));

    if (queryList.length === 0) {
      alert('Please enter at least one SQL query');
      return;
    }

    onSubmit(queryList, {
      tableName,
      useHybridSearch,
      optimizationLevel,
      includePartialIndexes
    });
  };

  const loadSampleQueries = () => {
    setQueries(SAMPLE_QUERIES.join('\n\n'));
    setTableName('users');
    
    // Add visual feedback
    const button = document.activeElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Loaded!';
      button.style.background = '#10b981';
      button.style.color = 'white';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#f3f4f6';
        button.style.color = '#374151';
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="tableName">
          Primary Table Name
        </label>
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="e.g., users, orders, products"
          required
          disabled={isRunning}
        />
        <small className="text-gray-600 mt-1 block">
          The main table that will be analyzed for index optimization
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="queries">
          SQL Queries to Optimize
        </label>
        <textarea
          id="queries"
          value={queries}
          onChange={(e) => setQueries(e.target.value)}
          placeholder="Enter your SQL queries here, one per line... Or click 'Load Sample Queries' to get started!"
          required
          disabled={isRunning}
          rows={8}
        />
        <small className="text-gray-600 mt-1 block">
          Enter the queries you want to optimize. Each query should be on a separate line.
        </small>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="advanced-options-panel">
          <div className="advanced-header">
            <div className="advanced-title">
              <Settings size={24} className="advanced-icon" />
              <h4>Advanced Agentic Postgres Features</h4>
            </div>
            <div className="advanced-badge">Pro Mode</div>
          </div>
          
          <div className="advanced-grid">
            {/* Hybrid Search Option */}
            <div className="advanced-option-card hybrid-search">
              <div className="option-header">
                <Search size={20} className="option-icon" />
                <div className="option-info">
                  <h5>Hybrid Search Engine</h5>
                  <p>BM25 + Vector Intelligence</p>
                </div>
                <label className="advanced-toggle">
                  <input
                    type="checkbox"
                    checked={useHybridSearch}
                    onChange={(e) => setUseHybridSearch(e.target.checked)}
                    disabled={isRunning}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="option-description">
                Leverage pg_textsearch and pgvector for context-aware recommendations with semantic understanding
              </div>
              <div className="option-features">
                <span className="feature-tag">pg_textsearch</span>
                <span className="feature-tag">pgvector</span>
                <span className="feature-tag">Fusion Ranking</span>
              </div>
            </div>

            {/* Partial Indexes Option */}
            <div className="advanced-option-card partial-indexes">
              <div className="option-header">
                <Database size={20} className="option-icon" />
                <div className="option-info">
                  <h5>Partial Index Generation</h5>
                  <p>Smart Selectivity Optimization</p>
                </div>
                <label className="advanced-toggle">
                  <input
                    type="checkbox"
                    checked={includePartialIndexes}
                    onChange={(e) => setIncludePartialIndexes(e.target.checked)}
                    disabled={isRunning}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="option-description">
                Generate conditional indexes with WHERE clauses for improved selectivity and reduced storage overhead
              </div>
              <div className="option-features">
                <span className="feature-tag">Conditional Logic</span>
                <span className="feature-tag">Storage Efficient</span>
                <span className="feature-tag">High Selectivity</span>
              </div>
            </div>

            {/* Optimization Level */}
            <div className="advanced-option-card optimization-level full-width">
              <div className="option-header">
                <Zap size={20} className="option-icon" />
                <div className="option-info">
                  <h5>Optimization Strategy</h5>
                  <p>Performance vs Safety Balance</p>
                </div>
              </div>
              <div className="optimization-selector">
                <div className="selector-options">
                  {['conservative', 'balanced', 'aggressive'].map((level) => (
                    <label key={level} className={`selector-option ${optimizationLevel === level ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="optimizationLevel"
                        value={level}
                        checked={optimizationLevel === level}
                        onChange={(e) => setOptimizationLevel(e.target.value)}
                        disabled={isRunning}
                      />
                      <div className="option-content">
                        <div className="option-name">{level.charAt(0).toUpperCase() + level.slice(1)}</div>
                        <div className="option-desc">
                          {level === 'conservative' && 'Minimal changes, maximum safety'}
                          {level === 'balanced' && 'Optimal performance with controlled risk'}
                          {level === 'aggressive' && 'Maximum optimization, advanced strategies'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="advanced-option-card additional-features">
              <div className="option-header">
                <Zap size={20} className="option-icon" />
                <div className="option-info">
                  <h5>Zero-Copy Fork Strategy</h5>
                  <p>Isolation & Performance Testing</p>
                </div>
              </div>
              <div className="fork-strategy-visual">
                <div className="fork-diagram">
                  <div className="main-db">Main DB</div>
                  <div className="fork-arrow">→</div>
                  <div className="fork-containers">
                    <div className="fork-item">Fork A</div>
                    <div className="fork-item">Fork B</div>
                  </div>
                </div>
              </div>
              <div className="option-description">
                Instant database snapshots with zero storage overhead for safe A/B testing
              </div>
            </div>

            {/* MCP Agents */}
            <div className="advanced-option-card mcp-agents">
              <div className="option-header">
                <Brain size={20} className="option-icon" />
                <div className="option-info">
                  <h5>Multi-Agent Coordination</h5>
                  <p>MCP-Powered Intelligence</p>
                </div>
              </div>
              <div className="agent-list">
                <div className="agent-item">
                  <div className="agent-dot orchestrator"></div>
                  <span>Orchestrator Agent</span>
                </div>
                <div className="agent-item">
                  <div className="agent-dot tuner"></div>
                  <span>Index-Tuner Agent</span>
                </div>
                <div className="agent-item">
                  <div className="agent-dot validator"></div>
                  <span>Validator Agent</span>
                </div>
              </div>
              <div className="option-description">
                Coordinated AI agents working together via Model Context Protocol
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isRunning}
          aria-describedby={isRunning ? "optimization-status" : undefined}
        >
          {isRunning ? (
            <>
              <div className="loading-spinner" />
              Running A/B Test...
            </>
          ) : (
            <>
              <Play size={20} />
              Start A/B Optimization
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onAdvancedToggle}
          className="btn"
          style={{ 
            background: showAdvanced ? '#3b82f6' : '#f3f4f6', 
            color: showAdvanced ? 'white' : '#374151',
            border: '1px solid #d1d5db'
          }}
          disabled={isRunning}
        >
          <Settings size={18} />
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>

        <button
          type="button"
          onClick={loadSampleQueries}
          className="btn"
          style={{ 
            background: '#f3f4f6', 
            color: '#374151',
            border: '1px solid #d1d5db'
          }}
          disabled={isRunning}
        >
          Load Sample Queries
        </button>
      </div>

      {isRunning && (
        <div id="optimization-status" className="sr-only" aria-live="polite">
          Optimization is currently running. Please wait for results.
        </div>
      )}
    </form>
  );
}

export default QueryForm;