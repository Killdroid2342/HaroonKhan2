
<?php

	// connection details for MySQL database
	// development
	$cd_host = "127.0.0.1";
	$cd_port = 3306;
	$cd_socket = "";

	// database name, username and password

	$cd_dbname = "companydirectory";
	$cd_user = "root";
	$cd_password = "";

	$uri = "mysql://avnadmin:AVNS_hNeqpNL5YGwnjYtjohY@mysql-2a27a3ec-haroonkhan120704-c853.b.aivencloud.com:26124/defaultdb?ssl-mode=REQUIRED";

	$fields = parse_url($uri);
	
	// build the DSN including SSL settings
	$conn = "mysql:";
	$conn .= "host=" . $fields["host"];
	$conn .= ";port=" . $fields["port"];;
	$conn .= ";dbname=defaultdb";
	$conn .= ";sslrootcert=" . __DIR__ . "/../ca.pem";

	
	try {
	  $db = new PDO($conn, $fields["user"], $fields["pass"]);
	
	  $stmt = $db->query("SELECT VERSION()");
	  print($stmt->fetch()[0]);
	} catch (Exception $e) {
	  echo "Error: " . $e->getMessage();
	}
?>
