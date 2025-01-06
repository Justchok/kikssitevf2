<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Récupération des données du formulaire
$data = json_decode(file_get_contents('php://input'), true);

// Configuration des en-têtes pour l'email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Kiks Travel <info@kikstravel.com>\r\n";
$headers .= "Reply-To: {$data['email']}\r\n";

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

// Envoi des emails
$admin_sent = mail(
    "info@kikstravel.com",
    "Nouvelle réservation de voyage - {$data['name']}",
    $admin_message,
    $headers
);

$client_sent = mail(
    $data['email'],
    "Confirmation de votre demande de réservation - Kiks Travel",
    $client_message,
    $headers
);

if ($admin_sent && $client_sent) {
    echo json_encode(['success' => true, 'message' => 'Emails envoyés avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi des emails']);
}
?>
