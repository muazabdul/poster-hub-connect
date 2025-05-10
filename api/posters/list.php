
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
    // Parse query parameters
    $category_id = isset($_GET['category']) ? $_GET['category'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    // Base query
    $query = "SELECT p.id, p.title, p.image_url, p.description, p.service_url, p.category_id, c.name as category_name, 
              p.created_at, p.active 
              FROM posters p 
              LEFT JOIN categories c ON p.category_id = c.id 
              WHERE 1=1";
    $params = array();
    $param_types = array();

    // Add category filter
    if ($category_id) {
        $query .= " AND p.category_id = ?";
        $params[] = $category_id;
    }

    // Add search filter
    if ($search) {
        $query .= " AND (p.title LIKE ? OR p.description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    // Active items only
    $query .= " AND p.active = 1";

    // Add sorting
    $query .= " ORDER BY p.created_at DESC";

    // Add pagination
    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    // Prepare and execute query
    $stmt = $db->prepare($query);
    
    // Bind parameters
    for ($i = 0; $i < count($params); $i++) {
        $stmt->bindParam($i + 1, $params[$i]);
    }
    
    $stmt->execute();

    $posters = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $poster_item = array(
            "id" => $row['id'],
            "title" => $row['title'],
            "image_url" => $row['image_url'],
            "description" => $row['description'],
            "service_url" => $row['service_url'],
            "category_id" => $row['category_id'],
            "category_name" => $row['category_name'],
            "created_at" => $row['created_at'],
            "active" => (bool)$row['active']
        );
        $posters[] = $poster_item;
    }

    // Return the posters
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "data" => $posters,
        "count" => count($posters)
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error retrieving posters",
        "error" => $e->getMessage()
    ));
}
?>
