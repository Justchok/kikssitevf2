<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'public/api/PHPMailer/src/Exception.php';
require 'public/api/PHPMailer/src/PHPMailer.php';
require 'public/api/PHPMailer/src/SMTP.php';

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
    $mail->addAddress('info@kikstravel.com'); // Email de test
    $mail->Subject = 'Test Email - ' . date('Y-m-d H:i:s');
    $mail->isHTML(true);
    
    // Corps de l'email
    $mail->Body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .test-email { background: #f9f9f9; padding: 20px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='test-email'>
            <h2>Email de Test</h2>
            <p>Ceci est un email de test envoyé le " . date('d/m/Y à H:i:s') . "</p>
            <p>Si vous recevez cet email, cela signifie que la configuration SMTP fonctionne correctement.</p>
        </div>
    </body>
    </html>";

    // Envoi de l'email
    if (!$mail->send()) {
        throw new Exception('Erreur lors de l\'envoi de l\'email : ' . $mail->ErrorInfo);
    }

    echo "Email de test envoyé avec succès !\n";
    echo "Vérifiez la boîte de réception de info@kikstravel.com\n";

} catch (Exception $e) {
    echo "ERREUR : " . $e->getMessage() . "\n";
}
?>
