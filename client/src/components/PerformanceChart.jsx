
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function PerformanceChart({ strategyA, strategyB }) {
  // Add safety checks for strategy data
  const safeStrategyA = strategyA || { name: 'Strategy A', avgExecutionTime: 0, queries: 0 };
  const safeStrategyB = strategyB || { name: 'Strategy B', avgExecutionTime: 0, queries: 0 };

  const data = [
    {
      name: safeStrategyA.name || 'Strategy A',
      executionTime: safeStrategyA.avgExecutionTime || 0,
      queries: safeStrategyA.queries || 0
    },
    {
      name: safeStrategyB.name || 'Strategy B',
      executionTime: safeStrategyB.avgExecutionTime || 0,
      queries: safeStrategyB.queries || 0
    }
  ];

  // Determine which strategy is better (lower execution time)
  const betterStrategy = (safeStrategyA.avgExecutionTime || 0) < (safeStrategyB.avgExecutionTime || 0) ? 0 : 1;
  const colors = ['#ef4444', '#10b981']; // red for worse, green for better

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Avg Execution Time: {data.executionTime.toFixed(2)}ms
          </p>
          <p className="text-gray-600">
            Queries Tested: {data.queries}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis 
            label={{ value: 'Execution Time (ms)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="executionTime" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === betterStrategy ? colors[1] : colors[0]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>Slower Performance</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Better Performance</span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;