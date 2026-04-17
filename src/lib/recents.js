// tracks which books the user has opened in reader mode
// stored in localStorage so it sticks around across refreshes + sign-outs
// keyed by user id so each account has their own separate list

const MAX_RECENTS = 3;

function keyFor(userId) {
  return `vsd:recents:${userId}`;
}

// grab the recent book ids for this user (most recent first)
export function getRecents(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// bump a book to the top of the list (or add it if its not there yet)
export function addRecent(userId, bookId) {
  if (!userId || !bookId) return;
  try {
    const current = getRecents(userId).filter((id) => id !== bookId);
    const next = [bookId, ...current].slice(0, MAX_RECENTS);
    localStorage.setItem(keyFor(userId), JSON.stringify(next));
  } catch {
    // localStorage full or blocked, just bail
  }
}
