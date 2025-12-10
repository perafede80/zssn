import { http, HttpResponse } from 'msw';
import { mockCreateSurvivor, mockFetchSurvivors, mockSurvivorTradeItems } from '../mocks/apiMocks';

export const handlers = [
  // Intercept GET requests...
  http.get('http://localhost:8000/api/survivors', () => {
    return HttpResponse.json(mockFetchSurvivors);
  }),
  http.post('http://localhost:8000/api/survivors/', () => {
    return HttpResponse.json(mockCreateSurvivor);
  }),
  http.post('http://localhost:8000/api/survivors/:survivorId/trade_items/', () => {
    return HttpResponse.json(mockSurvivorTradeItems);
  }),
];
