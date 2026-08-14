import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: any;
  immediate?: boolean;
}

function useFetch<T = any>(url: string, options: UseFetchOptions = { immediate: true }) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [shouldFetch, setShouldFetch] = useState<boolean>(!!options.immediate);
  const [fetchCount, setFetchCount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { method = 'GET', headers = {}, body } = options;
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        credentials: 'include',
      };
      console.log(url, fetchOptions)

      if (method !== 'GET' && body) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setState({
        data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log(error)
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [url, options]);

  const refetch = () => {
    setShouldFetch(true);
    setFetchCount(count => count + 1);
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchCount, fetchData]);

  return {
    ...state,
    refetch,
  };
}

export default useFetch;