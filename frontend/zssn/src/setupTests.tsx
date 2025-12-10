/// <reference types="@vitest/browser/context" />
import '@testing-library/jest-dom';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { server } from './mocks/server';

const DEFAULT_LANGUAGE = 'en';

const DEFAULT_NAMESPACE = 'translations';

export function initI18n(translations = {}) {
  i18n.use(initReactI18next).init({
    lng: DEFAULT_LANGUAGE,

    fallbackLng: DEFAULT_LANGUAGE,

    ns: [DEFAULT_NAMESPACE],

    defaultNS: DEFAULT_NAMESPACE,

    debug: false,

    interpolation: {
      escapeValue: false,
    },

    resources: { [DEFAULT_LANGUAGE]: { [DEFAULT_NAMESPACE]: translations } },
  });
}

export const renderWithRouter = (
  initialPath: string,
  component: React.ReactElement,
  state?: Record<string, unknown>,
) => {
  return rtlRender(
    <MemoryRouter initialEntries={[{ pathname: initialPath, state }]}>
      {component}
    </MemoryRouter>,
  );
};

// MSW lifecycle hooks
beforeAll(() => {
  server.listen();
  initI18n();
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
