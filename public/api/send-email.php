<?php
require_once 'email-helper.php';

header('Content-Type: application/json');

// Set CORS headers - dynamically use the current domain or allow Railway domain
$allowed_origins = [
    'https://kikstravel.com',
    'http://localhost:3000',
    'https://kikssitevf2-production.up.railway.app' // Ajoutez ici votre domaine Railway
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Récupération des données du formulaire
$raw_data = file_get_contents('php://input');
if (!$raw_data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit();
}

$data = json_decode($raw_data, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'departure', 'destination', 'departureDate', 'returnDate', 'passengers'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
        exit();
    }
}

// Sanitize all inputs to prevent XSS
$data = EmailHelper::sanitize($data);

// Message pour l'administrateur
$admin_message = "
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2>Nouvelle demande de réservation</h2>
    <div style='background: #f9f9f9; padding: 20px; border-radius: 5px;'>
        <p><strong>Nom :</strong> {$data['name']}</p>
        <p><strong>Email :</strong> {$data['email']}</p>
        <p><strong>Téléphone :</strong> {$data['phone']}</p>
        <p><strong>Départ :</strong> {$data['departure']}</p>
        <p><strong>Destination :</strong> {$data['destination']}</p>
        <p><strong>Date de départ :</strong> {$data['departureDate']}</p>
        <p><strong>Date de retour :</strong> {$data['returnDate']}</p>
        <p><strong>Nombre de passagers :</strong> {$data['passengers']}</p>
        " . (!empty($data['message']) ? "<p><strong>Message :</strong> {$data['message']}</p>" : "") . "
    </div>
</body>
</html>";

// Message pour le client
$client_message = "
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2>Confirmation de votre demande de réservation</h2>
    <div style='background: #f9f9f9; padding: 20px; border-radius: 5px;'>
        <p>Cher(e) {$data['name']},</p>
        <p>Nous avons bien reçu votre demande de réservation. Voici un récapitulatif :</p>
        <p><strong>Départ :</strong> {$data['departure']}</p>
        <p><strong>Destination :</strong> {$data['destination']}</p>
        <p><strong>Date de départ :</strong> {$data['departureDate']}</p>
        <p><strong>Date de retour :</strong> {$data['returnDate']}</p>
        <p><strong>Nombre de passagers :</strong> {$data['passengers']}</p>
        
        <div style='margin-top: 20px; color: #666;'>
            <p>Notre équipe vous contactera dans les plus brefs délais pour finaliser votre réservation.</p>
            <p>Pour toute question, n'hésitez pas à nous contacter :</p>
            <p>Téléphone : +221 77 200 44 32<br>
            Email : info@kikstravel.com</p>
        </div>
    </div>
</body>
</html>";

// Initialize email helper
$emailHelper = new EmailHelper();

// Send email to admin
$admin_result = $emailHelper->sendEmail(
    $config['email_to'],
    "Nouvelle réservation de voyage - {$data['name']}",
    $admin_message,
    $data['email'],
    $data['name']
);

// Send confirmation email to client
$client_result = $emailHelper->sendEmail(
    $data['email'],
    "Confirmation de votre demande de réservation - Kiks Travel",
    $client_message
);

// Return response
if ($admin_result['success'] && $client_result['success']) {
    echo json_encode(['success' => true, 'message' => 'Emails envoyés avec succès']);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de l\'envoi des emails',
        'admin_error' => $admin_result['success'] ? null : $admin_result['message'],
        'client_error' => $client_result['success'] ? null : $client_result['message']
    ]);
}
?>
