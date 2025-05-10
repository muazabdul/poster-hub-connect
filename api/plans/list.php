
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
    // Get active plans
    $query = "SELECT id, name, description, price, interval, features, active, created_at, updated_at
              FROM plans
              WHERE active = 1
              ORDER BY price";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    $plans = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Parse features JSON
        $features = json_decode($row['features']);
        
        $plan_item = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "description" => $row['description'],
            "price" => (float)$row['price'],
            "interval" => $row['interval'],
            "features" => $features,
            "active" => (bool)$row['active'],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at']
        );
        $plans[] = $plan_item;
    }

    // Return the plans
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "data" => $plans
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error retrieving plans",
        "error" => $e->getMessage()
    ));
}
?>
