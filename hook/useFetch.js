import { useState, useEffect } from "react";
import axios from "axios";
import Bottleneck from 'bottleneck';
import {RAPID_API_KEY} from '@env'

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limiter = new Bottleneck({
    maxConcurrent:1,
    minTime:1000
  })


  const options = {
    method: "GET",
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
    params: { ...query },
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
     
      const response = await limiter.schedule(()=> axios.request(options));
      
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
     fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
