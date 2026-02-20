export enum Color {
  BLUE = 'BLUE',
  WHITE = 'WHITE',
  BROWN = 'BROWN'
}

export interface Dragon {
  id?: number;
  name: string;
  coordinates: Coordinates;
  creationDate?: string;
  cave: DragonCave;
  killer?: Person;
  age: number;
  description: string;
  speaking: boolean;
  color?: Color;
  head?: DragonHead;
}

export interface Coordinates {
  id?: number;
  x: number;
  y: number;
}


export interface DragonCave {
  id?: number;
  depth: number;
}

export enum Country {
  INDIA = 'INDIA',
  VATICAN = 'VATICAN',
  THAILAND = 'THAILAND',
  SOUTH_KOREA = 'SOUTH_KOREA',
  NORTH_KOREA = 'NORTH_KOREA'
}

export interface Person {
  id?: number;
  name: string;
  eyeColor: Color;
  hairColor: Color;
  location?: Location;
  weight: number;
  nationality: Country;
}

export interface DragonHead {
  id?: number;
  size?: number;
  eyesCount: number;
  toothCount?: number;
}

export interface Location {
  id?: number;
  x: number;
  y: number;
  z: number;
  name: string;
}

export interface ColumnConfig {
  propertyName: string;
  displayName: string;
  sortable: boolean;
  type: 'auto' | 'input' | 'selectable' | 'enum';
  dataType?: 'string' | 'number' | 'boolean' | 'date';
  validators?: any[];
  tableIndexToSelectFrom?: number;
  enumValues?: string[];
}

export interface TableConfig {
  title: string;
  entityUrl: string;
  columns: ColumnConfig[];
  displayFormatter: (entity: any) => string;
}

export interface ParamConfig {
  column: ColumnConfig;
  in: 'query' | 'path';
}

export interface OperationConfig {
  title: string;
  description: string;
  path: string;
  method: string;
  params: ParamConfig[];
}
