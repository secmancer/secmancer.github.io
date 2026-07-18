# Questions
- Which software/application did Torrin use to leak Forela's secrets?
	- Slack
- What's the name of the rival company to which Torrin leaked the data?
	- PrimeTech Innovations
- What is the username of the person from the competitor organization whom Torrin shared information with?
	- Cyberjunkie-PrimeTechDev
- What's the channel name in which they conversed with each other?
	- forela-secrets-leak
- What was the password for the archive server?
	- Tobdaf8Qip$re@1
- What was the URL provided to Torrin to upload stolen data to?
	- https://drive.google.com/drive/folders/1vW97VBmxDZUIEuEUG64g5DLZvFP-Pdll?usp=sharing
- When was the above link shared with Torrin?
	- 2023-04-20 10:34:49
- For how much money did Torrin leak Forela's secrets?
	- £10000


# Notes
- After unzipping the folder, we are given a dump of wpnidm
- This part of an SQLite database, so we can use something like SQLitebrowser to look into the file
- We are then given the raw entries, which we can then export into a CSV file for easier viewing.
- Now with that done, we are continue along with answering the questions.
- For the first one, we need to know what application was used to leak the secrets.
- We can tell it was Slack due to the slack:channel and invitation to join Slack messages within the data.
- Next, we need the name of the rival company that the data was leaked to.
- From the same data, we are able to pull out the name of PrimeTech Innovations
- Next, we need to grab the username of the person from PrimeTech Innovations. We can find that in the same entry as the second question, in which we get Cyberjunkie-PrimeTechDev.
- Next, we need the Slack channel name, which we can determine to be: forela-secrets-leak
- Then, we need the password for the server, which we can see is: Tobdaf8Qip$re@1
- Next, we need the URL that was given to Torrin, which we can see is: https://drive.google.com/drive/folders/1vW97VBmxDZUIEuEUG64g5DLZvFP-Pdll?usp=sharing
- We also need to find when this link was shared, which we can grab in Unix epoch time, and then convert that into UTC to get: 2023-04-20 10:34:49
- Lastly, we need to get the price that was offered, which we can do from the same data
- We can see that £10000 was offered
