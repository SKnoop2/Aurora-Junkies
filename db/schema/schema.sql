DROP TABLE IF EXISTS photographers CASCADE;
DROP TABLE IF EXISTS endorsements CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS meetups CASCADE;
DROP TABLE IF EXISTS auroras CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS location_ratings CASCADE;


CREATE TABLE photographers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  albums_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
  equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
  endorsements_id INTEGER REFERENCES endorsements(id) ON DELETE CASCADE
);


CREATE TABLE endorsements (
  id SERIAL PRIMARY KEY NOT NULL,
  text VARCHAR(255) NOT NULL,
  photographer_id INTEGER REFERENCES photographers(id)
)

CREATE TABLE albums (
  id SERIAL PRIMARY KEY NOT NULL,
  photos VARCHAR(255) NOT NULL,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE
)

CREATE TABLE meetups (
  id SERIAL PRIMARY KEY NOT NULL,
  location VARCHAR(255) NOT NULL,
  aurora_id INTEGER REFERENCES auroras(id) ON DELETE CASCADE,
  location_rating INTEGER REFERENCES location_ratings(id) ON DELETE CASCADE,
  attendees INTEGER REFERENCES photgraphers(id) ON DELETE CASCADE
)

CREATE TABLE equipment (
  id SERIAL PRIMARY KEY NOT NULL,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE,
  camera_body VARCHAR(255),
  lens1 VARCHAR(255),
  lens2 VARCHAR(255),
  remote_shutter VARCHAR(255)
);

CREATE TABLE location_ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  location VARCHAR(255),
  rating VARCHAR(255)
)

CREATE TABLE auroras (
  id SERIAL PRIMARY KEY NOT NULL,
  forcast VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  strength VARCHAR(255) NOT NULL
);