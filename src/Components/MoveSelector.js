import React, { useEffect, useState } from 'react';
import { fetchMoveDetails } from '../Services/pokemonService';

const MoveSelector = ({ moves, onMoveSelect, disabled }) => {
  const [moveDetails, setMoveDetails] = useState([]);

  useEffect(() => {
    const fetchMoves = async () => {
      const details = await Promise.all(
        moves.map(move => fetchMoveDetails(move.move.url))
      );
      setMoveDetails(details);
    };

    fetchMoves();
  }, [moves]);

  return (
    <div>
      <h4 className="font-semibold">Escolha um movimento:</h4>
      <select
        onChange={(e) => onMoveSelect(moveDetails[e.target.selectedIndex])}
        disabled={disabled}
        className="mt-2 p-2 border border-gray-300 rounded"
      >
        <option value="">Selecione um movimento</option>
        {moveDetails.map((move) => (
          <option key={move.id} value={move.name}>
            {move.name.charAt(0).toUpperCase() + move.name.slice(1)} (Poder: {move.power})
          </option>
        ))}
      </select>
    </div>
  );
};

export default MoveSelector;
