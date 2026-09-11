CREATE TABLE users (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username varchar(50) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    priority varchar(20) NOT NULL DEFAULT 'medium',
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    
    CONSTRAINT fk_customer
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);