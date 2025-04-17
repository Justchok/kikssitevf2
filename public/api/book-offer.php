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
    
    // Validation des champs requis
    $required_fields = ['name', 'phone', 'offerTitle'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            throw new Exception('Champ manquant : ' . $field);
        }
    }
    
    // Email est recommandé mais pas obligatoire
    if (empty($data['email'])) {
        $data['email'] = 'non-fourni@placeholder.com'; // Valeur par défaut pour éviter les erreurs
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
    $mail->addAddress('info@kikstravel.com'); // Email de l'admin
    $mail->addReplyTo($data['email'], $data['name']);

    // Contenu de l'email
    $mail->isHTML(true);
    $mail->Subject = "Nouvelle réservation - {$data['offerTitle']}";
    
    // Corps du message
    $message = "
        <h2>Nouvelle demande de réservation</h2>
        <p><strong>Offre:</strong> {$data['offerTitle']}</p>
        
        <h3>Informations de voyage</h3>
        <p><strong>Date de départ:</strong> " . (isset($data['departureDate']) ? $data['departureDate'] : 'Non spécifiée') . "</p>
        <p><strong>Date de retour:</strong> " . (isset($data['returnDate']) ? $data['returnDate'] : 'Non spécifiée') . "</p>
        
        <h3>Passagers</h3>
        <p><strong>Adultes (12+ ans):</strong> " . (isset($data['adultsCount']) ? $data['adultsCount'] : '1') . "</p>
        <p><strong>Enfants (2-11 ans):</strong> " . (isset($data['childrenCount']) ? $data['childrenCount'] : '0') . "</p>
        <p><strong>Bébés (0-2 ans):</strong> " . (isset($data['infantsCount']) ? $data['infantsCount'] : '0') . "</p>
        <p><strong>Classe de voyage:</strong> " . (isset($data['cabin']) ? ucfirst($data['cabin']) : 'Économique') . "</p>
        
        <h3>Contact</h3>
        <p><strong>Nom:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Téléphone:</strong> {$data['phone']}</p>
        <p><strong>Message:</strong><br>{$data['message']}</p>
    ";
    
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
    $clientMail->Subject = "Confirmation de votre demande - {$data['offerTitle']}";
    
    $clientMessage = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .confirmation { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                .recap { margin-top: 20px; }
                .section { margin-top: 15px; }
                .footer { margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class='confirmation'>
                <h2>Confirmation de votre demande de réservation</h2>
                <p>Cher(e) {$data['name']},</p>
                <p>Nous avons bien reçu votre demande de réservation pour l'offre '{$data['offerTitle']}'.</p>
                <p>Notre équipe va étudier votre demande et vous recontactera dans les plus brefs délais.</p>
                
                <div class='recap'>
                    <h3>Récapitulatif de votre demande :</h3>
                    
                    <div class='section'>
                        <h4>Offre</h4>
                        <p>{$data['offerTitle']}</p>
                    </div>
                    
                    <div class='section'>
                        <h4>Dates</h4>
                        <p><strong>Départ:</strong> " . (isset($data['departureDate']) ? $data['departureDate'] : 'Non spécifiée') . "</p>
                        <p><strong>Retour:</strong> " . (isset($data['returnDate']) ? $data['returnDate'] : 'Non spécifiée') . "</p>
                    </div>
                    
                    <div class='section'>
                        <h4>Passagers</h4>
                        <p><strong>Adultes (12+ ans):</strong> " . (isset($data['adultsCount']) ? $data['adultsCount'] : '1') . "</p>
                        <p><strong>Enfants (2-11 ans):</strong> " . (isset($data['childrenCount']) ? $data['childrenCount'] : '0') . "</p>
                        <p><strong>Bébés (0-2 ans):</strong> " . (isset($data['infantsCount']) ? $data['infantsCount'] : '0') . "</p>
                        <p><strong>Classe de voyage:</strong> " . (isset($data['cabin']) ? ucfirst($data['cabin']) : 'Économique') . "</p>
                    </div>
                    
                    <div class='section'>
                        <h4>Contact</h4>
                        <p><strong>Nom:</strong> {$data['name']}</p>
                        <p><strong>Email:</strong> {$data['email']}</p>
                        <p><strong>Téléphone:</strong> {$data['phone']}</p>
                    </div>
                    
                    " . (!empty($data['message']) ? "<div class='section'>
                        <h4>Message</h4>
                        <p>{$data['message']}</p>
                    </div>" : "") . "
                </div>
                
                <div class='footer'>
                    <p>Pour toute question, n'hésitez pas à nous contacter :</p>
                    <p>Téléphone : +221 77 200 44 32<br>
                    Email : info@kikstravel.com</p>
                    <p>Cordialement,<br>L'équipe Kiks Travel</p>
                </div>
            </div>
        </body>
        </html>
    ";
    
    $clientMail->Body = $clientMessage;
    $clientMail->AltBody = strip_tags($clientMessage);

    $clientMail->send();

    // Réponse de succès
    echo json_encode([
        'success' => true,
        'message' => 'Votre demande a été envoyée avec succès !'
    ]);

} catch (Exception $e) {
    // Réponse d'erreur
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Une erreur est survenue : {$e->getMessage()}"
    ]);
}
