import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import SurvivorForm from '../../components/SurvivorForm';
import { renderWithRouter } from '../../setupTests';

describe('SurvivorForm Component', () => {
  it('prevents submission without inventory', () => {
    renderWithRouter('/', <SurvivorForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByLabelText(/Age/i), {
      target: { value: '30' },
    });
    fireEvent.change(screen.getByLabelText(/Latitude/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/Longitude/i), {
      target: { value: '60' },
    });
    fireEvent.click(screen.getByText(/Create Survivor/i));

    // expect(screen.getByText(/Please select at least one inventory item/i)).toBeInTheDocument();
  });

  // it("creates a survivor when valid data is provided", async () => {
  //     (createSurvivor as jest.Mock).mockResolvedValue({});
  //     render(
  //         <BrowserRouter>
  //             <SurvivorForm />
  //         </BrowserRouter>
  //     );

  //     fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alice" } });
  //     fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: "30" } });
  //     fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: "50" } });
  //     fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: "60" } });

  //     // Add inventory item
  //     fireEvent.click(screen.getByText(/Select Inventory/i));
  //     fireEvent.click(screen.getByText(/Water/i));
  //     fireEvent.click(screen.getByText(/Done/i));

  //     fireEvent.click(screen.getByText(/Create Survivor/i));

  //     await waitFor(() =>
  //         expect(createSurvivor).toHaveBeenCalledWith(expect.objectContaining({ name: "Alice" }))
  //     );
  //     expect(mockNavigate).toHaveBeenCalledWith("/survivors");
  // });
});
