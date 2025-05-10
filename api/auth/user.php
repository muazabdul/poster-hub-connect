
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
        // Check if token is valid
        $session_query = "SELECT user_id FROM user_sessions WHERE token = ? AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)";
        $session_stmt = $db->prepare($session_query);
        $session_stmt->bindParam(1, $auth_token);
        $session_stmt->execute();
        
        if ($session_stmt->rowCount() > 0) {
            $session = $session_stmt->fetch(PDO::FETCH_ASSOC);
            $user_id = $session['user_id'];
            
            // Get user data
            $user_query = "SELECT id, name, email, csc_id, csc_name, address, phone, role FROM users WHERE id = ?";
            $user_stmt = $db->prepare($user_query);
            $user_stmt->bindParam(1, $user_id);
            $user_stmt->execute();
            
            if ($user_stmt->rowCount() > 0) {
                $user = $user_stmt->fetch(PDO::FETCH_ASSOC);
                
                http_response_code(200);
                echo json_encode(array(
                    "status" => "success",
                    "session" => array(
                        "token" => $auth_token,
                        "user" => array(
                            "id" => $user['id'],
                            "email" => $user['email'],
                            "user_metadata" => array(
                                "role" => $user['role']
                            )
                        )
                    ),
                    "profile" => array(
                        "id" => $user['id'],
                        "name" => $user['name'],
                        "csc_id" => $user['csc_id'],
                        "csc_name" => $user['csc_name'],
                        "address" => $user['address'],
                        "phone" => $user['phone'],
                        "role" => $user['role']
                    )
                ));
            } else {
                // User not found
                http_response_code(404);
                echo json_encode(array("message" => "User not found."));
            }
        } else {
            // Invalid or expired token
            http_response_code(401);
            echo json_encode(array("message" => "Invalid or expired token."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "message" => "Error retrieving user data",
            "error" => $e->getMessage()
        ));
    }
} else {
    // No token provided
    http_response_code(401);
    echo json_encode(array("message" => "No authentication token provided"));
}
?>
