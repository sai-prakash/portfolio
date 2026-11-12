// The site's design system as data. The CSS in app/(site)/globals.css mirrors these values;
// /system renders them and /design-system.json serves them to agents.
export const colors = [
  { name: 'paper', light: '#EAEDF7', dark: '#0E1233', use: 'Page background' },
  { name: 'paper-2', light: '#F5F6FC', dark: '#151A45', use: 'Quiet surface, code' },
  { name: 'card', light: '#FFFFFF', dark: '#1C2257', use: 'Raised surface' },
  { name: 'ink', light: '#12163A', dark: '#ECEBF7', use: 'Text and primary actions' },
  { name: 'ink-2', light: '#4B5180', dark: '#AEB3DA', use: 'Secondary text' },
  { name: 'line', light: '#C6CBE6', dark: '#343B7A', use: 'Borders, never text' },
  { name: 'indigo', light: '#2E3BC4', dark: '#9AA6FF', use: 'What machines read: links, the agent line' },
  { name: 'haldi', light: '#F5B82E', dark: '#F5B82E', use: 'What a person should notice. Fills only, never text' },
  { name: 'kumkum', light: '#B8322A', dark: '#FF8A80', use: 'Failures, with a word, never colour alone' },
  { name: 'pass', light: '#1B6E47', dark: '#6FD3A0', use: 'Passes, with a word' },
] as const;

export const type = [
  { name: 'hero', value: 'clamp(2.6rem, 6.4vw, 5.4rem)', font: 'Eczar 600', use: 'One per page' },
  { name: '2xl', value: 'clamp(1.875rem, 3.3vw, 2.75rem)', font: 'Eczar 600', use: 'Section titles' },
  { name: 'xl', value: 'clamp(1.375rem, 2.2vw, 1.875rem)', font: 'Eczar 600', use: 'Sub-sections' },
  { name: 'l', value: 'clamp(1.0625rem, 1.2vw, 1.1875rem)', font: 'Hanken Grotesk', use: 'Body' },
  { name: 'm', value: '1rem', font: 'Hanken Grotesk', use: 'UI text' },
  { name: 's', value: '0.875rem', font: 'Hanken Grotesk', use: 'Labels and captions' },
] as const;

export const space = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;
export const radius = [{ name: 'control', value: '999px' }, { name: 'card', value: '14px' }, { name: 'inset', value: '10px' }] as const;

export const rules = [
  { component: 'Button', rule: 'One primary action per view. The text says what happens.' },
  { component: 'Card', rule: 'A card sets one thing apart. Not everything is a card.' },
  { component: 'Stat', rule: 'A big number always says what it counts.' },
  { component: 'Pill', rule: 'States a status in words, never by colour alone.' },
  { component: 'Field', rule: 'Every field has a visible label.' },
  { component: 'Heading', rule: 'Start at 1. Never skip a level.' },
  { component: 'Before / after', rule: 'Bars share one scale that starts at zero.' },
  { component: 'Demo', rule: 'Works with a keyboard and without WebGPU.' },
] as const;
