# FAILBROWSER

FailBrowser is a tool for browsing and feeding parsed xml-data in a simple view.

NOTE! This version of failbrowser does not include demo data.

## Prerequisites

- Docker
- AWS user
- AWS CLI

## Setup

- Get the code

```bash
$ git clone https://github.com/FailBrowser/FailBrowser.git
```

#### create keypair and IAM user in aws management console

- login to your aws console on amazon website
- navigate to ec2 -> key pairs -> create key pair -> name: failbrowser-keypair -> select pem -> create keypair

- note!!! you should save this under c:/users/youruser and use it from there when needed

- navigate to IAM -> Users -> add user -> enter username -> select programmatic access -> add group -> name group -> grant administrator access

- after you hit the create user you will recieve Accesskey ID and Secret access key. Write these down.

#### AWS EC2 and Aurora Serverless PostgreSQL

- navigate to /fb

```bash
$ cdk deploy
```

- enter the iam user credentials created earlier

```bash
$ cdk deploy
```

- edit the fb-config.ts host with you aurora serverless host address

```bash
$ cdk deploy
```

#### Failbrowser

- create the docker images with commandline

  - login to ecr docker
    - navigate to ecr in aws management console -> open repository -> view push commands -> copy the first command and execute in cmd

* navigate to reactfbr\failbrowser\poparse and create image

```bash
$ docker build -t fbfeederimg -f Dockerfile .
```

- check the image id for fbfeederimg

```bash
$ docker images
```

```bash
$ docker tag yourfbfeederimgid yourecruser/yourecrrepo:fbfeeder
```

```bash
$ docker push yourecruser/yourecrrepo:fbfeeder
```

- navigate to reactfbr\failbrowser\backend\FBrowser\FBrowser

```bash
$ pubuco
```

- check the image id for fbrowserimg

```bash
$ docker images
$ docker tag yourfbrimageid yourecruser/yourecrrepo:fbr
$ docker push yourecruser/yourecrrepo:fbr
```

- open cmd and connect to ec 2 machine with ssh

```bash
$ ssh -i "failbrowser-keypair.pem" ec2-user@yourserveraddress
$ aws configure
$ aws ecr get-login
```

- copy the output and remove -e none and paste the reminder

```bash
$ docker pull yourecruser/yourecrrepository:fbfeeder
```

```bash
$ docker pull yourecruser/yourecrrepository:fbr
```

- edit the docker-compose.yml file in ec2

```bash
$ sudo nano docker-compose.yml
```

- insert the image id of fbr in backend
- insert the image id of fbfeeder in feeder
- insert the db endpoint address to both environment hosts

```bash
$ docker-compose up
```

- for feeder head to your_ec2_address:5000/

- for failbrowser head to your_ec2_address/index.html

#### NOTE!!!

- to avoid exceeding aws freetier limits run

```bash
$ cdk destroy
```

- after you are done using Failbrowser

## Contributing

- Yes
