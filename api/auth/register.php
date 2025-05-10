
<?php
// Include CORS and database configuration
include_once '../config/cors.php';
include_once '../config/database.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if (
    !empty($data->email) && 
    !empty($data->password) && 
    !empty($data->name)
) {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();

    // Check if email already exists
    $email_check_query = "SELECT id FROM users WHERE email = ?";
    $email_check_stmt = $db->prepare($email_check_query);
    $email_check_stmt->bindParam(1, $data->email);
    $email_check_stmt->execute();

    if ($email_check_stmt->rowCount() > 0) {
        // Email already exists
        http_response_code(400);
        echo json_encode(array("message" => "Email already in use."));
        exit();
    }

    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    
    // Create user ID (UUID format)
    $user_id = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
    
    // Default role
    $role = "user";

    try {
        // Begin transaction
        $db->beginTransaction();
        
        // Insert user
        $user_query = "INSERT INTO users (
                id, email, password_hash, name, csc_id, csc_name, 
                address, phone, role, created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
            )";
                
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(1, $user_id);
        $user_stmt->bindParam(2, $data->email);
        $user_stmt->bindParam(3, $password_hash);
        $user_stmt->bindParam(4, $data->name);
        $user_stmt->bindParam(5, $data->csc_id ?? null);
        $user_stmt->bindParam(6, $data->csc_name ?? null);
        $user_stmt->bindParam(7, $data->address ?? null);
        $user_stmt->bindParam(8, $data->phone ?? null);
        $user_stmt->bindParam(9, $role);
        
        $user_stmt->execute();
        
        // Create session token
        $token = bin2hex(random_bytes(32));
        
        // Store token
        $token_query = "INSERT INTO user_sessions (user_id, token, created_at) VALUES (?, ?, NOW())";
        $token_stmt = $db->prepare($token_query);
        $token_stmt->bindParam(1, $user_id);
        $token_stmt->bindParam(2, $token);
        $token_stmt->execute();
        
        // Commit transaction
        $db->commit();
        
        // Return success with user data and token
        http_response_code(201);
        echo json_encode(array(
            "status" => "success",
            "session" => array(
                "token" => $token,
                "user" => array(
                    "id" => $user_id,
                    "email" => $data->email,
                    "user_metadata" => array(
                        "role" => $role
                    )
                )
            ),
            "profile" => array(
                "id" => $user_id,
                "name" => $data->name,
                "csc_id" => $data->csc_id ?? null,
                "csc_name" => $data->csc_name ?? null,
                "address" => $data->address ?? null,
                "phone" => $data->phone ?? null,
                "role" => $role
            )
        ));
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $db->rollBack();
        
        http_response_code(500);
        echo json_encode(array(
            "message" => "Unable to create user.",
            "error" => $e->getMessage()
        ));
    }
} else {
    // Data is incomplete
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>
