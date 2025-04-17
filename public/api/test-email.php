<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/html; charset=UTF-8');

// Inclure le fichier de configuration
require_once 'config.php';

// Inclure PHPMailer
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';
require_once 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Fonction pour tester l'envoi d'email
function testEmail($type = 'contact') {
    global $config;
    
    $result = ['success' => false, 'message' => ''];
    
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_user'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';
        
        $mail->setFrom($config['smtp_user'], 'Kiks Travel Test');
        $mail->addAddress($config['email_to']);
        
        $mail->isHTML(true);
        $mail->Subject = "Test d'envoi d'email - " . ucfirst($type);
        
        $message = "<h2>Test d'envoi d'email</h2>";
        $message .= "<p>Ceci est un test d'envoi d'email pour le formulaire de " . $type . ".</p>";
        $message .= "<p>Date et heure du test : " . date('Y-m-d H:i:s') . "</p>";
        
        $mail->Body = $message;
        $mail->AltBody = strip_tags($message);
        
        $mail->send();
        $result['success'] = true;
        $result['message'] = "Email de test envoyé avec succès pour le formulaire de " . $type;
    } catch (Exception $e) {
        $result['message'] = "Erreur lors de l'envoi de l'email : " . $e->getMessage();
    }
    
    return $result;
}

// Tester tous les types de formulaires
$formTypes = ['contact', 'offre', 'reservation'];
$results = [];

foreach ($formTypes as $type) {
    $results[$type] = testEmail($type);
}

// Afficher les résultats
echo "<!DOCTYPE html>\n";
echo "<html lang='fr'>\n";
echo "<head>\n";
echo "    <meta charset='UTF-8'>\n";
echo "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n";
echo "    <title>Test d'envoi d'emails - Kiks Travel</title>\n";
echo "    <style>\n";
echo "        body { font-family: Arial, sans-serif; margin: 20px; }\n";
echo "        h1 { color: #333; }\n";
echo "        .result { margin: 20px 0; padding: 15px; border-radius: 5px; }\n";
echo "        .success { background-color: #d4edda; color: #155724; }\n";
echo "        .error { background-color: #f8d7da; color: #721c24; }\n";
echo "        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow: auto; }\n";
echo "    </style>\n";
echo "</head>\n";
echo "<body>\n";
echo "    <h1>Test d'envoi d'emails - Kiks Travel</h1>\n";
echo "    <p>Cette page teste l'envoi d'emails pour les différents formulaires du site.</p>\n";

echo "    <h2>Configuration SMTP</h2>\n";
echo "    <pre>\n";
echo "Host: " . $config['smtp_host'] . "\n";
echo "User: " . $config['smtp_user'] . "\n";
echo "Password: " . str_repeat('*', strlen($config['smtp_password'])) . "\n";
echo "    </pre>\n";

echo "    <h2>Résultats des tests</h2>\n";

foreach ($results as $type => $result) {
    $class = $result['success'] ? 'success' : 'error';
    echo "    <div class='result $class'>\n";
    echo "        <h3>Formulaire de " . ucfirst($type) . "</h3>\n";
    echo "        <p>" . $result['message'] . "</p>\n";
    echo "    </div>\n";
}

echo "    <p><a href='../index.html'>Retour au site</a></p>\n";
echo "</body>\n";
echo "</html>\n";
?>
