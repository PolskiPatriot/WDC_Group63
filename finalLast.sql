-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: uDatabase
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BranchOrg`
--

DROP TABLE IF EXISTS `BranchOrg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BranchOrg` (
  `OrgID` binary(16) NOT NULL,
  `orgName` varchar(50) DEFAULT NULL,
  `aboutOrg` text,
  `memberCount` int DEFAULT NULL,
  `orgBanner` varchar(100) DEFAULT NULL,
  `orgRegion` varchar(30) DEFAULT NULL,
  `MainOrgID` binary(16) DEFAULT NULL,
  PRIMARY KEY (`OrgID`),
  KEY `MainOrgID` (`MainOrgID`),
  CONSTRAINT `ForeignBranchRule` FOREIGN KEY (`MainOrgID`) REFERENCES `MainOrg` (`MainOrgID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BranchOrg`
--

LOCK TABLES `BranchOrg` WRITE;
/*!40000 ALTER TABLE `BranchOrg` DISABLE KEYS */;
INSERT INTO `BranchOrg` VALUES (_binary 'ÖT*F\Ô∏5B¨\0','an example',NULL,1,NULL,'a',_binary '\Áx*F\Ô∏5B¨\0'),(_binary '%÷©\œ*F\Ô∏5B¨\0','an exampleaaa','b',1,NULL,'a',_binary '\Áx*F\Ô∏5B¨\0'),(_binary '¥¡y∑\Ôù;B¨\0','RSPCA Brazil','RSPCA Brazil is also about animal good',1234,'/images/banners/RSPCA.png','Brazil',_binary '\ \ı∂\Ôù;B¨\0');
/*!40000 ALTER TABLE `BranchOrg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventJoin`
--

DROP TABLE IF EXISTS `EventJoin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventJoin` (
  `JoinID` binary(16) NOT NULL,
  `EventID` binary(16) DEFAULT NULL,
  `UserID` binary(16) DEFAULT NULL,
  PRIMARY KEY (`JoinID`),
  KEY `EventID` (`EventID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `EventJoinEventRule` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE CASCADE,
  CONSTRAINT `EventJoinUserRule` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventJoin`
--

LOCK TABLES `EventJoin` WRITE;
/*!40000 ALTER TABLE `EventJoin` DISABLE KEYS */;
INSERT INTO `EventJoin` VALUES (_binary 'å\Ò\ﬁ*H\Ô∏5B¨\0',_binary 'o∑°*F\Ô∏5B¨\0',_binary 'Øê¬∂∏∞\ËÖ[\–3ÑyJ');
/*!40000 ALTER TABLE `EventJoin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Events` (
  `EventID` binary(16) NOT NULL,
  `startDate` timestamp NULL DEFAULT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `location` varchar(60) DEFAULT NULL,
  `responseCount` int DEFAULT NULL,
  PRIMARY KEY (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES (_binary 'o∑°*F\Ô∏5B¨\0','2025-01-14 18:31:23','2025-01-15 03:31:23','here',1);
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupJoin`
--

DROP TABLE IF EXISTS `GroupJoin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupJoin` (
  `JoinID` binary(16) NOT NULL,
  `OrgID` binary(16) DEFAULT NULL,
  `UserID` binary(16) DEFAULT NULL,
  `UserLevel` int DEFAULT NULL,
  PRIMARY KEY (`JoinID`),
  KEY `OrgID` (`OrgID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `ForeignBranchOrgRule` FOREIGN KEY (`OrgID`) REFERENCES `BranchOrg` (`OrgID`) ON DELETE CASCADE,
  CONSTRAINT `ForeignUserRule` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupJoin`
--

LOCK TABLES `GroupJoin` WRITE;
/*!40000 ALTER TABLE `GroupJoin` DISABLE KEYS */;
INSERT INTO `GroupJoin` VALUES (_binary '\ÔS*F\Ô∏5B¨\0',_binary 'ÖT*F\Ô∏5B¨\0',_binary 'Øê¬∂∏∞\ËÖ[\–3ÑyJ',4),(_binary 'y?ñ≠*J\Ô∏5B¨\0',_binary '%÷©\œ*F\Ô∏5B¨\0',_binary 'Øê¬∂∏∞\ËÖ[\–3ÑyJ',0);
/*!40000 ALTER TABLE `GroupJoin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MainOrg`
--

DROP TABLE IF EXISTS `MainOrg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MainOrg` (
  `MainOrgID` binary(16) NOT NULL,
  `orgName` varchar(50) DEFAULT NULL,
  `aboutMain` text,
  `memberCount` int DEFAULT NULL,
  `orgBanner` varchar(100) DEFAULT NULL,
  `verification` int DEFAULT NULL,
  PRIMARY KEY (`MainOrgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MainOrg`
--

LOCK TABLES `MainOrg` WRITE;
/*!40000 ALTER TABLE `MainOrg` DISABLE KEYS */;
INSERT INTO `MainOrg` VALUES (_binary '\Áx*F\Ô∏5B¨\0','an example','a',1,NULL,1),(_binary '\ \ı∂\Ôù;B¨\0','RSPCA','RSPCA is about animal good',1234,'/images/banners/RSPCA.png',2);
/*!40000 ALTER TABLE `MainOrg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `PostID` binary(16) NOT NULL,
  `EventID` binary(16) DEFAULT NULL,
  `OrgID` binary(16) DEFAULT NULL,
  `oldPostID` binary(16) DEFAULT NULL,
  `private` tinyint(1) DEFAULT NULL,
  `pinned` tinyint(1) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` text,
  `postDate` timestamp NULL DEFAULT NULL,
  `likeCount` int DEFAULT NULL,
  PRIMARY KEY (`PostID`),
  KEY `EventID` (`EventID`),
  KEY `OrgID` (`OrgID`),
  CONSTRAINT `PostsBranchRule` FOREIGN KEY (`OrgID`) REFERENCES `BranchOrg` (`OrgID`) ON DELETE CASCADE,
  CONSTRAINT `PostsEventRule` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES (_binary '=ó9˝*F\Ô∏5B¨\0',NULL,_binary '%÷©\œ*F\Ô∏5B¨\0',NULL,1,0,'something','here','2024-06-14 12:04:24',2),(_binary 'B´ï*F\Ô∏5B¨\0',NULL,_binary '%÷©\œ*F\Ô∏5B¨\0',NULL,0,0,'public','adasda','2024-06-14 12:04:32',1),(_binary 'oAØ*F\Ô∏5B¨\0',_binary 'o∑°*F\Ô∏5B¨\0',_binary '%÷©\œ*F\Ô∏5B¨\0',NULL,0,0,'sucsk','wow','2024-06-14 12:05:47',0);
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` binary(16) NOT NULL,
  `givenName` varchar(20) DEFAULT NULL,
  `familyName` varchar(30) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `About` varchar(10000) DEFAULT NULL,
  `phonenumber` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `uniqueEmail` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (_binary 'Øê¬∂∏∞\ËÖ[\–3ÑyJ','jon','smith',NULL,'johnsmith@mail.com','$argon2id$v=19$m=65536,t=3,p=4$ldOFcDFfy6XzUoYCKQw5Yg$fc5kPHC/ldSsEaPBHtjgJ2A2uV2sIZ+mfKZhj+N7jiU',NULL,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-14 12:40:01
