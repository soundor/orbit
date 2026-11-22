import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { BreakingChangeIcon } from './breaking-change-icon';
import { Downloads } from './downloads';
import { Player } from './player';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    BreakingChangeIcon,
    Downloads,
    Player,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;
