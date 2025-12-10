import { screen } from '@testing-library/react';
import { it } from 'vitest';
import TradePage from '../../pages/TradePage';
import { renderWithRouter } from '../../setupTests';

const mockSurvivor = {
  id: '1',
  name: 'Jane Doe',
  age: 30,
  gender: 'F',
  latitude: 40,
  longitude: 70,
  inventory: [{ item: 'Water', quantity: 3 }],
};

describe('TradePage Component', () => {
  it('displays the rigth elements of the page', async () => {
    renderWithRouter('/survivors/1', <TradePage />, {
      survivor: mockSurvivor,
    });

    expect(await screen.findByText(/trade_page.title/i)).toBeInTheDocument();
  });
});
