# Tasks
- Directory Brute-forcing is a technique used to check a lot of paths on a web server to find hidden pages. Which is another name for this? (i) Local File Inclusion, (ii) dir busting, (iii) hash cracking.
	- dir busting
- What switch do we use for nmap's scan to specify that we want to perform version detection
	- -sV
- What does Nmap report is the service identified as running on port 80/tcp?
	- http
- What server name and version of service is running on port 80/tcp?
	- nginx 1.14.2
- What switch do we use to specify to Gobuster we want to perform dir busting specifically?
	- dir
- When using gobuster to dir bust, what switch do we add to make sure it finds PHP pages?
	- -x .php
- What page is found during our dir busting activities?
	- admin.php
- What is the HTTP status code reported by Gobuster for the discovered page?
	- 200
- Submit root flag
	- 6483bee07c1c1d57f14e5b0717503c73


# Steps
- First, we will start off with a rustscan on the machine.
```
rustscan --ulimit 5000 --addresses "10.129.20.131" --top -- -sC -sV
```
- Only one port of 80 is found, in which is appears to be running nginx.
```
PORT   STATE SERVICE REASON         VERSION  
80/tcp open  http    syn-ack ttl 63 nginx 1.14.2  
|_http-server-header: nginx/1.14.2  
| http-methods:    
|_  Supported Methods: GET HEAD  
|_http-title: Welcome to nginx!
```
- Visting it only shows a welcome screen, but that makes us wonder if other possible subdirectories for this exist!
- For this, we can use gobuster, and since ngix uses php, we can filter out for specifically php files:
```
gobuster dir -w `fzf-wordlists` -u http://10.129.20.131 -x php
```
- After selecting a wordlist and running for a while, we are able to get a hit!
```
Gobuster v3.8  
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)  
===============================================================  
[+] Url:                     http://10.129.20.131  
[+] Method:                  GET  
[+] Threads:                 10  
[+] Wordlist:                /opt/lists/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-lowercase-2.3-small.txt  
[+] Negative Status codes:   404  
[+] User Agent:              gobuster/3.8  
[+] Extensions:              php  
[+] Timeout:                 10s  
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/admin.php            (Status: 200) [Size: 999]
```
- Looks like we were able to find an admin page for us to use!
- We then find that the default credentials of admin:admin are enough to get us in and get our flag!
```
6483bee07c1c1d57f14e5b0717503c73
```
