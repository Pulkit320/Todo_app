import "./App.css";
import Todo from "./components/Todo";
import Form from "./components/Form";
import Filtering from "./components/Filtering";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Search from "./components/Search";


function App() {
  const [todos, setTodos] = useState([]);
  const [filter,setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchTodos = async()=>{
      // if(isLoggedIn===true){
      const token = localStorage.getItem("token");
      console.log("isLoggedIn:", isLoggedIn);
      if(!token)
          return;
      try{
        const response = await fetch(
          "http://localhost:3000/todos",
          {
            headers:{
              "Authorization" : `Bearer ${token}`
            }
          }
        );

        if(!response.ok){
                throw new Error("Failed to login in");
            }
        const data = await response.json();
        console.log("data from backend:", data);
        setTodos(data);
      }catch{
        console.error("Error fetching todo")

    }
    
  }
    fetchTodos();
  },[]);


  function handleLogout(){
    localStorage.removeItem("token");
    setTodos([]);
    setIsLoggedIn(false);
  }

  async function addTodo(name,priority){
    try{
      const token = localStorage.getItem("token")
      const response = await fetch(
      
        "http://localhost:3000/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
          },
          body: JSON.stringify({name,priority})
        }
      );

      if(!response.ok){
        throw new Error("Failed to add todo");
      }
      const newTodo = await response.json();

      setTodos([...todos, newTodo])
    }catch(error){
      console.error("Error adding todo",error);
    }
  }

  async function deleteTodo(id){
    try{
      const token = localStorage.getItem("token")      
      const response = await fetch(
        `http://localhost:3000/todos/${id}`,

        {
          method : "DELETE",
          headers: {
          "Authorization" : `Bearer ${token}`
          }
        }
      );
      if(!response.ok){
        throw new Error("Failed to delete task");
      }
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    }catch(error){
      console.error("Error in deleting",error);
    }
  }

  async function toggleTaskCompleted(id){
    try{
      const todo = todos.find(todo=>todo.id === id);
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "PATCH",
          headers: {
              "Content-Type" : "application/json",
              "Authorization" : `Bearer ${token}`
          },
          body: JSON.stringify({
            completed: !todo.completed
          })
        }
      );

      if(!response.ok){
        throw new Error("Failed to toggle task");
      }
      
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
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "PATCH",
           headers: {
              "Content-Type" : "application/json",
              "Authorization" : `Bearer ${token}`
          
          },
          body: JSON.stringify({
            name: newName
          })
        }
      );
      if(!response.ok){
        throw new Error("Failed to edit task");
      }


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
    <Login onLogin = {setIsLoggedIn}/>
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
  return (<> {isLoggedIn? TodoTemplate : loginTemplate}</>);
}

export default App;