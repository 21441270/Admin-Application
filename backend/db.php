
<?php
 $servername = "localhost";
 $username = "root";
 $password = "D3v3l0p";
 $dbname = "admin_application_db";

 // Create connection
 $conn = new mysqli($servername, $username, $password, $dbname);

 // Check connection
 if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
 } /* else {
    echo "Connected successfully";
 } */
?>