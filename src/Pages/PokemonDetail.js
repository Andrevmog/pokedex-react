import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchPokemonData, fetchPokemonEncounters } from '../Services/pokemonService';
import { typeColors } from '../Utils/typeColors';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const { data: pokemonData, status: pokemonStatus, error: pokemonError } = useQuery(
    ["pokemon", name],
    () => fetchPokemonData(name)
  );

  const { data: encountersData, status: encountersStatus, error: encountersError } = useQuery(
    ["encounters", name],
    () => fetchPokemonEncounters(name)
  );

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (pokemonData) {
      const audioSrc = pokemonData.cries.latest;
      audioRef.current.src = audioSrc;
      audioRef.current.volume = 0.05;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log(err));
    }
  }, [pokemonData]);

  if (pokemonStatus === "loading" || encountersStatus === "loading") {
    return <div className="text-center text-blue-500">Carregando...</div>;
  }

  if (pokemonStatus === "error") {
    return <div className="text-center text-red-500">Erro ao buscar dados do Pokémon: {pokemonError.message}</div>;
  }

  if (encountersStatus === "error") {
    return <div className="text-center text-red-500">Erro ao buscar dados de encontros: {encountersError.message}</div>;
  }

  const handleNextPokemon = () => {
    navigate(`/pokemon/${pokemonData.id + 1}`);
  };

  const handlePrevPokemon = () => {
    if (pokemonData.id > 1) {
      navigate(`/pokemon/${pokemonData.id - 1}`);
    }
  };

  return (
    <div className="flex items-center min-h-screen select-none">
      <div className="flex gap-10 bg-white shadow-lg rounded-lg p-6 flex-col md:flex-row items-start justify-between mx-4 border border-gray-300 w-full max-w-5xl relative">
        
        {/* Detalhes do Pokémon */}
        <div className="relative flex flex-col items-center md:w-2/3 flex-grow max-h-[600px]"> {/* Defina uma altura máxima e overflow */}
          <h1 className="text-4xl font-bold mb-4 capitalize">{pokemonData.name}</h1>
          <img
            className="bg-cover bg-[url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/aa15ff7d-d333-4bf9-b115-95e18f63fe91/d8fbmbq-69a1f210-aa05-4a78-8425-4b6b84b9a335.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FhMTVmZjdkLWQzMzMtNGJmOS1iMTE1LTk1ZTE4ZjYzZmU5MVwvZDhmYm1icS02OWExZjIxMC1hYTA1LTRhNzgtODQyNS00YjZiODRiOWEzMzUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.UwbEhZVcsWv7NAON1L5LhP22kuGx_8G2uqM0oeBNCv4')] min-w-60 min-h-60 mb-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
          />
          <div className="w-full mb-4">
            <p className="text-lg">Altura: <span className="font-semibold">{pokemonData.height / 10} m</span></p>
            <p className="text-lg">Peso: <span className="font-semibold">{pokemonData.weight / 10} kg</span></p>
            <p className="text-lg font-semibold mt-4">Tipos:</p>
            <ul className="flex gap-2 flex-wrap mb-4">
              {pokemonData.types.map((type) => (
                <li key={type.type.name} className={`font-bold text-white rounded-full px-3 py-1 ${typeColors[type.type.name]} hover:shadow-lg transition-shadow duration-200`}>
                  {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Estatísticas do Pokémon */}
        <div className="w-full mb-4 flex-grow max-h-[600px] overflow-y-auto"> {/* Defina uma altura máxima e overflow */}
          <p className="text-lg font-semibold mb-2">Estatísticas:</p>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-lg">Estatística</th>
                <th className="border px-4 py-2 text-lg">Valor</th>
              </tr>
            </thead>
            <tbody>
              {pokemonData.stats.map((stat) => (
                <tr key={stat.stat.name}>
                  <td className="border px-4 py-3 text-lg capitalize">{stat.stat.name}</td>
                  <td className="border px-4 py-3 text-lg">{stat.base_stat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exibição de encontros */}
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-5xl flex-grow mx-4 flex flex-col items-center max-h-[600px] overflow-y-auto"> {/* Defina uma altura máxima e overflow */}
        <h2 className="text-2xl font-semibold mb-4">Encontros:</h2>
        {encountersData.length > 0 ? (
          encountersData.map((encounter, index) => (
            <div key={index} className="mb-4 w-full">
              <p className="font-bold capitalize">{encounter.location_area.name.replace(/-/g, ' ')}</p>
              {encounter.version_details.map((detail, idx) => (
                <div key={idx}>
                  <p className="text-lg">
                    <span className="font-semibold">Versão:</span> {detail.version.name} | 
                    <span className="font-semibold"> Chance:</span> {detail.max_chance}%
                  </p>
                  {detail.encounter_details.map((encounterDetail, id) => (
                    <p key={id} className="text-sm">
                      Nível: {encounterDetail.min_level}-{encounterDetail.max_level} | 
                      Método: {encounterDetail.method.name}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-lg">Sem encontros registrados.</p>
        )}
      </div>

      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200"
        onClick={handlePrevPokemon}
      >
        <AiOutlineLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200"
        onClick={handleNextPokemon}
      >
        <AiOutlineRight size={24} />
      </button>
    </div>
  );
}

export default PokemonDetail;
