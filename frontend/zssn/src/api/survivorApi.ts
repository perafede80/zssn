export const fetchSurvivors = async () => {
    const response = await fetch('http://localhost:8000/api/survivors');
    if (!response.ok) throw new Error('Failed to fetch survivors');
    return response.json();
};

export const createSurvivor = async (survivor: any) => {
    const response = await fetch('http://localhost:8000/api/survivors/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(survivor),
    });

    if (!response.ok) throw new Error("Failed to create survivor");
    return response.json();
};
