<?php
// Load environment variables if not already loaded
if (!isset($_ENV['ALLOW_ORIGIN']) && file_exists($_SERVER['DOCUMENT_ROOT'] . '/.env')) {
    $env_lines = file($_SERVER['DOCUMENT_ROOT'] . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($env_lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!empty($name)) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
        }
    }
}

// Get allowed origins from environment variable or default to all
$allow_origin = getenv('ALLOW_ORIGIN') ?: '*';

// Allow from specified origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // If ALLOW_ORIGIN is *, allow any origin
    if ($allow_origin === '*') {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    } 
    // Otherwise check if the origin is allowed
    else {
        $allowed_origins = explode(',', $allow_origin);
        if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        }
    }
    
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
?>
