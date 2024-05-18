export type EventListener = { type: keyof DocumentEventMap, listener:  (e: any) => any };

export type App = 'tunnel' | 'cube';

export type Point = { x: number, y: number, z: number };
export type Line = { from: Point, to: Point };

export type Point2D = { x: number, y: number };
export type Line2D = { from: Point2D, to: Point2D, width: number };
