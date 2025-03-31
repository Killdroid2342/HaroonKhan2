<?php
// FOR Dev only

// header('Access-Control-Allow-Origin: *');
    // header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    // header('Access-Control-Allow-Headers: Content-Type');
	
	// ini_set('display_errors', 'On');
	// error_reporting(E_ALL);

	// $executionStartTime = microtime(true);

	// include("config.php");

	// header('Content-Type: application/json; charset=UTF-8');

	// $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	// if (mysqli_connect_errno()) {
		
	// 	$output['status']['code'] = "300";
	// 	$output['status']['name'] = "failure";
	// 	$output['status']['description'] = "database unavailable";
	// 	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	// 	$output['data'] = [];

	// 	mysqli_close($conn);

	// 	echo json_encode($output);

	// 	exit;

	// }	


	// $query = 'SELECT id, firstName, lastName, jobTitle, email, departmentID FROM personnel ORDER BY lastName, firstName';

	// $result = $conn->query($query);
	
	// if (!$result) {

	// 	$output['status']['code'] = "400";
	// 	$output['status']['name'] = "executed";
	// 	$output['status']['description'] = "query failed";	
	// 	$output['data'] = [];

	// 	mysqli_close($conn);

	// 	echo json_encode($output); 

	// 	exit;

	// }
   
   	// $data = [];

	// while ($row = mysqli_fetch_assoc($result)) {

	// 	array_push($data, $row);

	// }

	// $output['status']['code'] = "200";
	// $output['status']['name'] = "ok";
	// $output['status']['description'] = "success";
	// $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	// $output['data'] = $data;
	
	// mysqli_close($conn);

	// echo json_encode($output); 

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type');
	
	// Enable error reporting
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	
	$executionStartTime = microtime(true);
	
	// Include the correct config file
	require_once __DIR__ . "/config.php";

	
	// Define SSL certificate path
	$certPath = realpath(__DIR__ . '../../../singlestore_bundle.pem');
	
	// Create a MySQL connection with SSL
	$conn = new mysqli($host, $user, $password, $db, $port, MYSQLI_CLIENT_SSL);
	
	// Check if the connection is successful
	if ($conn->connect_error) {
		die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
	}
	
	// Verify SSL status
	$result = $conn->query("SHOW STATUS LIKE 'Ssl_cipher'");
	$sslCipher = $result->fetch_assoc()['Value'] ?? null;
	
	if (!$sslCipher) {
		die(json_encode(["error" => "No SSL detected. Ensure your CA bundle is valid."]));
	}
	
	// Connection successful
	echo json_encode(["success" => "Connected with SSL using cipher: $sslCipher"]);

	
	if ($conn->connect_errno) {
		$output = [
			"status" => [
				"code" => "300",
				"name" => "failure",
				"description" => "database unavailable",
				"returnedIn" => (microtime(true) - $executionStartTime) / 1000 . " ms"
			],
			"data" => []
		];
	
		echo json_encode($output);
		exit;
	}
	
	// Correct SQL query
	$query = 'SELECT id, firstName, lastName, jobTitle, email, departmentID FROM personnel ORDER BY lastName, firstName';
	$result = $conn->query($query);
	
	if (!$result) {
		$output = [
			"status" => [
				"code" => "400",
				"name" => "executed",
				"description" => "query failed"
			],
			"data" => []
		];
	
		echo json_encode($output);
		exit;
	}
	
	// Fetch and store results
	$data = [];
	while ($row = $result->fetch_assoc()) {
		$data[] = $row;
	}
	
	// Success response
	$output = [
		"status" => [
			"code" => "200",
			"name" => "ok",
			"description" => "success",
			"returnedIn" => (microtime(true) - $executionStartTime) / 1000 . " ms"
		],
		"data" => $data
	];
	
	$conn->close();
	
	echo json_encode($output);

?>