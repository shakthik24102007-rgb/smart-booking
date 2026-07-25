import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Store } from '../types';
import { INITIAL_STORES } from '../lib/initialData';

interface AuthContextType {
  user: User | null;
  currentStore: Store | null;
  stores: Store[];
  loginStudent: (name: string, email?: string) => void;
  loginWorker: (storeIdOrCode: string, pin: string) => { success: boolean; error?: string };
  logout: () => void;
  setWorkerStore: (storeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'campus_food_user';
const STORE_STORAGE_KEY = 'campus_food_worker_store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentStore, setCurrentStore] = useState<Store | null>(() => {
    try {
      const savedStoreId = localStorage.getItem(STORE_STORAGE_KEY);
      if (savedStoreId) {
        return INITIAL_STORES.find(s => s.id === savedStoreId || s.code === savedStoreId) || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (currentStore) {
      localStorage.setItem(STORE_STORAGE_KEY, currentStore.id);
    } else {
      localStorage.removeItem(STORE_STORAGE_KEY);
    }
  }, [currentStore]);

  const loginStudent = (name: string, email?: string) => {
    const studentUser: User = {
      id: 'student-' + Date.now(),
      role: 'student',
      name: name.trim() || 'Campus Student',
      email: email || 'student@campus.edu',
    };
    setUser(studentUser);
    setCurrentStore(null);
  };

  const loginWorker = (storeIdOrCode: string, pin: string): { success: boolean; error?: string } => {
    const foundStore = INITIAL_STORES.find(
      s => s.id === storeIdOrCode || s.code.toLowerCase() === storeIdOrCode.toLowerCase() || s.name.toLowerCase() === storeIdOrCode.toLowerCase()
    );

    if (!foundStore) {
      return { success: false, error: 'Store not found. Please select a valid store.' };
    }

    if (foundStore.pin !== pin.trim()) {
      return { success: false, error: `Invalid PIN for ${foundStore.name}. Check your 4-digit store code PIN.` };
    }

    const workerUser: User = {
      id: 'worker-' + foundStore.code.toLowerCase(),
      role: 'worker',
      name: `${foundStore.name} Staff`,
      store_id: foundStore.id,
      pin: foundStore.pin,
    };

    setUser(workerUser);
    setCurrentStore(foundStore);
    return { success: true };
  };

  const setWorkerStore = (storeId: string) => {
    const foundStore = INITIAL_STORES.find(s => s.id === storeId || s.code === storeId);
    if (foundStore) {
      setCurrentStore(foundStore);
      if (user && user.role === 'worker') {
        setUser({
          ...user,
          store_id: foundStore.id,
          name: `${foundStore.name} Staff`,
        });
      }
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentStore(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(STORE_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentStore,
        stores: INITIAL_STORES,
        loginStudent,
        loginWorker,
        logout,
        setWorkerStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
