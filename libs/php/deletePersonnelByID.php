<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type');
	
	if (isset($_REQUEST['personnelID'])) {
		$personnelID = $_REQUEST['personnelID'];
		error_log("Received personnelID: " . $personnelID);
	} else {

		error_log("Personnel ID not provided"); 
		echo json_encode(["status" => ["code" => "400", "name" => "error", "description" => "Personnel ID not provided"]]);
		exit;
	}

	include("config.php");

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if ($conn->connect_error) {
		error_log("Database connection failed: " . $conn->connect_error);
		echo json_encode([
			'status' => ['code' => '500', 'name' => 'error', 'description' => 'Database connection failed'],
			'data' => []
		]);
		exit;
	}

	$query = "DELETE FROM personnel WHERE id = $personnelID";  
	error_log("Executing query: " . $query); 

	if ($conn->query($query) === TRUE) {
		error_log("Query executed successfully. Record with ID $personnelID deleted."); 
		echo json_encode([
			'status' => ['code' => '200', 'name' => 'ok', 'description' => 'Record deleted successfully'],
			'data' => []
		]);
	} else {
		error_log("Query failed: " . $conn->error); 
		echo json_encode([
			'status' => ['code' => '400', 'name' => 'error', 'description' => 'Query failed: ' . $conn->error],
			'data' => []
		]);
	}


	$conn->close();
	error_log("Database connection closed."); 
?>
