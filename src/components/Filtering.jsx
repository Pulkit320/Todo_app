import {useState} from 'react';

function Filtering({setFilter}) {
    //const [filter, setFilter] = useState('all');
    return(
        <div className="filtering">
            <button  onClick={()=>setFilter("all")}className = "btn btn-all"> Show all </button>
            <button onClick={()=> setFilter("complete")} className = "btn btn-completed"> Show completed </button>
            <button onClick = {()  => setFilter("incomplete")}className = "btn btn-incompleted"> Show incomplete </button>
        </div>
    )
};

export default Filtering;