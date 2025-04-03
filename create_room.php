<?php
ini_set('display_errors', 0);
error_reporting(0);
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "rooms";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database verbinding mislukt"]));
}

// Opschonen van lege rooms ouder dan 5 minuten
$cleanupQuery = "DELETE rooms FROM rooms LEFT JOIN room_users ON rooms.id = room_users.room_id 
    WHERE rooms.created_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE) AND room_users.room_id IS NULL";
$conn->query($cleanupQuery);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $room_code = isset($_POST['room_code']) ? $conn->real_escape_string($_POST['room_code']) : null;
    if (!$room_code) {
        // Genereer een random 6-karakter alfanumerieke code
        $room_code = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6);
    }
    $stmt = $conn->prepare("INSERT INTO rooms (room_code, created_at) VALUES (?, NOW())");
    $stmt->bind_param("s", $room_code);
    if ($stmt->execute()) {
        echo json_encode(["message" => "Room aangemaakt", "room_code" => $room_code]);
    } else {
        echo json_encode(["error" => "Room aanmaken mislukt"]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Ongeldige aanvraag"]);
}

$conn->close();
?>
