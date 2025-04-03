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
    if (!isset($_POST['room_code']) || !isset($_POST['user_name'])) {
        echo json_encode(["error" => "room_code en user_name zijn verplicht"]);
        exit;
    }
    $room_code = $conn->real_escape_string($_POST['room_code']);
    $user_name = $conn->real_escape_string($_POST['user_name']);

    // Controleer of de room bestaat
    $query = "SELECT id FROM rooms WHERE room_code = '$room_code'";
    $result = $conn->query($query);
    if ($result->num_rows == 0) {
        echo json_encode(["error" => "Room niet gevonden"]);
        exit;
    }
    $room = $result->fetch_assoc();
    $room_id = $room['id'];

    // Controleer of de user_name al in gebruik is in deze room
    $query = "SELECT id FROM room_users WHERE room_id = $room_id AND user_name = '$user_name'";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Naam al in gebruik"]);
        exit;
    }
    
    // Voeg de gebruiker toe aan de room
    $stmt = $conn->prepare("INSERT INTO room_users (room_id, user_name, join_time) VALUES (?, ?, NOW())");
    $stmt->bind_param("is", $room_id, $user_name);
    if ($stmt->execute()) {
        echo json_encode(["message" => "Succesvol gejoind", "room_code" => $room_code, "user_name" => $user_name]);
    } else {
        echo json_encode(["error" => "Kon niet joinen"]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Ongeldige aanvraag"]);
}

$conn->close();
?>
