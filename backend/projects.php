<?php
include 'db.php';
header('Content-Type: application/json');

// Handle GET request: Fetch project details with client and staff information
$sql = "SELECT 
            projects.id AS project_id,
            projects.client_id,
            CONCAT(clients.first_name, ' ', IFNULL(clients.middle_name, ''), ' ', clients.last_name) AS client_name,
            projects.project_name,
            projects.project_value,
            projects.description,
            projects.start_date,
            projects.expected_completion,
            projects.status,
            CONCAT(staff.first_name, ' ', IFNULL(staff.middle_name, ''), ' ', staff.last_name) AS team_member  -- Updated to show single team member
        FROM projects
        LEFT JOIN clients ON projects.client_id = clients.id
        LEFT JOIN staff ON projects.staff_id = staff.id";  // Join directly with staff table using staff_id

$result = $conn->query($sql);

$projects = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }
}

echo json_encode(["data" => $projects]);
?>
