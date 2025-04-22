<?php
include 'db.php';
header('Content-Type: application/json');

// Handle GET request: Fetch quote details with related client and project info
$sql = "SELECT 
            quotes.id,
            CONCAT(clients.first_name, ' ', IFNULL(clients.middle_name, ''), ' ', clients.last_name) AS name,
            quotes.description,
            quotes.quote_amount AS total_amount,
            projects.status,
            projects.expected_completion AS completion_date,

            -- Additional client info for form population
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

$result = $conn->query($sql);

$quotes = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $quotes[] = $row;
    }
}

echo json_encode(["data" => $quotes]);
?>
