export interface Pokemon {
  id: number;
  name: string;
  awesomeName: string;
  cryUrl: string;
  spriteUrl: string;
  baseExperience: number;
  stats: Stat[];
  moves: Move[];
  abilities: Ability[];
  types: Type[];
  isSaved?: boolean;
}

export interface Stat {
  name: string;
  awesomeName: string;
  baseStat: number;
}

export interface Move {
  name: string;
  awesomeName: string;
  pokemonIds: number[];
}

export interface Ability {
  name: string;
  awesomeName: string;
}

export interface Type {
  name: string;
  awesomeName: string;
}
