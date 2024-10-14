// Components/PokemonSearch.js

import React, { useState } from 'react';
import { useAllPokemonNames } from '../hooks/useAllPokemonNames'; // Ajuste o caminho conforme necessário

const PokemonSearch = ({ onSelect }) => {
  const { data: pokemonNames, isLoading, isError } = useAllPokemonNames();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  // Atualiza o termo de busca e filtra os Pokémon
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = pokemonNames.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons([]);
    }
  };

  // Seleciona um Pokémon e chama a função onSelect
  const handleSelect = (name) => {
    onSelect(name); // Passa o nome do Pokémon para a função pai
    setSearchTerm(''); // Limpa o input
    setFilteredPokemons([]); // Limpa as opções do dropdown
  };

  // Renderiza o estado de carregamento
  if (isLoading) return <div>Carregando Pokémon...</div>;

  // Renderiza o estado de erro
  if (isError) return <div>Erro ao carregar Pokémon.</div>;

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar Pokémon..."
        className="border p-2 rounded w-full"
      />
      {filteredPokemons.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-10 overflow-auto shadow-lg">
          {filteredPokemons.map((name) => (
            <li
              key={name}
              onClick={() => handleSelect(name)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonSearch;
