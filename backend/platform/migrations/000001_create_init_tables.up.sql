CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET TIMEZONE="Europe/Moscow";

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  phone varchar (16) NOT NULL,
  password_hash varchar (255) NOT NULL,
  name varchar (80) NOT NULL,
  surname varchar (80) NOT NULL,
  date_of_birth TIMESTAMP NOT NULL,
  gender varchar (10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW (),
  updated_at TIMESTAMP NULL,
  user_role varchar (10) NOT NULL,
  deleted BOOLEAN NULL
);
