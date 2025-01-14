DROP TABLE IF EXISTS photographers CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS meetups CASCADE;
DROP TABLE IF EXISTS auroras CASCADE;
DROP TABLE IF EXISTS meetup_photographers CASCADE;
DROP TABLE IF EXISTS auroras_locations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE photographers (
  id SERIAL PRIMARY KEY NOT NULL,
  uuid VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL, 
  email VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  bio TEXT NOT NULL,
  profile_pic VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  photo1_url VARCHAR(255) NOT NULL,
  photo2_url VARCHAR(255) NOT NULL,
  photo3_url VARCHAR(255) NOT NULL,
  photo1_url_details VARCHAR(255) NOT NULL,
  photo2_url_details VARCHAR(255) NOT NULL,
  photo3_url_details VARCHAR(255) NOT NULL
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  latitude VARCHAR(255) NOT NULL,
  longitude VARCHAR(255) NOT NULL,
  photo_url TEXT,
  photo_credit VARCHAR(255)
);

CREATE TABLE meetups (
  id SERIAL PRIMARY KEY NOT NULL,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL
);

CREATE TABLE auroras (
  id SERIAL PRIMARY KEY NOT NULL,
  forecast VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  strength INTEGER NOT NULL
);

CREATE TABLE auroras_locations (
  id SERIAL PRIMARY KEY NOT NULL,
  aurora_id INTEGER REFERENCES auroras(id) ON DELETE CASCADE,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE
);

CREATE TABLE meetup_photographers (
  id SERIAL PRIMARY KEY NOT NULL,
  meetup_id INTEGER REFERENCES meetups(id) ON DELETE CASCADE,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE,
  meetup_id INTEGER REFERENCES meetups(id) ON DELETE CASCADE,
  message VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL
);