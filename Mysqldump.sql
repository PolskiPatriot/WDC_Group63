-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: uDatabase
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
  CONSTRAINT `BranchOrg_ibfk_1` FOREIGN KEY (`MainOrgID`) REFERENCES `MainOrg` (`MainOrgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BranchOrg`
--

LOCK TABLES `BranchOrg` WRITE;
/*!40000 ALTER TABLE `BranchOrg` DISABLE KEYS */;
INSERT INTO `BranchOrg` VALUES (_binary '��y�\�;B�\0','RSPCA Brazil','RSPCA Brazil is also about animal good',1234,'/images/banners/RSPCA.png','Brazil',_binary '\�\��\�;B�\0');
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
  CONSTRAINT `EventJoin_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`),
  CONSTRAINT `EventJoin_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventJoin`
--

LOCK TABLES `EventJoin` WRITE;
/*!40000 ALTER TABLE `EventJoin` DISABLE KEYS */;
INSERT INTO `EventJoin` VALUES (_binary '_R\�2�\�;B�\0',_binary '��\�\��\�;B�\0',_binary 'E\�r�\�;B�\0');
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
INSERT INTO `Events` VALUES (_binary '��\�\��\�;B�\0','2024-05-23 04:00:21','2024-05-23 04:00:21','Not Brazil',0);
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
  CONSTRAINT `GroupJoin_ibfk_1` FOREIGN KEY (`OrgID`) REFERENCES `BranchOrg` (`OrgID`),
  CONSTRAINT `GroupJoin_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupJoin`
--

LOCK TABLES `GroupJoin` WRITE;
/*!40000 ALTER TABLE `GroupJoin` DISABLE KEYS */;
INSERT INTO `GroupJoin` VALUES (_binary 'D��\�;B�\0',_binary '��y�\�;B�\0',_binary 'E\�r�\�;B�\0',0);
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
INSERT INTO `MainOrg` VALUES (_binary '\�\��\�;B�\0','RSPCA','RSPCA is about animal good',1234,'/images/banners/RSPCA.png',2);
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
  CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`),
  CONSTRAINT `Posts_ibfk_2` FOREIGN KEY (`OrgID`) REFERENCES `BranchOrg` (`OrgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES (_binary '�Z߆�\�;B�\0',_binary '��\�\��\�;B�\0',_binary '��y�\�;B�\0',NULL,0,0,'Eventwan','This is a test event dont actually attend please','2024-05-23 04:05:49',0);
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
  `email` varchar(40) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `About` varchar(10000) DEFAULT NULL,
  `phonenumber` binary(16) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `uniqueEmail` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (_binary '\r�7=\0�N��\�˳v�r:','111111','111111','112','$argon2id$v=19$m=65536,t=3,p=4$PIE+7MUGLU0DahYy5AyNEQ$vKbsKNL+uwBm6VEUT8hHLnFLp7Z26P/ayCUX2cZhpdQ',NULL,NULL),(_binary '�_^��\n��\�\�\�\�\�','12we2321','12','12','$argon2id$v=19$m=65536,t=3,p=4$UYiOqMEnm54X/g+qGjpd3g$zqvR/aW7OQEi6XUrSXHy3zgBlHIN3dnqSKPdfr2vMjs','Your about content is empty!3213',NULL),(_binary '�\'̿�\Z\�Q�?I�\�\�','132','122','122','$argon2id$v=19$m=65536,t=3,p=4$LO/WDi9cdzsvzlhn4BuoNg$hgdRE+Q51K0HaiLh4kojRGpyL7HomSEoD4vhj+ECuC8',NULL,NULL),(_binary '�\���\�\�fN�\�UL','1234','1234','123','$argon2id$v=19$m=65536,t=3,p=4$f1CT2jXaKvQFHCIFRTQ1FA$A3KdcrEeUh0Dc6yl2Pa5TS8TF3SCSojNPOcLpiabdfU','Your about content is empty!',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),(_binary 'ϫ\�\�q\�\�n\0d�wȞ','12','12','1111','$argon2id$v=19$m=65536,t=3,p=4$cP6VKNcZO9gEYpPsHNrydg$v5b9HWicAiLHqQpD1rycDOSfFsrLQKOUMKOsqIJZJ6o',NULL,NULL),(_binary '\�f�c\�Pic��','12','12','3333','$argon2id$v=19$m=65536,t=3,p=4$KepCKznj8eWEoYnKSHHGjw$GqhvLEWEs0MVcK3Nyoi9dtLRWbXVCAiBsl8gt/NLbLU',NULL,NULL),(_binary '\�\�p\�z�x\�\�G�$Ԡ','12331','21212','1222212','$argon2id$v=19$m=65536,t=3,p=4$nhgmDS18jwArF0O5LQTRbQ$B3iYEMtv5OQ6f3Ob9Z4yjaLs8xZLSxZTqEzzOOR34WY',NULL,_binary '121213\0\0\0\0\0\0\0\0\0\0');
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

-- Dump completed on 2024-06-10  5:10:41


ALTER TABLE `EventJoin`
DROP FOREIGN KEY `DropEvent`,
ADD CONSTRAINT `DropEvent` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `GroupJoin`
DROP FOREIGN KEY `DropGroup`,
ADD CONSTRAINT `DropGroup` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE;