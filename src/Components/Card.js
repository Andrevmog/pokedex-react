import { useQuery } from 'react-query';
import axios from 'axios';
import { useRef } from 'react';
import { FaVolumeUp } from 'react-icons/fa';

const fetchPokemonData = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

const typeColors = {
    grass: 'bg-green-500',
    poison: 'bg-purple-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    bug: 'bg-green-600',
    normal: 'bg-gray-400',
    flying: 'bg-blue-300',
    electric: 'bg-yellow-400',
    ground: 'bg-brown-600',
    rock: 'bg-gray-600',
    fairy: 'bg-pink-400',
    fighting: 'bg-red-700',
    psychic: 'bg-pink-500',
    ice: 'bg-cyan-300',
    ghost: 'bg-purple-700',
    steel: 'bg-gray-300',
    dark: 'bg-gray-800',
    dragon: 'bg-indigo-600',
};

const Card = ({ pokemon }) => {
    const { data, isLoading, error } = useQuery(
        ['pokemon', pokemon.url],
        () => fetchPokemonData(pokemon.url)
    );

    const audioRef = useRef(null);

    const handlePlaySound = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.02;
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
        <div className=" select-none relative flex flex-col items-center justify-center p-4 w-1/5 bg-gradient-to-br from-red-300 to-red-400 border-none rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <audio ref={audioRef} src={data.cries.latest} />
            <img className="object-cover h-32 w-32 mb-4 rounded-full border-4 border-gray-800 bg-white" src={data.sprites.front_default} alt={data.name} />
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
            <button 
                onClick={handlePlaySound} 
                className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition duration-300"
                aria-label="Reproduzir som do Pokémon"
            >
                <FaVolumeUp />
            </button>
        </div>
    );
};

export default Card;