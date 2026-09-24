<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

$conn = getConnection();

$stmt = $conn->prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
$stmt->bind_param('s', $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Thanks for subscribing to Luxury Beauty!']);
} else {
    if ($conn->errno === 1062) { // duplicate entry
        echo json_encode(['success' => true, 'message' => 'You are already subscribed.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Could not subscribe: ' . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>
