// src/Components/PokemonBattleCard.js

import React from 'react';
import { typeColors } from '../Utils/typeColors'; // Ajuste o caminho para o seu objeto typeColors

const PokemonBattleCard = ({ pokemon }) => {
  // Verifica se as propriedades necessárias estão disponíveis
  const maxHp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat; // Obtém o HP máximo a partir de base_stat
  const currentHp = pokemon.hp || 0; // Define um valor padrão para o HP atual
  const hpPercentage = (currentHp / maxHp) * 100; // Cálculo da porcentagem de HP

  return (
    <div className="p-4 border border-gray-300 rounded shadow-lg bg-white">
      <h3 className="text-lg font-semibold">
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h3>
      <img
        src={pokemon.sprites?.front_default} // Adiciona a sprite do Pokémon
        alt={pokemon.name}
        className="w-24 h-24 mx-auto mb-2"
      />
      <div className="flex items-center mb-2">
        <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
          <div
            className={`h-full rounded ${hpPercentage > 50 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.max(0, Math.min(hpPercentage, 100))}%` }} // Limita a barra de vida entre 0% e 100%
          />
        </div>
        <span className="ml-2">{`${currentHp}/${maxHp}`}</span>
      </div>
      <p>
        Tipo: {pokemon.types.map(type => (
          <span
            key={type.type.name}
            className={`inline-block px-2 py-1 text-white rounded ${typeColors[type.type.name]}`}
          >
            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
          </span>
        ))}
      </p>
    </div>
  );
};

export default PokemonBattleCard;
