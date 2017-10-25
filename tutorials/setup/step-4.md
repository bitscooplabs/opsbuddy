# 4. Deploy Frontend API code to Amazon Lambda, create API Gateway, deploy static files to S3
With all of the networking squared away, we now need to upload all of our project files to the appropriate services.

### Create Frontend Lambda Function
First we’re going to create a Lambda function to serve as the API views for rendering the main page, signing up new users, logging users in and out, and handling callbacks from the authentication process.
Go to [your Lambda functions](https://console.aws.amazon.com/lambda/home#/functions?display=list) and Create a new function.
Click 'Author from scratch'.
Name the function; for reference we’ll call this ‘opsbuddy-frontend’.
For Role select 'Choose an existing role', then select the 'opsbuddy' role we created earlier, then click 'Create function'.

Under 'Function code', make sure the runtime is ‘Node.js 6.10’ and the Handler is 'index.handler'.
Leave the Code Entry Type as ‘Edit Code inline’, as we need to modify the project’s code with some information we don’t have yet before we can upload it.

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
* SITE_DOMAIN (The domain of the API gateway; this will be filled in later)

Go to the Basic settings block and set the timeout to 15 seconds.
Open the Network block, select the ‘opsbuddy’ VPC we created and add the two ‘private’ subnets we created earlier, and add the ‘opsbuddy-lambda’ security group.
Finally, scroll back up to the top of the page and click Save (not Save and test, as we don't want to test run it).

### Create API Gateway for Frontend
Next we will create an API gateway to handle traffic to the endpoints that will serve up the views for this project.
Go to the [API Gateway home](https://console.aws.amazon.com/apigateway/home#/apis) and click Create API.
Name the API whatever you want; for reference purposes we’ll call it ‘opsbuddy’.
Finally click Create API.

You should be taken to the API you just created.
Click on the Resources link if you aren’t there already.
Highlight the resource ‘/’ (it should be the only one present), click on the Actions dropdown and select ‘Create Method’.
Click on the blank dropdown that appears and select the method ‘GET’, then click the checkmark next to it.
Make sure the Integration Type is ‘Lambda Function’.
Check ‘Use Lambda Proxy integration’, select the region your Lambda function is in, and enter the name of that Lambda function (e.g. opsbuddy-frontend), then click Save.
Accept the request to give the API gateway permission to access the Lambda function.

What we’ve just done is configure GET requests to the ‘/’ path on our API to point to the Lambda function that has all of the project’s views.
We’re using API Gateway’s Proxy integration, which passes parameters and headers as-is on both requests to and responses from the Lambda function.

We next need to add sub-routes for our other views.
Select the ‘/’ resource, then click the Actions dropdown and select ‘Create Resource’.
Enter ‘complete-login’ for the Resource Name, and the Resource Path should be filled in with this automatically as well, which is what we want.
Leave the checkboxes unchecked and click the Create Resource button.
When that’s been created, click on the ‘/complete-login’ resource and follow the steps above for adding a GET method to that resource.
Repeat this process for the resources 'alexa-login', 'complete-service', 'connections', 'login', 'logout', 'signup', and 'users'.
'/connections' needs a 'DELETE' method in additional to its 'GET', and '/users' does not need a 'GET' method but does need a 'DELETE' and 'PATCH' methods.
All of the others just need a 'GET'.

When you’ve done all of that, you should have one top-level resource ‘/’ and seven resources under that, ‘/complete-login’, '/complete-service', '/connections', ‘/login’, ‘/logout’, ‘/signup’, and '/users'.
Click on the ‘/’ resource, then click on the Actions dropdown and select ‘Deploy API’.
For Deployment Stage select ‘New Stage’ and give it a name; we suggest ‘prod’, but it can be anything.
You can leave both descriptions blank.
Click Deploy when you’re done.

The final thing to do is get the URL at which this API is available.
Click ‘Stages’ on the far left, underneath the ‘Resources’ of this API.
Click on the stage you just created.
The URL should be shown as the ‘Invoke URL’ in the top middle of the page on a blue background.
You need to copy this URL, minus 'https://', into the SITE_DOMAIN Environment Variable in the frontend Lambda function (don’t forget to Save the Lambda function).

### Build Static Files and Deploy to S3
Navigate to the top level of the project and run

```
gulp build
```

to compile and package all of the static files to the dist/ folder.

Next we’re going to create an S3 bucket to host our static files.
Go to S3 and create a new bucket.
Give it a name and select the region that’s closest to you, then click Next.
You can leave Versioning, Logging, and Tags disabled, so click Next.
For 'Manage Public permissions', click on 'Grant public read access'.
Click Next, review everything, then click Create Bucket.

Click on the new bucket, then go to the Overview tab and click Upload to have a modal appear.
Click Add Files in this modal and navigate to the ‘dist’ directory in the bitscoop-opsbuddy-demo directory, then into the directory below that (it’s a unix timestamp of when the build process was completed).
Move the file system window so that you can see the Upload modal.
Click and drag the 'static' folder over the Upload modal (S3 requires that you drag-and-drop folders, and this only works in Chrome and Firefox).
Close the file system window, then click Next.
Make sure to grant public read access under 'Manage public permissions'.
Click Next, then Next again, then review everything and click Upload.

### Update Frontend Code with Static URL and Deploy to Lambda
Lastly, go to src/templates/home.html and replace ***INSERT S3 BUCKET NAME HERE*** with the name of the S3 bucket you created earlier.
From the top level of the project run

```
gulp bundle:frontend
```

to compile the code for the Lambda function to the /dist folder.
Go to the Lambda function we created earlier, click on the Code tab, then for ‘Code entry type’ select ‘Upload a .ZIP file’.
Click on the Upload button that appears next to ‘Function package’ and select the .zip file in the /dist folder.
Make sure to Save the function.

If all has gone well, you should be able to hit the Invoke URL and see a page asking you to log in or sign up.
Instructions on what to do on this page found in the [configure](../configure) tutorial.
There is one more major step involved in setting up your own copy, and that involves setting up the Alexa skill.
