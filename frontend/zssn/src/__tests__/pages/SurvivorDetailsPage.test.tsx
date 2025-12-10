import { screen } from '@testing-library/react';
import SurvivorDetailsPage from '../../pages/SurvivorDetailsPage';
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

describe('SurvivorDetail Component', () => {
  it('displays survivor details correctly', async () => {
    renderWithRouter('/survivors/1', <SurvivorDetailsPage />, {
      survivor: mockSurvivor,
    });

    expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/common.age/i)).toBeInTheDocument();
    expect(screen.getByText(/common.Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Update_Location/i)).toBeInTheDocument();
  });

  // it("navigates to update location when button is clicked", () => {
  //     render(
  //         <BrowserRouter>
  //             <SurvivorDetailsPage />
  //         </BrowserRouter>
  //     );

  //     fireEvent.click(screen.getByText(/Update Location/i));
  //     expect(mockNavigate).toHaveBeenCalledWith("/update-location/1", expect.anything());
  // });
});
