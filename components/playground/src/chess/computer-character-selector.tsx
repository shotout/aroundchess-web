'use client';

import * as React from 'react';
import { useComputerChessStore } from "../store/computerChessStore";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "./person-avatar";

interface Character {
  id: string;
  name: string;
  title: string;
  elo: number;
  gender: 'male' | 'female';
}

const getUniquePlayers = (elo: number, count: number) => {
  const players = [];
  const allPlayers = generateName(elo);
  
  for (let i = 0; i < count && i < allPlayers.length; i++) {
    const player = allPlayers[i];
    players.push({
      id: `${elo}-${i}`,
      name: `${player.name} ${player.flag}`,
      title: '',
      elo,
      gender: player.gender
    });
  }
  return players;
};

const generateName = (elo: number): Array<{ name: string; flag: string; gender: 'male' | 'female' }> => {
  if (elo === 250) {
    return [
      { name: 'Thomas', flag: '🇩🇪', gender: 'male' },
      { name: 'Sofia', flag: '🇮🇹', gender: 'female' }
    ];
  }
  if (elo === 400) {
    return [
      { name: 'Pierre', flag: '🇫🇷', gender: 'male' },
      { name: 'Lieke', flag: '🇳🇱', gender: 'female' },
      { name: 'Ana', flag: '🇪🇸', gender: 'female' }
    ];
  }
  if (elo === 500) {
    return [
      { name: 'Carlos', flag: '🇪🇸', gender: 'male' },
      { name: 'Lena', flag: '🇩🇪', gender: 'female' },
      { name: 'Dmitri', flag: '🇷🇺', gender: 'male' }
    ];
  }
  if (elo === 600) {
    return [
      { name: 'Marco', flag: '🇮🇹', gender: 'male' },
      { name: 'Marie', flag: '🇫🇷', gender: 'female' },
      { name: 'Elena', flag: '🇳🇱', gender: 'female' }
    ];
  }
  if (elo === 700) {
    return [
      { name: 'Viktor', flag: '🇷🇺', gender: 'male' },
      { name: 'Carmen', flag: '🇪🇸', gender: 'female' },
      { name: 'Hans', flag: '🇳🇱', gender: 'male' }
    ];
  }
  if (elo === 800) {
    return [
      { name: 'Igor', flag: '🇷🇺', gender: 'male' },
      { name: 'Amélie', flag: '🇫🇷', gender: 'female' },
      { name: 'Lisa', flag: '🇮🇹', gender: 'female' }
    ];
  }
  if (elo === 850) {
    return [
      { name: 'Anders', flag: '🇳🇴', gender: 'male' },
      { name: 'Astrid', flag: '🇳🇴', gender: 'female' },
      { name: 'Ingrid', flag: '🇳🇴', gender: 'female' }
    ];
  }

  if (elo === 900) {
    return [
      { name: 'Takeshi', flag: '🇯🇵', gender: 'male' },
      { name: 'Wei', flag: '🇨🇳', gender: 'female' },
      { name: 'Priya', flag: '🇮🇳', gender: 'female' },
      { name: 'John', flag: '🇺🇸', gender: 'male' },
      { name: 'Emily', flag: '🇬🇧', gender: 'female' }
    ];
  }
  if (elo === 1000) {
    return [
      { name: 'Kenji', flag: '🇯🇵', gender: 'male' },
      { name: 'Mei', flag: '🇨🇳', gender: 'female' },
      { name: 'Sarah', flag: '🇺🇸', gender: 'female' }
    ];
  }
  if (elo === 1100) {
    return [
      { name: 'Raj', flag: '🇮🇳', gender: 'male' },
      { name: 'Yuki', flag: '🇯🇵', gender: 'female' },
      { name: 'Lucy', flag: '🇬🇧', gender: 'female' }
    ];
  }
  if (elo === 1200) {
    return [
      { name: 'Li', flag: '🇨🇳', gender: 'male' },
      { name: 'Julia', flag: '🇧🇷', gender: 'female' },
      { name: 'Maria', flag: '🇺🇸', gender: 'female' }
    ];
  }
  if (elo === 1300) {
    return [
      { name: 'Amit', flag: '🇮🇳', gender: 'male' },
      { name: 'James', flag: '🇬🇧', gender: 'male' },
      { name: 'Hana', flag: '🇯🇵', gender: 'female' }
    ];
  }
  if (elo === 1400) {
    return [
      { name: 'Lucas', flag: '🇧🇷', gender: 'male' },
      { name: 'Clara', flag: '🇧🇷', gender: 'female' },
      { name: 'Sakiko', flag: '🇯🇵', gender: 'female' }
    ];
  }

  if (elo === 1500) {
    return [
      { name: 'Andrei', flag: '🇷🇴', gender: 'male' },
      { name: 'Maria', flag: '🇧🇬', gender: 'female' },
      { name: 'Eva', flag: '🇵🇱', gender: 'female' }
    ];
  }
  if (elo === 1600) {
    return [
      { name: 'Stefan', flag: '🇷🇴', gender: 'male' },
      { name: 'Irina', flag: '🇧🇬', gender: 'female' },
      { name: 'Ania', flag: '🇵🇱', gender: 'female' }
    ];
  }
  if (elo === 1700) {
    return [
      { name: 'Nicolae', flag: '🇷🇴', gender: 'male' },
      { name: 'Katalin', flag: '🇭🇺', gender: 'female' },
      { name: 'Piotr', flag: '🇵🇱', gender: 'male' }
    ];
  }
  if (elo === 1800) {
    return [
      { name: 'Ferenc', flag: '🇭🇺', gender: 'male' },
      { name: 'Eva', flag: '🇸🇰', gender: 'female' },
      { name: 'Diana', flag: '🇧🇬', gender: 'female' }
    ];
  }
  if (elo === 1900) {
    return [
      { name: 'Josef', flag: '🇸🇰', gender: 'male' },
      { name: 'Ilona', flag: '🇭🇺', gender: 'female' },
      { name: 'Jana', flag: '🇨🇿', gender: 'female' }
    ];
  }
  if (elo === 2000) {
    return [
      { name: 'Karel', flag: '🇨🇿', gender: 'male' },
      { name: 'Nina', flag: '🇸🇰', gender: 'female' },
      { name: 'Marta', flag: '🇭🇷', gender: 'female' }
    ];
  }
  if (elo === 2100) {
    return [
      { name: 'Marko', flag: '🇭🇷', gender: 'male' },
      { name: 'Petra', flag: '🇨🇿', gender: 'female' }
    ];
  }

  if (elo === 2200) {
    return [
      { name: 'Mikhail', flag: '🇷🇺', gender: 'male' },
      { name: 'Alexandra', flag: '🇷🇺', gender: 'female' },
      { name: 'Viktor', flag: '🇺🇦', gender: 'male' },
      { name: 'Kateryna', flag: '🇺🇦', gender: 'female' }
    ];
  }
  if (elo === 2300) {
    return [
      { name: 'Vladimir', flag: '🇷🇺', gender: 'male' },
      { name: 'Olga', flag: '🇺🇦', gender: 'female' },
      { name: 'Kristin', flag: '🇳🇴', gender: 'female' }
    ];
  }
  if (elo === 2450) {
    return [
      { name: 'Judit', flag: '🇭🇺', gender: 'female' },
      { name: 'Hou', flag: '🇨🇳', gender: 'female' },
      { name: 'Boris', flag: '🇷🇺', gender: 'male' }
    ];
  }

  return [{ name: 'Unknown', flag: '🏳️', gender: 'male' }];
};

