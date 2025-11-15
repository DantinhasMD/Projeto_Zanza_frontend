import { useState, useEffect, useCallback } from 'react';
import type { ApiError } from '../types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  immediate?: boolean;
}

interface UseApiReturn<T, P extends any[]> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for API calls with loading and error states
 */
export function useApi<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);
        setData(result);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);

        if (options.onError) {
          options.onError(apiError);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate) {
      (execute as (...args: unknown[]) => Promise<T | null>)();
    }
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Custom hook for paginated API calls
 */
interface UsePaginatedApiOptions<T> extends UseApiOptions<T> {
  initialPage?: number;
  pageSize?: number;
}

interface UsePaginatedApiReturn<T> extends UseApiReturn<T, [number, number]> {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function usePaginatedApi<T>(
  apiFunction: (page: number, size: number) => Promise<T>,
  options: UsePaginatedApiOptions<T> = {}
): UsePaginatedApiReturn<T> {
  const [currentPage, setCurrentPage] = useState(options.initialPage || 0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = options.pageSize || 20;

  const { data, loading, error, execute, reset } = useApi(apiFunction, {
    ...options,
    onSuccess: (result: any) => {
      if (result.totalPages !== undefined) {
        setTotalPages(result.totalPages);
      }
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    },
  });

  const loadPage = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      await execute(page, pageSize);
    },
    [execute, pageSize]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, totalPages, loadPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      loadPage(currentPage - 1);
    }
  }, [currentPage, loadPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        loadPage(page);
      }
    },
    [totalPages, loadPage]
  );

  useEffect(() => {
    if (options.immediate) {
      loadPage(currentPage);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
}

/**
 * Custom hook for optimistic updates
 */
interface UseOptimisticUpdateOptions<T> {
  updateFunction: (data: T) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError, previousData: T) => void;
}

export function useOptimisticUpdate<T>(
  initialData: T,
  options: UseOptimisticUpdateOptions<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const update = async (newData: T) => {
    const previousData = data;
    
    try {
      // Optimistically update UI
      setData(newData);
      setLoading(true);
      setError(null);

      // Call API
      const result = await options.updateFunction(newData);
      
      // Update with server response
      setData(result);

      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      // Rollback on error
      setData(previousData);
      const apiError = err as ApiError;
      setError(apiError);

      if (options.onError) {
        options.onError(apiError, previousData);
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, update };
}
