<?php
// Inclure le fichier d'aide pour les emails
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
$rawData = file_get_contents('php://input');
if (!$rawData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit();
}

$data = json_decode($rawData, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit();
}

// Validation des champs requis
$required_fields = ['name', 'phone', 'message'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Champ manquant : ' . $field]);
        exit();
    }
}

// Email est recommandé mais pas obligatoire
if (empty($data['email'])) {
    $data['email'] = 'non-fourni@placeholder.com'; // Valeur par défaut pour éviter les erreurs
}

// Sanitize all inputs to prevent XSS
$data = EmailHelper::sanitize($data);

try {
    // Initialize email helper
    $emailHelper = new EmailHelper();
    
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .message-container { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .message-header { margin-bottom: 20px; }
            .message-header img { max-width: 150px; }
            .message-content { margin-bottom: 20px; }
            .message-details { margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class='message-container'>
            <div class='message-header'>
                <h2>Nouveau message de contact</h2>
            </div>
            <div class='message-content'>
                <div class='message-details'>
                    <p><strong>Nom:</strong> {$data['name']}</p>
                    <p><strong>Téléphone:</strong> {$data['phone']}</p>
                    " . ($data['email'] !== 'non-fourni@placeholder.com' ? "<p><strong>Email:</strong> {$data['email']}</p>" : "<p><strong>Email:</strong> Non fourni</p>") . "
                    <p><strong>Sujet:</strong> {$data['subject']}</p>
                </div>
                <div class='message-body'>
                    <p><strong>Message:</strong></p>
                    <p>{$data['message']}</p>
                </div>
            </div>
        </div>
    </body>
    </html>";
    
    // Send email to admin
    $admin_result = $emailHelper->sendEmail(
        $config['email_to'],
        "Nouveau message de contact - {$data['name']}",
        $message,
        $data['email'],
        $data['name']
    );
    
    // Prepare confirmation email for client
    
    // Ne pas envoyer d'email de confirmation si l'email n'est pas fourni
    if ($data['email'] !== 'non-fourni@placeholder.com') {
        $client_message = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .confirmation { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                .footer { margin-top: 20px; color: #666; }
            </style>
        </head>
        <body>
            <h2>Confirmation de réception</h2>
            <div class='confirmation'>
                <p>Cher(e) {$data['name']},</p>
                <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
                <p>Notre équipe vous répondra dans les plus brefs délais.</p>
                
                <div class='footer'>
                    <p>Pour toute question urgente, n'hésitez pas à nous contacter :</p>
                    <p>Téléphone : +221 77 200 44 32<br>
                    Email : info@kikstravel.com</p>
                </div>
            </div>
        </body>
        </html>";
        
        // Send confirmation email to client
        $client_result = $emailHelper->sendEmail(
            $data['email'],
            "Confirmation de réception de votre message - Kiks Travel",
            $client_message
        );
    }
    
    // Check if admin email was sent successfully
    if ($admin_result['success']) {
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => "Une erreur est survenue lors de l'envoi du message",
            'error' => $admin_result['message']
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => "Une erreur est survenue lors de l'envoi du message",
        'error' => $e->getMessage()
    ]);
}
?>
