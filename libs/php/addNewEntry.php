<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable";
    echo json_encode($output);
    exit;
}

$locationName = $_POST['locationName'];
$locationQuery = $conn->prepare("SELECT id FROM location WHERE name = ?");
$locationQuery->bind_param("s", $locationName);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();
$locationID = null;

if ($locationResult->num_rows > 0) {
    $locationRow = $locationResult->fetch_assoc();
    $locationID = $locationRow['id']; 
} else {
    $insertLocation = $conn->prepare("INSERT INTO location (name) VALUES (?)");
    $insertLocation->bind_param("s", $locationName);
    $insertLocation->execute();
    $locationID = $conn->insert_id; 
}

$departmentName = $_POST['departmentName'];
$departmentQuery = $conn->prepare("SELECT id FROM department WHERE name = ? AND locationID = ?");
$departmentQuery->bind_param("si", $departmentName, $locationID);
$departmentQuery->execute();
$departmentResult = $departmentQuery->get_result();
$departmentID = null;

if ($departmentResult->num_rows > 0) {
    $departmentRow = $departmentResult->fetch_assoc();
    $departmentID = $departmentRow['id']; 
} else {
    $insertDepartment = $conn->prepare("INSERT INTO department (name, locationID) VALUES (?, ?)");
    $insertDepartment->bind_param("si", $departmentName, $locationID);
    $insertDepartment->execute();
    $departmentID = $conn->insert_id; 
}


$insertPersonnel = $conn->prepare("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)");
$insertPersonnel->bind_param("ssssi", $_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $departmentID);
$insertPersonnel->execute();

if ($insertPersonnel === false) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "Personnel insert failed";
    echo json_encode($output);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Success";
$output['data'] = [
    "departmentID" => $departmentID,
    "locationID" => $locationID
];

mysqli_close($conn);
echo json_encode($output);

?>
