import { useState, useEffect } from "react";

const useFetch = (url) => {

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        async function fetchData(){
            try{
               const response = await fetch(url);
                if(!response.ok){
                    throw "unable to fetch";
                }
                const data = await response.json();
                setData(data);

            }catch(error){
                setError(error);

            }finally{
                setLoading(false);
            }

        }
        fetchData();
    }, [url])


    return {data, loading, error};
    
}

export default useFetch;