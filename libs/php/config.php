
<?php

	// connection details for MySQL database
	// development
	$cd_port = 3306;
	$cd_socket = "";

	// database name, username and password

	$cd_dbname = "harofbou_companydirectory";
	$cd_user = "harofbou_test";
	$cd_password = "RmD!=?T}&Zgw";
    $cd_host = "server242";
    $conn = mysqli_connect($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
      if(!$conn){
        echo ' Not successfull';
        die('Connect failed!!'.mysqli_connect_error());

    } else {
        echo 'Connect successful';
    }

?>

