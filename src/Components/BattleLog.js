// src/Components/BattleLog.js

import React from 'react';

const BattleLog = ({ log }) => {
  return (
    <div className="battle-log mt-4 bg-gray-50 p-4 rounded border border-gray-200 shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">Log de Batalha:</h3>
      <ul className="max-h-60 overflow-y-auto">
        {log.length > 0 ? (
          log.map((entry, index) => (
            <li key={index} className="text-gray-700 p-1 border-b border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100">
              {entry}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center">Nenhum evento registrado.</li>
        )}
      </ul>
    </div>
  );
};

export default BattleLog;
