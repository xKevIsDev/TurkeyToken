export interface Position {
  x: number;
  y: number;
}

export interface Speed {
  x: number;
  y: number;
}

export interface FragmentSprite {
  id: string;
  position: Position;
  speed: Position;
  changeDirectionInterval: number;
  iconType?: string;
}

export interface Character {
  position: Position;
  targetPosition: Position | null;
  speed: number;
}