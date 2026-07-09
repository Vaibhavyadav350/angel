import axios from 'axios';
import { domain } from '../utils/constants';

/**
 * Preconfigured axios instance for all admin API calls.
 *
 * - Sends cookies automatically for JWT auth.
 * - Base URL points to /api so stores only specify the endpoint path.
 * - Centralised error extraction so no component re-implements the same
 *   `error.response?.data?.message` dance.
 */
const adminApi = axios.create({
  baseURL: `${domain}/api`,
  withCredentials: true,
  timeout: 10000,
});

/**
 * Extract a human-readable message from an axios/reject error.
 */
export const extractError = (error, fallback = 'Something went wrong') => {
  if (typeof error === 'string') return error;
  return error?.response?.data?.message || error?.message || fallback;
};

/**
 * Extract the data payload from a standard `{ success, data, message }` response.
 * Returns `null` if the response does not indicate success.
 */
export const extractData = (response) => {
  if (!response?.data) return null;
  return response.data.success ? response.data.data : null;
};

export default adminApi;
