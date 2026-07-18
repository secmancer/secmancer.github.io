# Tasks
- Which service version is found to be running on port 80?
	- nginx 1.14.2
- What is the 3-digit HTTP status code returned when you visit http://{machine IP}/?
	- 302
- What is the virtual host name the webpage expects to be accessed by?
	- ignition.htb
- What is the full path to the file on a Linux computer that holds a local list of domain name to IP address pairs?
	- /etc/hosts
- Use a tool to brute force directories on the webserver. What is the full URL to the Magento login page?
	- http://ignition.htb/admin
- Look up the password requirements for Magento and also try searching for the most common passwords of 2023. Which password provides access to the admin account?
	- qwerty123
- Submit root flag
	- 797d6c988d9dc5865e010b9410f247e0


# Steps
- First, let's start with a rustscan
```
rustscan --ulimit 5000 --addresses "10.129.1.27" --top -- -sC -sV
```
- From the results, we can see that it's only a web server that redirects to ignition.htb.
```
PORT   STATE SERVICE REASON         VERSION  
80/tcp open  http    syn-ack ttl 63 nginx 1.14.2  
|_http-server-header: nginx/1.14.2  
| http-methods:    
|_  Supported Methods: GET HEAD POST  
|_http-title: Did not follow redirect to http://ignition.htb/
```
- After adding that to /etc/hosts, we can visit the website with no problem
- We can see that it's a Luma CMS instance. However, nothing else shows up. So, let's run gobuster to see if anything else comes up
```
gobuster dir --url http://ignition.htb --wordlist `fzf-wordlists`
```
- We are able to find the existence of an admin panel
```
===============================================================  
Starting gobuster in directory enumeration mode  
===============================================================  
/contact              (Status: 200) [Size: 28673]  
/home                 (Status: 200) [Size: 25802]  
/media                (Status: 301) [Size: 185] [--> http://ignition.htb/media/]  
/0                    (Status: 200) [Size: 25803]  
/catalog              (Status: 302) [Size: 0] [--> http://ignition.htb/]  
/static               (Status: 301) [Size: 185] [--> http://ignition.htb/static/]  
/admin                (Status: 200) [Size: 7092]  
/Home                 (Status: 301) [Size: 0] [--> http://ignition.htb/home]
```
- From the login page, we are able to use the default credentials of admin/qwerty123 to get into the dashboard
- We are then able to get our flag!
```
Congratulations, your flag is: 797d6c988d9dc5865e010b9410f247e0
```
