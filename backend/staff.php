<?php
include 'db.php';
header('Content-Type: application/json');

// Handle GET request: Fetch staff details
$sql = "SELECT 
            id, 
            first_name,
            middle_name,
            last_name,
            CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) AS name, 
            contact_number, 
            email,
            role
        FROM staff";

$result = $conn->query($sql);

$staff = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $staff[] = $row;
    }
}

echo json_encode(["data" => $staff]);
?>
