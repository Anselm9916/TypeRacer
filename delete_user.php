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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_POST['room_code']) || !isset($_POST['user_name'])) {
        echo json_encode(["error" => "room_code en user_name zijn verplicht"]);
        exit;
    }
    $room_code = $conn->real_escape_string($_POST['room_code']);
    $user_name = $conn->real_escape_string($_POST['user_name']);

    // Haal het room-id op
    $query = "SELECT id FROM rooms WHERE room_code = '$room_code'";
    $result = $conn->query($query);
    if ($result->num_rows == 0) {
        echo json_encode(["error" => "Room niet gevonden"]);
        exit;
    }
    $room = $result->fetch_assoc();
    $room_id = $room['id'];

    // Controleer of de gebruiker in de room zit
    $query = "SELECT id FROM room_users WHERE room_id = $room_id AND user_name = '$user_name'";
    $result = $conn->query($query);
    if ($result->num_rows == 0) {
        echo json_encode(["error" => "Gebruiker niet gevonden in de room"]);
        exit;
    }
    
    // Verwijder de gebruiker uit de room
    $stmt = $conn->prepare("DELETE FROM room_users WHERE room_id = ? AND user_name = ?");
    $stmt->bind_param("is", $room_id, $user_name);
    if ($stmt->execute()) {
        // Update de room datum naar het huidige moment
        $updateRoomQuery = "UPDATE rooms SET created_at = NOW() WHERE id = ?";
        $stmtUpdate = $conn->prepare($updateRoomQuery);
        $stmtUpdate->bind_param("i", $room_id);
        $stmtUpdate->execute();
        $stmtUpdate->close();

        echo json_encode(["message" => "Gebruiker verwijderd en room datum geüpdatet"]);
    } else {
        echo json_encode(["error" => "Kon gebruiker niet verwijderen"]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Ongeldige aanvraag"]);
}

$conn->close();
?>
