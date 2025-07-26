-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lip 26, 2025 at 10:36 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `energy_db`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `devices`
--

CREATE TABLE `devices` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `daily_usage_hours` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `power_watt` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`id`, `created_at`, `daily_usage_hours`, `name`, `power_watt`, `type`, `user_id`) VALUES
(4, '2025-07-23 08:20:58.000000', 1.5, 'Zmywarka', 212, 'AGD', 7),
(5, '2025-07-23 08:48:05.000000', 24, 'Lodowka', 120, 'AGD', 7),
(6, '2025-07-23 08:49:17.000000', 4, 'TV', 80, 'RTV', 7),
(9, '2025-07-24 11:37:06.000000', 4, 'Telewizor', 120, 'TV', 10),
(10, '2025-07-24 12:17:37.000000', 1, 'Pralka', 500, 'AGD', 10),
(12, '2025-07-24 12:54:29.000000', 2, 'Komputer', 400, 'RTV', 10),
(23, '2025-07-25 08:42:17.000000', 6, 'Wiatrak', 50, 'Inne', 10),
(24, '2025-07-25 08:51:05.000000', 5, 'Laptop', 50, 'Inne', 7),
(25, '2025-07-25 09:17:27.000000', 6, 'Oświetlenie LED', 10, 'Oświetlenie', 7),
(26, '2025-07-25 09:17:42.000000', 24, 'Router Wi-Fi', 15, 'RTV', 7),
(27, '2025-07-25 09:18:10.000000', 0.5, 'Piekarnik', 1800, 'AGD', 7),
(28, '2025-07-25 09:18:38.000000', 0.2, 'Czajnik elektryczny', 2000, 'AGD', 7),
(32, '2025-07-25 11:23:08.000000', 6, 'Klimatyzacja', 400, 'HVAC', 10),
(33, '2025-07-26 20:29:29.000000', 0.3, 'Czajnik', 2000, 'AGD', 10);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `energy_usage`
--

