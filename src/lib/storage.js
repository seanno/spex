const SITE_KEY = 'spex_site';
const SESSION_KEY = 'spex_session';

export function getSite() {
  try {
    return JSON.parse(sessionStorage.getItem(SITE_KEY));
  } catch {
    return null;
  }
}

export function setSite(site) {
  sessionStorage.setItem(SITE_KEY, JSON.stringify(site));
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAll() {
  sessionStorage.removeItem(SITE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  // Also clear fhirclient's internal state
  Object.keys(sessionStorage)
    .filter((k) => k.startsWith('SMART'))
    .forEach((k) => sessionStorage.removeItem(k));
}
