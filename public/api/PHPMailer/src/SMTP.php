<?php

/**
 * PHPMailer RFC821 SMTP email transport class.
 * PHP Version 5.5.
 *
 * @see       https://github.com/PHPMailer/PHPMailer/ The PHPMailer GitHub project
 *
 * @author    Marcus Bointon (Synchro/coolbru) <phpmailer@synchromedia.co.uk>
 * @author    Jim Jagielski (jimjag) <jimjag@gmail.com>
 * @author    Andy Prevost (codeworxtech) <codeworxtech@users.sourceforge.net>
 * @author    Brent R. Matzelle (original founder)
 * @copyright 2012 - 2020 Marcus Bointon
 * @copyright 2010 - 2012 Jim Jagielski
 * @copyright 2004 - 2009 Andy Prevost
 * @license   http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 * @note      This program is distributed in the hope that it will be useful - WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.
 */

namespace PHPMailer\PHPMailer;

/**
 * PHPMailer RFC821 SMTP email transport class.
 * Implements RFC 821 SMTP commands and provides some utility methods for sending mail to an SMTP server.
 *
 * @author Chris Ryan
 * @author Marcus Bointon <phpmailer@synchromedia.co.uk>
 */
class SMTP
{
    const VERSION = '6.8.0';
    const CRLF = "\r\n";
    const DEFAULT_SMTP_PORT = 25;
    const MAX_LINE_LENGTH = 998;
    const MAX_REPLY_LENGTH = 512;
    const DEBUG_OFF = 0;
    const DEBUG_CLIENT = 1;
    const DEBUG_SERVER = 2;
    const DEBUG_CONNECTION = 3;
    const DEBUG_LOWLEVEL = 4;

    /**
     * Debug output level.
     * Options:
     * * self::DEBUG_OFF (`0`) No debug output, default
     * * self::DEBUG_CLIENT (`1`) Client commands
     * * self::DEBUG_SERVER (`2`) Client commands and server responses
     * * self::DEBUG_CONNECTION (`3`) As DEBUG_SERVER plus connection status
     * * self::DEBUG_LOWLEVEL (`4`) Low-level data output, all messages.
     *
     * @var int
     */
    public $do_debug = self::DEBUG_OFF;

    /**
     * How to handle debug output.
     * Options:
     * * `echo` Output plain-text as-is, appropriate for CLI
     * * `html` Output escaped, line breaks converted to `<br>`, appropriate for browser output
     * * `error_log` Output to error log as configured in php.ini
     * * callable PHP function that takes a string parameter and displays it somehow.
     *
     * @var string|callable
     */
    public $Debugoutput = 'echo';

    /**
     * The function/method to use for debugging output.
     * Options: 'echo', 'html' or 'error_log'.
     *
     * @var string
     */
    public $Timeout = 300;
    public $Timelimit = 300;

    protected $smtp_conn;
    protected $error = '';
    protected $helo_rply = '';
    protected $last_reply = '';

    protected function get_lines()
    {
        if (!is_resource($this->smtp_conn)) {
            return '';
        }
        $data = '';
        $endtime = 0;
        stream_set_timeout($this->smtp_conn, $this->Timeout);
        if ($this->Timelimit > 0) {
            $endtime = time() + $this->Timelimit;
        }
        $selR = [$this->smtp_conn];
        $selW = null;
        while (is_resource($this->smtp_conn) && !feof($this->smtp_conn)) {
            if (!stream_select($selR, $selW, $selW, $this->Timeout)) {
                $this->error = ['error' => 'Timeout'];
                return false;
            }
            $str = @fgets($this->smtp_conn, self::MAX_REPLY_LENGTH);
            $data .= $str;
            if (!empty($str) && $str[strlen($str) - 1] === "\n") {
                break;
            }
            if ($endtime && time() > $endtime) {
                $this->error = ['error' => 'Timeout'];
                return false;
            }
        }
        return $data;
    }

    public function connect($host, $port = null, $timeout = 30, $options = [])
    {
        $this->error = '';
        if ($this->connected()) {
            $this->error = ['error' => 'Already connected to a server'];
            return false;
        }
        if (empty($port)) {
            $port = self::DEFAULT_SMTP_PORT;
        }
        $this->smtp_conn = @fsockopen(
            $host,
            $port,
            $errno,
            $errstr,
            $timeout
        );
        if (empty($this->smtp_conn)) {
            $this->error = ['error' => 'Failed to connect to server',
                           'errno' => $errno,
                           'errstr' => $errstr];
            return false;
        }
        stream_set_timeout($this->smtp_conn, $timeout, 0);
        return true;
    }

    public function startTLS()
    {
        if (!$this->sendCommand('STARTTLS', 'STARTTLS', 220)) {
            return false;
        }
        $crypto_method = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT;
        }
        if (!stream_socket_enable_crypto(
            $this->smtp_conn,
            true,
            $crypto_method
        )) {
            return false;
        }
        return true;
    }

    public function authenticate($username, $password)
    {
        $this->error = '';
        if (!$this->connected()) {
            $this->error = ['error' => 'Not connected'];
            return false;
        }
        return $this->sendCommand(
            'Username',
            'AUTH LOGIN',
            334
        ) && $this->sendCommand(
            'Password',
            base64_encode($password),
            235
        );
    }

    public function connected()
    {
        if (is_resource($this->smtp_conn)) {
            $sock_status = stream_get_meta_data($this->smtp_conn);
            if ($sock_status['eof']) {
                $this->error = ['error' => 'EOF caught while checking if connected'];
                return false;
            }
            return true;
        }
        return false;
    }

    public function close()
    {
        $this->error = '';
        if ($this->connected()) {
            fclose($this->smtp_conn);
            $this->smtp_conn = null;
        }
    }

    protected function sendCommand($command, $commandstring, $expect)
    {
        if (!$this->connected()) {
            $this->error = ['error' => "Called $command without being connected"];
            return false;
        }
        fwrite($this->smtp_conn, $commandstring . self::CRLF);
        $reply = $this->get_lines();
        $code = substr($reply, 0, 3);
        if ($code != $expect) {
            $this->error = ['error' => "$command command failed",
                           'smtp_code' => $code,
                           'detail' => substr($reply, 4)];
            return false;
        }
        return true;
    }
}
