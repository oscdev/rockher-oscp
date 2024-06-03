CREATE TABLE `bulk_operation_status` (
  `id` int NOT NULL,
  `sh_shop` varchar(255) NOT NULL,
  `sh_operation_id` varchar(255) NOT NULL,
  `sh_operation_status` varchar(255) NOT NULL,
  `sh_operation_user_errors` varchar(255) NOT NULL,
  `app_operation_error` varchar(256) DEFAULT NULL,
  `app_operation_status` enum('WAITING','COMPLETE','ERROR') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user_status` int DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `bulk_operation_status`
  ADD UNIQUE KEY `id` (`id`);

ALTER TABLE `bulk_operation_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;