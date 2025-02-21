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

export const getSurvivor = async (id: string) => {
    const response = await fetch(`http://localhost:8000/survivors/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch survivor details.");
    }

    return response.json();
};

export const updateSurvivorLocation = async (id: string, latitude: number, longitude: number) => {
    const response = await fetch(`http://localhost:8000/api/survivors/${id}/update_location/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
        throw new Error("Failed to update location. Please try again.");
    }

    return response.json();
};

export interface TradeItems {
    [key: string]: number; // Item name as key, quantity as value
}

export const survivorTradeItems = async (
    survivorAId: number,
    survivorBId: number,
    itemsA: TradeItems,
    itemsB: TradeItems
) => {
    const tradePayload = {
        survivor_b_id: survivorBId,
        items_a: itemsA,
        items_b: itemsB,
    };
    const response = await fetch(`http://localhost:8000/api/survivors/${survivorAId}/trade/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tradePayload),
    });

    if (!response.ok) {
        throw new Error("Trade failed");
    }

    return response.json();
};
