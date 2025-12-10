import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import SurvivorCard from '../../components/SurvivorCard';
import { Gender } from '../../enums/gender.enums';
import type { Survivor } from '../../models/survivor.model';
import { renderWithRouter } from '../../setupTests';

const mockSurvivor: Survivor = {
  id: 1,
  name: 'John Doe',
  age: 25,
  gender: Gender.Male,
  latitude: 45,
  longitude: 90,
  inventory: [{ item: 'Food', quantity: 2 }],
};

describe('SurvivorCard Component', () => {
  it('renders survivor details correctly', () => {
    renderWithRouter('/survivors/1', <SurvivorCard survivor={mockSurvivor} />);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Age: 25/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
  });

  // it("navigates to survivor details when button is clicked", () => {
  //     renderWithRouter("/survivors/1", <SurvivorCard survivor={mockSurvivor} />);

  //     fireEvent.click(screen.getByText(/Play as Survivor/i));
  //     expect(mockNavigate).toHaveBeenCalledWith("/survivors/1", expect.anything());
  // });
});
