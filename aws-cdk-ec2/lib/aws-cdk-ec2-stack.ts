import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class MyNextjsCdkStack extends cdk.Stack {
  public readonly instance: ec2.Instance;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Key Pair
    const keyPair = new ec2.CfnKeyPair(this, 'NextjsKeyPair', {
      keyName: 'nextjs-keypair',
      keyType: 'rsa', // or 'ed25519'
      keyFormat: 'pem',
    });

    // Lookup Default VPC
    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });

    // Create IAM Role for EC2
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    // IAM user
    const user = new iam.User(this, 'GitHubCICDUser', {
      userName: 'github-actions-user',
    });

    user.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
    );




    // Create Security Group
    const sg = new ec2.SecurityGroup(this, 'WebSG', {
      vpc,
      allowAllOutbound: true,
    });
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3000), 'Allow Next.js app');

    // Use Amazon Linux 2023
    const ami = ec2.MachineImage.latestAmazonLinux2023();

    // Launch EC2 Instance
    this.instance = new ec2.Instance(this, 'NextjsEC2', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: sg,
      role: role,
      keyName: keyPair.keyName!, // use the keyName created above
    });

    // Allocate an Elastic IP
    const eip = new ec2.CfnEIP(this, 'NextjsElasticIP', {
      domain: 'vpc', // must be 'vpc' for instances in a VPC
    });

    // Associate the EIP with the EC2 instance
    new ec2.CfnEIPAssociation(this, 'EIPAssociation', {
      instanceId: this.instance.instanceId,
      eip: eip.ref,
    });

    // Output Elastic IP
    new cdk.CfnOutput(this, 'ElasticIP', {
      value: eip.ref,
      description: 'Static Elastic IP of the EC2 instance',
    });


    //public ip
    new cdk.CfnOutput(this, 'InstancePublicIP', {
      value: this.instance.instancePublicIp,
    });


    // Optional: Add dependency to ensure key is created before instance
    this.instance.node.addDependency(keyPair);
  }
}
