<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get project ID safely
    $project_id = intval($_POST['project_id']);

    // Prepare SQL to get project information
    $query = $conn->prepare("
        SELECT 
            -- Project Overview
            projects.project_name AS project_name,
            projects.status AS status,
            projects.start_date AS start_date,
            projects.expected_completion AS expected_completion_date,
            projects.description AS project_description,
            projects.project_value AS project_value,
            
            -- Client Details
            clients.id AS client_id,
            CONCAT(clients.first_name, ' ', IFNULL(clients.middle_name, ''), ' ', clients.last_name) AS client_name,
            clients.email AS client_email,
            clients.contact_number AS client_phone,
            CONCAT(clients.address_line, ', ', clients.city, ', ', clients.postcode) AS client_address,
            
            -- Project Team
            staff.id AS staff_id,
            CONCAT(staff.first_name, ' ', IFNULL(staff.middle_name, ''), ' ', staff.last_name) AS project_manager,
            staff.role AS role,
            staff.contact_number AS staff_contact,
            staff.email AS staff_email
        FROM 
            projects
        JOIN clients ON projects.client_id = clients.id
        JOIN staff ON projects.staff_id = staff.id
        WHERE 
            projects.id = ?
    ");

    // Bind project ID
    $query->bind_param("i", $project_id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $project = $result->fetch_assoc();

        // Now fetch quotes separately
        $quotes_query = $conn->prepare("
            SELECT 
                id AS quote_id,
                quote_amount,
                description AS quote_description,
                created_at
            FROM 
                quotes
            WHERE 
                project_id = ?
        ");

        $quotes_query->bind_param("i", $project_id);
        $quotes_query->execute();
        $quotes_result = $quotes_query->get_result();

        $quotes = [];
        while ($row = $quotes_result->fetch_assoc()) {
            $quotes[] = $row;
        }

        $project['quotes'] = $quotes;

        echo json_encode($project);
    } else {
        echo json_encode(["error" => "No project found"]);
    }
}
?>
