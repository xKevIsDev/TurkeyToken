export interface Position {
  x: number;
  y: number;
}

export interface Speed {
  x: number;
  y: number;
}

export interface TurkeySprite {
  id: string;
  position: Position;
  speed: Speed;
  changeDirectionInterval: number;
}

export interface Character {
  position: Position;
  targetPosition: Position | null;
  speed: number;
}