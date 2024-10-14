import React, { useEffect, useState } from 'react';
import { fetchAllPokemonNames } from '../Services/pokemonService'; // Certifique-se de que o caminho está correto

const PokemonSelector = ({ onSelect }) => {
  const [pokemonNames, setPokemonNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  useEffect(() => {
    const loadPokemonNames = async () => {
      const names = await fetchAllPokemonNames();
      setPokemonNames(names);
    };

    loadPokemonNames();
  }, []);

  // Filtra os Pokémon conforme o termo de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const filtered = pokemonNames.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons([]);
    }
  }, [searchTerm, pokemonNames]);

  const handleSelect = (name) => {
    onSelect(name);
    setSearchTerm('');
    setFilteredPokemons([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar Pokémon..."
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Buscar Pokémon"
      />
      {filteredPokemons.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 overflow-auto shadow-lg">
          {filteredPokemons.map((name) => (
            <li
              key={name}
              onClick={() => handleSelect(name)}
              className="p-2 hover:bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out"
              role="option"
              aria-selected="false"
              tabIndex={0} // Torna o item da lista focável
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSelect(name);
                }
              }}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)} {/* Capitaliza o primeiro caractere */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonSelector;
