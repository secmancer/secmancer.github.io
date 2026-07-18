# Questions
- At a glance, what protocol seems to be suspect in this attack?
	- DNS
- There seems to be a lot of traffic between our host and another, what is the IP address of the suspect host?
	- 192.168.157.145
- What is the first command the attacker sends to the client?
	- whoami
- What is the version of the DNS tunneling tool the attacker is using?
	- 0.07
- The attackers attempts to rename the tool they accidentally left on the clients host. What do they name it to?
	- win_installer.exe
- The attacker attempts to enumerate the users cloud storage. How many files do they locate in their cloud storage directory?
	- C:\users\test\documents\client data optimisation\ user details.csv
- What is the full location of the PII file that was stolen?
	- C:\users\test\documents\client data optimisation\user details.csv
- Exactly how many customer PII records were stolen?
	- 721


# Notes
- After unzipping the file, we are only given a pcap file named suspicious_traffic
- Well, that will keep it easy! We'll go ahead and open it up with WIreshark
- First, we need to determine the protocol used during this attack
- Looking at the protocols, we have a good amount of DNS requests happening from the attacker
- Looking at the conversation statistics, we see that a lot of the traffic was occurring between 192.168.157.144 and 192.168.157.145
- 192.168.157.145, is our specific suspect host
![[Screenshot_20251203_122522.png]]
- We can use this to filter out the packets even more
```
ip.addr == 192.168.157.144 && ip.addr == 192.168.157.145 && dns.qry.name.len > 100
```
- We can pull out the name of the query, and put it into CyberChef, in which we get PII leakage
![[Screenshot_20251203_123353.png]]
- However, we can see overall that all of the DNS packets can be converted from hex to see what is going on
- We can dump out the contents first:
```
tcpdump -nr suspicious_traffic.pcap port 53 -w dns.pcap
```
- And then convert all of that into hex, we can see that whoami is the first command ran
![[Screenshot_20251203_132240.png]]
- Next, we need to get the version of the DNS tunneling tool. We can grab that from this dump
![[Screenshot_20251203_132457.png]]
- Next, we need to name the tool that they left on the host. We know this already, as it's right there: win_installer.exe
- Are are then asked if they found anything on the cloud storage. Luckily, they came up empty handed
![[Screenshot_20251203_132817.png]]
 - Next, the file path to the PII file is asked.
 - We are able to find it as: C:\users\test\documents\client data optimisation\ user details.csv
![[Screenshot_20251203_132954.png]]
- Finally, we need to determine the amount of records that were stolen. Doing the count, we are able to determine that 721 users had their information stolen from the breach.