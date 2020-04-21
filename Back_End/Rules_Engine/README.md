# Instruction

## Description

Things Rules Engine do:

1. Get the input from the SJA Engine .
2. Process the given input based on the given ruleset, the rules in the ruleset are saved on the server.
3. Send back the generated result to the SJA Engine.

## Endpoint

- **/new**: Takes the input from the SJA Engine and uses the given rules in the ruleset subject of the input to generate the result. The input is case-sensitive.

## Apache Maven

First, make sure you have installed Apache Maven. You can find the instruction of how to install Apache Maven [here](http://maven.apache.org/install.html).

## Installation

Enter the **TestProject** folder and Run:

```
mvn install
```

to install all of the require packages.

## Deploy Locally

Run:

```
mvn tomcat7:run
```

to run the server locally.

The defualt port is being set to 8080, you can access the server with the URL:

```
localhost:8080
```

## Deploy Remotely

If you want to deploy the server on your cloud server, first you have to install tomcat 7 in your cloud server. You can find the instruction [here](https://tecadmin.net/steps-to-install-tomcat-server-on-centos-rhel/).
Next, run

```
mvn package
```

in the **TestProject** folder. This will generate a war file

```
TestProject/target/TestProject-3.4.0-SNAPSHOT.war
```

. Upload the war file to your tomcat server to deploy the Rules Engine server.