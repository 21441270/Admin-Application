<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Safely get the Quote ID
    $quote_id = intval($_POST['quote_id']);

    // Prepare SQL query for quote information
    $query = $conn->prepare("
        SELECT 
            -- Quote Details
            quotes.id AS quote_id,
            quotes.description AS quote_description,
            quotes.quote_amount AS total_amount,
            quotes.created_at AS quote_created_at,

            -- Associated Project Details
            projects.status AS project_status,
            projects.start_date AS project_start_date,
            projects.expected_completion AS project_completion_date,

            -- Client Details
            CONCAT(clients.first_name, ' ', IFNULL(clients.middle_name, ''), ' ', clients.last_name) AS client_name,
            clients.contact_number AS client_number,
            clients.email AS client_email,
            CONCAT(clients.address_line, ', ', clients.city, ', ', clients.postcode) AS client_address
        FROM 
            quotes
        JOIN clients ON quotes.client_id = clients.id
        JOIN projects ON quotes.project_id = projects.id
        WHERE 
            quotes.id = ?
    ");

    // Bind Quote ID
    $query->bind_param("i", $quote_id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $quote = $result->fetch_assoc();

        // Fetch Requirements Separately
        $requirements_query = $conn->prepare("
            SELECT 
                id AS requirement_id,
                requirement_text,
                created_at AS requirement_created_at
            FROM 
                requirements
            WHERE 
                quote_id = ?
        ");

        $requirements_query->bind_param("i", $quote_id);
        $requirements_query->execute();
        $requirements_result = $requirements_query->get_result();

        $requirements = [];
        while ($row = $requirements_result->fetch_assoc()) {
            $requirements[] = $row;
        }

        $quote['requirements'] = $requirements;

        // Return combined data
        echo json_encode($quote);
    } else {
        echo json_encode(["error" => "No quote found"]);
    }
}
?>
