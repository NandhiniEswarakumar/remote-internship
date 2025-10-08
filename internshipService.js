// A small API-like service for internships. Currently backed by localStorage.
// Replace internals with real API/Firestore calls as needed.

const LS_KEY = 'internships';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function writeAll(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export const internshipService = {
  getAll() {
    return Promise.resolve(readAll());
  },
  getById(id) {
    const all = readAll();
    return Promise.resolve(all.find(i => i.id === id));
  },
  add(item) {
    const all = readAll();
    const toAdd = { ...item, id: item.id || Date.now() };
    all.unshift(toAdd);
    writeAll(all);
    return Promise.resolve(toAdd);
  },
  update(id, patch) {
    const all = readAll();
    const idx = all.findIndex(i => i.id === id);
    if (idx === -1) return Promise.reject(new Error('Not found'));
    all[idx] = { ...all[idx], ...patch };
    writeAll(all);
    return Promise.resolve(all[idx]);
  },
  remove(id) {
    const all = readAll();
    const filtered = all.filter(i => i.id !== id);
    writeAll(filtered);
    return Promise.resolve();
  }
};
