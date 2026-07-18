# Questions
- The SOC Team suspects that an adversary is lurking in their environment and are using PsExec to move laterally. A junior SOC Analyst specifically reported the usage of PsExec on a WorkStation. How many times was PsExec executed by the attacker on the system?
	- 9
- What is the name of the service binary dropped by PsExec tool allowing attacker to execute remote commands?
	- psexesvc.exe
- Now we have confirmed that PsExec ran multiple times, we are particularly interested in the 5th Last instance of the PsExec. What is the timestamp when the PsExec Service binary ran?
	- 07/09/2023 12:06:54
- Can you confirm the hostname of the workstation from which attacker moved laterally?
	- Forela-Wkstn001
- What is full name of the Key File dropped by 5th last instance of the Psexec?
	- PSEXEC-FORELA-WKSTN001-95F03CFE.key
- Can you confirm the timestamp when this key file was created on disk?
	- 07/09/2023 12:06:55
- What is the full name of the Named Pipe ending with the "stderr" keyword for the 5th last instance of the PsExec?
	- \PSEXESVC-FORELA-WKSTN001-3056-stderr


# Notes
- When unzipping, we are given a pf file, or a Windows prefetch files
- Essentially, this stores information about an app that we run for the first time
- In this case, the app that was ran in this context was PSExec
- So, we can use PECmd to take this file and pull out specific information that may be useful to us
- To answer the first question, we can look at the output from this command see that the app was ran 9 times.
- Next, we are asked the name of the service binary dropped by the PSExec tool
- We are also given this from the same output, which is psexesvc.exe
- For the timestamp, we can place the output into a CSV file, which allows us to categorize all of the timestamps together
- We are then able to see that the timestamp we are looking for is: 07/09/2023 12:06:54
- Next, we need the hostname of the workstation that the attacker moved from
- We are pull from the same results, in which we get: Forela-Wkstn001
- Next, we need the full name of the key file .
- We can regenerate the results and put them into a CSV file
- From that file, we can pull the information we need to get: PSEXEC-FORELA-WKSTN001-95F03CFE.key
- We can then grab the timestamp to answer the next question
- To answer the last question, we need the full name of the Named Pipe ending
- From that, we are able to pull information to get the answer: \PSEXESVC-FORELA-WKSTN001-3056-stderr