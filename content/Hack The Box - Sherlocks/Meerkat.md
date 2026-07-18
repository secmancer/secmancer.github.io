# Questions
- We believe our Business Management Platform server has been compromised. Please can you confirm the name of the application running?
	- BonitaSoft
- We believe the attacker may have used a subset of the brute forcing attack category - what is the name of the attack carried out?
	- Credential Stuffing
- Does the vulnerability exploited have a CVE assigned - and if so, which one?
	- CVE-2022-25237
- Which string was appended to the API URL path to bypass the authorization filter by the attacker's exploit?
	- i18ntranslation
- How many combinations of usernames and passwords were used in the credential stuffing attack?
	- 56
- Which username and password combination was successful?
	- seb.broom@forela.co.uk:g0vernm3nt
- If any, which text sharing site did the attacker utilise?
	- pastes.io
- Please provide the filename of the public key used by the attacker to gain persistence on our host.
	- hffgra4unv
- Can you confirm the file modified by the attacker to gain persistence?
	- /home/ubuntu/.ssh/authorized_keys
- Can you confirm the MITRE technique ID of this type of persistence mechanism?
	- T1098.004


# Notes
- Unzipping the file, we are given two files: meerkat.pcap and meerkat-alerts.json.
- PCAP can obviously be done with Wireshark. 
- The alerts json is generated from Zeek, but  thanks to it being in json, we can just use standard tools to take a look at it
- To make it easier to read, we can use the jq to format it better
```
jq '.[]' meerkat-alerts.json
```
- To answer the first question, let's use jq to find the alert signatures, which will describe what is going on
```
jq '.[].alert.signature' meerkat-alerts.json
```
 - We can then see the usage of something called BonitaSoft, which is the app being ran here
```
"ET EXPLOIT Bonitasoft Authorization Bypass M1 (CVE-2022-25237)"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
"GPL WEB_SERVER DELETE attempt"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
null  
"ET EXPLOIT Bonitasoft Authorization Bypass M1 (CVE-2022-25237)"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
"ET EXPLOIT Bonitasoft Authorization Bypass and RCE Upload M1 (CVE-2022-25237)"  
"ET EXPLOIT Bonitasoft Authorization Bypass M1 (CVE-2022-25237)"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
"ET EXPLOIT Bonitasoft Successful Default User Login Attempt (Possible Staging for CVE-2022-25237)"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
"ET WEB_SPECIFIC_APPS Bonitasoft Default User Login Attempt M1 (Possible Staging for CVE-2022-25237)"  
"ET EXPLOIT Bonitasoft Authorization Bypass M1 (CVE-2022-25237)"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"  
"GPL WEB_SERVER DELETE attempt"  
"ET INFO User-Agent (python-requests) Inbound to Webserver"
```
- To get the next question, we need to look into the pcap file
- On Wireshark, we are looking for a specific type of password attack
- Following the stream, we are able to find the usage of credentials
```
POST /bonita/loginservice HTTP/1.1
Host: forela.co.uk:8080
User-Agent: python-requests/2.28.1
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Cookie: x=x
Content-Length: 39

username=install&password=install&_l=enHTTP/1.1 401 
Content-Length: 0
Date: Thu, 19 Jan 2023 15:39:17 GMT
Keep-Alive: timeout=20
Connection: keep-alive

POST /bonita/loginservice HTTP/1.1
Host: forela.co.uk:8080
User-Agent: python-requests/2.28.1
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Cookie: x=x
Content-Length: 59

username=seb.broom%40forela.co.uk&password=g0vernm3nt&_l=enHTTP/1.1 204 
Set-Cookie: bonita.tenant=1; SameSite=Lax
Set-Cookie: JSESSIONID=772FE3C83B1A0815EC3AFA1C098B40E9; Path=/bonita; HttpOnly; SameSite=Lax
Set-Cookie: X-Bonita-API-Token=d350c469-2660-4504-9bea-4dbfa41ed9a4; Path=/bonita; SameSite=Lax
Set-Cookie: BOS_Locale=en; Path=/; SameSite=Lax
Date: Thu, 19 Jan 2023 15:39:17 GMT
Keep-Alive: timeout=20
Connection: keep-alive

POST /bonita/API/pageUpload;i18ntranslation?action=add HTTP/1.1
Host: forela.co.uk:8080
User-Agent: python-requests/2.28.1
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Cookie: JSESSIONID=772FE3C83B1A0815EC3AFA1C098B40E9; X-Bonita-API-Token=d350c469-2660-4504-9bea-4dbfa41ed9a4; bonita.tenant=1; BOS_Locale=en
Content-Length: 15163
Content-Type: multipart/form-data; boundary=7ba185551eb7b4ef7035d691317837e9

--7ba185551eb7b4ef7035d691317837e9
Content-Disposition: form-data; name="file"; filename="rce_api_extension.zip"
Content-Type: application/octet-stream
```
- We can see that the python requests library is being used to do this, and that they all use the uri of /bonita/loginservice
- Therefore, we can continue to filter it out
```
http.request.uri == "/bonita/loginservice" && http.user_agent == "python-requests/2.28.1"
```
- We can see multiple instances of different credentials being attempted, so this attack fits the definition of Credential Stuffing.
- Next, we need to get the CVE of the vulnerability
- This was actually given to us earlier from the Zeek alerts, so let's pull from there.
- We get what we are looking for:
	- CVE-2022-25237
- Next, we need to show what was appended to the API URL
- We also have this information already after looking at Wireshark, which is this:
	- i18ntranslation
- Next, we need to count up the amount of times credentials were attempted.
- Overall, we get a count of 57, but we need to account for the fact that the default credentials were also tried as well, so it's really 56 unique credentials
- Now, let's determine which credential set actually worked for the attacker
- Going back to Wireshark, we can go back to the stream, we can get out a set of credentials, but some of it is URL encoded
	- seb.broom%40forela.co.uk:g0vernm3nt
- So, knowing that %40 = @, we get our full credential set:
	- seb.broom@forela.co.uk:g0vernm3nt
- We are now asked to get what text sharing site they used for this attack
- For answering the second question, we can follow the HTTP requests, and was able to pull what we needed to:
	- pastes.io
- Next, we need to find the filename of the public key the attacker used.
- We can actually use the wayback machine to find the content the attacker was copying over
![[Screenshot_20251203_121100.png]]
- Now, we need to confirm that the attacker had gained persistence
- We can actually confirm this that seeing that the attacker's key was copied over into the authorized_keys, allowing the attacker to bypass other authentication methods
- Finally, we need to determine the MITRE technique ID for this persistence mechanism
- We can take a look at the matrix, and determine that this fits the SSH Authorized Keys Account Manipulation:
	- https://attack.mitre.org/matrices/enterprise/
- So, we can determine the ID to be T1098.004