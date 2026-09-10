import {useState} from "react";

function SignUp({setShowSignUp}){
    const [username, setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function newUser(username,email,password){
        try{
            const response = await fetch(
                "http://localhost:3000/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({username,email,password})
                }
            )

            if(!response.ok){
                throw new Error("Failed to signUp");
            }
            const data = await response.json();
            setShowSignUp(false);
        }catch(error){
            console.error("Error in signUp",error);
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        newUser(username,email,password)
        
    }
    return(
        <div className = "login-page">
            <form id = "login-form" onSubmit={handleSubmit}>
                <input className = "username" type = "text" value = {username} onChange={(e)=>setUsername(e.target.value)}/>
                <input className = "email" type = "text"  value = {email} onChange={(e)=>setEmail(e.target.value)}/>
                <input className = "password-user" type = "password" value = {password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className = "btn-signUp">SignUp</button>
            </form>
        </div>

    )
}

export default SignUp;