<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    // Configuration de PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Active le debugging détaillé
    $mail->Host = 'smtp.ionos.fr';
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->Username = 'info@kikstravel.com';
    $mail->Password = 'Ktravel&tours1!';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->CharSet = 'UTF-8';

    // Configuration de l'email
    $mail->setFrom('info@kikstravel.com', 'Kiks Travel');
    $mail->addAddress('info@kikstravel.com');
    $mail->Subject = 'Test Email IONOS SMTP - ' . date('Y-m-d H:i:s');
    $mail->isHTML(true);

    // Corps de l'email
    $mail->Body = "
    <html>
    <body style='font-family: Arial, sans-serif;'>
        <h2>Test d'envoi d'email via SMTP IONOS</h2>
        <div style='background: #f9f9f9; padding: 20px; border-radius: 5px;'>
            <p>Ceci est un email de test envoyé le " . date('d/m/Y à H:i:s') . "</p>
            <p>Configuration utilisée :</p>
            <ul>
                <li>Serveur SMTP : smtp.ionos.fr</li>
                <li>Port : 465</li>
                <li>Sécurité : SMTPS (SSL)</li>
                <li>Authentification : Oui</li>
                <li>Compte : info@kikstravel.com</li>
            </ul>
            <p>Si vous recevez cet email, la configuration SMTP fonctionne correctement.</p>
        </div>
    </body>
    </html>";

    // Envoi de l'email
    $mail->send();
    
    echo "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;'>";
    echo "<h1 style='color: green;'>Email envoyé avec succès !</h1>";
    echo "<p>Vérifiez la boîte de réception de info@kikstravel.com</p>";
    echo "<p><strong>Détails techniques :</strong></p>";
    echo "<pre style='background: #f9f9f9; padding: 10px;'>";
    echo "Serveur SMTP : smtp.ionos.fr\n";
    echo "Port : 465\n";
    echo "Sécurité : SMTPS (SSL)\n";
    echo "Compte : info@kikstravel.com\n";
    echo "</pre>";
    echo "</div>";

} catch (Exception $e) {
    echo "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;'>";
    echo "<h1 style='color: red;'>Erreur lors de l'envoi de l'email</h1>";
    echo "<p>Message d'erreur : " . $e->getMessage() . "</p>";
    echo "</div>";
}
?>
