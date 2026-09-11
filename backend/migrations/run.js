import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id integer PRIMARY KEY
        );
    `);

    const files = fs.readdirSync(__dirname)
        .filter(file => file.endsWith(".sql"))
        .sort();

    for (const file of files) {
        const id = Number(file.split("_")[0]);

        const result = await pool.query(
            "SELECT id FROM schema_migrations WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            const sql = fs.readFileSync(
                path.join(__dirname, file),
                "utf8"
            );

            await pool.query(sql);

            await pool.query(
                "INSERT INTO schema_migrations (id) VALUES ($1)",
                [id]
            );

            console.log(`Migration ${file} completed`);
        } else {
            console.log(`Migration ${file} already completed`);
        }
    }

} catch (error) {
    console.error("Migration failed:", error);
} finally {
    await pool.end();
}