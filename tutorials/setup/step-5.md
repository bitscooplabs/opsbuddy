# 5. Deploy Backend code to Lambda and Set Up Alexa Skill

### Create Backend Lambda Function
First we’re going to create a Lambda function to handle Alexa login and invocations.

From the top level of the project run

```
gulp bundle:backend
```

to compile the backend code in the /dist folder.

Go to [your Lambda functions](https://console.aws.amazon.com/lambda/home#/functions?display=list) and Create a new function.
Click 'Author from scratch'.
Name the function; for reference we’ll call this ‘opsbuddy-backend’.
For Role select 'Choose an existing role', then select the 'opsbuddy' role we created earlier, then click 'Create function'.

If you are not taken to the function automatically, then select the role we just created from the list of functions.
Under 'Function code', make sure the runtime is ‘Node.js 6.10’ and the Handler is 'index.handler'.
Select ‘Upload a .ZIP file’ for ‘Code entry type’.
Click on the Upload button that appears next to ‘Function package’ and select the backend .zip file in the /dist folder.

You will need to add several Environment Variables:

* BITSCOOP_API_KEY (obtainable at https://bitscoop.com/keys)
* PORT (by default it’s 3306)
* HOST (the endpoint for the RDS box, <Box name>.<ID>.<Region>.rds.amazonaws.com)
* USER (the username you picked for the RDS box)
* PASSWORD (the password you set for the RDS box)
* DATABASE (the database name you set for the RDS box)
* GITHUB_MAP_ID (the ID of the BitScoop API map for GitHub)
* GOOGLE_ANALYTICS_MAP_ID (the ID of the BitScoop API map for Google Analytics)
* GOOGLE_SIGN_IN_MAP_ID (the ID of the BitScoop API map for Google Sign-In)
* POSTMAN_MAP_ID (the ID of the BitScoop API map for Postman)
* STATUSCAKE_MAP_ID (the ID of the BitScoop API map for StatusCake)
* ALEXA_APP_ID (The ID of the Alexa app; this will be filled in later)

Go to the Basic settings block and set the timeout to 15 seconds.
Open the Network block, select the ‘opsbuddy’ VPC we created and add the two ‘private’ subnets we created earlier, and add the ‘opsbuddy-lambda’ security group.
Finally, scroll back up to the top of the page and click Save (not Save and test, as we don't want to test run it).
Click on the Triggers tab, next to Configuration.
Click on 'Add Trigger', then click on the dashed gray box, select 'Alexa Skills Kit', and then click Submit.
Look in the upper-right corner of the screen to find the ARN; we will need this momentarily.

### Set up Alexa Skill
Go to [your Alexa Skills](https://developer.amazon.com/edw/home.html#/skills) and click ‘Add a New Skill’.

Under Skill Information, pick ‘Custom Interaction Model’ for the Skill Type, enter ‘Ops Buddy’ for Name and Interaction Name, and click Save.
Click on Interaction Model on the left-hand side. Under Intent Schema enter:

```
{
  "intents": [
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AboutIntent"
    },
    {
      "intent": "StackIntent"
    }
  ]
}
```

and under Sample Utterances enter:

```
StackIntent how's the stack doing
StackIntent how is the stack doing
StackIntent how is the stack doing today
StackIntent tell me how the stack is doing
```

You can add more utterances if you wish; the key thing is that they must start with ‘StackIntent’ to call the right Intent in the Lambda function.
Click Save when you’re done.

Next click on Configuration.
Service Endpoint Type should be ‘AWS Lambda ARN’.
Paste the ARN from the end of Step 3 into the 'Default' text box right under the endpoint type.
Select 'Yes' under Account Linking, after which a number of fields will appear.
For Authorization URL, enter the Invoke URL followed by '/alexa-login', e.g. 'https://abcd1234.execute-api.us-east-1.amazonaws.com/prod/alexa-login'.
Client ID should be the public key you generated for Google.
Add a domain for Domain List and make it 'google.com'.
Add two scopes, which should be 'https://www.googleapis.com/auth/userinfo.email' and 'https://www.googleapis.com/auth/userinfo.profile'.
Take note of the Redirect URLs, as you will need to use one of them soon.
Authorization Grant Type should be 'Auth Code Grant'.
Set Access Token URI to 'https://accounts.google.com/o/oauth2/token'.
Enter your Google secret key under Client Secret.
Set Client Authentication Scheme to 'Credentials in request body', then click Save.

You need to go back to the Google credentials you made and add one of the Redirect URLs from the Configuration page to 'Authorized Redirect URLs'.
Make sure to save the credentials.

Go to Publishing Information in the Alexa Skill.
Pick a category and sub category; we recommend Productivity - Organizers & Assisstants, but you can pick whatever you want.
You must enter some testing instructions.
Add the two skill descriptions, and enter a few example phrases.
You must also upload a small and large icon.
When all of that is done, click Save.

Go to Privacy & Compliance.
The first question should be No, the second Yes, and the third No.
Check Export Compliance and select No for the advertising question.
For the Privacy Policy URL you can enter 'https://bitscoop.com/privacy'.
Finally, save this.

### Enable and run in Test mode
The rest of these instructions assume you will not publish your copy, but just want to run it in test mode.

At this point, you should see the 'Skills Beta Testing' box on the left change and a button to 'Beta Test Your Skill'.
This means that all necessary information has been entered and you can now run the app.
Click on this button, then enter some emails of testers and click 'Update Testers'.
Finally click 'Start test' in the bottom right.
You should be taken to a page with an Invite URL.

For instructions on how to enable and link this skill, see the instructions in the [configure](../configure) tutorial.
