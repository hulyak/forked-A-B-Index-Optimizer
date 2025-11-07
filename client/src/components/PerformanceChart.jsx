
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function PerformanceChart({ strategyA, strategyB }) {
  // Add safety checks for strategy data
  const safeStrategyA = strategyA || { name: 'Strategy A', avgExecutionTime: 0, queries: 0 };
  const safeStrategyB = strategyB || { name: 'Strategy B', avgExecutionTime: 0, queries: 0 };

  // Shorten strategy names for better display
  const shortenName = (name) => {
    if (!name) return 'Unknown';
    if (name.includes('Basic') || name.toLowerCase().includes('single')) return 'Strategy A: Basic';
    if (name.includes('Advanced') || name.toLowerCase().includes('composite')) return 'Strategy B: Advanced';
    return name.length > 25 ? name.substring(0, 22) + '...' : name;
  };

  const data = [
    {
      name: shortenName(safeStrategyA.name),
      fullName: safeStrategyA.name || 'Strategy A',
      executionTime: parseFloat(safeStrategyA.avgExecutionTime) || 0,
      queries: parseInt(safeStrategyA.queries) || 0
    },
    {
      name: shortenName(safeStrategyB.name),
      fullName: safeStrategyB.name || 'Strategy B',
      executionTime: parseFloat(safeStrategyB.avgExecutionTime) || 0,
      queries: parseInt(safeStrategyB.queries) || 0
    }
  ];

  // Determine which strategy is better (lower execution time)
  const betterStrategy = (safeStrategyA.avgExecutionTime || 0) < (safeStrategyB.avgExecutionTime || 0) ? 0 : 1;
  const colors = ['#ef4444', '#10b981']; // red for worse, green for better

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm">{data.fullName}</p>
          <p className="text-blue-600 font-medium mt-2">
            Avg Execution Time: <strong>{data.executionTime.toFixed(2)}ms</strong>
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Queries Tested: {data.queries}
          </p>
        </div>
      );
    }
    return null;
  };

  // Check if we have valid data
  const hasValidData = data.some(d => d.executionTime > 0);

  if (!hasValidData) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <p className="font-medium">No performance data available</p>
          <p className="text-sm mt-1">Run an optimization to see the comparison chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center" style={{ minHeight: '380px' }}>
      {/* Chart Container - Centered with max width */}
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 40,
              left: 40,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#374151' }}
              interval={0}
              angle={0}
              textAnchor="middle"
            />
            <YAxis
              label={{ value: 'Execution Time (ms)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#374151' } }}
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="executionTime" radius={[8, 8, 0, 0]} maxBarSize={100}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === betterStrategy ? colors[1] : colors[0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Bar-aligned labels in horizontal row */}
        <div className="flex justify-center mt-6 px-8" style={{ gap: '80px' }}>
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg shadow-sm" style={{
              backgroundColor: index === betterStrategy ? '#dcfce7' : '#fee2e2',
              border: `2px solid ${index === betterStrategy ? '#10b981' : '#ef4444'}`,
              minWidth: '200px',
              flex: '0 0 auto'
            }}>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: index === betterStrategy ? '#10b981' : '#ef4444' }}
              />
              <span className="font-semibold text-sm whitespace-nowrap" style={{
                color: index === betterStrategy ? '#047857' : '#991b1b'
              }}>
                {index === betterStrategy ? '✓ Better Performance' : '✗ Slower Performance'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;