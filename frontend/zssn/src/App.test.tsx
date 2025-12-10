import { screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import { renderWithRouter } from './setupTests';

const mockSurvivor = {
  id: 1,
  name: 'Alice',
  age: 30,
  gender: 'F',
  latitude: 40.71,
  longitude: -74.01,
};

describe('App Routing', () => {
  it('renders Landing Page on default route `/`', () => {
    renderWithRouter('/', <App />);
    expect(screen.getByText(/landing_page.title/i)).toBeInTheDocument();
  });

  it('renders SurvivorForm on `/create-survivor` route', () => {
    renderWithRouter('/create-survivor', <App />);

    // Check that the form's heading exists (proves the component is rendered)
    expect(screen.getByText(/create a survivor/i)).toBeInTheDocument();
  });

  it('renders Survivor List on `/survivors` route', async () => {
    renderWithRouter('/survivors', <App />);
    expect(await screen.findByText(/Survivors/i)).toBeInTheDocument();
  });

  it('renders Survivor Details on `/survivors/1` route', async () => {
    renderWithRouter('/survivors/1', <App />, { survivor: mockSurvivor });

    expect(await screen.findByText(/Alice/i)).toBeInTheDocument();
  });

  it('renders Update Location on `/update-location/1` route', async () => {
    renderWithRouter('/update-location/1', <App />, { survivor: mockSurvivor });
    expect(await screen.findByText(/Update_Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude/i)).toHaveValue(40.71);
  });
});
