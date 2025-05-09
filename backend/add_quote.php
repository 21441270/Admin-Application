<?php
include 'db.php';
header('Content-Type: application/json');

// Read JSON input
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
?>
