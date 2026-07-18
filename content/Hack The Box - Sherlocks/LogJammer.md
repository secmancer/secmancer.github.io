# Questions
- When did the cyberjunkie user first successfully log into his computer? (UTC)
	- 27/03/2023 14:37:09
- The user tampered with firewall settings on the system. Analyze the firewall event logs to find out the Name of the firewall rule added?
	- Metasploit C2 Bypass
- Whats the direction of the firewall rule?
	- Outbound
- The user changed audit policy of the computer. Whats the Subcategory of this changed policy?
	- Other Object Access Events
- The user "cyberjunkie" created a scheduled task. Whats the name of this task?
	- HTB-Automation
- Whats the full path of the file which was scheduled for the task?
	- C:\Users\CyberJunkie\Desktop\Automation-HTB.ps1
- What are the arguments of the command?
	- -A cyberjunkie@hackthebox.eu
- The antivirus running on the system identified a threat and performed actions on it. Which tool was identified as malware by antivirus?
	- SharpHound
- Whats the full path of the malware which raised the alert?
	- `C:\Users\CyberJunkie\Downloads\SharpHound-v1.1.0.zip`
- What action was taken by the antivirus?
	- Quarantine
- The user used Powershell to execute commands. What command was executed by the user?
	- Get-FileHash -Algorithm md5 .\Desktop\Automation-HTB.ps1
- We suspect the user deleted some event logs. Which Event log file was cleared?
	- Microsoft-Windows-Windows Firewall With Advanced Security/Firewall


