async function apiFetch(url,options,{setIsLoggedIn}){
        const token = localStorage.getItem("token");
        console.log("TOKEN BEING SENT:", token);
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
        if(response.status === 401){
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
        throw new Error("Failed to fetch todos"); 
    }
        return response
}

export default apiFetch;