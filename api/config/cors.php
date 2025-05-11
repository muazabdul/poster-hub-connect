
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

// Allow from any origin during development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
?>
