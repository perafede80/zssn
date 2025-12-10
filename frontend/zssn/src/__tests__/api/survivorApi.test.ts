import { fetchSurvivors } from '../../api/survivorApi';
import { mockFetchSurvivors } from '../../mocks/apiMocks';

it('fetchSurvivors returns a list of survivors', async () => {
  const survivors = await fetchSurvivors();
  expect(survivors).toEqual(mockFetchSurvivors);
});
