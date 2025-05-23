<?php
session_start();
header("Content-Type: application/json");


$valid_users = [
    "admin" => "admin123",
    "user1" => "pass1"
];

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (isset($valid_users[$username]) && $valid_users[$username] === $password) {
    $_SESSION['user'] = $username;
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid username or password"
    ]);
}
