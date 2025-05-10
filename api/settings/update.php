
<?php
// Include CORS and database configuration
include_once '../config/cors.php';
include_once '../config/database.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if (!empty($data)) {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();

    try {
        // Prepare payment and appearance JSON
        $payment_json = json_encode($data->payment);
        $appearance_json = json_encode($data->appearance);
        
        if (isset($data->id)) {
            // Update existing settings
            $query = "UPDATE settings SET 
                      payment = ?, appearance = ?, updated_at = NOW()
                      WHERE id = ?";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $payment_json);
            $stmt->bindParam(2, $appearance_json);
            $stmt->bindParam(3, $data->id);
        } else {
            // Create new settings
            // Generate UUID
            $id = sprintf(
                '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
            
            $query = "INSERT INTO settings (id, payment, appearance, created_at, updated_at)
                      VALUES (?, ?, ?, NOW(), NOW())";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
            $stmt->bindParam(2, $payment_json);
            $stmt->bindParam(3, $appearance_json);
        }
        
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "message" => "Settings updated successfully",
            "id" => $data->id ?? $id
        ));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "message" => "Error updating settings",
            "error" => $e->getMessage()
        ));
    }
} else {
    // Data is incomplete
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update settings. Data is incomplete."));
}
?>
