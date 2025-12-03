import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  items: Notification[];
  add: (message: string, kind?: Notification['kind'], autoRemove?: boolean) => string;
  remove: (id: string) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let notificationId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notification[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const add = useCallback((message: string, kind: Notification['kind'] = 'info', autoRemove: boolean = true) => {
    const id = `notification-${++notificationId}`;
    setItems((prev) => [...prev, { id, message, kind }]);
    
    // get rid of the notification after 3 seconds if autoRemove is true
    if (autoRemove) {
      setTimeout(() => {
        remove(id);
      }, 3000);
    }
    
    return id;
  }, [remove]);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

