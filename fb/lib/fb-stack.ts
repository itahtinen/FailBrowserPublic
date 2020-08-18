import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";
import * as ecr from "@aws-cdk/aws-ecr";
import fbconfig from "./fb-config";

import { Tag, CfnOutput } from "@aws-cdk/core";
import { CfnDBSubnetGroup } from "@aws-cdk/aws-rds";
import { SubnetType } from "@aws-cdk/aws-ec2";

export class FbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "VPC", {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "fbappserver",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "fbdb",
          subnetType: SubnetType.ISOLATED,
        },
      ],
    });
    // security group
    const mySecurityGroup = new ec2.SecurityGroup(this, "failbrowser-sg", {
      vpc,
      description: "Allow ssh access to ec2 instances",
      allowAllOutbound: true, // Can be set to false
    });
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),

      "allow ssh access from the world"
    );
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),

      "allow PostgreSQL access from the world"
    );
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),

      "allow HTTP access from the world"
    );
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5000),

      "allow http access from the world"
    );

    mySecurityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),

      "allow postgres to world"
    );
    // ami

    const amznLinux = ec2.MachineImage.latestAmazonLinux({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    });

    // instance

    const env_script = `
cat <<EOF > /home/ec2-user/docker-compose.yml
version: "3.7"
services:
  backend:
    image: ${fbconfig.ecrRepositoryBackend}
    ports:
      - 80:80
    environment:
      - FBConnectionStrings__DefaultConnection=Host=${fbconfig.dbHost};Port=5432;Username=${fbconfig.dbUserName};Password=${fbconfig.dbPassword};Database=fbdb
  feeder:
    image: ${fbconfig.ecrRepositoryFeeder}
    ports:
      - 5000:5000
    environment:
      - FB_PY_DB_USER=${fbconfig.dbUserName}
      - FB_PY_DB_PASS=${fbconfig.dbPassword}
      - FB_PY_DB_HOST=${fbconfig.dbHost}
      - FB_PY_DB_PORT=5432
      - FB_PY_DB_DATABASE=fbdb

EOF


cat <<EOF2 > /home/ec2-user/ecr_runme.sh
aws ecr get-login --region eu-west-1 >login_script.sh
EOF2
    `;
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      "yum update -y",
      "yum install -y docker",
      "service docker start",
      "curl -L https://github.com/docker/compose/releases/download/1.25.5/docker-compose-Linux-x86_64 -o /usr/local/bin/docker-compose",
      "chmod +x /usr/local/bin/docker-compose",
      "usermod -a -G docker ec2-user",

      env_script
    );

    // Instance details
    const ec2Instance = new ec2.Instance(this, "failbrowser-Instance4", {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.NANO
      ),

      keyName: "failbrowser-keypair",
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      machineImage: amznLinux,
      securityGroup: mySecurityGroup,
      userData: userData,
    });

    function instanceTags(ins: any) {
      Tag.add(ins, "Application", "FailBrowser");
      Tag.add(ins, "Uptime", "False");
      Tag.add(ins, "Role", "DevTest");
      Tag.add(ins, "Environment", "CI");
      Tag.add(ins, "Name", "FailBrowser");
      Tag.add(ins, "Owner", "FailBrowserTeam");
    }

    new CfnOutput(this, "Server address", {
      description: "Public dns name of ec2 server",
      value: ec2Instance.instancePublicDnsName,
    });
    instanceTags(ec2Instance);

    //Aurora serverless

    const createDb = () => {
      const dbcluster = new rds.CfnDBCluster(this, "apidbcluster", {
        databaseName: "fbdb",
        engine: "aurora-postgresql",
        masterUsername: fbconfig.dbUserName,
        masterUserPassword: fbconfig.dbPassword,
        port: 5432,
        engineVersion: "10.7",
        engineMode: "serverless",
        dbSubnetGroupName: new CfnDBSubnetGroup(this, "db-subnet-group", {
          dbSubnetGroupDescription: "generated subnet group",
          subnetIds: vpc.selectSubnets({
            subnetType: SubnetType.ISOLATED,
          }).subnetIds,
        }).ref,
        vpcSecurityGroupIds: [mySecurityGroup.securityGroupId],

        scalingConfiguration: {
          autoPause: true,
          minCapacity: 2,
          maxCapacity: 2,
          secondsUntilAutoPause: 300,
        },
      });

      new cdk.CfnOutput(this, "AuroraHostname", {
        description: "Host where db is",
        value: dbcluster.attrEndpointAddress,
      });
    };

    const createRepository = (repoName: string) => {
      const repository = new ecr.Repository(this, repoName, {});
      repository.addLifecycleRule({
        tagPrefixList: ["prod"],
        maxImageCount: 9999,
      });
      repository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
      repository.grantPull(ec2Instance.role);
      new cdk.CfnOutput(this, "Out" + repoName, {
        description: "Docker repository " + repoName,
        value: repository.repositoryUri,
      });
    };
    createRepository("EcrBackend");
    createRepository("EcrFeeder");

    createDb();
  }
}
