-- PostgreSQL Schema for Evangadi Forum
-- Compatible with Aiven PostgreSQL

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reset_token VARCHAR(255),
  reset_expires BIGINT,
  google_id VARCHAR(255)
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS questions (
  questionid SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0,
  question_uuid VARCHAR(36) NOT NULL UNIQUE
);

-- Create Answers table
CREATE TABLE IF NOT EXISTS answers (
  answerid SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  questionid INTEGER NOT NULL REFERENCES questions(questionid) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comment_count INTEGER DEFAULT 0
);

-- Create Answer Likes table
CREATE TABLE IF NOT EXISTS answer_likes (
  likeid SERIAL PRIMARY KEY,
  answerid INTEGER NOT NULL REFERENCES answers(answerid) ON DELETE CASCADE,
  userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(answerid, userid)
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS comments (
  commentid SERIAL PRIMARY KEY,
  answerid INTEGER NOT NULL REFERENCES answers(answerid) ON DELETE CASCADE,
  userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_userid ON questions(userid);
CREATE INDEX IF NOT EXISTS idx_questions_createdat ON questions(createdAt);
CREATE INDEX IF NOT EXISTS idx_answers_questionid ON answers(questionid);
CREATE INDEX IF NOT EXISTS idx_answers_userid ON answers(userid);
CREATE INDEX IF NOT EXISTS idx_answer_likes_answerid ON answer_likes(answerid);
CREATE INDEX IF NOT EXISTS idx_answer_likes_userid ON answer_likes(userid);
CREATE INDEX IF NOT EXISTS idx_comments_answerid ON comments(answerid);
CREATE INDEX IF NOT EXISTS idx_comments_userid ON comments(userid);

