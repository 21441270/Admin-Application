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


if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Handle update quote
    $data = json_decode(file_get_contents('php://input'), true);

    $quoteId = intval($data['quote_id']);
    $clientId = intval($data['client_id']);
    $projectId = intval($data['project_id']);
    $quoteAmount = floatval($data['quote_amount']);
    $description = $conn->real_escape_string($data['quote_description']);
    $requirements = $data['requirements'];

    $response = [];

    $conn->begin_transaction();

    try {
        // Update quote
        $updateQuoteSql = "UPDATE quotes SET client_id = ?, project_id = ?, quote_amount = ?, description = ? WHERE id = ?";
        $stmt = $conn->prepare($updateQuoteSql);
        $stmt->bind_param("iidsi", $clientId, $projectId, $quoteAmount, $description, $quoteId);
        $stmt->execute();

        // Get current requirement IDs from DB
        $existingReqIds = [];
        $result = $conn->query("SELECT id FROM requirements WHERE quote_id = $quoteId");
        while ($row = $result->fetch_assoc()) {
            $existingReqIds[] = intval($row['id']);
        }

        // Prepare insert and update statements
        $insertReqSql = "INSERT INTO requirements (project_id, quote_id, requirement_text) VALUES (?, ?, ?)";
        $insertStmt = $conn->prepare($insertReqSql);

        $updateReqSql = "UPDATE requirements SET requirement_text = ? WHERE id = ?";
        $updateStmt = $conn->prepare($updateReqSql);

        foreach ($requirements as $req) {
            $reqText = $conn->real_escape_string($req['requirement_text']);

            if (empty($req['requirement_id']) || !in_array(intval($req['requirement_id']), $existingReqIds)) {
                // New requirement
                $insertStmt->bind_param("iis", $projectId, $quoteId, $reqText);
                $insertStmt->execute();
            } else {
                // Existing requirement - update
                $reqId = intval($req['requirement_id']);
                $updateStmt->bind_param("si", $reqText, $reqId);
                $updateStmt->execute();
            }
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
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Read the raw DELETE data
    parse_str(file_get_contents("php://input"), $data);

    // Handle requirement deletion
    if (!empty($data['requirement_id'])) {
        $requirementId = intval($data['requirement_id']);
        $sql = "DELETE FROM requirements WHERE id = $requirementId";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Requirement deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
        }
        exit;
    }

    // Handle quote deletion
    if (!empty($data['id'])) {
        $quoteId = intval($data['id']);
        $sql = "DELETE FROM quotes WHERE id = $quoteId";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Quote deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
        }
        exit;
    }

    // If neither ID is set
    echo json_encode(["status" => "error", "message" => "Missing ID for deletion"]);
    exit;
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
