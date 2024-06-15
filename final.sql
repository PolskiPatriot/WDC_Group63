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
INSERT INTO `BranchOrg` VALUES (_binary '\'Tò\—*\Ì\Ôö\ÁB¨\0','Pandas for Mars (Main)','We support the propagation of Martian Pandas. Our cause is just!',2,NULL,'(Main)',_binary '\'TH*\Ì\Ôö\ÁB¨\0'),(_binary 'Wπ\Ÿ[*\Ì\Ôö\ÁB¨\0','Pandas for Mars Tasmania','Proud Tasmanian Branch of Pandas for Mars. Our cause is just!',2,NULL,'Tasmania',_binary '\'TH*\Ì\Ôö\ÁB¨\0'),(_binary '≠$\Á*\Ì\Ôö\ÁB¨\0','NoWaste (Main)','We are a non-profit organisation seeking to eliminate the waste of used goods.',3,NULL,'(Main)',_binary '≠$n*\Ì\Ôö\ÁB¨\0'),(_binary '\œA!†*\Ì\Ôö\ÁB¨\0','NoWaste Kangaroo Island','There\'s far too much waste.',2,NULL,'Kangaroo Island',_binary '≠$n*\Ì\Ôö\ÁB¨\0'),(_binary '\ı\ÃTD*\Î\Ôö\ÁB¨\0','Site Managers (Main)','Get info from Site Managers here!',3,NULL,'(Main)',_binary '\ı\À ®*\Î\Ôö\ÁB¨\0');
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
INSERT INTO `GroupJoin` VALUES (_binary '\'U∂*\Ì\Ôö\ÁB¨\0',_binary '\'Tò\—*\Ì\Ôö\ÁB¨\0',_binary '\’H|9üá\Ÿ^\◊Q \»/âk',4),(_binary 'W∫`¨*\Ì\Ôö\ÁB¨\0',_binary 'Wπ\Ÿ[*\Ì\Ôö\ÁB¨\0',_binary '\’H|9üá\Ÿ^\◊Q \»/âk',4),(_binary ']\'\◊\Z*\Ó\Ôö\ÁB¨\0',_binary '\ı\ÃTD*\Î\Ôö\ÁB¨\0',_binary '\’H|9üá\Ÿ^\◊Q \»/âk',1),(_binary 't}\'\Ô*\Ó\Ôö\ÁB¨\0',_binary '\ı\ÃTD*\Î\Ôö\ÁB¨\0',_binary 'a≤◊∑ùaq$\Ù \≈/\ı1\ˆ',1),(_binary '≠%w\¬*\Ì\Ôö\ÁB¨\0',_binary '≠$\Á*\Ì\Ôö\ÁB¨\0',_binary 'a≤◊∑ùaq$\Ù \≈/\ı1\ˆ',4),(_binary '∫n\ÁH*\Ó\Ôö\ÁB¨\0',_binary '\'Tò\—*\Ì\Ôö\ÁB¨\0',_binary 'y#9±,÷´~\·\'Fr|z\r',1),(_binary 'ºj°\Ê*\Ó\Ôö\ÁB¨\0',_binary '≠$\Á*\Ì\Ôö\ÁB¨\0',_binary 'y#9±,÷´~\·\'Fr|z\r',1),(_binary '\œA¢\ı*\Ì\Ôö\ÁB¨\0',_binary '\œA!†*\Ì\Ôö\ÁB¨\0',_binary 'a≤◊∑ùaq$\Ù \≈/\ı1\ˆ',4),(_binary '\›\Ãh\Ï*\Ì\Ôö\ÁB¨\0',_binary 'Wπ\Ÿ[*\Ì\Ôö\ÁB¨\0',_binary 'a≤◊∑ùaq$\Ù \≈/\ı1\ˆ',3),(_binary '\Ëy\‹`*\Ì\Ôö\ÁB¨\0',_binary '≠$\Á*\Ì\Ôö\ÁB¨\0',_binary '\’H|9üá\Ÿ^\◊Q \»/âk',1),(_binary '\Ïfç\Â*\Ì\Ôö\ÁB¨\0',_binary '\œA!†*\Ì\Ôö\ÁB¨\0',_binary '\’H|9üá\Ÿ^\◊Q \»/âk',3),(_binary '\ıÃΩ1*\Î\Ôö\ÁB¨\0',_binary '\ı\ÃTD*\Î\Ôö\ÁB¨\0',_binary 'y#9±,÷´~\·\'Fr|z\r',5);
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
INSERT INTO `MainOrg` VALUES (_binary '\'TH*\Ì\Ôö\ÁB¨\0','Pandas for Mars','We support the propagation of Martian Pandas. Our cause is just!',1,NULL,1),(_binary '≠$n*\Ì\Ôö\ÁB¨\0','NoWaste','We are a non-profit organisation seeking to eliminate the waste of used goods.',1,NULL,1),(_binary '\ı\À ®*\Î\Ôö\ÁB¨\0','Site Managers','Get info from Site Managers here!',1,NULL,2);
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
INSERT INTO `Posts` VALUES (_binary '%÷©\‘*\Ï\Ôö\ÁB¨\0',NULL,_binary '\ı\ÃTD*\Î\Ôö\ÁB¨\0',NULL,1,1,'An Invitation','If you\'d like to get updates for new site features, come join!','2024-06-15 07:52:00',0);
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
INSERT INTO `Users` VALUES (_binary 'a≤◊∑ùaq$\Ù \≈/\ı1\ˆ','Barry','Bee',NULL,'BarryB@hotmail.com','$argon2id$v=19$m=65536,t=3,p=4$krz/n4U07bO1P+W47dNtYw$XbymgGCBF8A6BQvEM+BvU8kfZ6UzzteXhXG/u5CW+Cs',NULL,NULL),(_binary 'y#9±,÷´~\·\'Fr|z\r','SiteManager','',NULL,'siteManager@mail.service','$argon2id$v=19$m=65536,t=3,p=4$0T+rbAfh06DBBScJh7469w$0WUvBmM9YqI36n+7S+4TWDEMMXm9ilPrZonhkn75vbM',NULL,NULL),(_binary '\’H|9üá\Ÿ^\◊Q \»/âk','Alex','Apples',NULL,'AApples@email.com','$argon2id$v=19$m=65536,t=3,p=4$rPAvb+rCaBNVOF2WUhZz8w$XSwF79rzn4/gBsXw19ct0h+FQmsUdK4VoaeLLAgtKj0',NULL,NULL);
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

-- Dump completed on 2024-06-15  8:13:27
