async function apiFetch(url,options){
        const token = localStorage.getItem("token");
        // console.log("TOKEN BEING SENT:", token);
        const response = await fetch(
        url,
        {
            ...options,
            headers:{
                ...options.headers,
                "Authorization" : `Bearer ${token}`
            }
        }
    );
    
        if (!response.ok) {
            const data = await response.json();
            const error = new Error(data.error);
            error.status = response.status;
            throw error;
        }
        return response
}

export default apiFetch;