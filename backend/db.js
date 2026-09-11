import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const port = process.env.PGPORT|| 5432;
const dbhost = process.env.PGHOST;
const dbuser = process.env.PGUSER;
const dbpassword = process.env.PGPASSWORD;
const db = process.env.PGDATABASE;
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
    ? new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    })
    : new Pool({
        user: dbuser,
        password: dbpassword,
        host: dbhost,
        port: port,
        database: db
    });

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err);
});

export default pool;