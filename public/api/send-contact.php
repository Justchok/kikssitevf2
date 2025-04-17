<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Inclure le fichier de configuration
require_once 'config.php';
// Les informations SMTP sont maintenant dans config.php

// Récupération des données du formulaire
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit;
}

// Validation des champs requis
$required_fields = ['name', 'phone', 'message'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Champ manquant : ' . $field]);
        exit;
    }
}

// Email est recommandé mais pas obligatoire
if (empty($data['email'])) {
    $data['email'] = 'non-fourni@placeholder.com'; // Valeur par défaut pour éviter les erreurs
}

// Envoi des emails avec PHPMailer
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';
require_once 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    // Email pour l'administrateur
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('info@kikstravel.com', 'Kiks Travel');
    $mail->addAddress('info@kikstravel.com');
    $mail->addReplyTo($data['email'], $data['name']);
    
    $mail->Subject = "Nouveau message de contact - {$data['name']}";
    $mail->isHTML(true);
    
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
    
    $mail->Body = $message;
    $mail->send();

    // Email de confirmation pour le client
    $mail_client = new PHPMailer(true);
    $mail_client->isSMTP();
    $mail_client->Host = $config['smtp_host'];
    $mail_client->SMTPAuth = true;
    $mail_client->Username = $config['smtp_user'];
    $mail_client->Password = $config['smtp_password'];
    $mail_client->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail_client->Port = 465;
    $mail_client->CharSet = 'UTF-8';

    $mail_client->setFrom('info@kikstravel.com', 'Kiks Travel');
    $mail_client->addAddress($data['email'], $data['name']);
    
    $mail_client->Subject = "Confirmation de réception de votre message - Kiks Travel";
    $mail_client->isHTML(true);
    
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
        
        $mail_client->Body = $client_message;
        $mail_client->send();
    }
    
    // L'envoi de l'email de confirmation est déjà géré dans la condition ci-dessus

    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => "Une erreur est survenue lors de l'envoi du message",
        'debug' => $e->getMessage()
    ]);
}
?>
