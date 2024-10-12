import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchPokemonData, fetchPokemonEncounters } from '../Services/pokemonService';
import { typeColors } from '../Utils/typeColors';
import { AiOutlineLeft, AiOutlineRight, AiOutlineSound } from 'react-icons/ai';

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(new Audio()); // Ref para o áudio
  const [activeTab, setActiveTab] = useState('info'); // Estado para controlar a aba ativa
  const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar se o áudio está tocando

  const { data: pokemonData, status: pokemonStatus, error: pokemonError } = useQuery(
    ["pokemon", name],
    () => fetchPokemonData(name)
  );

  const { data: encountersData, status: encountersStatus, error: encountersError } = useQuery(
    ["encounters", name],
    () => fetchPokemonEncounters(name)
  );

  useEffect(() => {
    if (pokemonData) {
      const audioSrc = pokemonData.cries.latest;
      audioRef.current.src = audioSrc;
      audioRef.current.volume = 0.05;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [pokemonData]);

  const toggleAudio = () => {
    audioRef.current.play().catch(err => console.log(err));
  };

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

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex items-center min-h-screen select-none">
      <div className="bg-cover flex gap-10 bg-red-200 shadow-lg rounded-lg p-6 flex-col md:flex-row items-start justify-between mx-4 border border-gray-300 w-full max-w-5xl relative">

        {/* Detalhes do Pokémon */}
        <div className="relative flex flex-col items-center md:w-2/3 flex-grow max-h-[600px]">
          <h1 className="text-4xl font-bold mb-4 capitalize">{pokemonData.name}</h1>
          <img
            className="bg-[url('https://pokemonrevolution.net/forum/uploads/monthly_2019_10/d843fov-5ad2d436-789b-48f4-91ac-7a553ca26306.png.3c7185d83015a14741e5cf34bdae8c99.png')] bg-cover bg-red-400 min-w-60 min-h-60 mb-4 rounded-lg shadow-lg"
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

          {/* Botão de áudio */}
          <button
            className={`absolute bottom-40 right-0 mt-4 p-2 rounded-full bg-white text-black hover:shadow-lg transition-shadow`}
            onClick={toggleAudio}
          >
            <AiOutlineSound size={27} />
          </button>
        </div>

        {/* Abas */}
        <div className="w-full mb-4 flex flex-col">
          <div className="flex justify-around mb-4 gap-3">
            <button
              className={`flex-1 p-3 rounded-lg ${activeTab === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => switchTab('info')}
            >
              Informações
            </button>
            <button
              className={`flex-1 p-3 rounded-lg ${activeTab === 'encounters' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => switchTab('encounters')}
            >
              Encontros
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="flex-grow max-h-[500px] min-w-[300px] bg-white border-gray-300 rounded-lg p-4">
            {activeTab === 'info' && (
              <div>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-lg">Estatística</th>
                      <th className="px-4 py-2 text-lg">Valor</th>
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
            )}

            {activeTab === 'encounters' && (
              <div className="overflow-y-auto max-h-[400px] bg-white">
                {encountersData.length > 0 ? (
                  encountersData.map((encounter, index) => (
                    <div key={index} className="mb-4 w-full ">
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
            )}
          </div>
        </div>
      </div>

      <button
        className="flex absolute left-1/3 bottom-20 transform -translate-y-1/3 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        onClick={handlePrevPokemon}
      >
        <AiOutlineLeft size={24} /> Anterior
      </button>
      <button
        className="flex absolute right-1/3 bottom-20 transform -translate-y-1/3 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        onClick={handleNextPokemon}
      >
        Próximo <AiOutlineRight size={24} />
      </button>
    </div>
  );
}

export default PokemonDetail;
