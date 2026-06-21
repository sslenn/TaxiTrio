let inMemoryToken = null;

export const getToken = () => inMemoryToken;
export const setToken = (t) => { inMemoryToken = t; };
export const removeToken = () => { inMemoryToken = null; };

export const getUser = () => {
  const raw = localStorage.getItem('taxitrio_user');
  return raw ? JSON.parse(raw) : null;
};
export const setUser = (u) => localStorage.setItem('taxitrio_user', JSON.stringify(u));
export const removeUser = () => localStorage.removeItem('taxitrio_user');

export const logout = () => { 
  removeToken(); 
  removeUser(); 
  fetch('/api/auth/logout', { method: 'POST' }).catch((err) => {
    console.error('Failed to log out session on server:', err);
  });
};
