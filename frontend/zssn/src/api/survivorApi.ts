export const fetchSurvivors = async () => {
    const response = await fetch('http://localhost:8000/api/survivors');
    if (!response.ok) throw new Error('Failed to fetch survivors');
    return response.json();
};