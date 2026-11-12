// The playground's tiny design system, the checks that grade agent output, and recorded runs
// for browsers without WebGPU. Kept dependency-free so it can be unit-tested or reused.

export type UINode = { type: string; props?: Record<string, unknown>; children?: UINode[] | string };

export const COMPONENTS = {
  Stack: 'Vertical layout. props: none. children: nodes.',
  Row: 'Horizontal layout. props: none. children: nodes.',
  Card: 'A surface that groups content. props: none. children: nodes.',
  Heading: 'props: level (1, 2 or 3). children: text.',
  Text: 'props: tone ("default" | "muted"). children: text.',
  Button: 'props: variant ("primary" | "secondary"). children: text, a short verb phrase.',
  TextField: 'props: label (required text), type ("text" | "email" | "number").',
  Stat: 'props: label (text), value (text).',
  Badge: 'props: tone ("info" | "success" | "warning" | "danger"). children: text.',
} as const;

export const TOKENS = ['info', 'success', 'warning', 'danger', 'default', 'muted', 'primary', 'secondary'];

export const SYSTEM_PROMPT = `You build user interfaces as JSON using ONLY this design system.
Components:
${Object.entries(COMPONENTS).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
Rules: use only these components and only the listed prop values. Never use colours, hex codes, pixel sizes or HTML tags.
Every TextField needs a label. Use at most one primary Button. Start with a Heading level 1. Button text is a specific action like "Approve payment".
Reply with JSON only, shaped as {"type":"Stack","children":[...]} where every node is {"type", "props", "children"}.`;

export type Check = { id: string; name: string; ok: boolean; detail: string };

function walk(n: UINode, f: (n: UINode) => void) {
  f(n);
  if (Array.isArray(n.children)) n.children.forEach((c) => c && typeof c === 'object' && walk(c, f));
}
const textOf = (n: UINode) => (typeof n.children === 'string' ? n.children : '');

export function runChecks(root: UINode): Check[] {
  const nodes: UINode[] = [];
  walk(root, (n) => nodes.push(n));
  const unknown = nodes.filter((n) => !(n.type in COMPONENTS)).map((n) => n.type);
  const raw = nodes.flatMap((n) => Object.values(n.props ?? {}).map(String)).filter((v) => /#[0-9a-f]{3,8}\b|rgb\(|\d+px/i.test(v));
  const badProp = nodes.filter((n) => {
    const p = n.props ?? {};
    if (n.type === 'Button' && p.variant && !['primary', 'secondary'].includes(String(p.variant))) return true;
    if (n.type === 'Badge' && p.tone && !['info', 'success', 'warning', 'danger'].includes(String(p.tone))) return true;
    return false;
  });
  const fields = nodes.filter((n) => n.type === 'TextField');
  const unlabelled = fields.filter((n) => !String(n.props?.label ?? '').trim());
  const primaries = nodes.filter((n) => n.type === 'Button' && (n.props?.variant ?? 'primary') === 'primary');
  const headings = nodes.filter((n) => n.type === 'Heading').map((n) => Number(n.props?.level ?? 1));
  const skips = headings.some((l, i) => i > 0 && l - headings[i - 1] > 1);
  const vague = nodes.filter((n) => n.type === 'Button').map(textOf).filter((t) => /^(ok|submit|click here|go|button|yes|continue)$/i.test(t.trim()) || t.trim().split(/\s+/).length > 5 || !t.trim());

  return [
    { id: 'components', name: 'Uses system components', ok: unknown.length === 0, detail: unknown.length ? `Not in the system: ${[...new Set(unknown)].join(', ')}` : 'Every node is a system component.' },
    { id: 'tokens', name: 'Uses design tokens', ok: raw.length === 0 && badProp.length === 0, detail: raw.length ? `Raw values: ${raw.slice(0, 3).join(', ')}` : badProp.length ? `Unknown prop value on ${badProp[0].type}` : 'No hard-coded colours or sizes.' },
    { id: 'labels', name: 'Every field has a label', ok: unlabelled.length === 0, detail: fields.length ? (unlabelled.length ? `${unlabelled.length} field(s) without a label` : `${fields.length} field(s), all labelled`) : 'No fields to check.' },
    { id: 'primary', name: 'At most one primary action', ok: primaries.length <= 1, detail: `${primaries.length} primary button(s)` },
    { id: 'headings', name: 'Headings start at 1 and don’t skip', ok: headings.length > 0 && headings[0] === 1 && !skips, detail: headings.length ? `Levels: ${headings.join(', ')}` : 'No heading' },
    { id: 'actions', name: 'Buttons say what they do', ok: vague.length === 0, detail: vague.length ? `Vague: “${vague[0] || '(empty)'}”` : 'Every button names its action.' },
  ];
}

export function feedbackFor(checks: Check[]) {
  const failed = checks.filter((c) => !c.ok);
  return `Your JSON failed these checks. Fix them and reply with the full corrected JSON only:\n${failed.map((c) => `- ${c.name}: ${c.detail}`).join('\n')}`;
}

export function parseUI(text: string): UINode | null {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const obj = JSON.parse(text.slice(start, end + 1));
    return obj && typeof obj === 'object' && obj.type ? obj : null;
  } catch {
    return null;
  }
}

