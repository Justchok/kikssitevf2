<?php
// Load environment variables from .env file if in local environment
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if present
        if (strpos($value, '"') === 0 && strrpos($value, '"') === strlen($value) - 1) {
            $value = substr($value, 1, -1);
        }
        
        if (!getenv($name)) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
        }
    }
    return true;
}

// Try to load from .env file (only if not in Railway)
// Railway automatically sets environment variables
$envPath = __DIR__ . '/.env';
loadEnv($envPath);

// Configuration SMTP
$config = [
    'smtp_host' => getenv('SMTP_HOST') ?: 'smtp.ionos.fr',
    'smtp_user' => getenv('SMTP_USER') ?: 'info@kikstravel.com',
    'smtp_password' => getenv('SMTP_PASSWORD') ?: '',
    'email_to' => getenv('EMAIL_TO') ?: 'info@kikstravel.com'
];
?>
