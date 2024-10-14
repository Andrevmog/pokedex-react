import React, { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { fetchPokemonData } from '../Services/pokemonService'; // Importa o serviço
import { typeColors } from '../Utils/typeColors'
import { FaVolumeUp } from 'react-icons/fa';


const Card = ({ pokemon }) => {
    // Assume que pokemon.id é o ID do Pokémon
    const { name } = pokemon; // Obtém o ID do Pokémon
    const { data, isLoading, error } = useQuery(
        ['pokemon', name], // Usa o ID como chave da consulta
        () => fetchPokemonData(`${name}`) // Construindo a URL com o ID
    );

    const audioRef = useRef(null);

    const handlePlaySound = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.02; // Ajusta o volume
            audioRef.current.play().catch(err => console.log(err));
        }
    };

    if (error) {
        return <div className="text-red-500">Erro ao buscar dados do Pokémon: {error.message}</div>;
    }

    if (isLoading) {
        return <div className="text-blue-500">Loading...</div>;
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-4 w-full bg-gray-200 bg-opacity-70 shadow-lg border-2 rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <audio ref={audioRef} src={data.cries.latest} />
            <img className="bg-[url('https://pokemonrevolution.net/forum/uploads/monthly_2019_10/d843fov-5ad2d436-789b-48f4-91ac-7a553ca26306.png.3c7185d83015a14741e5cf34bdae8c99.png')] bg-cover object-contain h-32 w-32 mb-4 rounded-full border-4 shadow-md" src={data.sprites.front_default} alt={data.name} />
            <h5 className="text-lg font-bold text-gray-800">
                {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
            </h5>
            <div className='flex m-2 gap-2'>
                {data.types.map((typeData) => (
                    <p
                        key={typeData.type.name}
                        className={`font-extrabold text-white rounded-full px-2 py-1 ${typeColors[typeData.type.name]}`}
                    >
                        {typeData.type.name.charAt(0).toUpperCase() + typeData.type.name.slice(1)}
                    </p>
                ))}
            </div>
            {/* Botão de som no canto superior direito */}
            {/* <button 
                onClick={handlePlaySound} 
                className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition duration-300"
                aria-label="Reproduzir som do Pokémon"
            >
                <FaVolumeUp />
            </button> */}
        </div>
    );
};

export default Card;
