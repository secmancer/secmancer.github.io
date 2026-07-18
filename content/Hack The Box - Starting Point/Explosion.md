# Tasks
- What does the 3-letter acronym RDP stand for?
	- Remote Desktop Protocol
- What is a 3-letter acronym that refers to interaction with the host through a command line interface?
	- CLI
- What about graphical user interface interactions?
	- GUI
- What is the name of an old remote access tool that came without encryption by default and listens on TCP port 23?
	- telnet
- What is the name of the service running on port 3389 TCP?
	- ms-wbt-server
- What is the switch used to specify the target host's IP address when using xfreerdp?
	- /v:
- What username successfully returns a desktop projection to us with a blank password?
	- administrator
- Submit root flag
	- 951fa96d7830c451b536be5a6be008a0


# Steps
- Let's start off with a rustscan run:
```
rustscan --ulimit 5000 --addresses "10.129.1.13" --top -- -sC -sV
```
- We are given a ton of results, but what is notable is that this machine has RDP running!
```
PORT      STATE SERVICE       REASON          VERSION  
135/tcp   open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
139/tcp   open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn  
445/tcp   open  microsoft-ds? syn-ack ttl 127  
3389/tcp  open  ms-wbt-server syn-ack ttl 127 Microsoft Terminal Services  
| rdp-ntlm-info:    
|   Target_Name: EXPLOSION  
|   NetBIOS_Domain_Name: EXPLOSION  
|   NetBIOS_Computer_Name: EXPLOSION  
|   DNS_Domain_Name: Explosion  
|   DNS_Computer_Name: Explosion  
|   Product_Version: 10.0.17763  
|_  System_Time: 2025-11-21T01:22:34+00:00  
| ssl-cert: Subject: commonName=Explosion  
| Issuer: commonName=Explosion  
| Public Key type: rsa  
| Public Key bits: 2048  
| Signature Algorithm: sha256WithRSAEncryption  
| Not valid before: 2025-11-20T01:19:56  
| Not valid after:  2026-05-22T01:19:56  
| MD5:   2ac736be3b1cad27f110efff7088b63e  
| SHA-1: 333eca52a4443f83cc88410df1acf61f4a694f4b  
| -----BEGIN CERTIFICATE-----  
| MIIC1jCCAb6gAwIBAgIQFEXRfxnJ+pBOwHdsmMj3azANBgkqhkiG9w0BAQsFADAU  
| MRIwEAYDVQQDEwlFeHBsb3Npb24wHhcNMjUxMTIwMDExOTU2WhcNMjYwNTIyMDEx  
| OTU2WjAUMRIwEAYDVQQDEwlFeHBsb3Npb24wggEiMA0GCSqGSIb3DQEBAQUAA4IB  
| DwAwggEKAoIBAQC1S+a9q9BDD9lZp2SdE9KswjSoaVbv6GIIpmMBdEqkkoFY0i5E  
| hv1LCUtYjuz8whsw3HclbTcA1vghhkeDQYhLeujuQE/6BSM93KUjI5u+S9mAyopY  
| 2JsOvg5s18j9vtUULoCO+Qp3FtjNQyplZtv+8NBy5ok3qpcHW0x9k3R7S2peuPoL  
| 2WApt90vJf0JyBJUiwkcwUicu6biSPiuLvQv51VCnQybDGbgQkVlngy6U9Ezj2q2  
| 2ItaBFy7+hZmc6Q7eiALRC0OVCUFKR9dFNo/SIosq237mSBgNfSAOI0zXJrGUwUr  
| uQMhTkr+XFHTpJagpEB6FCPqBSMG2PV0H3wZAgMBAAGjJDAiMBMGA1UdJQQMMAoG  
| CCsGAQUFBwMBMAsGA1UdDwQEAwIEMDANBgkqhkiG9w0BAQsFAAOCAQEAF6/Qe/i/  
| V8u/RjiKEKjzvaRL4QJnBkN2ubU6h0BdercvsMYkWHiqt7gQc85sqm3JOM4nLv60  
| clqrUeuIfGa4MA2epiYHlOGvIeNiv+DSNyguvJ675BWzv4Q5p/5Gccw6JBVLYonf  
| V9n0efrygenRsjmluxXeEsW7+5hjM/ZGznejRObhrHHTJ+YI9e6h+aYWejw3cpmh  
| WoRAOcF5vhmNpU3djvqAIjB1r3Vfqh2H0Ehj3y14y0NyArO0O0TxzHHonr1/tSI/  
| eI+wWMhCTLFDxrPun/t7D0P7YYwXxBP0DTwXaBAwJP1zdaRJn7jYzCUqSa/v7HP8  
| 7u31USHZz9ExsA==  
|_-----END CERTIFICATE-----  
|_ssl-date: 2025-11-21T01:22:41+00:00; 0s from scanner time.  
5985/tcp  open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)  
|_http-server-header: Microsoft-HTTPAPI/2.0  
|_http-title: Not Found  
47001/tcp open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)  
|_http-server-header: Microsoft-HTTPAPI/2.0  
|_http-title: Not Found  
49664/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49665/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49666/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49667/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49668/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49669/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49670/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49671/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows  
  
Host script results:  
|_clock-skew: mean: 0s, deviation: 0s, median: 0s  
| smb2-time:    
|   date: 2025-11-21T01:22:38  
|_  start_date: N/A  
| p2p-conficker:    
|   Checking for Conficker.C or higher...  
|   Check 1 (port 37798/tcp): CLEAN (Couldn't connect)  
|   Check 2 (port 28667/tcp): CLEAN (Couldn't connect)  
|   Check 3 (port 8460/udp): CLEAN (Failed to receive data)  
|   Check 4 (port 50597/udp): CLEAN (Timeout)  
|_  0/4 checks are positive: Host is CLEAN or ports are blocked  
| smb2-security-mode:    
|   311:    
|_    Message signing enabled but not required
```
- This means we can use xfreerdp to connect to the machine no problem.
- We can use the /v to specify the host and then /u to specify the user we want to connect as.
```
xfreerdp /u:administrator /v:10.129.1.13
```
- We didn't need a password, so we were able to finally connect and get our flag!
```
951fa96d7830c451b536be5a6be008a0
```

