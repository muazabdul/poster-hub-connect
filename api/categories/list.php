
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
    // Get all categories
    $query = "SELECT id, name, description, thumbnail, created_at, updated_at
              FROM categories
              ORDER BY name";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    $categories = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Count posters for this category
        $count_query = "SELECT COUNT(*) as count FROM posters WHERE category_id = ? AND active = 1";
        $count_stmt = $db->prepare($count_query);
        $count_stmt->bindParam(1, $row['id']);
        $count_stmt->execute();
        $count_row = $count_stmt->fetch(PDO::FETCH_ASSOC);
        
        $category_item = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "description" => $row['description'],
            "thumbnail" => $row['thumbnail'],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at'],
            "count" => (int)$count_row['count']
        );
        $categories[] = $category_item;
    }

    // Return the categories
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "data" => $categories
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error retrieving categories",
        "error" => $e->getMessage()
    ));
}
?>
