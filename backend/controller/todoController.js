import pool from "../db.js";

const getTodo = async (req,res)=>{
    try{
    const result = await pool.query("select * from todos");
    res.json(result.rows);
    }catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

const getById =  async (req,res)=>{
    try{
        const id = Number(req.params.id);
        if(!Number.isInteger(id)|| id <=0){
            return res.status(400).json({
            error: "Invalid todo ID"        
        });
        }
        const text = 'SELECT * FROM todos where id = $1'
        const value = [id];
        const result = await pool.query(text,value);
    
        if (result.rows.length === 0) {
        return res.status(404).json({
            error: "Todo not found",
        });
        }
        return res.status(200).json(result.rows[0]);
    } catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}


const createTodo = async (req,res)=>{
    try{
    const name = req.body.name;
    const priority = req.body.priority;
    if(!name){
        return res.status(400).json({
            error: "name is required"
        })
    }

    const text = 'INSERT INTO todos(name,priority) VALUES ($1, $2) RETURNING *';
    const values = [name , priority];
    const result = await pool.query(text,values);

    return res.status(201).json(result.rows[0]);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

const deleteById =  async (req,res)=>{
    try{
    const id = Number(req.params.id);
    if(!Number.isInteger(id)|| id <=0){
        return res.status(400).json({
        error: "Invalid todo ID"        
    });
    }
    const text = 'DELETE FROM todos WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await pool.query(text,values);
      if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Todo not found",
    });
    }
    return res.status(200).json(result.rows[0]);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

const updatebyId = async (req, res) => {
    try{
  const id = Number(req.params.id);

  if(!Number.isInteger(id)|| id <=0){
        return res.status(400).json({
        error: "Invalid todo ID"        
    });
  }
  const updates = req.body;
  const allowedFields = ["name", "completed","priority"];
  const setClauses = [];
  const values = [];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      setClauses.push(`${field} = $${values.length + 1}`);
      values.push(updates[field]);
    }
  }

  if (setClauses.length === 0) {
    return res.status(400).json({
      error: "No valid fields to update",
    });
  }

  values.push(id);

  const text = `
    UPDATE todos
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(text, values);

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  return res.status(200).json(result.rows[0]);
}
catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

export { getTodo,getById ,createTodo , deleteById , updatebyId};