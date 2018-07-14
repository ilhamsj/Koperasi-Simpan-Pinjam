-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2018 at 07:56 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_ksp`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ambil_simpanan`
--

CREATE TABLE `tbl_ambil_simpanan` (
  `id` int(11) NOT NULL,
  `id_simpanan` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `id_jenis_simpanan` int(11) NOT NULL,
  `saldo_awal` int(11) NOT NULL,
  `tgl_pengambilan` date NOT NULL,
  `jml_pengambilan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_ambil_simpanan`
--

INSERT INTO `tbl_ambil_simpanan` (`id`, `id_simpanan`, `id_anggota`, `id_jenis_simpanan`, `saldo_awal`, `tgl_pengambilan`, `jml_pengambilan`) VALUES
(1, 49, 28, 4, 3975000, '2018-07-12', 50000),
(2, 49, 28, 4, 3925000, '2018-08-09', 25000),
(3, 50, 28, 6, 2750000, '2018-06-07', 50000);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_anggota`
--

CREATE TABLE `tbl_anggota` (
  `id` int(11) NOT NULL,
  `no_pendaftaran` int(11) NOT NULL,
  `nik_anggota` int(16) NOT NULL,
  `nama_anggota` varchar(50) NOT NULL,
  `alamat_anggota` text NOT NULL,
  `jk_anggota` varchar(20) NOT NULL,
  `no_telp_anggota` varchar(16) NOT NULL,
  `tgl_masuk` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_anggota`
--

INSERT INTO `tbl_anggota` (`id`, `no_pendaftaran`, `nik_anggota`, `nama_anggota`, `alamat_anggota`, `jk_anggota`, `no_telp_anggota`, `tgl_masuk`) VALUES
(26, 180001, 12345, 'Husni', 'Bantul', 'Laki-Laki', '08998122112', '2018-05-12'),
(27, 180002, 54321, 'Mubarak', 'Sleman', 'Laki-Laki', '087132121213', '2018-05-12'),
(28, 180003, 567890, 'Ailatat', 'Bantul', 'Laki-Laki', '0890909012', '2018-05-12');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_angsuran`
--

CREATE TABLE `tbl_angsuran` (
  `id` int(11) NOT NULL,
  `id_pinjaman` int(11) NOT NULL,
  `angsuran_ke` int(11) NOT NULL,
  `tgl_bayar` date DEFAULT NULL,
  `jml_bayar` int(11) NOT NULL,
  `angsuran` int(11) NOT NULL,
  `bunga` int(11) NOT NULL,
  `iptw` int(11) NOT NULL,
  `total_bayar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_angsuran`
--

INSERT INTO `tbl_angsuran` (`id`, `id_pinjaman`, `angsuran_ke`, `tgl_bayar`, `jml_bayar`, `angsuran`, `bunga`, `iptw`, `total_bayar`) VALUES
(37, 27, 1, NULL, 0, 166666, 3333, 0, 169999),
(38, 27, 2, NULL, 0, 166666, 3333, 0, 169999),
(39, 27, 3, NULL, 0, 166666, 3333, 0, 169999),
(40, 27, 4, NULL, 0, 166666, 3333, 0, 169999),
(41, 27, 5, NULL, 0, 166666, 3333, 0, 169999),
(42, 27, 6, NULL, 0, 166666, 3333, 0, 169999),
(43, 27, 7, NULL, 0, 166666, 3333, 0, 169999),
(44, 27, 8, NULL, 0, 166666, 3333, 0, 169999),
(45, 27, 9, NULL, 0, 166666, 3333, 0, 169999),
(46, 27, 10, NULL, 0, 166666, 3333, 0, 169999),
(47, 27, 11, NULL, 0, 166666, 3333, 0, 169999),
(48, 27, 12, NULL, 0, 166666, 3333, 0, 169999),
(61, 32, 1, NULL, 0, 83333, 1666, 0, 84999),
(62, 32, 2, NULL, 0, 83333, 1666, 0, 84999),
(63, 32, 3, NULL, 0, 83333, 1666, 0, 84999),
(64, 32, 4, NULL, 0, 83333, 1666, 0, 84999),
(65, 32, 5, NULL, 0, 83333, 1666, 0, 84999),
(66, 32, 6, NULL, 0, 83333, 1666, 0, 84999),
(67, 32, 7, NULL, 0, 83333, 1666, 0, 84999),
(68, 32, 8, NULL, 0, 83333, 1666, 0, 84999),
(69, 32, 9, NULL, 0, 83333, 1666, 0, 84999),
(70, 32, 10, NULL, 0, 83333, 1666, 0, 84999),
(71, 32, 11, NULL, 0, 83333, 1666, 0, 84999),
(72, 32, 12, NULL, 0, 83333, 1666, 0, 84999),
(73, 33, 1, NULL, 0, 250000, 5000, 0, 255000),
(74, 33, 2, NULL, 0, 250000, 5000, 0, 255000),
(75, 33, 3, NULL, 0, 250000, 5000, 0, 255000),
(76, 33, 4, NULL, 0, 250000, 5000, 0, 255000),
(77, 33, 5, NULL, 0, 250000, 5000, 0, 255000),
(78, 33, 6, NULL, 0, 250000, 5000, 0, 255000),
(79, 33, 7, NULL, 0, 250000, 5000, 0, 255000),
(80, 33, 8, NULL, 0, 250000, 5000, 0, 255000),
(81, 33, 9, NULL, 0, 250000, 5000, 0, 255000),
(82, 33, 10, NULL, 0, 250000, 5000, 0, 255000),
(83, 33, 11, NULL, 0, 250000, 5000, 0, 255000),
(84, 33, 12, NULL, 0, 250000, 5000, 0, 255000),
(85, 33, 13, NULL, 0, 250000, 5000, 0, 255000),
(86, 33, 14, NULL, 0, 250000, 5000, 0, 255000),
(87, 33, 15, NULL, 0, 250000, 5000, 0, 255000),
(88, 33, 16, NULL, 0, 250000, 5000, 0, 255000),
(89, 33, 17, NULL, 0, 250000, 5000, 0, 255000),
(90, 33, 18, NULL, 0, 250000, 5000, 0, 255000),
(91, 33, 19, NULL, 0, 250000, 5000, 0, 255000),
(92, 33, 20, NULL, 0, 250000, 5000, 0, 255000),
(93, 33, 21, NULL, 0, 250000, 5000, 0, 255000),
(94, 33, 22, NULL, 0, 250000, 5000, 0, 255000),
(95, 33, 23, NULL, 0, 250000, 5000, 0, 255000),
(96, 33, 24, NULL, 0, 250000, 5000, 0, 255000),
(97, 34, 1, NULL, 0, 750000, 15000, 0, 765000),
(98, 34, 2, NULL, 0, 750000, 15000, 0, 765000),
(99, 34, 3, NULL, 0, 750000, 15000, 0, 765000),
(100, 34, 4, NULL, 0, 750000, 15000, 0, 765000),
(101, 34, 5, NULL, 0, 750000, 15000, 0, 765000),
(102, 34, 6, NULL, 0, 750000, 15000, 0, 765000),
(103, 34, 7, NULL, 0, 750000, 15000, 0, 765000),
(104, 34, 8, NULL, 0, 750000, 15000, 0, 765000),
(105, 34, 9, NULL, 0, 750000, 15000, 0, 765000),
(106, 34, 10, NULL, 0, 750000, 15000, 0, 765000),
(107, 34, 11, NULL, 0, 750000, 15000, 0, 765000),
(108, 34, 12, NULL, 0, 750000, 15000, 0, 765000),
(109, 35, 1, NULL, 0, 333333, 6666, 0, 339999),
(110, 35, 2, NULL, 0, 333333, 6666, 0, 339999),
(111, 35, 3, NULL, 0, 333333, 6666, 0, 339999),
(112, 35, 4, NULL, 0, 333333, 6666, 0, 339999),
(113, 35, 5, NULL, 0, 333333, 6666, 0, 339999),
(114, 35, 6, NULL, 0, 333333, 6666, 0, 339999),
(115, 35, 7, NULL, 0, 333333, 6666, 0, 339999),
(116, 35, 8, NULL, 0, 333333, 6666, 0, 339999),
(117, 35, 9, NULL, 0, 333333, 6666, 0, 339999),
(118, 35, 10, NULL, 0, 333333, 6666, 0, 339999),
(119, 35, 11, NULL, 0, 333333, 6666, 0, 339999),
(120, 35, 12, NULL, 0, 333333, 6666, 0, 339999),
(121, 36, 1, NULL, 0, 83333, 1666, 0, 84999),
(122, 36, 2, NULL, 0, 83333, 1666, 0, 84999),
(123, 36, 3, NULL, 0, 83333, 1666, 0, 84999),
(124, 36, 4, NULL, 0, 83333, 1666, 0, 84999),
(125, 36, 5, NULL, 0, 83333, 1666, 0, 84999),
(126, 36, 6, NULL, 0, 83333, 1666, 0, 84999),
(127, 36, 7, NULL, 0, 83333, 1666, 0, 84999),
(128, 36, 8, NULL, 0, 83333, 1666, 0, 84999),
(129, 36, 9, NULL, 0, 83333, 1666, 0, 84999),
(130, 36, 10, NULL, 0, 83333, 1666, 0, 84999),
(131, 36, 11, NULL, 0, 83333, 1666, 0, 84999),
(132, 36, 12, NULL, 0, 83333, 1666, 0, 84999);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_history_simpanan`
--

CREATE TABLE `tbl_history_simpanan` (
  `id` int(11) NOT NULL,
  `id_simpanan` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `id_jenis_simpanan` int(11) NOT NULL,
  `tgl_simpanan` date NOT NULL,
  `saldo_awal` int(11) NOT NULL,
  `kredit` int(11) NOT NULL,
  `saldo_akhir` int(11) NOT NULL,
  `bunga` int(11) NOT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `jenjang` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_history_simpanan`
--

INSERT INTO `tbl_history_simpanan` (`id`, `id_simpanan`, `id_anggota`, `id_jenis_simpanan`, `tgl_simpanan`, `saldo_awal`, `kredit`, `saldo_akhir`, `bunga`, `jangka_waktu`, `jenjang`, `status`) VALUES
(1, 49, 28, 4, '2018-05-13', 2000000, 2000000, 2000000, 0, NULL, NULL, 'Tambah Simpanan'),
(2, 49, 28, 4, '2018-06-08', 2000000, 1500000, 3500000, 0, NULL, NULL, 'Tambah Simpanan'),
(3, 49, 28, 4, '2018-06-28', 3500000, 500000, 4075000, 75000, NULL, NULL, 'Tambah Simpanan'),
(4, 50, 28, 6, '2018-05-13', 2500000, 2500000, 2500000, 0, 0, 'SMP', 'Tambah Simpanan'),
(5, 49, 28, 4, '2018-07-12', 3975000, 50000, 3925000, 0, NULL, NULL, 'Ambil Simpanan'),
(6, 49, 28, 4, '2018-08-09', 3925000, 25000, 3900000, 0, NULL, NULL, 'Ambil Simpanan'),
(7, 50, 28, 6, '2018-05-14', 2500000, 250000, 2750000, 0, NULL, 'SMP', 'Tambah Simpanan'),
(8, 50, 28, 6, '2018-06-07', 2750000, 50000, 2700000, 0, NULL, 'SMP', 'Ambil Simpanan');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_jenis_pinjaman`
--

CREATE TABLE `tbl_jenis_pinjaman` (
  `id` int(11) NOT NULL,
  `kode_jenis` char(5) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `iptw` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_jenis_pinjaman`
--

INSERT INTO `tbl_jenis_pinjaman` (`id`, `kode_jenis`, `nama`, `iptw`) VALUES
(1, 'KU', 'Kredit Umum', 4),
(2, 'KSB', 'Kredit Subsidi BBM', 4),
(3, 'KA', 'Kredit Agrobisnis', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_jenis_simpanan`
--

CREATE TABLE `tbl_jenis_simpanan` (
  `id` int(11) NOT NULL,
  `kode_jenis` varchar(5) NOT NULL,
  `nama` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_jenis_simpanan`
--

INSERT INTO `tbl_jenis_simpanan` (`id`, `kode_jenis`, `nama`) VALUES
(1, 'SK', 'Simpanan Kurban'),
(3, 'SA', 'Simpanan Agro'),
(4, 'SUM', 'Simpanan Usaha Mandiri'),
(6, 'SP', 'Simpanan Pendidikan'),
(7, 'SJK', 'Simpanan Berjangka');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pinjaman`
--

CREATE TABLE `tbl_pinjaman` (
  `id` int(11) NOT NULL,
  `kode_pinjaman` char(8) DEFAULT NULL,
  `id_anggota` int(11) NOT NULL,
  `id_jenis_pinjaman` int(11) DEFAULT NULL,
  `tgl_pinjaman` date DEFAULT NULL,
  `jangka_waktu` int(11) NOT NULL,
  `jml_pinjaman` int(11) NOT NULL,
  `angsuran_pokok` int(11) NOT NULL,
  `bunga_angsuran` int(11) NOT NULL,
  `total_angsuran` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_pinjaman`
--

INSERT INTO `tbl_pinjaman` (`id`, `kode_pinjaman`, `id_anggota`, `id_jenis_pinjaman`, `tgl_pinjaman`, `jangka_waktu`, `jml_pinjaman`, `angsuran_pokok`, `bunga_angsuran`, `total_angsuran`) VALUES
(27, 'KU18001', 26, 1, '2018-05-12', 12, 2000000, 169999, 2, 2039988),
(32, 'KSB18001', 26, 2, '2018-05-12', 12, 1000000, 84999, 2, 1019988),
(33, 'KU18002', 26, 1, '2018-05-12', 24, 6000000, 255000, 2, 6120000),
(34, 'KA18001', 26, 3, '2018-05-12', 12, 9000000, 765000, 2, 9180000),
(35, 'KU18003', 27, 1, '2018-05-12', 12, 4000000, 339999, 2, 4079988),
(36, 'KSB18002', 27, 2, '2018-05-12', 12, 1000000, 84999, 2, 1019988),
(37, NULL, 28, NULL, NULL, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_simpanan`
--

CREATE TABLE `tbl_simpanan` (
  `id` int(11) NOT NULL,
  `kode_simpanan` char(11) DEFAULT NULL,
  `id_anggota` int(11) NOT NULL,
  `id_jenis_simpanan` int(11) DEFAULT NULL,
  `saldo_awal` int(11) NOT NULL,
  `tgl_simpanan` date DEFAULT NULL,
  `tgl_ambil` date DEFAULT NULL,
  `jml_simpanan` int(11) DEFAULT NULL,
  `saldo_akhir` int(11) DEFAULT NULL,
  `bunga` int(11) DEFAULT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `jenjang` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_simpanan`
--

INSERT INTO `tbl_simpanan` (`id`, `kode_simpanan`, `id_anggota`, `id_jenis_simpanan`, `saldo_awal`, `tgl_simpanan`, `tgl_ambil`, `jml_simpanan`, `saldo_akhir`, `bunga`, `jangka_waktu`, `jenjang`) VALUES
(47, NULL, 26, NULL, 0, NULL, NULL, 0, 0, 0, 0, ''),
(48, NULL, 27, NULL, 0, NULL, NULL, 0, 0, 0, 0, ''),
(49, 'SUM18001', 28, 4, 3925000, '2018-08-09', NULL, 25000, 3900000, 15, NULL, NULL),
(50, 'SP18001', 28, 6, 2750000, '2018-06-07', NULL, 50000, 2700000, 0, 0, 'SMP');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `level` enum('admin','user','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `level`) VALUES
(1, 'admin', 'admin', 'admin'),
(3, 'husni', 'husni12345', 'user'),
(4, 'husni 2', 'husni12345', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_ambil_simpanan`
--
ALTER TABLE `tbl_ambil_simpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`),
  ADD KEY `id_jenis_simpanan` (`id_jenis_simpanan`),
  ADD KEY `id_simpanan` (`id_simpanan`);

--
-- Indexes for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pinjaman` (`id_pinjaman`);

--
-- Indexes for table `tbl_history_simpanan`
--
ALTER TABLE `tbl_history_simpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_simpanan` (`id_simpanan`),
  ADD KEY `id_anggota` (`id_anggota`),
  ADD KEY `id_jenis_simpanan` (`id_jenis_simpanan`);

--
-- Indexes for table `tbl_jenis_pinjaman`
--
ALTER TABLE `tbl_jenis_pinjaman`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_jenis_simpanan`
--
ALTER TABLE `tbl_jenis_simpanan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_pinjaman`
--
ALTER TABLE `tbl_pinjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`),
  ADD KEY `id_jenis_pinjaman` (`id_jenis_pinjaman`);

--
-- Indexes for table `tbl_simpanan`
--
ALTER TABLE `tbl_simpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`),
  ADD KEY `id_jenis_simpanan` (`id_jenis_simpanan`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_ambil_simpanan`
--
ALTER TABLE `tbl_ambil_simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;
--
-- AUTO_INCREMENT for table `tbl_history_simpanan`
--
ALTER TABLE `tbl_history_simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `tbl_jenis_pinjaman`
--
ALTER TABLE `tbl_jenis_pinjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbl_jenis_simpanan`
--
ALTER TABLE `tbl_jenis_simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `tbl_pinjaman`
--
ALTER TABLE `tbl_pinjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
--
-- AUTO_INCREMENT for table `tbl_simpanan`
--
ALTER TABLE `tbl_simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_ambil_simpanan`
--
ALTER TABLE `tbl_ambil_simpanan`
  ADD CONSTRAINT `tbl_ambil_simpanan_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `tbl_anggota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_ambil_simpanan_ibfk_2` FOREIGN KEY (`id_jenis_simpanan`) REFERENCES `tbl_jenis_simpanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  ADD CONSTRAINT `tbl_angsuran_ibfk_1` FOREIGN KEY (`id_pinjaman`) REFERENCES `tbl_pinjaman` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_history_simpanan`
--
ALTER TABLE `tbl_history_simpanan`
  ADD CONSTRAINT `tbl_history_simpanan_ibfk_1` FOREIGN KEY (`id_simpanan`) REFERENCES `tbl_simpanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_history_simpanan_ibfk_2` FOREIGN KEY (`id_anggota`) REFERENCES `tbl_anggota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_history_simpanan_ibfk_3` FOREIGN KEY (`id_jenis_simpanan`) REFERENCES `tbl_jenis_simpanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_pinjaman`
--
ALTER TABLE `tbl_pinjaman`
  ADD CONSTRAINT `tbl_pinjaman_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `tbl_anggota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_pinjaman_ibfk_2` FOREIGN KEY (`id_jenis_pinjaman`) REFERENCES `tbl_jenis_pinjaman` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_simpanan`
--
ALTER TABLE `tbl_simpanan`
  ADD CONSTRAINT `tbl_simpanan_ibfk_3` FOREIGN KEY (`id_anggota`) REFERENCES `tbl_anggota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_simpanan_ibfk_4` FOREIGN KEY (`id_jenis_simpanan`) REFERENCES `tbl_jenis_simpanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
