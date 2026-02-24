export enum Color {
  RED = 'RED',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  ORANGE = 'ORANGE'
}

export interface Dragon {
  id?: number;
  name: string;
  coordinatesId: number;
  caveId?: number;
  killerId?: number;
  age?: number;
  color?: Color;
  type?: DragonType;
  character: DragonCharacter;
  headId?: number;
}

export enum DragonType {
  WATER = 'WATER',
  UNDERGROUND = 'UNDERGROUND',
  AIR = 'AIR',
  FIRE = 'FIRE'
}

export enum DragonCharacter {
  EVIL = 'EVIL',
  CHAOTIC_EVIL = 'CHAOTIC_EVIL',
  FICKLE = 'FICKLE'
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

export interface Person {
  id?: number;
  name: string;
  eyeColor?: Color;
  hairColor: Color;
  locationId?: number;
  birthday?: string;
  height: number;
  weight?: number;
  passportId: string;
}

export interface DragonHead {
  id?: number;
  size?: number;
}

export interface Location {
  id?: number;
  x: number;
  y?: number;
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
  readOnly?: boolean;
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
