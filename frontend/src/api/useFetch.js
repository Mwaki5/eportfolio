import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const useFetch = (baseUrl = 'http://localhost:3400/') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const cancelSourceRef = useRef(null); // for request cancellation
  const lastRequestRef = useRef(null);  // for refetch

  const createCancelToken = () => {
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel('Request canceled by user.');
    }
    cancelSourceRef.current = axios.CancelToken.source();
    return cancelSourceRef.current.token;
  };

  const handleRequest = useCallback(async (method, url, body = null, config = {}) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    const token = createCancelToken();

    const fullConfig = {
      method,
      url: baseUrl + url,
      data: body,
      cancelToken: token,
      ...config,
    };

    lastRequestRef.current = { method, url, body, config };

    try {
      const response = await axios(fullConfig);
      setData(response.data);
      return response.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.warn('Request cancelled:', err.message);
      } else {
        setIsError(true);
        setError(err);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Request wrappers
  const get = (url, config = {}) => handleRequest('GET', url, null, config);
  const post = (url, body = {}, config = {}) => handleRequest('POST', url, body, config);
  const put = (url, body = {}, config = {}) => handleRequest('PUT', url, body, config);
  const del = (url, config = {}) => handleRequest('DELETE', url, null, config);

  // Refetch the last successful request
  const refetch = () => {
    if (lastRequestRef.current) {
      const { method, url, body, config } = lastRequestRef.current;
      return handleRequest(method, url, body, config);
    }
    console.warn('No previous request to refetch.');
    return Promise.resolve(null);
  };

  // Cancel the current request
  const cancel = () => {
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel('Request manually cancelled.');
    }
  };

  return {
    data,
    isLoading,
    isError,
    error,
    get,
    post,
    put,
    delete: del,
    refetch,
    cancel,
  };
};

export default useFetch;
