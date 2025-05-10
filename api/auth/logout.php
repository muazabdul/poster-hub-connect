
<?php
// Include CORS and database configuration
include_once '../config/cors.php';
include_once '../config/database.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Get auth token from header
$headers = getallheaders();
$auth_token = null;

if (isset($headers['Authorization'])) {
    $auth_parts = explode(' ', $headers['Authorization']);
    if (count($auth_parts) === 2 && strtolower($auth_parts[0]) === 'bearer') {
        $auth_token = $auth_parts[1];
    }
}

if ($auth_token) {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();

    try {
        // Delete the session
        $query = "DELETE FROM user_sessions WHERE token = ?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $auth_token);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(array("message" => "Successfully logged out"));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "message" => "Error during logout",
            "error" => $e->getMessage()
        ));
    }
} else {
    // No token provided
    http_response_code(401);
    echo json_encode(array("message" => "No authentication token provided"));
}
?>
