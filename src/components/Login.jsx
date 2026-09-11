import { useState } from "react";

function Login({onLogin, setShowSignUp}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState("");
    
    async function checkLogin(email,password){
        try{
            const response = await fetch(
                "http://localhost:3000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({email,password})
                }
            )

            if(!response.ok){
                const data = await response.json();
                setError(data.error);
                return;
            }
            const data = await response.json();
            localStorage.setItem("token",data.token);
            onLogin(true);


        }catch(error){
            console.error("Error in login",error);
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        checkLogin(email,password)
        
    }
    return(
        <div className = "login-page">
            <form id = "login-form" onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <input className = "email" type = "text" value = {email} onChange={(e)=>setEmail(e.target.value)} />
                <input className = "password-user" type = "password" value = {password} onChange={(e)=>setPassword(e.target.value)}/>
                <button type = "submit" className = "btn-login">Login</button>
                <button type = "button" className = "btn-signup" onClick={()=>setShowSignUp(true)}> SignUp </button>
            </form>
        </div>
    )
}

export default Login;