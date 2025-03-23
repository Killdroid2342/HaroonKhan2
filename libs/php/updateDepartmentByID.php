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
    $output['status'] = [
        "code" => "300",
        "name" => "failure",
        "description" => "Database unavailable",
        "returnedIn" => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ];
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}


if (isset($_POST['departmentID']) && !empty($_POST['name'])) {
    $departmentID = (int) $_POST['departmentID']; 
    $name = $_POST['name'];


    $sql = "UPDATE department SET name = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $name, $departmentID);
    $stmt->execute();

    if ($stmt->affected_rows >= 0) { 
        $output['status'] = [
            "code" => "200",
            "name" => "ok",
            "description" => "Update successful"
        ];
    } else {
        $output['status'] = [
            "code" => "400",
            "name" => "error",
            "description" => "No changes made or invalid ID"
        ];
    }
} else {
    $output['status'] = [
        "code" => "400",
        "name" => "error",
        "description" => "Required fields (departmentID and name) are missing"
    ];
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);
echo json_encode($output);
?>
