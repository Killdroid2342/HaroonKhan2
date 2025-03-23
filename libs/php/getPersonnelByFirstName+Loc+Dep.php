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
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}


$name = isset($_REQUEST['name']) && !empty($_REQUEST['name']) ? "%" . $_REQUEST['name'] . "%" : "%";
$department = isset($_REQUEST['department']) && $_REQUEST['department'] !== "%" ? $_REQUEST['department'] : "%";
$location = isset($_REQUEST['location']) && $_REQUEST['location'] !== "%" ? $_REQUEST['location'] : "%";

$query = $conn->prepare("
    SELECT 
        p.lastName,
        p.firstName,
        p.jobTitle,
        p.email,
        p.id,
        d.name AS department,
        l.name AS location
    FROM personnel p
    LEFT JOIN department d ON d.id = p.departmentID
    LEFT JOIN location l ON l.id = d.locationID
    WHERE 
        LOWER(p.firstName) LIKE LOWER(?) 
        AND d.id LIKE ?
        AND l.id LIKE ?
    ORDER BY 
        p.lastName, p.firstName, d.name, l.name
");

$query->bind_param("sss", $name, $department, $location);
$query->execute();

if ($query === false) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Query execution failed";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$result = $query->get_result();
$personnel = [];

while ($row = mysqli_fetch_assoc($result)) {
    $personnel[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "success";
$output['status']['description'] = "Query executed successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $personnel;

mysqli_close($conn);
echo json_encode($output);

?>
