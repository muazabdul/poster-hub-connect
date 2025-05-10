
<?php
// Include CORS and database configuration
include_once '../config/cors.php';
include_once '../config/database.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$database = new Database();
$db = $database->getConnection();

try {
    // Get the latest settings
    $query = "SELECT id, payment, appearance, updated_at, created_at
              FROM settings
              ORDER BY updated_at DESC
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Process JSON fields
        $payment = json_decode($row['payment']);
        $appearance = json_decode($row['appearance']);
        
        $settings = array(
            "id" => $row['id'],
            "payment" => $payment,
            "appearance" => $appearance,
            "updated_at" => $row['updated_at'],
            "created_at" => $row['created_at']
        );
        
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "data" => $settings
        ));
    } else {
        // No settings found, return default
        $default_settings = array(
            "payment" => array(
                "provider" => "razorpay",
                "apiKey" => "",
                "apiSecret" => "",
                "testMode" => true
            ),
            "appearance" => array(
                "logo" => null,
                "navigationLinks" => array(
                    array("name" => "Home", "url" => "/"),
                    array("name" => "Dashboard", "url" => "/dashboard")
                ),
                "copyrightText" => "© 2023 CSC Portal. All rights reserved.",
                "socialLinks" => array()
            )
        );
        
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "data" => $default_settings
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error retrieving settings",
        "error" => $e->getMessage()
    ));
}
?>
