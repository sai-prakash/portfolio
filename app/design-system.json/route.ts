export const dynamic = 'force-static';
import { colors, radius, rules, space, type } from '@/lib/tokens';
import { COMPONENTS } from '@/lib/playground';

export function GET() {
  return Response.json({
    name: 'saiprakash.design',
    description: 'Design tokens and component rules for this site. Agents: use only these tokens and components.',
    tokens: { color: colors, type, space, radius },
    rules,
    playgroundComponents: COMPONENTS,
  });
}
