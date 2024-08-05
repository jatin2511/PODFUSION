import axios from 'axios';

const API = axios.create({
  baseURL: 'https://podfusion.onrender.com/api',
  withCredentials: true,
});

// Auth Endpoints
export const signIn = async ({ email, password }) =>
  await API.post('/auth/signin', { email, password });

export const signUp = async ({ name, email, password }) =>
  await API.post('/auth/signup', { name, email, password });

export const googleSignIn = async ({ name, email, picture }) =>
  await API.post('/auth/google', { name, email, picture });

export const findUserByEmail = async (email) =>
  await API.get(`/auth/findbyemail`, {
    params: { email }
  });

export const generateOtp = async (email, name, reason) =>
  await API.get(`/auth/generateotp`, {
    params: { email, name, reason }
  });

export const verifyOtp = async (otp) =>
  await API.get(`/auth/verifyotp`, {
    params: { code: otp }
  });

export const resetPassword = async (email, password) =>
  await API.put('/auth/forgetpassword', { email, password });

// User Endpoints
export const getUsers = async (token) =>
  await API.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

export const searchUsers = async (search, token) =>
  await API.get(`/users/search/${search}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

// Podcast Endpoints
export const createPodcast = async (podcast, token) => {
  console.log('Creating podcast with data:', podcast);
  try {
    const response = await API.post('/podcasts', podcast, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating podcast:', error);
    throw error;
  }
};

export const getPodcasts = async () => await API.get('/podcasts');

export const addEpisodes = async (podcast, token) =>
  await API.post('/podcasts/episode', podcast, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const favoritePodcast = async (id, token) =>
  await API.post('/podcasts/favorite', { id }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const getRandomPodcast = async () => await API.get('/podcasts/random');

export const getPodcastByTags = async (tags) =>
  await API.get('/podcasts/tags', {
    params: { tags }
  });

export const getPodcastByCategory = async (category) =>
  await API.get('/podcasts/category', {
    params: { q: category }
  });

export const getMostPopularPodcast = async () =>
  await API.get('/podcasts/mostpopular');

export const getPodcastById = async (id) =>
  await API.get(`/podcasts/get/${id}`);

export const addView = async (id) => await API.post(`/podcasts/addview/${id}`);

export const searchPodcast = async (search) =>
  await API.get('/podcasts/search', {
    params: { q: search }
  });