const categories = [
  { id: 'beginner', name: 'Beginner', range: [250, 850], color: 'bg-blue-50' },
  { id: 'intermediate', name: 'Intermediate', range: [900, 1400], color: 'bg-blue-50' },
  { id: 'advanced', name: 'Advanced', range: [1500, 2100], color: 'bg-blue-50' },
  { id: 'master', name: 'Master', range: [2200, 2450], color: 'bg-blue-50' },
] as const;

const getAvatarNumber = (name: string, elo: number, gender: 'male' | 'female'): number => {
  const str = `${name}-${elo}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const positiveHash = Math.abs(hash);
  return (positiveHash % 35) + 1;
};

export function ComputerCharacterSelector() {
  const { 
    targetELO, 
    updateTargetELO, 
    setOpponentName, 
    computer, 
    playerColor, 
    setPlayerColor,
    setSelectedCharacter 
  } = useComputerChessStore();
  
  const [selectedCategory, setSelectedCategory] = React.useState('beginner');
  const [selectedCharacterId, setSelectedCharacterId] = React.useState<string | null>(null);
  
  const characters = React.useMemo(() => {
    const currentCategory = categories.find(c => c.id === selectedCategory)!;
    const result: (Character & { avatarNumber: number })[] = [];
    
    const eloRanges = {
      'beginner': [250, 400, 500, 600, 700, 800, 850],
      'intermediate': [900, 1000, 1100, 1200, 1300, 1400],
      'advanced': [1500, 1600, 1700, 1800, 1900, 2000, 2100],
      'master': [2200, 2300, 2450]
    };

    const currentElos = eloRanges[selectedCategory as keyof typeof eloRanges];
    
    currentElos.forEach(elo => {
      const count = elo === 250 ? 2 : elo === 900 ? 5 : elo === 2200 ? 4 : 3;
      const players = getUniquePlayers(elo, count);
      
      players.forEach(player => {
        const avatarNumber = getAvatarNumber(player.name, elo, player.gender);
        
        result.push({
          ...player,
          avatarNumber
        });
      });
    });

    return result;
  }, [selectedCategory]);

  const handleCharacterSelect = React.useCallback((character: Character & { avatarNumber: number }) => {
    setSelectedCharacterId(character.id);
    updateTargetELO(character.elo);
    setOpponentName(character.name);
    setSelectedCharacter(character);
    
    if (!computer) {
      setPlayerColor('white');
    }
  }, [computer, setOpponentName, setPlayerColor, setSelectedCharacter, updateTargetELO]);

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full border rounded-lg overflow-hidden">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedCharacterId(null);
            }}
            className={cn(
              "flex-1 py-3 px-4 text-center transition-colors",
              selectedCategory === category.id
                ? "bg-white border-b-2 border-blue-600"
                : "hover:bg-gray-50"
            )}
          >
            <div className="font-medium">{category.name}</div>
            <div className="text-[14px] --xs text-muted-foreground">
              {category.range[0]}-{category.range[1]} ELO
            </div>
          </button>
        ))}
      </div>

      <div className="border rounded-xl p-6 bg-white">
        <div className="grid grid-cols-6 gap-4">
          {characters.map((character) => {
            const isSelected = character.id === selectedCharacterId;
            
            return (
              <button
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className={cn(
                  "group relative flex flex-col items-center p-3 rounded-lg transition-all",
                  "hover:bg-blue-50",
                  isSelected && "bg-blue-50 ring-2 ring-blue-600 ring-offset-2"
                )}
              >
                <div className="w-14 h-14 relative mb-2">
                  <div className="absolute inset-0">
                    <PersonAvatar
                      seed={character.avatarNumber}
                      className="w-full h-full"
                      gender={character.gender}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-[14px] --sm font-medium leading-tight",
                    isSelected ? "text-blue-600" : "text-gray-900"
                  )}>
                    {character.name}
                  </p>
                  <p className="text-[14px] --xs text-gray-500 mt-0.5">
                    ELO {character.elo}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 