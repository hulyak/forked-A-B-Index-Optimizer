import { useState } from 'react';
import { Database, Zap, GitBranch, Search, Shield, BarChart3, ChevronRight, X, Check, ExternalLink } from 'lucide-react';

function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 'zero-copy-forks',
      icon: GitBranch,
      title: 'Zero-Copy Forks',
      description: 'Instant database snapshots with no storage overhead',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-400/30',
      details: {
        title: 'Zero-Copy Database Forks',
        content: 'Create instant database snapshots without duplicating data. Perfect for A/B testing index strategies safely.',
        benefits: ['No storage overhead', 'Instant creation', 'Safe experimentation', 'Automatic cleanup'],
        learnMore: 'https://docs.tigerdata.com/use-timescale/latest/fork-services/'
      }
    },
    {
      id: 'mcp-agents',
      icon: Zap,
      title: 'MCP Agents',
      description: 'Multi-agent coordination via Model Context Protocol',
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-400/30',
      details: {
        title: 'Model Context Protocol Agents',
        content: 'Orchestrator, Index-Tuner, and Validator agents work together to optimize your database performance.',
        benefits: ['Automated coordination', 'Specialized roles', 'Parallel processing', 'Intelligent decision making'],
        learnMore: 'https://www.tigerdata.com/blog/postgres-for-agents'
      }
    },
    {
      id: 'hybrid-search',
      icon: Search,
      title: 'Hybrid Search',
      description: 'BM25 + vector search for intelligent recommendations',
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-400/30',
      details: {
        title: 'Hybrid Search Engine',
        content: 'Combines pg_textsearch (BM25) with pgvector for context-aware index recommendations.',
        benefits: ['Keyword precision', 'Semantic understanding', 'Evidence-based suggestions', 'Fusion ranking'],
        learnMore: 'https://www.tigerdata.com/blog/postgresql-hybrid-search-using-pgvector-and-cohere'
      }
    },
    {
      id: 'risk-free-testing',
      icon: Shield,
      title: 'Risk-Free Testing',
      description: 'Safe experimentation without touching production',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-400/30',
      details: {
        title: 'Production-Safe Testing',
        content: 'Test index changes in isolated environments without any risk to your production database.',
        benefits: ['Zero production risk', 'Isolated testing', 'Instant rollback', 'Confidence in changes'],
        learnMore: 'https://docs.tigerdata.com/use-timescale/latest/services/'
      }
    },
    {
      id: 'performance-analytics',
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Real-time metrics and visual comparisons',
      color: 'text-red-400',
      bgGradient: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-400/30',
      details: {
        title: 'Real-Time Performance Analytics',
        content: 'Comprehensive metrics, visual comparisons, and detailed explain plans for data-driven decisions.',
        benefits: ['Live metrics', 'Visual comparisons', 'Detailed analysis', 'Performance insights'],
        learnMore: 'https://docs.tigerdata.com/use-timescale/latest/hypercore/real-time-analytics-in-hypercore/'
      }
    },
    {
      id: 'fluid-storage',
      icon: Database,
      title: 'Fluid Storage',
      description: 'Dynamic resource allocation and optimization',
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-500/20 to-indigo-600/20',
      borderColor: 'border-indigo-400/30',
      details: {
        title: 'Fluid Storage Architecture',
        content: 'Dynamic resource allocation that scales with your optimization needs automatically.',
        benefits: ['Auto-scaling', 'Cost optimization', 'Resource efficiency', 'Performance tuning'],
        learnMore: 'https://www.tigerdata.com/blog/fluid-storage-forkable-ephemeral-durable-infrastructure-age-of-agents'
      }
    }
  ];

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };

  return (
    <>
      <div className="feature-showcase">
        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id}
                className={`feature-card interactive bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor}`}
                onClick={() => handleFeatureClick(feature)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFeatureClick(feature);
                  }
                }}
                aria-label={`Learn more about ${feature.title}`}
              >
                <div className="feature-icon-wrapper">
                  <Icon size={28} className={`feature-icon ${feature.color}`} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-cta">
                    <span className="cta-text">Click to learn more</span>
                    <ChevronRight size={16} className="cta-arrow" />
                  </div>
                </div>
                <div className="feature-glow"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="feature-modal-overlay" onClick={closeModal}>
          <div className="feature-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <selectedFeature.icon size={32} className={selectedFeature.color} />
                <h2 className="modal-title">{selectedFeature.details.title}</h2>
              </div>
              <button 
                className="modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-content">
              <p className="modal-description">{selectedFeature.details.content}</p>
              
              <div className="modal-benefits">
                <h3>Key Benefits:</h3>
                <ul>
                  {selectedFeature.details.benefits.map((benefit, index) => (
                    <li key={index}>
                      <Check size={16} className="benefit-check" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="modal-actions">
                <a 
                  href={selectedFeature.details.learnMore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="learn-more-btn"
                >
                  <ExternalLink size={16} />
                  Learn More in Docs
                </a>
                <button 
                  className="close-btn"
                  onClick={closeModal}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeatureShowcase;