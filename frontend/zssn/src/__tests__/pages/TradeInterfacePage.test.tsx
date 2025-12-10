import { screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import TradeInterfacePage from '../../pages/TradeInterfacePage'
import { renderWithRouter } from '../../setupTests';

const mockSurvivor1 = {
  id: '1',
  name: 'Jane Doe',
  age: 30,
  gender: 'F',
  latitude: 40,
  longitude: 70,
  inventory: [{ item: 'Water', quantity: 3 }],
};

const mockSurvivor2 = {
  id: '2',
  name: 'John Doe',
  age: 40,
  gender: 'M',
  latitude: 58,
  longitude: -80,
  inventory: [{ item: 'Food', quantity: 4 }],
};

describe('TradeInterfacePage Component', () => {
  it('displays the rigth elements of the page', async () => {
    renderWithRouter(`/survivors/${mockSurvivor2.id}`, <TradeInterfacePage />, {
      survivor: mockSurvivor1,
      tradingWith: mockSurvivor2,
    });

    expect(
      await screen.findByText(/trade_interface_page.trade_between/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/trade_interface_page.button.confirm/i),
    ).toBeInTheDocument();
    expect(await screen.getByTestId('button')).toBeDisabled();
  });

  it('correctly display the right alert message', async () => {
      renderWithRouter(`/survivors/${mockSurvivor1.id}/trade_items/`, <TradeInterfacePage />, {
        survivor_b_id: mockSurvivor2.id,
        items_from_a: {"Water": 3},
        items_from_b: {"Food": 4}
      });
    
    expect(await screen.getByRole('alert')).toHaveTextContent('trade successful!');
  });
});
