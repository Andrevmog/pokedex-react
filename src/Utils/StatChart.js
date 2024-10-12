import React from 'react';

const StatChart = ({ stats }) => {
  // Converte as estatísticas para um formato mais fácil de trabalhar
  const statsData = {
    HP: stats[0].base_stat,
    Attack: stats[1].base_stat,
    Defense: stats[2].base_stat,
    "Sp. Atk": stats[3].base_stat,
    "Sp. Def": stats[4].base_stat,
    Speed: stats[5].base_stat,
  };

  // Acha o valor máximo para normalizar as barras
  const maxStat = Math.max(...Object.values(statsData));

  return (
    <div className="flex flex-col">
      {Object.entries(statsData).map(([key, value]) => (
        <div key={key} className="flex items-center mb-2">
          <span className="w-24">{key}:</span>
          <div className="relative w-full bg-gray-300 rounded">
            <div
              className="absolute top-0 left-0 h-full bg-green-500 rounded"
              style={{ width: `${(value / maxStat) * 100}%` }}
            />
            <span className="absolute text-xs text-center w-full">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatChart;