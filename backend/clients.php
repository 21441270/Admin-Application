<?php
include 'db.php';
header('Content-Type: application/json');

// Handle GET request: Fetch client list
$sql = "SELECT 
            id, 
            first_name,
            middle_name,
            last_name,
            CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) AS name, 
            contact_number, 
            email,
            address_line,
            city,
            postcode,
            CONCAT(address_line, ', ', city, ', ', postcode) AS address 
        FROM clients";

$result = $conn->query($sql);

$clients = array();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $clients[] = $row;
    }
}

echo json_encode(["data" => $clients]);

// Handle POST request: Insert new client
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;

    if (!$data || empty($data['first_name']) || empty($data['last_name']) || empty($data['contact_number']) || empty($data['address_line'])  || empty($data['city']) || empty($data['postcode'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    $first_name = $conn->real_escape_string($data["first_name"]);
    $middle_name = isset($data["middle_name"]) ? $conn->real_escape_string($data["middle_name"]) : "";
    $last_name = $conn->real_escape_string($data["last_name"]);
    $contact_number = $conn->real_escape_string($data["contact_number"]);
    $email = isset($data["email"]) ? $conn->real_escape_string($data["email"]) : "";
    $address_line = $conn->real_escape_string($data["address_line"]);
    $city = $conn->real_escape_string($data["city"]);
    $postcode = $conn->real_escape_string($data["postcode"]);

    $sql = "INSERT INTO clients (first_name, middle_name, last_name, contact_number, email, address_line, city, postcode)
            VALUES ('$first_name', '$middle_name', '$last_name', '$contact_number', '$email', '$address_line', '$city', '$postcode')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Client added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }

    exit;
}

// Handle PUT request: Update existing client
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Parse PUT data (not in $_POST)
    parse_str(file_get_contents("php://input"), $data);

    if (empty($data['id']) || empty($data['first_name']) || empty($data['last_name']) ||
        empty($data['contact_number']) || empty($data['address_line']) || empty($data['city']) || empty($data['postcode'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    $id = intval($data["id"]);
    $first_name = $conn->real_escape_string($data["first_name"]);
    $middle_name = isset($data["middle_name"]) ? $conn->real_escape_string($data["middle_name"]) : "";
    $last_name = $conn->real_escape_string($data["last_name"]);
    $contact_number = $conn->real_escape_string($data["contact_number"]);
    $email = isset($data["email"]) ? $conn->real_escape_string($data["email"]) : "";
    $address_line = $conn->real_escape_string($data["address_line"]);
    $city = $conn->real_escape_string($data["city"]);
    $postcode = $conn->real_escape_string($data["postcode"]);

    $sql = "UPDATE clients SET 
                first_name='$first_name', 
                middle_name='$middle_name', 
                last_name='$last_name', 
                contact_number='$contact_number', 
                email='$email',
                address_line='$address_line',
                city='$city',
                postcode='$postcode'
            WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Client updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }

    exit;
}

// Handle DELETE request: Delete a client
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Read the raw POST data
    parse_str(file_get_contents("php://input"), $data);

    // Check if the ID is provided
    if (empty($data['id'])) {
        echo json_encode(["status" => "error", "message" => "Missing client ID"]);
        exit;
    }

    // Get the client ID and delete the record from the clients table
    $id = intval($data['id']);
    $sql = "DELETE FROM clients WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Client deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }

    exit;
}




?>
