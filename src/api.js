import axios from 'axios';

const SERVER_URL = "http://localhost:4000";

export const fetchLandmarks = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${SERVER_URL}/landmark/generate/landmarks/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch landmarks:', error);
        return [];
    }
};

export const fetchPrompt = async (landmark, art) => {
    console.log('Coordinates received:', landmark.latitude, landmark.longitude);
    if (!landmark.latitude || !landmark.longitude) {
        throw new Error('Latitude and longitude are required');
    }

    try {
        const response = await axios.post(`${SERVER_URL}/landmark/generate/prompt`, {landmark: landmark, art: art});
        return response.data;
    } catch (error) {
        console.error('Failed to fetch landmarks:', error);
        return [];
    }
};
