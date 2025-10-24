CREATE TABLE `answers` (
  `answerid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `questionid` int(11) NOT NULL,
  `answer` text NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `comment_count` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `answer_likes` (
  `likeid` int(11) NOT NULL,
  `answerid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `answer_likes` (
  `likeid` int(11) NOT NULL,
  `answerid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `questions` (
  `questionid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `views` int(11) DEFAULT '0',
  `answer_count` int(11) DEFAULT '0',
  `question_uuid` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` bigint(20) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;