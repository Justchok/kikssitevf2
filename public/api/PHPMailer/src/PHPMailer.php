<?php
namespace PHPMailer\PHPMailer;

class PHPMailer {
    const CHARSET_ASCII = 'us-ascii';
    const CHARSET_ISO88591 = 'iso-8859-1';
    const CHARSET_UTF8 = 'utf-8';

    const CONTENT_TYPE_PLAINTEXT = 'text/plain';
    const CONTENT_TYPE_TEXT_CALENDAR = 'text/calendar';
    const CONTENT_TYPE_TEXT_HTML = 'text/html';
    const CONTENT_TYPE_MULTIPART_ALTERNATIVE = 'multipart/alternative';
    const CONTENT_TYPE_MULTIPART_MIXED = 'multipart/mixed';
    const CONTENT_TYPE_MULTIPART_RELATED = 'multipart/related';

    const ENCODING_7BIT = '7bit';
    const ENCODING_8BIT = '8bit';
    const ENCODING_BASE64 = 'base64';
    const ENCODING_BINARY = 'binary';
    const ENCODING_QUOTED_PRINTABLE = 'quoted-printable';

    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';

    protected $Priority;
    protected $CharSet = self::CHARSET_UTF8;
    protected $ContentType = self::CONTENT_TYPE_PLAINTEXT;
    protected $Encoding = self::ENCODING_8BIT;
    protected $ErrorInfo = '';
    protected $From = '';
    protected $FromName = '';
    protected $Sender = '';
    protected $Subject = '';
    protected $Body = '';
    protected $AltBody = '';
    protected $Mailer = 'mail';
    protected $WordWrap = 0;
    protected $Hostname = '';
    protected $MessageID = '';
    protected $MessageDate = '';
    protected $Host = 'localhost';
    protected $Port = 25;
    protected $Username = '';
    protected $Password = '';
    protected $SMTPAuth = false;
    protected $SMTPSecure = '';
    protected $SMTPAutoTLS = true;
    protected $SMTPOptions = [];
    protected $Timeout = 300;
    protected $SMTPDebug = 0;
    protected $Debugoutput = 'echo';
    protected $SMTPKeepAlive = false;
    protected $SingleTo = false;
    protected $SingleToArray = [];
    protected $do_verp = false;
    protected $AllowEmpty = false;
    protected $DKIM_selector = '';
    protected $DKIM_identity = '';
    protected $DKIM_passphrase = '';
    protected $DKIM_domain = '';
    protected $DKIM_copyHeaderFields = true;
    protected $DKIM_extraHeaders = [];
    protected $DKIM_private = '';
    protected $DKIM_private_string = '';
    protected $action_function = '';
    protected $XMailer = '';
    protected $smtp = null;
    protected $to = [];
    protected $cc = [];
    protected $bcc = [];
    protected $ReplyTo = [];
    protected $all_recipients = [];
    protected $attachment = [];
    protected $CustomHeader = [];
    protected $lastMessageID = '';
    protected $message_type = '';
    protected $boundary = [];
    protected $language = [];
    protected $error_count = 0;
    protected $sign_cert_file = '';
    protected $sign_key_file = '';
    protected $sign_extracerts_file = '';
    protected $sign_key_pass = '';
    protected $exceptions = false;
    protected $uniqueid = '';

    public function __construct($exceptions = null) {
        if (null !== $exceptions) {
            $this->exceptions = (bool)$exceptions;
        }
        $this->Debugoutput = function($str, $level) {
            error_log("PHPMailer Debug: $str");
        };
    }

    public function isSMTP() {
        $this->Mailer = 'smtp';
    }

    public function setFrom($address, $name = '') {
        $this->From = $address;
        $this->FromName = $name;
    }

    public function addAddress($address, $name = '') {
        $this->to[] = [$address, $name];
    }

    public function Subject($subject) {
        $this->Subject = $subject;
    }

    public function Body($body) {
        $this->Body = $body;
    }

    public function isHTML($ishtml = true) {
        if ($ishtml) {
            $this->ContentType = self::CONTENT_TYPE_TEXT_HTML;
        } else {
            $this->ContentType = self::CONTENT_TYPE_PLAINTEXT;
        }
    }

    public function send() {
        try {
            if (!$this->smtp) {
                $this->smtp = new SMTP;
            }
            
            $this->smtp->do_debug = $this->SMTPDebug;
            
            if (!$this->smtp->connect($this->Host, $this->Port)) {
                throw new Exception('Failed to connect to server');
            }
            
            if (!$this->smtp->hello($this->Hostname)) {
                throw new Exception('Failed to send HELO command');
            }
            
            if ($this->SMTPAuth) {
                if (!$this->smtp->authenticate($this->Username, $this->Password)) {
                    throw new Exception('Failed to authenticate');
                }
            }
            
            foreach ($this->to as $toaddr) {
                list($addr, $name) = $toaddr;
                if (!$this->smtp->mail($this->From)) {
                    throw new Exception('Failed to set sender: ' . $this->From);
                }
                if (!$this->smtp->recipient($addr)) {
                    throw new Exception('Failed to add recipient: ' . $addr);
                }
                if (!$this->smtp->data($this->Body)) {
                    throw new Exception('Failed to send data');
                }
            }
            
            $this->smtp->quit();
            return true;
        } catch (Exception $e) {
            $this->ErrorInfo = $e->getMessage();
            error_log("PHPMailer Error: " . $this->ErrorInfo);
            if ($this->exceptions) {
                throw $e;
            }
            return false;
        }
    }
}
