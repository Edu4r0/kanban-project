/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

export function useOptimisticUpdate<T>(initialState: T[]) {
  const [items, setItems] = useState<T[]>(initialState);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        (item as any)._id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const rollbackItem = useCallback((id: string, originalItem: T) => {
    setItems((prevItems) =>
      prevItems.map((item) => ((item as any)._id === id ? originalItem : item))
    );
  }, []);

  return { items, setItems, updateItem, rollbackItem };
}
