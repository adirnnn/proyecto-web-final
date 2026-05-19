import type { GymSession } from '../types/item';

const STORAGE_KEY = 'gym_sessions';

export const storageService = {
  getItems: (): GymSession[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveItems: (items: GymSession[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};
