import "./App.css";
import Todo from "./components/Todo";
import Form from "./components/Form";
import Filtering from "./components/Filtering";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Search from "./components/Search";


function App() {
  const [todos, setTodos] = useState(()=>{
    const storedTodos = localStorage.getItem("todos");
    if(storedTodos){
      return JSON.parse(storedTodos);
    }
    return [];
  })
  const [filter,setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    localStorage.setItem("todos",JSON.stringify(todos));
  },[todos]);


  function addTodo(name,priority){
    const newTodo = {
      id: nanoid(),
      name: name,
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString()
    }
    setTodos([...todos, newTodo])
  }

  function deleteTodo(id){
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  }

  function toggleTaskCompleted(id){
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, completed: !todo.completed};
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  function editTodo(id, newName){
    const updatedTodos = todos.map(todo => {
      if(todo.id === id){
        return {...todo, name: newName};
      }
      return todo;
    });
    setTodos(updatedTodos);
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
      createdAt = {todo.createdAt}
    />
  ));

  return (
    <div className = "todoapp">
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
  );
}

export default App;