<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch project list with client and staff info
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
                CONCAT(staff.first_name, ' ', IFNULL(staff.middle_name, ''), ' ', staff.last_name) AS team_member
            FROM projects
            LEFT JOIN clients ON projects.client_id = clients.id
            LEFT JOIN staff ON projects.staff_id = staff.id";

    $result = $conn->query($sql);
    $projects = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
    }

    echo json_encode(["data" => $projects]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;

    // Check for required fields
    if (
        empty($data['client_id']) ||
        empty($data['staff_id']) ||
        empty($data['project_name']) ||
        empty($data['project_value']) ||
        empty($data['description']) ||
        empty($data['start_date']) ||
        empty($data['expected_completion']) ||
        empty($data['status'])
    ) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    // Sanitize inputs
    $client_id = $conn->real_escape_string($data["client_id"]);
    $staff_id = $conn->real_escape_string($data["staff_id"]);
    $project_name = $conn->real_escape_string($data["project_name"]);
    $project_value = $conn->real_escape_string($data["project_value"]);
    $description = $conn->real_escape_string($data["description"]);
    $start_date = $conn->real_escape_string($data["start_date"]);
    $expected_completion = $conn->real_escape_string($data["expected_completion"]);
    $status = $conn->real_escape_string($data["status"]);

    // Build SQL query
    $sql = "INSERT INTO projects (client_id, staff_id, project_name, project_value, description, start_date, expected_completion, status)
            VALUES ('$client_id', '$staff_id', '$project_name', '$project_value', '$description', '$start_date', '$expected_completion', '$status')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Project added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }

    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Parse raw input
    parse_str(file_get_contents("php://input"), $data);

    // Check for required fields
    if (
        empty($data['project_id']) ||
        empty($data['client_id']) ||
        empty($data['staff_id']) ||
        empty($data['project_name']) ||
        empty($data['project_value']) ||
        empty($data['description']) ||
        empty($data['start_date']) ||
        empty($data['expected_completion']) ||
        empty($data['status'])
    ) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    // Sanitize inputs
    $project_id = $conn->real_escape_string($data["project_id"]);
    $client_id = $conn->real_escape_string($data["client_id"]);
    $staff_id = $conn->real_escape_string($data["staff_id"]);
    $project_name = $conn->real_escape_string($data["project_name"]);
    $project_value = $conn->real_escape_string($data["project_value"]);
    $description = $conn->real_escape_string($data["description"]);
    $start_date = $conn->real_escape_string($data["start_date"]);
    $expected_completion = $conn->real_escape_string($data["expected_completion"]);
    $status = $conn->real_escape_string($data["status"]);

    // Run update query
    $sql = "UPDATE projects SET 
                client_id = '$client_id',
                staff_id = '$staff_id',
                project_name = '$project_name',
                project_value = '$project_value',
                description = '$description',
                start_date = '$start_date',
                expected_completion = '$expected_completion',
                status = '$status'
            WHERE id = '$project_id'";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Project updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }

    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Parse raw input
    parse_str(file_get_contents("php://input"), $data);

    if (empty($data['project_id'])) {
        echo json_encode(["status" => "error", "message" => "Missing project ID"]);
        exit;
    }

    $project_id = $conn->real_escape_string($data['project_id']);

    // Delete the project
    $sql = "DELETE FROM projects WHERE id = '$project_id'";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Project deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }

    exit;
}




?>
