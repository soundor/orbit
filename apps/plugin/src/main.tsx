import { registerFonts } from '@soundor/components';
import { render } from '@soundor/react';

import { CoveredEditor } from './app/covered-editor';

void registerFonts().catch((error: unknown) =>
  console.warn('Orbit fonts could not load', error),
);
render(<CoveredEditor />);
