import React, { useEffect, useState } from 'react';
import PokemonBattleSelector from '../Components/PokemonBattleSelector';
import PokemonBattleCard from '../Components/PokemonBattleCard';
import MoveSelector from '../Components/MoveSelector';
import BattleLog from '../Components/BattleLog';
import { fetchPokemonData } from '../Services/pokemonService';
import { calculateDamage } from '../Utils/battleCalculations';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'; // Importando ícones

const Battle = () => {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isBattleOver, setIsBattleOver] = useState(false);

  const handlePokemonSelect = async (name, isPlayer) => {
    setLoading(true);
    try {
      const data = await fetchPokemonData(name);
      const pokemonWithHpAndMoves = {
        ...data,
        hp: data.stats[0].base_stat,
        moves: data.moves.slice(0, 4),
      };
      if (isPlayer) {
        setPlayerPokemon(pokemonWithHpAndMoves);
      } else {
        setEnemyPokemon(pokemonWithHpAndMoves);
      }
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerMove = async (move) => {
    if (isBattleOver) return;

    const damage = calculateDamage(playerPokemon, enemyPokemon, move);
    enemyPokemon.hp = Math.max(enemyPokemon.hp - damage, 0);

    // Verifica se o movimento tem efeitos
    if (move.effect) {
      applyEffect(enemyPokemon, move.effect);
    }

    setBattleLog((prevLog) => [
      ...prevLog,
      `${playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)} usou ${move.name} e causou ${damage} de dano!`,
    ]);

    if (enemyPokemon.hp <= 0) {
      setBattleLog((prevLog) => [
        ...prevLog,
        `${enemyPokemon.name.charAt(0).toUpperCase() + enemyPokemon.name.slice(1)} foi derrotado! Você venceu!`,
      ]);
      setIsBattleOver(true);
      return;
    }

    setPlayerTurn(false);
    await enemyAttack();
  };

  const enemyAttack = async () => {
    setTimeout(() => {
      const enemyMoveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
      const enemyMove = enemyPokemon.moves[enemyMoveIndex];

      const moveName = enemyMove.move.name || 'movimento desconhecido';
      const enemyDamage = calculateDamage(enemyPokemon, playerPokemon, enemyMove);

      // Verifica se o movimento tem efeitos
      if (enemyMove.effect) {
        applyEffect(playerPokemon, enemyMove.effect);
      }

      playerPokemon.hp = Math.max(playerPokemon.hp - enemyDamage, 0);

      setBattleLog((prevLog) => [
        ...prevLog,
        `${enemyPokemon.name.charAt(0).toUpperCase() + enemyPokemon.name.slice(1)} usou ${moveName} e causou ${enemyDamage} de dano!`,
      ]);

      if (playerPokemon.hp <= 0) {
        setBattleLog((prevLog) => [
          ...prevLog,
          `${playerPokemon.name.charAt(0).toUpperCase() + playerPokemon.name.slice(1)} foi derrotado! Você perdeu!`,
        ]);
        setIsBattleOver(true);
      } else {
        setPlayerTurn(true);
      }
    }, 1000);
  };

  // Função para aplicar efeitos
  const applyEffect = (target, effect) => {
    if (effect.type === 'status') {
      target.status = effect.status; // Aplicar status ao alvo
      // Você pode adicionar lógica adicional aqui para lidar com efeitos específicos
    }
  };

  const handleRestart = () => {
    setPlayerPokemon(null);
    setEnemyPokemon(null);
    setBattleLog([]);
    setIsBattleOver(false);
    setPlayerTurn(true);
  };

  return (
    <div className="battle max-w-2xl mx-auto p-6 bg-gradient-to-r from-green-300 to-blue-500 rounded-lg shadow-lg">
      <h2 className="text-center text-4xl font-bold text-white mb-6 drop-shadow-lg">Sistema de Batalha Pokémon</h2>

      {!playerPokemon || !enemyPokemon ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Escolha o Pokémon do Jogador:</h3>
          <PokemonBattleSelector 
            onSelect={(name) => handlePokemonSelect(name, true)} 
            disabled={isBattleOver} // Desabilitar durante a batalha
          />
          {loading && <p className="text-gray-200">Carregando Pokémon...</p>}
          {playerPokemon && <PokemonBattleCard pokemon={playerPokemon} />}

          <h3 className="text-lg font-semibold text-white mb-2 mt-4">Escolha o Pokémon do Inimigo:</h3>
          <PokemonBattleSelector 
            onSelect={(name) => handlePokemonSelect(name, false)} 
            disabled={isBattleOver} // Desabilitar durante a batalha
          />
          {loading && <p className="text-gray-200">Carregando Pokémon...</p>}
          {enemyPokemon && <PokemonBattleCard pokemon={enemyPokemon} />}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <PokemonBattleCard pokemon={playerPokemon} />
            <PokemonBattleCard pokemon={enemyPokemon} />
          </div>
          {!isBattleOver && (
            <div className="mb-4">
              <MoveSelector
                moves={playerPokemon.moves} // Sempre mostrando apenas 4 movimentos
                onMoveSelect={handlePlayerMove}
                disabled={!playerTurn} // Desabilitar se não for a vez do jogador
                className="bg-white rounded-lg shadow-md p-4"
              />
              <p className="text-center mt-2 text-white font-semibold">
                {playerTurn ? "É a sua vez!" : `${enemyPokemon.name.charAt(0).toUpperCase() + enemyPokemon.name.slice(1)} está atacando!`}
              </p>
            </div>
          )}
        </>
      )}

      <div className="battle-log bg-gray-800 text-gray-200 p-4 rounded-lg mt-4 shadow-lg">
        <h4 className="text-lg font-bold mb-2">Log de Batalha:</h4>
        <BattleLog log={battleLog} />
      </div>

      {isBattleOver && (
        <button
          onClick={handleRestart}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded transition duration-200 shadow-lg"
        >
          Recomeçar Batalha
        </button>
      )}
    </div>
  );
};

export default Battle;