# Notes
- So after unzipping the file, we are given a folder with multiple Windows Event logs
- Specifically, these files are called Powershell-Operational, Security, System, Windows Defender-Operational, and Windows Firewall-Firewall
- First, we need to find the login time of cyberjunkie.
- To make it easier, we can convert all of the logs into a JSON file
- We can do this using the EvtxECmd tool to do this
```
 .\EvtxECmd.exe -d C:\Users\FLARE_VM_ONLINE\Downloads\Event-Logs --json .
```
- Now, all of the logs are combined for easier viewing.
- Now, let's find the login time for this user. We know that logon events have an ID of 4624.
- Therefore, we can filter for that along with the username cyberjunkie, we are able to find what we are looking for
- Now that the file has been converted, we can put this file back into Linux and use commands like jq to filter out further
```
cat logjammer.json| jq -c '. | select(.EventId == 4624 and (.Payload | test("cyberjunkie";"i")))'
```
- We can then get it down to 4 events, in which we can pull the timestamp from the first event:
```
{"PayloadData1":"Target: DESKTOP-887GK2L\\CyberJunkie","PayloadData2":"LogonType 2","PayloadData3":"LogonId: 0x25F28","PayloadData4":"AuthenticationPackageName: Negotiate","PayloadData5":"LogonProcessName: User32 ","UserName":"WORKGROUP  
\\DESKTOP-887GK2L$","RemoteHost":"DESKTOP-887GK2L (127.0.0.1)","ExecutableInfo":"C:\\Windows\\System32\\svchost.exe","MapDescription":"Successful logon","ChunkNumber":0,"Computer":"DESKTOP-887GK2L","Payload":"{\"EventData\":{\"Data\":[{  
\"@Name\":\"SubjectUserSid\",\"#text\":\"S-1-5-18\"},{\"@Name\":\"SubjectUserName\",\"#text\":\"DESKTOP-887GK2L$\"},{\"@Name\":\"SubjectDomainName\",\"#text\":\"WORKGROUP\"},{\"@Name\":\"SubjectLogonId\",\"#text\":\"0x3E7\"},{\"@Name\":  
\"TargetUserSid\",\"#text\":\"S-1-5-21-3393683511-3463148672-371912004-1001\"},{\"@Name\":\"TargetUserName\",\"#text\":\"CyberJunkie\"},{\"@Name\":\"TargetDomainName\",\"#text\":\"DESKTOP-887GK2L\"},{\"@Name\":\"TargetLogonId\",\"#text\  
":\"0x25F28\"},{\"@Name\":\"LogonType\",\"#text\":\"2\"},{\"@Name\":\"LogonProcessName\",\"#text\":\"User32 \"},{\"@Name\":\"AuthenticationPackageName\",\"#text\":\"Negotiate\"},{\"@Name\":\"WorkstationName\",\"#text\":\"DESKTOP-887GK2L  
\"},{\"@Name\":\"LogonGuid\",\"#text\":\"00000000-0000-0000-0000-000000000000\"},{\"@Name\":\"TransmittedServices\",\"#text\":\"-\"},{\"@Name\":\"LmPackageName\",\"#text\":\"-\"},{\"@Name\":\"KeyLength\",\"#text\":\"0\"},{\"@Name\":\"Pr  
ocessId\",\"#text\":\"0x570\"},{\"@Name\":\"ProcessName\",\"#text\":\"C:\\\\Windows\\\\System32\\\\svchost.exe\"},{\"@Name\":\"IpAddress\",\"#text\":\"127.0.0.1\"},{\"@Name\":\"IpPort\",\"#text\":\"0\"},{\"@Name\":\"ImpersonationLevel\"  
,\"#text\":\"%%1833\"},{\"@Name\":\"RestrictedAdminMode\",\"#text\":\"-\"},{\"@Name\":\"TargetOutboundUserName\",\"#text\":\"-\"},{\"@Name\":\"TargetOutboundDomainName\",\"#text\":\"-\"},{\"@Name\":\"VirtualAccount\",\"#text\":\"%%1843\  
"},{\"@Name\":\"TargetLinkedLogonId\",\"#text\":\"0x25F9F\"},{\"@Name\":\"ElevatedToken\",\"#text\":\"%%1842\"}]}}","Channel":"Security","Provider":"Microsoft-Windows-Security-Auditing","EventId":4624,"EventRecordId":"13058","ProcessId"  
:780,"ThreadId":824,"Level":"LogAlways","Keywords":"Audit success","SourceFile":"C:\\Users\\FLARE_VM_ONLINE\\Downloads\\Event-Logs\\Security.evtx","ExtraDataOffset":0,"HiddenRecord":false,"TimeCreated":"2023-03-27T14:37:09.8798913+00:00  
","RecordNumber":39}
```
- Now, let's move onto the next two questions actually, since they both deal with firewall rules.
- Specifically, we need to find the name of the firewall rule and the direction of which it was applied
- Since we do know that the user logged in at 27/03/2023 13:37:09, we can filter out events that occur after that
```
cat logjammer.json| grep -i firewall | jq -c 'select(.EventId==2004 and .TimeCreated > "2023-03-27T14:37:09") | [.PayloadData1, .PayloadData3, .PayloadData4, .PayloadData  
5, .RemoteHost, .TimeCreated]'
```
- We then get some interesting results, in which we see that Metasploit C2 was used to create a malicious rule within the firewall for outbound traffic.
- This indicates an attack was ran here!
```
[": Microsoft Edge","Direction: Inbound","Action: Block","Protocol: All","*: ","2023-03-27T14:37:35.4692787+00:00"]  
[": Microsoft Edge","Direction: Outbound","Action: Block","Protocol: All","*: ","2023-03-27T14:37:35.4701846+00:00"]  
[": Metasploit C2 Bypass","Direction: Outbound","Action: Allow","Protocol: TCP","*: 4444","2023-03-27T14:44:43.4157021+00:00"]
```
- Now, let's find the subcategory of this changed policy
- We know that the event ID is 4719, so let's filter for that
```
cat logjammer.json | jq 'select(.EventId==4719)'
```
- We then get this:
```
"PayloadData2": "SubcategoryGuid: 0cce9227-69ae-11d9-bed3-505054503030",
```
- We can then do some research, and learn that this represents the category "Other Object Access Events"
	- https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-gpac/77878370-0712-47cd-997d-b07053429f6d
