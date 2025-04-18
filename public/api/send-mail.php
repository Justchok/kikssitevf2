<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';
require_once 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    // Récupérer les données du formulaire
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('Données invalides');
    }

    // Créer l'instance de PHPMailer
    $mail = new PHPMailer(true);
    
    // Configuration du serveur SMTP
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';

    // Expéditeur et destinataire
    $mail->setFrom('info@kikstravel.com', 'Kiks Travel');
    $mail->addAddress('info@kikstravel.com');
    $mail->addReplyTo($data['email'], $data['name']);

    // Contenu de l'email
    $mail->isHTML(true);
    
    // Déterminer le type d'email
    if (isset($data['offerTitle'])) {
        // Email de réservation d'offre
        $mail->Subject = "Nouvelle réservation : {$data['offerTitle']}";
        $message = "
            <h2>Nouvelle réservation</h2>
            <p><strong>Offre:</strong> {$data['offerTitle']}</p>
            <p><strong>Nom:</strong> {$data['name']}</p>
            <p><strong>Email:</strong> {$data['email']}</p>
            <p><strong>Téléphone:</strong> {$data['phone']}</p>
            <p><strong>Message:</strong><br>{$data['message']}</p>
        ";
    } else {
        // Email de contact
        $mail->Subject = "Nouveau message de contact - {$data['name']}";
        $message = "
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> {$data['name']}</p>
            <p><strong>Email:</strong> {$data['email']}</p>
            <p><strong>Téléphone:</strong> " . ($data['phone'] ?? 'Non renseigné') . "</p>
            <p><strong>Message:</strong><br>{$data['message']}</p>
        ";
    }
    
    $mail->Body = $message;
    $mail->AltBody = strip_tags($message);

    // Envoi de l'email
    $mail->send();

    // Email de confirmation au client
    $clientMail = new PHPMailer(true);
    $clientMail->isSMTP();
    $clientMail->Host = $config['smtp_host'];
    $clientMail->SMTPAuth = true;
    $clientMail->Username = $config['smtp_user'];
    $clientMail->Password = $config['smtp_password'];
    $clientMail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $clientMail->Port = 465;
    $clientMail->CharSet = 'UTF-8';

    $clientMail->setFrom('info@kikstravel.com', 'Kiks Travel');
    $clientMail->addAddress($data['email'], $data['name']);

    $clientMail->isHTML(true);
    
    if (isset($data['offerTitle'])) {
        $clientMail->Subject = "Confirmation de votre réservation - {$data['offerTitle']}";
        $clientMessage = "
            <h2>Confirmation de votre réservation</h2>
            <p>Cher(e) {$data['name']},</p>
            <p>Nous avons bien reçu votre demande de réservation pour l'offre \"{$data['offerTitle']}\" et nous vous en remercions.</p>
            <p>Notre équipe va étudier votre demande et vous recontactera dans les plus brefs délais.</p>
            <p>Récapitulatif de votre demande :</p>
            <ul>
                <li>Offre : {$data['offerTitle']}</li>
                <li>Nom : {$data['name']}</li>
                <li>Email : {$data['email']}</li>
                <li>Téléphone : {$data['phone']}</li>
                <li>Message : {$data['message']}</li>
            </ul>
            <p>Cordialement,<br>L'équipe Kiks Travel</p>
        ";
    } else {
        $clientMail->Subject = "Confirmation de votre message - Kiks Travel";
        $clientMessage = "
            <h2>Confirmation de votre message</h2>
            <p>Cher(e) {$data['name']},</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <p>Notre équipe va l'étudier et vous recontactera dans les plus brefs délais.</p>
            <p>Récapitulatif de votre message :</p>
            <ul>
                <li>Nom : {$data['name']}</li>
                <li>Email : {$data['email']}</li>
                <li>Téléphone : " . ($data['phone'] ?? 'Non renseigné') . "</li>
                <li>Message : {$data['message']}</li>
            </ul>
            <p>Cordialement,<br>L'équipe Kiks Travel</p>
        ";
    }
    
    $clientMail->Body = $clientMessage;
    $clientMail->AltBody = strip_tags($clientMessage);

    $clientMail->send();

    // Réponse de succès
    echo json_encode([
        'success' => true,
        'message' => isset($data['offerTitle']) ? 'Votre demande de réservation a été envoyée avec succès !' : 'Votre message a été envoyé avec succès !'
    ]);

} catch (Exception $e) {
    // Réponse d'erreur
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Une erreur est survenue : {$e->getMessage()}"
    ]);
}
