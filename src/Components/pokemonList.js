import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import Card from './Card';
import { fetchPokemons } from '../Services/pokemonService'; // Importa o serviço
import { Link } from 'react-router-dom';

function PokemonList() {
    const loadMoreRef = useRef(null); // Ref para o observador
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
                return lastPage.next ? lastPage.offset : undefined; // Retorna o próximo offset
            },
        }
    );

    // Função para renderizar os cartões de Pokémon
    const renderPokemonCards = () => {
        if (!data || !data.pages) return <div>Nenhum Pokémon encontrado.</div>;

        return data.pages.flatMap((page) => 
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
        }, {
            rootMargin: '300px', // Ajuste este valor conforme necessário
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

    // Função para rolar para o topo da página
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                onClick={scrollToTop} // Chama a função para rolar para o topo
                className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg hover:bg-green-600 transition"
            >
                Voltar ao Topo
            </button>
        </div>
    );
}

export default PokemonList;