// Recorded examples for browsers without WebGPU. Written to show the loop, graded live by the same checks.
export const PRESETS: { prompt: string; attempts: UINode[] }[] = [
  {
    prompt: 'A card to approve a payment, with a reference field',
    attempts: [
      { type: 'Stack', children: [
        { type: 'Heading', props: { level: 2 }, children: 'Approve payment' },
        { type: 'Card', children: [
          { type: 'Stat', props: { label: 'Amount', value: '€2,400.00' } },
          { type: 'TextField', props: { label: '', type: 'text', placeholder: 'Reference' } },
          { type: 'div', props: { style: 'background:#0a5bd3' }, children: 'Submit' },
          { type: 'Button', props: { variant: 'primary' }, children: 'Reject' },
        ] },
      ] },
      { type: 'Stack', children: [
        { type: 'Heading', props: { level: 1 }, children: 'Approve payment' },
        { type: 'Card', children: [
          { type: 'Stat', props: { label: 'Amount', value: '€2,400.00' } },
          { type: 'TextField', props: { label: 'Reference', type: 'text' } },
          { type: 'Row', children: [
            { type: 'Button', props: { variant: 'primary' }, children: 'Approve payment' },
            { type: 'Button', props: { variant: 'secondary' }, children: 'Reject payment' },
          ] },
        ] },
      ] },
    ],
  },
  {
    prompt: 'A newsletter sign-up for design engineers',
    attempts: [
      { type: 'Stack', children: [
        { type: 'Heading', props: { level: 1 }, children: 'Design engineering, monthly' },
        { type: 'Text', props: { tone: 'muted', color: '#888888' }, children: 'One email a month. No spam.' },
        { type: 'TextField', props: { type: 'email' } },
        { type: 'Button', props: { variant: 'primary' }, children: 'OK' },
      ] },
      { type: 'Stack', children: [
        { type: 'Heading', props: { level: 1 }, children: 'Design engineering, monthly' },
        { type: 'Text', props: { tone: 'muted' }, children: 'One email a month. No spam.' },
        { type: 'TextField', props: { label: 'Email address', type: 'email' } },
        { type: 'Button', props: { variant: 'primary' }, children: 'Subscribe' },
      ] },
    ],
  },
  {
    prompt: 'An account summary with balance, pending items and a status badge',
    attempts: [
      { type: 'Stack', children: [
        { type: 'Heading', props: { level: 1 }, children: 'Operating account' },
        { type: 'Heading', props: { level: 3 }, children: 'Today' },
        { type: 'Row', children: [
          { type: 'Stat', props: { label: 'Balance', value: '€184,220' } },
          { type: 'Stat', props: { label: 'Pending', value: '6' } },
        ] },
        { type: 'Badge', props: { tone: 'green' }, children: 'Healthy' },
        { type: 'Button', props: { variant: 'primary' }, children: 'View' },
        { type: 'Button', props: { variant: 'primary' }, children: 'Export' },
      ] },
      { type: 'Stack', children: [
        { type: 'Heading', props: { level: 1 }, children: 'Operating account' },
        { type: 'Heading', props: { level: 2 }, children: 'Today' },
        { type: 'Card', children: [
          { type: 'Row', children: [
            { type: 'Stat', props: { label: 'Balance', value: '€184,220' } },
            { type: 'Stat', props: { label: 'Pending', value: '6' } },
          ] },
          { type: 'Badge', props: { tone: 'success' }, children: 'Healthy' },
        ] },
        { type: 'Row', children: [
          { type: 'Button', props: { variant: 'primary' }, children: 'Review pending items' },
          { type: 'Button', props: { variant: 'secondary' }, children: 'Export statement' },
        ] },
      ] },
    ],
  },
];
