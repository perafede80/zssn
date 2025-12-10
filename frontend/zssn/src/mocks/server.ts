import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create and configure the MSW server
export const server = setupServer(...handlers);
