import User from './models/user.js';

const schereSteinPapierUserKey = 'SSS_USER';
let currentUser;

function loadUserFromLocalStorage() {
  const userFromLocalStorage = localStorage.getItem(schereSteinPapierUserKey);
  if (userFromLocalStorage) {
    currentUser = JSON.parse(userFromLocalStorage);
  }
}

export function setCurrentUser(username) {
  currentUser = new User(username);
  localStorage.setItem(schereSteinPapierUserKey, JSON.stringify(currentUser));
}

export function resetCurrentUser() {
  currentUser = undefined;
  localStorage.removeItem(schereSteinPapierUserKey);
}

export function getCurrentUser() {
  return currentUser;
}

export function initUserService() {
  loadUserFromLocalStorage();
}
