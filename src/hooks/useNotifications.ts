import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info' | 'warning';
}

let notificationId = 0;

export function useNotifications() {
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

  return { items, add, remove, clear };
}

