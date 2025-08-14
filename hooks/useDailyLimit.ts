
import { useState, useEffect, useCallback } from 'react';
import { DailyLimit } from '../types';
import { DAILY_GENERATION_LIMIT } from '../constants';

const LOCAL_STORAGE_KEY = 'buildWebsiteWithTamimLimit';

export const useDailyLimit = () => {
  const [limit, setLimit] = useState<DailyLimit>({
    count: DAILY_GENERATION_LIMIT,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData: DailyLimit = JSON.parse(storedData);
        const today = new Date().toISOString().split('T')[0];
        if (parsedData.date === today) {
          setLimit(parsedData);
        } else {
          // Reset for a new day
          const newLimit = { count: DAILY_GENERATION_LIMIT, date: today };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLimit));
          setLimit(newLimit);
        }
      } else {
        // Initialize for the first time
        const newLimit = { count: DAILY_GENERATION_LIMIT, date: new Date().toISOString().split('T')[0] };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLimit));
        setLimit(newLimit);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback for environments where localStorage is disabled
      setLimit({ count: DAILY_GENERATION_LIMIT, date: new Date().toISOString().split('T')[0] });
    }
  }, []);

  const decrementLimit = useCallback(() => {
    setLimit((prevLimit) => {
      const newCount = Math.max(0, prevLimit.count - 1);
      const newLimit = { ...prevLimit, count: newCount };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLimit));
      } catch (error) {
        console.error("Failed to update localStorage:", error);
      }
      return newLimit;
    });
  }, []);
  
  const hasGenerationsLeft = limit.count > 0;

  return { remainingGenerations: limit.count, decrementLimit, hasGenerationsLeft };
};