export type EventListener = { type: keyof DocumentEventMap, listener:  (e: any) => any };

export type App = 'tunnel' | 'cube';
