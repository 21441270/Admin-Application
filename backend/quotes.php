<?php
include 'db.php';
header('Content-Type: application/json');

$projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

$sql = "SELECT 
            quotes.id,
            CONCAT(clients.first_name, ' ', IFNULL(clients.middle_name, ''), ' ', clients.last_name) AS name,
            quotes.description,
            quotes.quote_amount AS total_amount,
            projects.status,
            projects.expected_completion AS completion_date,
            clients.first_name,
            clients.middle_name,
            clients.last_name,
            clients.contact_number,
            clients.email,
            clients.address_line,
            clients.city,
            clients.postcode
        FROM quotes
        LEFT JOIN clients ON quotes.client_id = clients.id
        LEFT JOIN projects ON quotes.project_id = projects.id";

if ($projectId > 0) {
    $sql .= " WHERE quotes.project_id = $projectId";
}

$result = $conn->query($sql);
$quotes = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $quotes[] = $row;
    }
}

echo json_encode(["data" => $quotes]);
?>
