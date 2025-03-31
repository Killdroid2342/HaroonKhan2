
<?php

	// connection details for MySQL database
	// development
	// $cd_host = "127.0.0.1";
	// $cd_port = 3306;
	// $cd_socket = "";

	// // database name, username and password

	// $cd_dbname = "companydirectory";
	// $cd_user = "root";
	// $cd_password = "";



// Production dont worry about code above

	// $host = "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com";
	// $port = 3333;
	// $dbname = "db_haroon_5c8d4";
	// $username = "haroon-f667e";
	// $password = "kbuzdODaQVS1YkdnuZEcm28wJkd0lcB7";
	// $host = "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com";
	// $port = 3333;
	// $user = "haroon-f667e";
	// $password = "kbuzdODaQVS1YkdnuZEcm28wJkd0lcB7";
	// $db = "db_haroon_5c8d4";
	
	// // Path to SSL certificate
	// $ssl_ca = __DIR__ . "/singlestore_bundle.pem";
	
	// // Create MySQLi connection
	// $mysqli = mysqli_init();
	
	// // Set the SSL parameters
	// $mysqli->ssl_set(null, null, $ssl_ca, null, null);
	
	// // Attempt to connect to the database
	// if ($mysqli->real_connect($host, $user, $password, $db, $port)) {
	// 	echo "✅ Successfully connected to the database!";
	// } else {
	// 	die("❌ MySQLi Connection Error: " . $mysqli->connect_error);
	// }
	
	// $mysqli->close();
	$host = "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com";
	$port = 3333;
	$user = "haroon-f667e";
	$password = "kbuzdODaQVS1YkdnuZEcm28wJkd0lcB7";
	$db = "db_haroon_5c8d4";
	$ssl_ca = __DIR__ . "../../../singlestore_bundle.pem";

	try {

	    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
	
	    $pdo = new PDO($dsn, $user, $password, [
	        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	        PDO::MYSQL_ATTR_SSL_CA => $ssl_ca
	    ]);

	    echo "✅ Successfully connected to the database!";
	} catch (PDOException $e) {
	    echo "❌ Connection failed: " . $e->getMessage();
	}
?>

