import { createContext, useContext } from 'react';

export const IntroPhaseContext = createContext({
  phase: 'done',
  started: true,
  done: true,
});

export function useIntroPhase() {
  return useContext(IntroPhaseContext);
}
