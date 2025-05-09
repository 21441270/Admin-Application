<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle insert quote
    $data = json_decode(file_get_contents('php://input'), true);

    $clientId = intval($data['client_id']);
    $projectId = intval($data['project_id']);
    $quoteAmount = floatval($data['quote_amount']);
    $description = $conn->real_escape_string($data['quote_description']);
    $requirements = $data['requirements']; // array of requirements

    $response = [];

    $conn->begin_transaction();

    try {
        // Insert into quotes
        $insertQuoteSql = "INSERT INTO quotes (client_id, project_id, quote_amount, description) 
                           VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuoteSql);
        $stmt->bind_param("iids", $clientId, $projectId, $quoteAmount, $description);
        $stmt->execute();

        // Get the newly inserted quote ID
        $quoteId = $stmt->insert_id;

        // Insert requirements using both project_id and quote_id
        $insertReqSql = "INSERT INTO requirements (project_id, quote_id, requirement_text) VALUES (?, ?, ?)";
        $reqStmt = $conn->prepare($insertReqSql);

        foreach ($requirements as $req) {
            $reqText = $conn->real_escape_string($req['requirement_text']);
            $reqStmt->bind_param("iis", $projectId, $quoteId, $reqText);
            $reqStmt->execute();
        }

        $conn->commit();
        $response['success'] = true;
        $response['quote_id'] = $quoteId;
    } catch (Exception $e) {
        $conn->rollback();
        $response['success'] = false;
        $response['error'] = $e->getMessage();
    }

    echo json_encode($response);
    exit; // 🔑 Stop script after POST response
}

// Handle GET (fetch quotes)
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
