import { Pool } from 'pg';
import 'dotenv/config';

const port = process.env.PGPORT|| 5432;
const dbhost = process.env.PGHOST;
const dbuser = process.env.PGUSER;
const dbpassword = process.env.PGPASSWORD;
const db = process.env.PGDATABASE;


const pool = new Pool({
    user : dbuser,
    password : dbpassword,
    host : dbhost,
    port: port,
    database : db
});


export default pool;