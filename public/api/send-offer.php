<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration SMTP IONOS
$smtp_host = 'smtp.ionos.fr';
$smtp_port = 465;
$smtp_username = 'info@kikstravel.com';
$smtp_password = 'Ktravel&tours1!';

// Récupération des données du formulaire
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit;
}

// Validation des champs requis
$required_fields = ['name', 'email', 'phone', 'offerTitle', 'departureDate', 'passengers'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Champ manquant : ' . $field]);
        exit;
    }
}

// Envoi des emails avec PHPMailer
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    // Email pour l'administrateur
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $smtp_port;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('info@kikstravel.com', 'Kiks Travel');
    $mail->addAddress('info@kikstravel.com');
    $mail->addReplyTo($data['email'], $data['name']);
    
    $mail->Subject = "Nouvelle demande pour l'offre : {$data['offerTitle']}";
    $mail->isHTML(true);
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .offer { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .detail { margin: 10px 0; }
        </style>
    </head>
    <body>
        <h2>Nouvelle demande pour une offre spéciale</h2>
        <div class='offer'>
            <div class='detail'><strong>Offre :</strong> {$data['offerTitle']}</div>
            <div class='detail'><strong>Nom :</strong> {$data['name']}</div>
            <div class='detail'><strong>Email :</strong> {$data['email']}</div>
            <div class='detail'><strong>Téléphone :</strong> {$data['phone']}</div>
            <div class='detail'><strong>Date de départ :</strong> {$data['departureDate']}</div>
            <div class='detail'><strong>Nombre de passagers :</strong> {$data['passengers']}</div>
            " . (!empty($data['message']) ? "<div class='detail'><strong>Message :</strong><br>{$data['message']}</div>" : "") . "
        </div>
    </body>
    </html>";
    
    $mail->Body = $message;
    $mail->send();

    // Email de confirmation pour le client
    $mail_client = new PHPMailer(true);
    $mail_client->isSMTP();
    $mail_client->Host = $smtp_host;
    $mail_client->SMTPAuth = true;
    $mail_client->Username = $smtp_username;
    $mail_client->Password = $smtp_password;
    $mail_client->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail_client->Port = $smtp_port;
    $mail_client->CharSet = 'UTF-8';

    $mail_client->setFrom('info@kikstravel.com', 'Kiks Travel');
    $mail_client->addAddress($data['email'], $data['name']);
    
    $mail_client->Subject = "Confirmation de votre intérêt pour l'offre : {$data['offerTitle']}";
    $mail_client->isHTML(true);
    
    $client_message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .confirmation { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .detail { margin: 10px 0; }
            .footer { margin-top: 20px; color: #666; }
        </style>
    </head>
    <body>
        <h2>Confirmation de votre demande</h2>
        <div class='confirmation'>
            <p>Cher(e) {$data['name']},</p>
            <p>Nous avons bien reçu votre demande concernant l'offre suivante :</p>
            <div class='detail'><strong>Offre :</strong> {$data['offerTitle']}</div>
            <div class='detail'><strong>Date de départ souhaitée :</strong> {$data['departureDate']}</div>
            <div class='detail'><strong>Nombre de passagers :</strong> {$data['passengers']}</div>
            
            <div class='footer'>
                <p>Notre équipe vous contactera très prochainement pour discuter des détails de cette offre.</p>
                <p>Pour toute question, n'hésitez pas à nous contacter :</p>
                <p>Téléphone : +221 77 200 44 32<br>
                Email : info@kikstravel.com</p>
            </div>
        </div>
    </body>
    </html>";
    
    $mail_client->Body = $client_message;
    $mail_client->send();

    echo json_encode(['success' => true, 'message' => 'Demande envoyée avec succès']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => "Une erreur est survenue lors de l'envoi de la demande",
        'debug' => $e->getMessage()
    ]);
}
?>
