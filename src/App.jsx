import "./App.css";
import Todo from "./components/Todo";
import Form from "./components/Form";
import SignUp from "./components/SignUp";
import Filtering from "./components/Filtering";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Logout from "./components/Logout";
import apiFetch from "./components/apiFetch";
import Search from "./components/Search";

const backend = import.meta.env.VITE_API_URL;

function App() {
  const [error,setError] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter,setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading,setLoading] = useState(false);  
  const [isLoggedIn,setIsLoggedIn] = useState(localStorage.getItem("token")!== null);
  const [showSignUp,setShowSignUp] = useState(false);
  
  
    function handleLogout(){
      localStorage.removeItem("token");
      setTodos([]);
      setError("");
      setIsLoggedIn(false);
    }

  useEffect(() => {
    if(isLoggedIn)
      {const fetchTodos = async()=>{
        setLoading(true);
        setError("");
      try{
        const url = `${backend}/todos`;
        const options = {};
        // await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await apiFetch(url,options);
        const data = await response.json();
        console.log("data from backend:", data);
        setTodos(data);
      }catch(error){
        if(error.status === 401){
          handleLogout();
        }else
          setError(error.message);
        }
      finally{
        setLoading(false);
      }  
  }
      fetchTodos();

}
  },[isLoggedIn]);


  async function addTodo(name,priority){
    try{
      const response = await apiFetch(
      
        `${backend}/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name,priority})
        },
      );

      const newTodo = await response.json();
      setTodos(prevTodos=>[...prevTodos,newTodo]);
    }catch(error){
        if(error.status === 401){
          handleLogout();
        }else
            setError(error.message);
    }
  }

  async function deleteTodo(id){
    try{    
      const response = await apiFetch(
        `${backend}/todos/${id}`,

        {
          method : "DELETE",
        },
      );

      setTodos(prevTodos=>prevTodos.filter(todo=>todo.id!== id));
    }catch(error){
        if(error.status === 401){
          handleLogout();
        }else
          console.error("Error in deleting",error);
    }
  }

  async function toggleTaskCompleted(id){
    try{
      const todo = todos.find(todo=>todo.id === id);
      const response = await apiFetch(
        `${backend}/todos/${id}`,
        {
          method: "PATCH",
          headers: {
              "Content-Type" : "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed
          })
        },
      );
      
      const updatedTodo = await response.json();

      setTodos(prevTodos =>
        prevTodos.map(todo=>
          todo.id === id?updatedTodo : todo
        )
      );
    }catch(error){
        if(error.status === 401){
          handleLogout();
        }else
          console.error("Error in toggling",error);
    }
  }

  async function editTodo(id, newName){
    try{
      const response = await apiFetch(
        `${backend}/todos/${id}`,
        {
          method: "PATCH",
           headers: {
              "Content-Type" : "application/json",
          
          },
          body: JSON.stringify({
            name: newName
          })
        }
      );




    const updatedTodos = await response.json();
    setTodos(prevTodos=>
      prevTodos.map(todo=>
        todo.id === id?updatedTodos:todo
      )
    );
    }catch(error){
        if(error.status === 401){
          handleLogout();
        }else
          console.log("Error in editing name",error);
    }
  }

  const searchTodos = todos.filter(todo=>{
    if(searchTerm.trim() === "")
        return todo;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return todo.name.toLowerCase().includes(lowerSearchTerm)
  })

  const filteredTodos = searchTodos.filter(todo=>{
    if(filter=="complete"){
      return todo.completed;
    }
    if(filter == "incomplete"){
      return !todo.completed;
    }
    return true;
  })


  const taskList = filteredTodos.map(todo => (
    <Todo 
      id={todo.id}
      name={todo.name}
      completed={todo.completed}
      key={todo.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTodo={deleteTodo}
      editTodo={editTodo}
      priority={todo.priority}
      created_at = {todo.created_at}
    />
  ));
  const loginTemplate = (<>
  <Login onLogin = {setIsLoggedIn} setShowSignUp = {setShowSignUp}/> 
  </>
)
  const TodoTemplate = (<>
    {loading?<p>Loading tasks...</p>:error?<p>{error}</p>:<div className = "todoapp">
      <Logout handleLogout={handleLogout} />
      <Form addTodo = {addTodo}/>
      <Filtering setFilter = {setFilter}/>
      <div className = "todo-list">
        <h2> Task List</h2>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        
        <ul role = "list"
        className  = "todo-list-items">
          {(todos.length===0)? <li>No Tasks </li>: taskList}
        </ul>
      </div>
    </div>}
    </>
  )

  const SignUpTemplate = (
    <SignUp setShowSignUp = {setShowSignUp}/>
  )
  return (<> {isLoggedIn? TodoTemplate : showSignUp? SignUpTemplate: loginTemplate}</>);
}

export default App;