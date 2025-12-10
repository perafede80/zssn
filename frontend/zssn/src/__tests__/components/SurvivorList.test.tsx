import { render, screen, waitFor } from '@testing-library/react';
import { http } from 'msw';
import SurvivorList from '../../components/SurvivorList';
import { server } from '../../mocks/server';
import { renderWithRouter } from '../../setupTests';

describe('SurvivorList Component', () => {
  it('renders Survivor List on `/survivors` route', async () => {
    renderWithRouter('/survivors', <SurvivorList />);
    await waitFor(() => {
      expect(screen.getByText(/Survivors/i)).toBeInTheDocument();
    });
  });

  it('displays survivors when API call succeeds', async () => {
    renderWithRouter('/survivors', <SurvivorList />);
    expect(await screen.findByText(/Survivor 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Survivor 6/i)).toBeInTheDocument();
  });

  it('displays an error message when API call fails', async () => {
    // Override the handler to simulate an API error
    server.use(
      http.get('http://localhost:8000/api/survivors', () => {
        return new Response('API Error', { status: 500 });
      }),
    );

    renderWithRouter('/survivors', <SurvivorList />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch survivors/i),
      ).toBeInTheDocument();
    });
  });

  // it("navigates to landing page when 'Back to Launch Page' is clicked", () => {
  //     render(
  //         <BrowserRouter>
  //             <SurvivorList />
  //         </BrowserRouter>
  //     );

  //     fireEvent.click(screen.getByText(/Back to Launch Page/i));
  //     expect(mockNavigate).toHaveBeenCalledWith("/");
  // });
});
