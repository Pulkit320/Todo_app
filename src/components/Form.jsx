import {useState} from "react";

function Form({addTodo}) {
    const [input, setInput] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        addTodo(input);
        setInput("");
    }
    return(
        <div className="todo-form">
            <h1>Welcome to the To-Do App</h1>
            <form onSubmit = {handleSubmit}>
                <input type = "text" placeholder = "Enter your task" value = {input} onChange = {(e) => setInput(e.target.value)}/>
                <button  className = "btn" type = "submit"> Add Task</button>
            </form>
      </div>
    )
}

export default Form;