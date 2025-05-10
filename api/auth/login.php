
<?php
// Include CORS and database configuration
include_once '../config/cors.php';
include_once '../config/database.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if (!empty($data->email) && !empty($data->password)) {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();

    // Prepare query
    $query = "SELECT id, name, email, csc_id, csc_name, address, phone, role, password_hash FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->email);
    $stmt->execute();

    // Check if user exists
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (password_verify($data->password, $row['password_hash'])) {
            // Create session token
            $token = bin2hex(random_bytes(32));
            $user_id = $row['id'];
            
            // Store token in database
            $token_query = "INSERT INTO user_sessions (user_id, token, created_at) VALUES (?, ?, NOW())";
            $token_stmt = $db->prepare($token_query);
            $token_stmt->bindParam(1, $user_id);
            $token_stmt->bindParam(2, $token);
            $token_stmt->execute();
            
            // Return success with user data and token
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "session" => array(
                    "token" => $token,
                    "user" => array(
                        "id" => $row['id'],
                        "email" => $row['email'],
                        "user_metadata" => array(
                            "role" => $row['role']
                        )
                    )
                ),
                "profile" => array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "csc_id" => $row['csc_id'],
                    "csc_name" => $row['csc_name'],
                    "address" => $row['address'],
                    "phone" => $row['phone'],
                    "role" => $row['role']
                )
            ));
        } else {
            // Password does not match
            http_response_code(401);
            echo json_encode(array("message" => "Invalid credentials."));
        }
    } else {
        // User does not exist
        http_response_code(401);
        echo json_encode(array("message" => "Invalid credentials."));
    }
} else {
    // Data is incomplete
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}
?>
