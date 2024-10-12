import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import Card from './Card';
import { fetchPokemons } from '../Services/pokemonService'; // Importa o serviço
import { Link, useNavigate } from 'react-router-dom';

function PokemonList() {
    const loadMoreRef = useRef(null); // Ref para o observador
    const navigate = useNavigate(); // Hook para navegação
    const {
        data,
        status,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(
        "pokemons",
        ({ pageParam = 0 }) => fetchPokemons(40, pageParam), // Passa o limite e o offset
        {
            getNextPageParam: (lastPage) => {
                return lastPage.next ? (lastPage.results.length / 40) : undefined; // Calcule a próxima página
            },
        }
    );

    // Função para renderizar os cartões de Pokémon
    const renderPokemonCards = () => {
        if (!data || !data.pages) return <div>Nenhum Pokémon encontrado.</div>;

        return data.pages.map((page) =>
            page.results.map((pokemon) => {
                const pokemonName = pokemon.name; // Nome do Pokémon
                return (
                    <Link className='flex w-1/6' key={pokemonName} to={`/pokemon/${pokemonName}`}>
                        <Card pokemon={pokemon} />
                    </Link>
                );
            })
        );
    };

    // Efeito para configurar a rolagem infinita
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage(); // Carrega a próxima página quando o elemento está visível
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, hasNextPage, fetchNextPage]);

    return (
        <div className='flex mt-20 w-full flex-col items-center'>
            <div className='flex gap-3 w-full'>
                {status === "loading" && <div>Carregando...</div>}
                {status === "error" && <div className="text-red-500">Erro ao buscar pokémons</div>}
                {status === "success" && (
                    <div className='flex justify-center w-full h-full gap-8 flex-wrap'>
                        {renderPokemonCards()}
                    </div>
                )}
            </div>
            {/* Elemento observador para carregar mais Pokémon */}
            <div ref={loadMoreRef} className="h-10" />

            {/* Botão fixo no canto inferior direito */}
            <button
                onClick={() => navigate('/')} // Redireciona para a página inicial
                className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg hover:bg-green-600 transition"
            >
                Voltar ao Início
            </button>
        </div>
    );
}

export default PokemonList;
