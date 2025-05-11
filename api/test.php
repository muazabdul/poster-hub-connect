
<?php
// Include CORS configuration
include_once 'config/cors.php';

// Set response content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Send a simple JSON response
echo json_encode(array(
    "status" => "success",
    "message" => "PHP is working correctly"
));
?>
