import {useState} from "react";

function Todo(props){
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(props.name);


    function handleChange(e){
        setNewName(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        props.editTodo(props.id, newName);
        setIsEditing(false);
    }
    const EditTemplate = (
        <form className = "todo-edit-form" onSubmit = {handleSubmit}>
            <input className = "todo-edit-input"id = {props.id} type = "text" value = {newName} onChange = {handleChange}/>
            <button className = "btn btn-cancel" onClick = {()=> {
                setNewName(props.name);
                setIsEditing(false);}}> Cancel </button>
            <button className = "btn btn-edit" type = "submit"> Save </button>
        </form>
    )

    const dateView = new Date(props.created_at).toLocaleTimeString();
    
    const viewTemplate = (
        <li className = "todo-item">
            <div className = "checkbox">
                <input id = {props.id} type = "checkbox" checked = {props.completed} onChange = {() => props.toggleTaskCompleted(props.id)}/>
                <label className = "todo-label" htmlFor = {props.id}> {props.name} </label>
                <span className = {`priority ${props.priority}`}>
                    {props.priority}
                </span>
                <span> Created: {dateView}</span>
            </div>
            <div className = "btn-group">
                <button className = "btn btn-edit" onClick = {()=> setIsEditing(true)}> Edit </button>
                <button className = "btn btn-delete" onClick = {()=> props.deleteTodo(props.id)} > Delete </button>
            </div>
        </li>
    )

    return <li>{isEditing ? EditTemplate : viewTemplate}</li>
}

export default Todo;