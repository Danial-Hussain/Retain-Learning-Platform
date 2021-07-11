-- DROP TABLE info
-- DROP TABLE episodes

CREATE TABLE IF NOT EXISTS info (
    info_id serial PRIMARY KEY,
    info_date DATE NOT NULL DEFAULT CURRENT_DATE,
    info_topic VARCHAR(100) NOT NULL, 
    info_medium VARCHAR(100) NOT NULL DEFAULT 'internet',
    info_source VARCHAR(255) NOT NULL,
    info_fact VARCHAR(500) NOT NULL,
    info_confidence_level SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS episodes (
    episode_id serial PRIMARY KEY,
    episode_title VARCHAR(255) NOT NULL,
    episode_publisher VARCHAR(255) NOT NULL,
    episode_category VARCHAR(100) NOT NULL,
    episode_url VARCHAR(255) NOT NULL,
    episode_description VARCHAR(1000) NOT NULL,
    episode_duration BIGINT NOT NULL,
    episode_rating SMALLINT NOT NULL,
    episode_watch_date DATE NOT NULL DEFAULT CURRENT_DATE
);