export const TOKEN_KEY = 'token';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function saveToken(token: string) {
  if (isBrowser()) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (isBrowser()) {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
  }
  return null;
}

export function removeToken() {
  if (isBrowser()) {
    localStorage.removeItem(TOKEN_KEY);
  }
}