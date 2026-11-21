import { track } from '@vercel/analytics';

export type EggId = 'agent' | 'palette' | 'strum' | 'sargam' | 'kolam' | 'console' | 'time';
export type Egg = { id: EggId; title: string; hint: string };

export const EGGS: Egg[] = [
  { id: 'agent', title: 'Read like a machine', hint: 'One letter changes who is reading.' },
  { id: 'palette', title: 'Everything, from the keyboard', hint: 'The shortcut every engineer tries first.' },
  { id: 'strum', title: 'All three strings', hint: 'The headline is an instrument. Play all of it.' },
  { id: 'sargam', title: 'Sa re ga ma pa dha ni', hint: 'Seven letters, in order, with the sound on.' },
  { id: 'kolam', title: 'The oldest cheat code', hint: 'Up, up, down, down…' },
  { id: 'console', title: 'Looked under the hood', hint: 'Developers look in one place first. Then call the function.' },
  { id: 'time', title: '181 minutes back', hint: 'Drag a long task until it is short.' },
];

const KEY = 'sai-eggs';
let memory: EggId[] = [];
const valid = (x: unknown): x is EggId => EGGS.some((e) => e.id === x);

export function getFound(): EggId[] {
  if (typeof window === 'undefined') return [];
  let stored: EggId[] = [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(v)) stored = v.filter(valid);
  } catch {}
  return Array.from(new Set([...stored, ...memory]));
}

/** Easter-egg tracking was retired: no counter, no toasts. Kept as a no-op so call sites stay simple. */
export function findEgg(_id: EggId): boolean {
  return false;
}

/** Shared keyboard state so the `a` shortcut does not fire at the end of the Konami code (b, a). */
export const keyState = { konami: 0, doneAt: -1000 };

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent('sai:toast', { detail: message }));
}
