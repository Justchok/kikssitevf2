<?php
namespace PHPMailer\PHPMailer;

class PHPMailer {
    public $Host;
    public $SMTPAuth;
    public $Username;
    public $Password;
    public $SMTPSecure;
    public $Port;
    public $CharSet;
    public $From;
    public $FromName;
    public $Subject;
    public $Body;
    public $isHTML = false;
    private $to = [];
    private $replyTo = [];

    const ENCRYPTION_SMTPS = 'ssl';

    public function __construct($exceptions = false) {
        $this->CharSet = 'UTF-8';
    }

    public function isSMTP() {
        // Configuration par défaut pour IONOS
        $this->SMTPSecure = self::ENCRYPTION_SMTPS;
        $this->Port = 465;
    }

    public function setFrom($address, $name = '') {
        $this->From = $address;
        $this->FromName = $name;
    }

    public function addAddress($address, $name = '') {
        $this->to[] = ['address' => $address, 'name' => $name];
    }

    public function addReplyTo($address, $name = '') {
        $this->replyTo[] = ['address' => $address, 'name' => $name];
    }

    public function send() {
        $to = implode(', ', array_column($this->to, 'address'));
        $subject = $this->Subject;
        $message = $this->Body;
        
        $headers = [
            'From: ' . ($this->FromName ? "{$this->FromName} <{$this->From}>" : $this->From),
            'Reply-To: ' . ($this->replyTo ? $this->replyTo[0]['address'] : $this->From),
            'MIME-Version: 1.0',
            'Content-Type: ' . ($this->isHTML ? 'text/html' : 'text/plain') . '; charset=' . $this->CharSet,
            'X-Mailer: PHP/' . phpversion()
        ];

        return mail($to, $subject, $message, implode("\r\n", $headers));
    }
}
