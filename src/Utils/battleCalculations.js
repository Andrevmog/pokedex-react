// src/Utils/battleCalculations.js

export const calculateDamage = (attacker, defender, move) => {
  if (!attacker || !defender || !move) return 0;

  const baseDamage = move.power || 50; // Poder do movimento, padrão 50 se não estiver disponível
  const attack = attacker.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 100; // Ataque do Pokémon atacante
  const defense = defender.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 100; // Defesa do Pokémon defensor

  // Cálculo de dano básico
  let damage = Math.max(0, Math.floor((baseDamage * attack) / defense));

  // Fator de tipo
  const typeEffectiveness = calculateTypeEffectiveness(move.type, defender.types);
  damage = Math.floor(damage * typeEffectiveness);

  if (move.effect) {
    // Adicione lógica para efeitos especiais
    if (move.effect.type === "status") {
      // Exemplo: paralisar o inimigo
      defender.status = move.effect.status; // Presumindo que você tenha uma propriedade "status"
    }
  }

  return damage;
};

// Função para calcular a efetividade do tipo
const calculateTypeEffectiveness = (attackType, defenderTypes) => {
  // Mapeamento de efetividade dos tipos (simplificado)
  const typeEffectivenessMap = {
    // Tipo do ataque: [Tipos de defesa, multiplicador]
    fire: { grass: 2, water: 0.5, fire: 0.5 },
    water: { fire: 2, grass: 0.5, water: 0.5 },
    grass: { water: 2, fire: 0.5, grass: 0.5 },
    // Adicione mais tipos conforme necessário
  };

  let effectiveness = 1;

  if (typeEffectivenessMap[attackType]) {
    for (const defenderType of defenderTypes) {
      const multiplier = typeEffectivenessMap[attackType][defenderType.type.name];
      if (multiplier) {
        effectiveness *= multiplier; // Ajusta a efetividade com base nos tipos
      }
    }
  }

  return effectiveness;
};
