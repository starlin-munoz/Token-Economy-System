const BASE_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

export const api = {
    register: (email, password) =>
        fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(r => r.json()),

    login: (email, password) =>
        fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(r => r.json()),

    getClients: () =>
        fetch(`${BASE_URL}/clients`, {
            headers: headers(),
        }).then(r => r.json()),

    createClient: (name, age, gender) =>
        fetch(`${BASE_URL}/clients`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ name, age, gender }),
        }).then(r => r.json()),

    deleteClient: (id) =>
        fetch(`${BASE_URL}/clients/${id}`, {
            method: 'DELETE',
            headers: headers(),
        }).then(r => r.json()),

    getClientBank: (clientId) =>
        fetch(`${BASE_URL}/clients/${clientId}/bank`, {
            headers: headers(),
        }).then(r => r.json()),

    createSession: (clientId, goalTokens) =>
        fetch(`${BASE_URL}/sessions`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ clientId, goalTokens }),
        }).then(r => r.json()),

    awardToken: (sessionId, tokenEmoji) =>
        fetch(`${BASE_URL}/sessions/${sessionId}/tokens`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ tokenEmoji }),
        }).then(r => r.json()),

    completeSession: (sessionId) =>
        fetch(`${BASE_URL}/sessions/${sessionId}/complete`, {
            method: 'PATCH',
            headers: headers(),
        }).then(r => r.json()),

    getClientSessions: (clientId) =>
        fetch(`${BASE_URL}/sessions/client/${clientId}`, {
            headers: headers(),
        }).then(r => r.json()),

    getRewards: (clientId) =>
        fetch(`${BASE_URL}/rewards/client/${clientId}`, {
            headers: headers(),
        }).then(r => r.json()),

    createReward: (clientId, name, cost) =>
        fetch(`${BASE_URL}/rewards`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ clientId, name, cost }),
        }).then(r => r.json()),

    redeemReward: (id) =>
        fetch(`${BASE_URL}/rewards/${id}/redeem`, {
            method: 'POST',
            headers: headers(),
        }).then(r => r.json()),

    deleteReward: (id) =>
        fetch(`${BASE_URL}/rewards/${id}`, {
            method: 'DELETE',
            headers: headers(),
        }).then(r => r.json()),
};