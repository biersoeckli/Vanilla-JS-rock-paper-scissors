import { LOCAL_STORAGE_USER_KEY } from '../models/constants.js';
import User from '../models/user.js';

let currentUser;

function loadUserFromLocalStorage() {
  const userFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (userFromLocalStorage) {
    currentUser = JSON.parse(userFromLocalStorage);
  }
}

export function setCurrentUser(username) {
  currentUser = new User(username);
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
}

export function resetCurrentUser() {
  currentUser = undefined;
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
}

export function getCurrentUser() {
  return currentUser;
}

export function initUserService() {
  loadUserFromLocalStorage();
}
