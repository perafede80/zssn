import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { vi } from 'vitest';
import { getSurvivor, updateSurvivorLocation } from '../../api/survivorApi';
import UpdateLocationPage from '../../pages/UpdateLocationPage';
import { renderWithRouter } from '../../setupTests';

const mockSurvivor = {
  id: 1,
  name: 'Alice',
  age: 30,
  gender: 'F',
  latitude: 40.71,
  longitude: -74.01,
};

const mockNavigate = useNavigate as ReturnType<typeof vi.fn>;
const mockGetSurvivor = getSurvivor as ReturnType<typeof vi.fn>;
const mockUpdateSurvivorLocation = updateSurvivorLocation as ReturnType<
  typeof vi.fn
>;

describe('UpdateLocation Component', () => {
  it('renders survivor details correctly when data is passed via navigation', async () => {
    renderWithRouter('/survivors/1', <UpdateLocationPage />, {
      survivor: mockSurvivor,
    });
    await waitFor(() =>
      expect(screen.getByLabelText(/COMMON.NAME/i)).toBeInTheDocument(),
    );
    expect(screen.getByLabelText(/COMMON.NAME/i)).toHaveValue('Alice');
    expect(screen.getByLabelText(/Latitude/i)).toHaveValue(40.71);
    expect(screen.getByLabelText(/Longitude/i)).toHaveValue(-74.01);
  });

  // it('fetches survivor details if not passed via navigation', async () => {
  //   renderWithRouter('/survivors/1', <UpdateLocationPage />);
  //   await waitFor(() => expect(screen.getByLabelText(/COMMON.NAME/i)).toHaveValue('Alice'));
  // });

  // it('displays error if fetching survivor fails', async () => {
  //   renderWithRouter('/survivors/1', <UpdateLocationPage />);
  //   await waitFor(() =>
  //     expect(screen.getByRole('alert', { name: /error/i })).toHaveTextContent(
  //       `{t("COMMON.SURVIVOR_DETAILS_NOT_FOUND")}`,
  //     ),
  //   );
  //   expect(screen.getByRole('button', { name: /UPDATE_LOCATION_PAGE.BACK_BUTTON/i })).toBeInTheDocument();
  // });

  // it('updates location when form is submitted', async () => {
  //   mockUpdateSurvivorLocation.mockResolvedValue({});
  //   renderWithRouter('/survivors/1', <UpdateLocationPage />, { survivor: mockSurvivor });
  //   fireEvent.change(screen.getByLabelText(/COMMON.LATITUDE/i), { target: { value: '15' } });
  //   fireEvent.change(screen.getByLabelText(/COMMON.LONGITUDE/i), { target: { value: '30' } });
  //   fireEvent.click(screen.getByRole('button', { name: /UPDATE_LOCATION_PAGE.BUTTON.UPDATE/i }));

  //   await waitFor(() =>
  //     expect(mockUpdateSurvivorLocation).toHaveBeenCalledWith('1', 15, 30),
  //   );
  //   await waitFor(() =>
  //     expect(mockNavigate).toHaveBeenCalledWith(
  //       '/survivors/1',
  //       expect.objectContaining({
  //         state: { survivor: { ...mockSurvivor, latitude: 15, longitude: 30 } },
  //       }),
  //     ),
  //   );
  // });

  // Add more test cases for error during update, validation, loading state, and cancel button

  // it("updates location when form is submitted", async () => {
  //     (updateSurvivorLocation as jest.Mock).mockResolvedValue({});

  //     render(
  //         <BrowserRouter>
  //             <UpdateLocationPage />
  //         </BrowserRouter>
  //     );

  //     fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: "15" } });
  //     fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: "30" } });
  //     fireEvent.click(screen.getByText(/Update Location/i));

  //     await waitFor(() => expect(updateSurvivorLocation).toHaveBeenCalledWith("1", 15, 30));
  //     expect(mockNavigate).toHaveBeenCalledWith("/survivors/1", expect.anything());
  // });
});