CREATE TABLE `energy_usage` (
  `id` bigint(20) NOT NULL,
  `cost` double NOT NULL,
  `date` date NOT NULL,
  `energy_kwh` double NOT NULL,
  `device_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `energy_usage`
--

INSERT INTO `energy_usage` (`id`, `cost`, `date`, `energy_kwh`, `device_id`) VALUES
(1, 0.2862, '2025-07-23', 0.318, 4),
(2, 2.592, '2025-07-23', 2.88, 5),
(5, 0.29, '2025-07-23', 0.32, 6),
(7, 0.43, '2025-07-24', 0.48, 9),
(8, 0.45, '2025-07-24', 0.5, 10),
(10, 1.08, '2025-07-24', 1.2000000000000002, 12),
(16, 0.29, '2025-07-24', 0.318, 4),
(17, 0.29, '2025-07-25', 0.318, 4),
(18, 2.59, '2025-07-24', 2.88, 5),
(19, 2.59, '2025-07-25', 2.88, 5),
(20, 0.29, '2025-06-10', 0.32, 6),
(21, 0.29, '2025-07-25', 0.32, 6),
(24, 0.43, '2025-07-25', 0.48, 9),
(25, 0.45, '2025-07-25', 0.5, 10),
(26, 0.72, '2025-07-25', 0.8, 12),
(32, 0.27, '2025-07-25', 0.30000000000000004, 23),
(33, 0.23, '2025-07-25', 0.25, 24),
(100, 0.5, '2025-07-23', 0.55, 24),
(101, 0.48, '2025-07-24', 0.53, 24),
(102, 0.52, '2025-07-25', 0.58, 24),
(103, 0.29, '2025-07-23', 0.32, 6),
(104, 0.3, '2025-07-24', 0.34, 6),
(105, 0.31, '2025-07-25', 0.35, 6),
(106, 2.6, '2025-07-23', 2.9, 5),
(107, 2.65, '2025-07-24', 2.95, 5),
(108, 2.7, '2025-07-25', 3, 5),
(109, 0.51, '2025-07-20', 0.56, 24),
(110, 0.5, '2025-07-21', 0.55, 24),
(111, 0.48, '2025-07-22', 0.53, 24),
(112, 0.52, '2025-07-23', 0.58, 24),
(113, 0.49, '2025-07-24', 0.54, 24),
(114, 0.29, '2025-07-11', 0.32, 6),
(115, 0.3, '2025-07-12', 0.34, 6),
(116, 0.31, '2025-07-13', 0.35, 6),
(117, 0.29, '2025-07-14', 0.32, 6),
(118, 0.3, '2025-07-15', 0.34, 6),
(119, 0.31, '2025-07-16', 0.35, 6),
(120, 0.29, '2025-07-17', 0.32, 6),
(121, 0.3, '2025-07-18', 0.34, 6),
(122, 0.31, '2025-07-19', 0.35, 6),
(123, 0.29, '2025-07-20', 0.32, 6),
(124, 0.3, '2025-07-21', 0.34, 6),
(125, 0.31, '2025-07-22', 0.35, 6),
(126, 0.29, '2025-07-23', 0.32, 6),
(127, 0.3, '2025-07-24', 0.34, 6),
(128, 2.6, '2025-07-11', 2.9, 5),
(129, 2.65, '2025-07-12', 2.95, 5),
(130, 2.7, '2025-07-13', 3, 5),
(131, 2.62, '2025-07-14', 2.92, 5),
(132, 2.68, '2025-07-15', 2.98, 5),
(133, 2.64, '2025-07-16', 2.94, 5),
(134, 2.61, '2025-07-17', 2.91, 5),
(135, 2.66, '2025-07-18', 2.96, 5),
(136, 2.69, '2025-07-19', 2.99, 5),
(137, 2.63, '2025-07-20', 2.93, 5),
(138, 2.67, '2025-07-21', 2.97, 5),
(139, 2.65, '2025-07-22', 2.95, 5),
(140, 2.62, '2025-07-23', 2.92, 5),
(141, 2.64, '2025-07-24', 2.94, 5),
(142, 0.05, '2025-07-25', 0.06, 25),
(143, 0.32, '2025-07-25', 0.36, 26),
(144, 0.81, '2025-07-25', 0.9, 27),
(145, 0.36, '2025-07-25', 0.4, 28),
(149, 2.16, '2025-07-25', 2.4000000000000004, 32),
(150, 0.54, '2025-07-26', 0.6, 33);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `energy_cost_per_kwh` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `email`, `password`, `role`, `username`, `energy_cost_per_kwh`) VALUES
(1, '2025-07-22 11:57:20.000000', 'lukasz@example.com', '$2a$10$tfLvvWdNeGTCXL3G9/5JiO1PVotKPfdcBnAB9GH65GL6JDvYH.3ey', 'USER', 'lukasz', 0.5),
(6, '2025-07-22 12:25:08.000000', 'lukasz@op.pl', '$2a$10$jwCotuvppe2mpPn2mmrIfeRFda3Aqphu52OIKhpIF8f0/Jra9w9UW', 'USER', 'lukasz123', 0.5),
(7, '2025-07-22 12:36:08.000000', 'adam1@op.pl', '$2a$10$CnSdi8MEhQJnbmuJy9eUNeACPxh/Ny4t7Y6cv1.8BOe.1zqGzaxr6', 'USER', 'adam1', 0.9),
(8, '2025-07-22 12:44:22.000000', 'admin@gmail.com', '$2a$10$smbPW9gU5.HTkEdg/Cfn8ezHEBJfQTV4o0SGn5ciL/vtS3RUFEjbW', 'ADMIN', 'admin', 0.5),
(9, '2025-07-23 08:04:38.000000', 'kuba.ez@gmail.com', '$2a$10$2IHx/K.iwbPR/rAFywhv8.yGWHpNd0QSZm8p63coSfydmJJAfv31a', 'USER', 'Kuba123', 0.5),
(10, '2025-07-23 12:36:49.000000', 'tomasz@wp.pl', '$2a$10$P7cKL3ZFW7IGoOgCwUUEF.4Ns7dRx/jVuXOTdjf0D89OcI6pK/Ks2', 'USER', 'tomek123', 0.9),
(12, '2025-07-24 08:01:48.000000', 'asd@asd.asd', '$2a$10$9MaCymE3JaQUe9QvEur.A.qCZ5wJFnqX2aEdkVWQczGSn2E.aRbIG', 'USER', 'asdasd', 0.9),
(13, '2025-07-24 08:02:28.000000', 'asd@asd.sss', '$2a$10$8jZfyhtlOP5S76Ejlpv/Qu6AcoRee0izDUnHHSX4ZuJY8TqsOlRli', 'USER', 'qweasd', 0.9),
(15, '2025-07-24 08:03:13.000000', 'asd@asd.wwww', '$2a$10$17vDhRwiD2fSYeG3mYuGf.7fU9o3sTFADjo6t8dkixN2drWfAbmGm', 'USER', 'asd123', 0.9),
(16, '2025-07-24 08:04:35.000000', 'as@aaa.as', '$2a$10$M9w0iD/3ZOPr3nfF1uu8Ke0U9OBJ/M3OpR0BKC8Quw3cRIVP7mKlC', 'USER', 'asd12333', 0.9),
(18, '2025-07-24 08:07:54.000000', 'rrrrasd@asd.cs', '$2a$10$IJBm7HUEsIvyOPrrPyXImuBlh0QLPQ/izJ.SgA0OvA9FdMOsWZpI2', 'USER', 'qazwsx', 0.9),
(19, '2025-07-24 08:08:49.000000', 'zxc@asd.pl', '$2a$10$Q62K6/sMWw2MjkWKcvtqCuY5ImeI9Ne60SMMUp/20b7EPdt0McOPq', 'USER', 'zxc', 0.9),
(20, '2025-07-24 08:10:21.000000', 'asd@asdwq.plsa', '$2a$10$UjvYimZL7mApettx/rLYTOug6LcSjVP3gN9QbuOgVVlpLtMV50Wr2', 'USER', 'fgh', 0.9),
(21, '2025-07-24 08:10:39.000000', 'kuba44.ez@gmail.com', '$2a$10$myycaMG6REKaeCFk5ArlFORIGiQUhnDflIPPNRiOY/5LnQxIkwmG6', 'USER', 'Kuba12344', 0.9),
(22, '2025-07-24 08:12:11.000000', 'cvb@asdvx.pl', '$2a$10$nzKTGH266OaSGzX2OHL77.genHW49OL0puobSw/LfRlmzi/ez9tlO', 'USER', 'cvb', 0.9),
(23, '2025-07-24 08:14:03.000000', 'qwe@asd.pl', '$2a$10$h/4KB1jXPYUrN1JikgjrDO/zJSX4gwzhGHDKRxaQcTBZKbk4dz9g2', 'USER', 'qwe', 0.9);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrfbri1ymrwywdydc4dgywe1bt` (`user_id`);

--
-- Indeksy dla tabeli `energy_usage`
--
ALTER TABLE `energy_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4mcwp7nxs8on5e3oy3p7y0j0f` (`device_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `energy_usage`
--
ALTER TABLE `energy_usage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `FKrfbri1ymrwywdydc4dgywe1bt` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `energy_usage`
--
ALTER TABLE `energy_usage`
  ADD CONSTRAINT `FK4mcwp7nxs8on5e3oy3p7y0j0f` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
