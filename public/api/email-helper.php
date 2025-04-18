<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class EmailHelper {
    private $mailer;
    private $config;
    
    public function __construct() {
        global $config;
        $this->config = $config;
        $this->mailer = new PHPMailer(true);
        
        // Server settings
        $this->mailer->isSMTP();
        $this->mailer->Host = $this->config['smtp_host'];
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = $this->config['smtp_user'];
        $this->mailer->Password = $this->config['smtp_password'];
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $this->mailer->Port = 465;
        $this->mailer->CharSet = 'UTF-8';
        
        // Default sender
        $this->mailer->setFrom($this->config['smtp_user'], 'Kiks Travel');
    }
    
    /**
     * Send an email
     * 
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $htmlBody HTML content of the email
     * @param string $replyTo Reply-to email address (optional)
     * @param string $replyToName Reply-to name (optional)
     * @return array Success status and message
     */
    public function sendEmail($to, $subject, $htmlBody, $replyTo = null, $replyToName = null) {
        try {
            // Reset recipients
            $this->mailer->clearAllRecipients();
            $this->mailer->clearReplyTos();
            
            // Recipients
            $this->mailer->addAddress($to);
            
            // Reply-to if provided
            if ($replyTo) {
                $this->mailer->addReplyTo($replyTo, $replyToName ?: '');
            }
            
            // Content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = $subject;
            $this->mailer->Body = $htmlBody;
            
            // Create plain text version from HTML
            $this->mailer->AltBody = strip_tags(str_replace('<br>', "\n", $htmlBody));
            
            // Send email
            $this->mailer->send();
            return ['success' => true, 'message' => 'Email sent successfully'];
            
        } catch (Exception $e) {
            return [
                'success' => false, 
                'message' => 'Email could not be sent. Error: ' . $this->mailer->ErrorInfo
            ];
        }
    }
    
    /**
     * Sanitize input to prevent XSS attacks
     * 
     * @param string|array $input Input to sanitize
     * @return string|array Sanitized input
     */
    public static function sanitize($input) {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                $input[$key] = self::sanitize($value);
            }
            return $input;
        }
        
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}
