import {useState} from "react";

function Form({addTodo}) {
    const [input, setInput] = useState("");
    const [priority,setPriority] = useState("medium");

    function handleSubmit(e){
        e.preventDefault();
        addTodo(input,priority);
        setInput("");
    }
    return(
        <div className="todo-form">
            <h1>Welcome to the To-Do App</h1>
            <form onSubmit = {handleSubmit}>
                <input type = "text" placeholder = "Enter your task" value = {input} onChange = {(e) => setInput(e.target.value)}/>
                <label>Priority</label>
                <select value = {priority} onChange={(e)=>setPriority(e.target.value)}>
                    <option value= "low">Low</option>
                    <option value= "medium">Medium</option>
                    <option value= "high">High</option>
                </select>
                <button  className = "btn" type = "submit"> Add Task</button>
            </form>
      </div>
    )
}

export default Form;