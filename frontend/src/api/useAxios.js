import { useState, useEffect } from "react";
import axios from "axios";

const useAxios = (axiosParams) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await axios.request(axiosParams);
      setResponse(result.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [axiosParams.url]); // Re-fetch data if URL changes

  return { response, error, loading };
};

export default useAxios;
