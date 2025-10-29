-- async function createTables() {
--   try {
--     let sql = `
--     -- Users table
--     CREATE TABLE IF NOT EXISTS users (
--       userid INT AUTO_INCREMENT PRIMARY KEY,
--       username VARCHAR(50) NOT NULL,
--       firstname VARCHAR(255) DEFAULT NULL,
--       lastname VARCHAR(255) DEFAULT NULL,
--       email VARCHAR(100) NOT NULL UNIQUE,
--       password VARCHAR(255) DEFAULT NULL,
--       createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--       reset_token VARCHAR(255) DEFAULT NULL,
--       reset_expires BIGINT DEFAULT NULL,
--       google_id VARCHAR(255) DEFAULT NULL,
--       UNIQUE KEY uk_users_username (username)
--     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--     -- Questions table
--     CREATE TABLE IF NOT EXISTS questions (
--       questionid INT AUTO_INCREMENT PRIMARY KEY,
--       userid INT NOT NULL,
--       title VARCHAR(255) NOT NULL,
--       description TEXT NOT NULL,
--       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
--       views INT DEFAULT 0,
--       answer_count INT DEFAULT 0,
--       question_uuid VARCHAR(36) NOT NULL UNIQUE,
--       FOREIGN KEY (userid) REFERENCES users(userid)
--         ON DELETE CASCADE ON UPDATE CASCADE
--     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- CREATE TABLE IF NOT EXISTS comments (
--   commentid INT AUTO_INCREMENT PRIMARY KEY,
--   answerid INT NOT NULL,
--   userid INT NOT NULL,
--   comment TEXT NOT NULL,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE,
--   FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;







--     -- Answers table
--     CREATE TABLE IF NOT EXISTS answers (
--       answerid INT AUTO_INCREMENT PRIMARY KEY,
--       userid INT NOT NULL,
--       questionid INT NOT NULL,
--       answer TEXT NOT NULL,
--       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
--       comment_count INT DEFAULT 0,
--       FOREIGN KEY (userid) REFERENCES users(userid)
--         ON DELETE CASCADE ON UPDATE CASCADE,
--       FOREIGN KEY (questionid) REFERENCES questions(questionid)
--         ON DELETE CASCADE ON UPDATE CASCADE
--     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--     -- Answer Likes table
--     CREATE TABLE IF NOT EXISTS answer_likes (
--       likeid INT AUTO_INCREMENT PRIMARY KEY,
--       answerid INT NOT NULL,
--       userid INT NOT NULL,
--       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
--       FOREIGN KEY (answerid) REFERENCES answers(answerid)
--         ON DELETE CASCADE ON UPDATE CASCADE,
--       FOREIGN KEY (userid) REFERENCES users(userid)
--         ON DELETE CASCADE ON UPDATE CASCADE
--     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--     `;

--     // Strip comments to avoid parser issues
--     sql = sql.replace(/\/\*[\s\S]*?\*\//g, "");
--     sql = sql.replace(/(^|\n)\s*--.*(?=\n|$)/g, "$1");

--     const statements = sql
--       .split(/;\s*\n|;\s*$/gm)
--       .map((s) => s.trim())
--       .filter((s) => s.length > 0);

--     for (let i = 0; i < statements.length; i++) {
--       const stmt = statements[i];
--       try {
--         await dbConnection.query(stmt);
--       } catch (e) {
--         console.error(
--           `❌ Error creating tables (statement ${i + 1})`,
--           e.message
--         );
--         throw e;
--       }
--     }
--     console.log("✅ All tables created successfully");
--   } catch (err) {
--     console.error("❌ Error creating tables:", err.message);
--   }
-- }
