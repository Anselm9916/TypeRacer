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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (!isset($_GET['room_code'])) {
        echo json_encode(["error" => "room_code is verplicht"]);
        exit;
    }
    $room_code = $conn->real_escape_string($_GET['room_code']);
    $query = "SELECT id FROM rooms WHERE room_code = '$room_code'";
    $result = $conn->query($query);
    if ($result->num_rows == 0) {
        echo json_encode(["error" => "Room niet gevonden"]);
        exit;
    }
    $room = $result->fetch_assoc();
    $room_id = $room['id'];
    
    // Haal de gebruikers op die in de room zitten
    $users = [];
    $query = "SELECT user_name, join_time FROM room_users WHERE room_id = $room_id ORDER BY join_time ASC";
    $result = $conn->query($query);
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    echo json_encode(["room_code" => $room_code, "users" => $users]);
} else {
    echo json_encode(["error" => "Ongeldige aanvraag"]);
}

$conn->close();
?>