- We now need to answer the next 3 questions revolving a scheduled task that the attacker created
- We need to learn its name, the path of the file, and what arguments are being passed with its execution
- We can start by seeing that the event ID for schedule tasks is 4698, so let's start with that
- We are then given what we seek:
```
{"PayloadData1":"TaskName: \\HTB-AUTOMATION","PayloadData2":"TaskContent: &lt;?xml version=\"1.0\" encoding=\"UTF-16\"?&gt;, &lt;Task version=\"1.2\" xmlns=\"http://schemas.microsoft.com/windows/2004/02/mit/task\"&gt;,   &lt;Registratio  
nInfo&gt;,     &lt;Date&gt;2023-03-27T07:51:21.4599985&lt;/Date&gt;,     &lt;Author&gt;DESKTOP-887GK2L\\CyberJunkie&lt;/Author&gt;,     &lt;Description&gt;practice&lt;/Description&gt;,     &lt;URI&gt;\\HTB-AUTOMATION&lt;/URI&gt;,   &lt;  
/RegistrationInfo&gt;,   &lt;Triggers&gt;,     &lt;CalendarTrigger&gt;,       &lt;StartBoundary&gt;2023-03-27T09:00:00&lt;/StartBoundary&gt;,       &lt;Enabled&gt;true&lt;/Enabled&gt;,       &lt;ScheduleByDay&gt;,         &lt;DaysInterv  
al&gt;1&lt;/DaysInterval&gt;,       &lt;/ScheduleByDay&gt;,     &lt;/CalendarTrigger&gt;,   &lt;/Triggers&gt;,   &lt;Principals&gt;,     &lt;Principal id=\"Author\"&gt;,       &lt;RunLevel&gt;LeastPrivilege&lt;/RunLevel&gt;,       &lt;U  
serId&gt;DESKTOP-887GK2L\\CyberJunkie&lt;/UserId&gt;,       &lt;LogonType&gt;InteractiveToken&lt;/LogonType&gt;,     &lt;/Principal&gt;,   &lt;/Principals&gt;,   &lt;Settings&gt;,     &lt;MultipleInstancesPolicy&gt;IgnoreNew&lt;/Multipl  
eInstancesPolicy&gt;,     &lt;DisallowStartIfOnBatteries&gt;true&lt;/DisallowStartIfOnBatteries&gt;,     &lt;StopIfGoingOnBatteries&gt;true&lt;/StopIfGoingOnBatteries&gt;,     &lt;AllowHardTerminate&gt;true&lt;/AllowHardTerminate&gt;,    
  &lt;StartWhenAvailable&gt;false&lt;/StartWhenAvailable&gt;,     &lt;RunOnlyIfNetworkAvailable&gt;false&lt;/RunOnlyIfNetworkAvailable&gt;,     &lt;IdleSettings&gt;,       &lt;Duration&gt;PT10M&lt;/Duration&gt;,       &lt;WaitTimeout&g  
t;PT1H&lt;/WaitTimeout&gt;,       &lt;StopOnIdleEnd&gt;true&lt;/StopOnIdleEnd&gt;,       &lt;RestartOnIdle&gt;false&lt;/RestartOnIdle&gt;,     &lt;/IdleSettings&gt;,     &lt;AllowStartOnDemand&gt;true&lt;/AllowStartOnDemand&gt;,     &lt  
;Enabled&gt;true&lt;/Enabled&gt;,     &lt;Hidden&gt;false&lt;/Hidden&gt;,     &lt;RunOnlyIfIdle&gt;false&lt;/RunOnlyIfIdle&gt;,     &lt;WakeToRun&gt;false&lt;/WakeToRun&gt;,     &lt;ExecutionTimeLimit&gt;P3D&lt;/ExecutionTimeLimit&gt;,  
   &lt;Priority&gt;7&lt;/Priority&gt;,   &lt;/Settings&gt;,   &lt;Actions Context=\"Author\"&gt;,     &lt;Exec&gt;,       &lt;Command&gt;C:\\Users\\CyberJunkie\\Desktop\\Automation-HTB.ps1&lt;/Command&gt;,       &lt;Arguments&gt;-A cyb  
erjunkie@hackthebox.eu&lt;/Arguments&gt;,     &lt;/Exec&gt;,   &lt;/Actions&gt;, &lt;/Task&gt;","UserName":"DESKTOP-887GK2L\\CyberJunkie","MapDescription":"Scheduled Task created","ChunkNumber":1,"Computer":"DESKTOP-887GK2L","Payload":"  
{\"EventData\":{\"Data\":[{\"@Name\":\"SubjectUserSid\",\"#text\":\"S-1-5-21-3393683511-3463148672-371912004-1001\"},{\"@Name\":\"SubjectUserName\",\"#text\":\"CyberJunkie\"},{\"@Name\":\"SubjectDomainName\",\"#text\":\"DESKTOP-887GK2L\  
"},{\"@Name\":\"SubjectLogonId\",\"#text\":\"0x25F28\"},{\"@Name\":\"TaskName\",\"#text\":\"\\\\HTB-AUTOMATION\"},{\"@Name\":\"TaskContent\",\"#text\":\"&lt;?xml version=\\\"1.0\\\" encoding=\\\"UTF-16\\\"?&gt;, &lt;Task version=\\\"1.2  
\\\" xmlns=\\\"http://schemas.microsoft.com/windows/2004/02/mit/task\\\"&gt;,   &lt;RegistrationInfo&gt;,     &lt;Date&gt;2023-03-27T07:51:21.4599985&lt;/Date&gt;,     &lt;Author&gt;DESKTOP-887GK2L\\\\CyberJunkie&lt;/Author&gt;,     &lt  
;Description&gt;practice&lt;/Description&gt;,     &lt;URI&gt;\\\\HTB-AUTOMATION&lt;/URI&gt;,   &lt;/RegistrationInfo&gt;,   &lt;Triggers&gt;,     &lt;CalendarTrigger&gt;,       &lt;StartBoundary&gt;2023-03-27T09:00:00&lt;/StartBoundary&  
gt;,       &lt;Enabled&gt;true&lt;/Enabled&gt;,       &lt;ScheduleByDay&gt;,         &lt;DaysInterval&gt;1&lt;/DaysInterval&gt;,       &lt;/ScheduleByDay&gt;,     &lt;/CalendarTrigger&gt;,   &lt;/Triggers&gt;,   &lt;Principals&gt;,       
&lt;Principal id=\\\"Author\\\"&gt;,       &lt;RunLevel&gt;LeastPrivilege&lt;/RunLevel&gt;,       &lt;UserId&gt;DESKTOP-887GK2L\\\\CyberJunkie&lt;/UserId&gt;,       &lt;LogonType&gt;InteractiveToken&lt;/LogonType&gt;,     &lt;/Principal  
&gt;,   &lt;/Principals&gt;,   &lt;Settings&gt;,     &lt;MultipleInstancesPolicy&gt;IgnoreNew&lt;/MultipleInstancesPolicy&gt;,     &lt;DisallowStartIfOnBatteries&gt;true&lt;/DisallowStartIfOnBatteries&gt;,     &lt;StopIfGoingOnBatteries  
&gt;true&lt;/StopIfGoingOnBatteries&gt;,     &lt;AllowHardTerminate&gt;true&lt;/AllowHardTerminate&gt;,     &lt;StartWhenAvailable&gt;false&lt;/StartWhenAvailable&gt;,     &lt;RunOnlyIfNetworkAvailable&gt;false&lt;/RunOnlyIfNetworkAvail  
able&gt;,     &lt;IdleSettings&gt;,       &lt;Duration&gt;PT10M&lt;/Duration&gt;,       &lt;WaitTimeout&gt;PT1H&lt;/WaitTimeout&gt;,       &lt;StopOnIdleEnd&gt;true&lt;/StopOnIdleEnd&gt;,       &lt;RestartOnIdle&gt;false&lt;/RestartOnId  
le&gt;,     &lt;/IdleSettings&gt;,     &lt;AllowStartOnDemand&gt;true&lt;/AllowStartOnDemand&gt;,     &lt;Enabled&gt;true&lt;/Enabled&gt;,     &lt;Hidden&gt;false&lt;/Hidden&gt;,     &lt;RunOnlyIfIdle&gt;false&lt;/RunOnlyIfIdle&gt;,      
&lt;WakeToRun&gt;false&lt;/WakeToRun&gt;,     &lt;ExecutionTimeLimit&gt;P3D&lt;/ExecutionTimeLimit&gt;,     &lt;Priority&gt;7&lt;/Priority&gt;,   &lt;/Settings&gt;,   &lt;Actions Context=\\\"Author\\\"&gt;,     &lt;Exec&gt;,       &lt;  
Command&gt;C:\\\\Users\\\\CyberJunkie\\\\Desktop\\\\Automation-HTB.ps1&lt;/Command&gt;,       &lt;Arguments&gt;-A cyberjunkie@hackthebox.eu&lt;/Arguments&gt;,     &lt;/Exec&gt;,   &lt;/Actions&gt;, &lt;/Task&gt;\"},{\"@Name\":\"ClientPr  
ocessStartKey\",\"#text\":\"4222124650660162\"},{\"@Name\":\"ClientProcessId\",\"#text\":\"9320\"},{\"@Name\":\"ParentProcessId\",\"#text\":\"6112\"},{\"@Name\":\"RpcCallClientLocality\",\"#text\":\"0\"},{\"@Name\":\"FQDN\",\"#text\":\"  
DESKTOP-887GK2L\"}]}}","Channel":"Security","Provider":"Microsoft-Windows-Security-Auditing","EventId":4698,"EventRecordId":"13103","ProcessId":780,"ThreadId":4180,"Level":"LogAlways","Keywords":"Audit success","SourceFile":"C:\\Users\\  
FLARE_VM_ONLINE\\Downloads\\Event-Logs\\Security.evtx","ExtraDataOffset":0,"HiddenRecord":false,"TimeCreated":"2023-03-27T14:51:21.4817206+00:00","RecordNumber":84}
```
- We can make out that the task's name is HTB-Automation
- Looking further, we can see the file path of where this script is stored:
```
C:\Users\CyberJunkie\Desktop\Automation-HTB.ps1
```
- Along with this, we can also pull out the arguments that are being ran as well:
```
-A cyberjunkie@hackthebox.eu
```
- Next, we need to find what the antivirus detected the malware as
- For this, we need to sort out for the Windows Defender logs
- The event log, specifically, is 1116.
- Of course, we also know the timestamp as well, so let's filter for that additionally
```
cat logjammer.json | jq 'select(.TimeCreated > "2023-03-27T14:37:09" and .EventId == 1116) | {"Name": .PayloadData1, "User": .UserName, "ExeInfo": .ExecutableInfo, "CreationTime": .TimeCreated}'
```
- We get events in return:
```
{  
 "Name": "Malware name: HackTool:PowerShell/SharpHound.B",  
 "User": "Detection User: DESKTOP-887GK2L\\CyberJunkie",  
 "ExeInfo": "containerfile:_C:\\Users\\CyberJunkie\\Downloads\\SharpHound-v1.1.0.zip; file:_C:\\Users\\CyberJunkie\\Downloads\\SharpHound-v1.1.0.zip-&gt;SharpHound.ps1; webfile:_C:\\Users\\CyberJunkie\\Downloads\\SharpHound-v1.1.0.zip|  
https://objects.githubusercontent.com/github-production-release-asset-2e65be/385323486/70d776cc-8f83-44d5-b226-2dccc4f7c1e3?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230327%2Fus-east-1%2Fs3%2Faws4_re  
quest&amp;X-Amz-Date=20230327T144228Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=f969ef5ca3eec150dc1e23623434adc1e4a444ba026423c32edf5e85d881a771&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=385323486&amp;response  
-content-disposition=attachment%3B%20filename%3DSharpHound-v1.1.0.zip&amp;response-content-type=application%2Foctet-stream|pid:3532,ProcessStart:133244017530289775",  
 "CreationTime": "2023-03-27T14:42:34.2909353+00:00"  
}  
{  
 "Name": "Malware name: HackTool:MSIL/SharpHound!MSR",  
 "User": "Detection User: DESKTOP-887GK2L\\CyberJunkie",  
 "ExeInfo": "containerfile:_C:\\Users\\CyberJunkie\\Downloads\\SharpHound-v1.1.0.zip; file:_C:\\Users\\CyberJunkie\\Downloads\\SharpHound-v1.1.0.zip-&gt;SharpHound.exe; webfile:_C:\\Users\\CyberJunkie\\Downloads\\SharpHound-v1.1.0.zip|  
https://objects.githubusercontent.com/github-production-release-asset-2e65be/385323486/70d776cc-8f83-44d5-b226-2dccc4f7c1e3?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230327%2Fus-east-1%2Fs3%2Faws4_re  
quest&amp;X-Amz-Date=20230327T144228Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=f969ef5ca3eec150dc1e23623434adc1e4a444ba026423c32edf5e85d881a771&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=385323486&amp;response  
-content-disposition=attachment%3B%20filename%3DSharpHound-v1.1.0.zip&amp;response-content-type=application%2Foctet-stream|pid:3532,ProcessStart:133244017530289775",  
 "CreationTime": "2023-03-27T14:42:34.2927169+00:00"  
}
```
- With this, we can answer the first question, in which the malware was called SharpHound
- Looking further, we can find the answer to the other question, in which the file detected was `C:\Users\CyberJunkie\Downloads\SharpHound-v1.1.0.zip`
- Next, let's determine what action the antivirus took against this malware
- We can do this by filtering for events with ID 1117
```
cat logjammer.json | jq 'select(.TimeCreated > "2023-03-27T14:37:09" and .EventId == 1117) | .Payload | fromjson | .EventData.Data | map(select(.["@Name"]=="Action Name")) | .[]."#text"'
```
- We are then able to see that the antivirus went ahead and quarantined the file
```
"Quarantine"
```
- Next, let's find what PowerShell command was executed
- We know that 4104 is the event id for these types of events, so let's filter for that
```
cat logjammer.json | jq 'select(.TimeCreated > "2023-03-27T14:37:09" and .EventId==4104 and (.Payload | test("Get-FileHash")))'
```
- We then get the following output:
```
{  
 "PayloadData1": "Path: ",  
 "PayloadData2": "ScriptBlockText: Get-FileHash -Algorithm md5 .\\Desktop\\Automation-HTB.ps1",  
 "MapDescription": "Contains contents of scripts run",  
 "ChunkNumber": 180,  
 "Computer": "DESKTOP-887GK2L",  
 "Payload": "{\"EventData\":{\"Data\":[{\"@Name\":\"MessageNumber\",\"#text\":\"1\"},{\"@Name\":\"MessageTotal\",\"#text\":\"1\"},{\"@Name\":\"ScriptBlockText\",\"#text\":\"Get-FileHash -Algorithm md5 .\\\\Desktop\\\\Automation-HTB.ps1  
\"},{\"@Name\":\"ScriptBlockId\",\"#text\":\"b4fcf72f-abdc-4a84-923f-8e06a758000b\"},{\"@Name\":\"Path\"}]}}",  
 "UserId": "S-1-5-21-3393683511-3463148672-371912004-1001",  
 "Channel": "Microsoft-Windows-PowerShell/Operational",  
 "Provider": "Microsoft-Windows-PowerShell",  
 "EventId": 4104,  
 "EventRecordId": "571",  
 "ProcessId": 7152,  
 "ThreadId": 2000,  
 "Level": "Verbose",  
 "Keywords": "0x0",  
 "SourceFile": "C:\\Users\\FLARE_VM_ONLINE\\Downloads\\Event-Logs\\Powershell-Operational.evtx",  
 "ExtraDataOffset": 0,  
 "HiddenRecord": false,  
 "TimeCreated": "2023-03-27T14:58:33.3647699+00:00",  
 "RecordNumber": 571  
}
```
- We can see that the command ran was `Get-FileHash -Algorithm md5 .\Desktop\Automation-HTB.ps1`
- Lastly, we need to find which Event log file was cleared in an attempt to cover the attacker's tracks
- While many not think it's trackable, there actually is an ID for cleared logs, and it's 1102
- So, we can go ahead and filter for that
```
cat logjammer.json | grep -i cleared | jq 'select(.EventId==104 and .TimeCreated > "2023-03-27T14:37:09")'
```
- We get a nice response:
```
{  
 "PayloadData1": "The Microsoft-Windows-Windows Firewall With Advanced Security/Firewall log file was cleared",  
 "UserName": "DESKTOP-887GK2L\\CyberJunkie",  
 "MapDescription": "Event log cleared",  
 "ChunkNumber": 18,  
 "Computer": "DESKTOP-887GK2L",  
 "Payload": "{\"UserData\":{\"LogFileCleared\":{\"SubjectUserName\":\"CyberJunkie\",\"SubjectDomainName\":\"DESKTOP-887GK2L\",\"Channel\":\"Microsoft-Windows-Windows Firewall With Advanced Security/Firewall\",\"BackupPath\":\"\"}}}",  
 "UserId": "S-1-5-21-3393683511-3463148672-371912004-1001",  
 "Channel": "System",  
 "Provider": "Microsoft-Windows-Eventlog",  
 "EventId": 104,  
 "EventRecordId": "2186",  
 "ProcessId": 1332,  
 "ThreadId": 5332,  
 "Level": "Info",  
 "Keywords": "Classic",  
 "SourceFile": "C:\\Users\\FLARE_VM_ONLINE\\Downloads\\Event-Logs\\System.evtx",  
 "ExtraDataOffset": 0,  
 "HiddenRecord": false,  
 "TimeCreated": "2023-03-27T15:01:56.5158362+00:00",  
 "RecordNumber": 2186  
}  
[Dec
```
- We are able to see that the event log cleared was Microsoft-Windows-Windows Firewall With Advanced Security/Firewall log file.