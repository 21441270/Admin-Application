<?php
header("Content-Type: application/json");
session_start();
echo json_encode([
  "loggedIn" => isset($_SESSION['user'])
]);
