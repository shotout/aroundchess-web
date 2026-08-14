import { openDB } from "idb";

export const DB_NAME = "ChessDB";
export const STORE_NAME = "moves";

const generateSessionId = () => {
  if (typeof window === 'undefined') return '';
  
  const tabId = window.sessionStorage.getItem('chess-tab-id');
  if (!tabId) {
    const newTabId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    window.sessionStorage.setItem('chess-tab-id', newTabId);
    return newTabId;
  }
  return tabId;
};

export const getSessionStoreName = () => `${STORE_NAME}-${generateSessionId()}`;

async function initializeDB() {
  const storeName = getSessionStoreName();
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
}

export const getDB = async () => {
  const db = await initializeDB();
  return db;
};
