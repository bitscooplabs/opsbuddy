# 3. Set up an RDS box and configure networking
There are several AWS services that need to be set up to run this demo.
We’re first going to tackle the networking and creating the SQL server that will hold our user database.
We’re going to create everything from scratch so that you don’t interfere with anything you may already have in AWS.

### Create IAM role
Go to [IAM roles](https://console.aws.amazon.com/iam/home#/roles) and create a new role.
Click Lambda, then Next:Permissions.
You will need to add three policies to this role:
AWSLambdaBasicExecution
AWSCloudFormationReadOnlyAccess
AWSLambdaVPCAccessExecution

Click Next:Review, give the role a name (such as 'bitscoop-demo'), and then click Create Role.
This role will be used by the Lambda function to specify what it has permission to access.

### Create VPC
Go to your [VPCs](https://console.aws.amazon.com/vpc/home#vpcs:) and create a new one.
Tag it with something like ‘opsbuddy’ so you can easily identify it later.
For the IPv4 CIDR block, enter 10.0.0.0/16, or something similar, such as 10.1.0.0/16, if that is already taken.
Leave IPv6 CIDR block and tenancy as their defaults and create the VPC.
Select the VPC from the list, then click the Actions dropdown, then 'Edit DNS Hostnames'.
In here, click the Yes option and then Save.

### Create subnets
View your [Subnets](https://console.aws.amazon.com/vpc/home#subnets).
You should create four new subnets.
Two of these will be public subnets, and two will be private.
Call the public ones ‘public1’ and ‘public2’, and the private ones ‘private1’ and ‘private2’.
Make sure they are all on the ‘opsbuddy’ VPC we created.
One public and one private subnet should be in the same availability zone, and the other public and private subnets should be in different AZs, e.g. public1 in us-east-1a, public2 in us-east-1c, private1 in us-east-1a, and private2 in us-east-1b.
Remember which AZ is shared between a public and private subnet for later.
The CIDR block needs to be different for each subnet and they all need to fall within the CIDR block of the VPC; if the VPC block is 10.0.0.0/16, you could use 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, and 10.0.3.0/24.
AWS will let you know if anything overlaps.

### Create Internet Gateway
Go to your [Internet Gateways](https://console.aws.amazon.com/vpc/home#igws).
Create a new Internet Gateway, give it a memorable name, and then click 'Yes,Create'.
Once it's created, select it in the list, click Attach to VPC, and attach it to the 'opsbuddy' VPC.

### Create NAT Gateway
Go view your [NAT Gateways](https://console.aws.amazon.com/vpc/home#NatGateways).
Create a new Gateway, and for the subnet pick the public subnet that shares an AZ with a private subnet, e.g. ‘public1’ in the example above.
Click Create New EIP and then Create the gateway.
This new gateway should have an ID nat-<ID>.
It should be noted that, while almost everything in this demo is part of AWS’ free tier, NAT gateways are NOT free.
They’re pretty cheap, at about $0.05 per hour and $0.05 per GB of data processed, but don’t forget to delete this when you’re done with the demo (and don’t forget to create a new one and point the private route table to the new one if you revisit this demo).

### Create Route Tables
Go to [Route Tables](https://console.aws.amazon.com/vpc/home#routetables) and create two new ones.
Name one ‘opsbudyd-public’ and the other ‘opsbuddy-private’, and make sure they’re in the ‘opsbuddy’ VPC.
When they’re created, click on the ‘private’ one and select the Routes tab at the bottom of the page.
Click Edit, and add another route with a destination of 0.0.0.0/0 and a target of the NAT gateway we just created (so nat-<ID>, not igw-<ID>).
Save the private route table.
Now click the public route table, go to the Routes tab, Edit it, and add a route with destination 0.0.0.0/0 and a target of the Internet Gateway we created just before this, then save the route table.

### Update Subnets to Point to Route Tables
Go back to the subnets and click on one of the ‘private’ ones.
Click on the Route Table tab, click Edit, and change the 'Change to' dropdown to the ‘private’ Route Table that you created in the previous step.
Then click Save.
Repeat this for the other ‘private’ subnet.
You will also need to change the public subnets to point to the public route table if they don't point there already.

### Create Security Groups
You also need to create a couple of [Security Groups](https://console.aws.amazon.com/vpc/home#securityGroups:).
Name the first one ‘opsbuddy-rds’ and make sure it’s in the ‘opsbuddy’ VPC, then create it.
Click on it in the list, click on the Inbound Rules tab, and then click Edit.
You’ll want to add a MySQL/Aurora rule (port 3306) for 10.0.0.0/16 (or whatever CIDR block you picked for the VPC) so Lambda can access the RDS box internally.
If you want to make sure that the box you’re going to set up is working as intended, you can also add a MySQL/Aurora rule for your IP address with /32 appended to the end (e.g. 123.456.789.012/32).
You do not need to add any Outbound Rules.

You also need to add a Security Group called ‘opsbuddy-lambda’.
This does not need any Inbound Rules, but it does need Outbound Rules for HTTP (80) to 0.0.0.0/0, HTTPS (443) to 0.0.0.0/0, and MySQL/Aurora (3306) to 0.0.0.0/0.

### Create Subnet Group
Go to your [RDS Subnet Groups](https://console.aws.amazon.com/rds/home#db-subnet-groups:).
Click 'Create DB Subnet Group', then give the new group a name and select the 'opsbuddy' VPC.
Under 'Add subnets', you will need to add the two public subnets.
You must first select the AZ where those subnets are located, then the subnet (it will be grayed out/uneditable if there is only one subnet in the AZ), then click 'Add subnet'.
Finally hit Continue to create the subnet group.

### Create RDS Box
Finally, you will set up the [RDS](https://console.aws.amazon.com/rds/home) box to store the data that will be generated.
Click on Instances and select Launch DB Instance.
For this demo we are using MySQL; if you wish to use a different database, you may have to install a different library in the demo project and change the Sequelize dialect to that db.

On this page you can click the checkbox ‘Only show options that are eligible for RDS Free Tier’ to ensure you don’t configure a box that costs money.
Click on MySQL (or whatever Engine you want) and then click the Next button to go to ‘Specify DB Details’.

Select a DB Instance class; db.t2.micro is normally free and should be sufficient for this demo, as should the default storage amount (5GB as of publication).
Pick a DB Instance Identifier, as well as a username and password.
Save the latter two for later reference, as you will need to set Environment Variables in the Lambda function for them so that the function can connect to the DB.
Click Next Step.

Under Network and Security, select the ‘opsbuddy’ VPC.
For 'Subnet group', make sure it is the one we just created.
Select Yes for 'Public accessibility', and for Availability zone, select the AZ that's shared between a public and private subnet (us-east-1a in the above example).
Under VPC Security Groups, click 'Select existing VPC security groups', then select the ‘rds’ group we created earlier (also delete any other groups it may have already attached).
Make sure to give the database a name and save this name for later use, as it too will need to be added to an Environment Variable.
Leave everything else as-is and click Launch DB Instance.

Go to your [RDS instances](https://console.aws.amazon.com/rds/home#dbinstances).
When the box you just created is ready, click Instance Actions, then See Details.
Scroll down to the Connect section.
Take note of the Endpoint field.
Save this for later use, as it will be used in another Environment Variable.
