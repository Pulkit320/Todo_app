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



function App() {
  const [todos, setTodos] = useState([]);
  const [filter,setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(localStorage.getItem("token")!== null);
  const [showSignUp,setShowSignUp] = useState(false);
  


  useEffect(() => {
    if(isLoggedIn)
      {const fetchTodos = async()=>{
      try{
        const url = "http://localhost:3000/todos";
        const options = {};

        const response = await apiFetch(url,options,{setIsLoggedIn});
        const data = await response.json();
        console.log("data from backend:", data);
        setTodos(data);
      }catch{
        console.error("Error fetching todo")

    }  
  }
      fetchTodos();

}
  },[isLoggedIn]);


  function handleLogout(){
    localStorage.removeItem("token");
    setTodos([]);
    setIsLoggedIn(false);
  }

  async function addTodo(name,priority){
    try{
      const response = await apiFetch(
      
        "http://localhost:3000/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name,priority})
        },
        {setIsLoggedIn}
      );

      const newTodo = await response.json();
      setTodos(prevTodos=>[...prevTodos,newTodo]);
    }catch(error){
      console.error("Error adding todo",error);
    }
  }

  async function deleteTodo(id){
    try{    
      const response = await apiFetch(
        `http://localhost:3000/todos/${id}`,

        {
          method : "DELETE",
        },
        {setIsLoggedIn}
      );

      setTodos(prevTodos=>prevTodos.filter(todo=>todo.id!== id));
    }catch(error){
      console.error("Error in deleting",error);
    }
  }

  async function toggleTaskCompleted(id){
    try{
      const todo = todos.find(todo=>todo.id === id);
      const response = await apiFetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "PATCH",
          headers: {
              "Content-Type" : "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed
          })
        },
        {setIsLoggedIn}
      );
      
      const updatedTodo = await response.json();

      setTodos(prevTodos =>
        prevTodos.map(todo=>
          todo.id === id?updatedTodo : todo
        )
      );
    }catch(error){
      console.error("Error in toggling",error);
    }
  }

  async function editTodo(id, newName){
    try{
      const response = await apiFetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "PATCH",
           headers: {
              "Content-Type" : "application/json",
          
          },
          body: JSON.stringify({
            name: newName
          })
        },{setIsLoggedIn}
      );




    const updatedTodos = await response.json();
    setTodos(prevTodos=>
      prevTodos.map(todo=>
        todo.id === id?updatedTodos:todo
      )
    );
    }catch(error){
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
  const loginTemplate = (
    <Login onLogin = {setIsLoggedIn} setShowSignUp = {setShowSignUp}/>
  )
  const TodoTemplate = (
    <div className = "todoapp">
      <Logout handleLogout={handleLogout} />
      <Form addTodo = {addTodo}/>
      <Filtering setFilter = {setFilter}/>
      <div className = "todo-list">
        <h2> Task List</h2>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        <ul role = "list"
        className  = "todo-list-items">
          {taskList}
        </ul>
      </div>
    </div>
  )

  const SignUpTemplate = (
    <SignUp setShowSignUp = {setShowSignUp}/>
  )
  return (<> {isLoggedIn? TodoTemplate : showSignUp? SignUpTemplate: loginTemplate}</>);
}

export default App;