import axios from 'axios';

const BASE_URL = 'https://drab-teal-ox-kit.cyclic.app/auth';
// const BASE_URL = "http://localhost:5000/auth"

export async function registerUser(fullname: string, email: string, password: string) {
  try {
    const url = `${BASE_URL}/register`;
    const data = { fullname, email, password };
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'An error occurred while registering user';
    console.error('Error starting Discord service:', errorMessage);
    throw errorMessage;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const url = `${BASE_URL}/login`;
    const data = { email, password };
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'An error occurred while logging in';
    console.error('Error logging in:', errorMessage);
    throw errorMessage;
  }
}

interface RefreshTokenResponse {
  access_token: string;
}

export async function refreshAccessToken(): Promise<void> {
  try {
    const url = `${BASE_URL}/refreshAccessToken`;
    const data = { refresh_token: window.electron.store.get("refresh_token") };
    const response = await axios.post<RefreshTokenResponse>(url, data);
    await window.electron.store.set("access_token", response.data.access_token);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Propagate the error to the calling code
  }
}

// Call refreshAccessToken function every hour
export const tokenRefreshInterval = setInterval(refreshAccessToken, 3600000);
