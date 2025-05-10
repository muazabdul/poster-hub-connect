
<?php
// Include CORS and database configuration
include_once '../config/cors.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Allow for image uploads
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if a file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(array("message" => "No file uploaded or upload error occurred."));
        exit;
    }
    
    // Check file type
    $allowed_types = array('image/jpeg', 'image/png', 'image/gif', 'image/webp');
    $file_type = $_FILES['image']['type'];
    
    if (!in_array($file_type, $allowed_types)) {
        http_response_code(400);
        echo json_encode(array("message" => "Only image files (JPEG, PNG, GIF, WEBP) are allowed."));
        exit;
    }
    
    // Check file size (5MB limit)
    $max_size = 5 * 1024 * 1024; // 5MB
    if ($_FILES['image']['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(array("message" => "File size exceeds the 5MB limit."));
        exit;
    }
    
    // Get bucket/folder information
    $bucket = isset($_POST['bucket']) ? $_POST['bucket'] : 'uploads';
    $folder = isset($_POST['folder']) ? trim($_POST['folder'], '/') : 'images';
    
    // Create directory structure if it doesn't exist
    $upload_dir = "../../uploads/{$bucket}/{$folder}/";
    
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    // Generate a unique filename
    $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $unique_id = bin2hex(random_bytes(16));
    $new_filename = $unique_id . '.' . $file_extension;
    
    $file_path = $upload_dir . $new_filename;
    
    // Move the uploaded file
    if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
        $public_url = "/uploads/{$bucket}/{$folder}/{$new_filename}";
        
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "publicUrl" => $public_url,
            "filename" => $new_filename,
            "bucket" => $bucket,
            "folder" => $folder
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to upload file."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
