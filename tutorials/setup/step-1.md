# 1 . Create accounts, add API maps to BitScoop, and set up authorization
First, you need to [create a BitScoop account](https://bitscoop.com/signup) as well as [an AWS account](https://portal.aws.amazon.com/billing/signup).
You will need to create a Postman Pro account, a Google account, and/or a StatusCake account to use those services in this demo.
The use of GitHub in ths demo assumes that you will be monitoring a public repo, so there is no authentication needed.
Google Analytics will require some additional steps to use OAuth2 to authenticate; see the section below for instructions on what to do.

For each API you are using, you will add an API Map to your BitScoop account using the “Add to BitScoop” buttons.
You can either enter any required API keys when you create the map or edit the source of that map later.

## Add API Maps to BitScoop

To quickly get started with what you'll need on BitScoop, you can add the following API Maps using the buttons below.
Note that you do not need to use all of these services for the demo to run, as the Amazon Lambda function that powers the Alexa Skill will adjust automatically based on how you configure it.
So you only need to add the ones to BitScoop that you want to try for yourself.
Make sure to substitute the values for the API keys, client IDs, and client secrets where appropriate.

| API Map   | File Name       |                                                                                                                                                                                                                                    |
|----------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Postman Pro API Monitors | postman.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/postman.json) |
| Google Analytics Data | google_analytics.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/google_analytics.json) |
| Google Sign-In | google_sign_in.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/google_sign_in.json) |
| StatusCake Health Alerts | statuscake.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/statuscake.json) |
| GitHub Issues | github.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/github.json) |


# Postman Pro
You will need a Postman Pro account and a Postman API key.
In Postman, create a Monitor for an API you wish to test, then click on the Monitor.
The Monitor’s ID should be the last thing in the URL path.
When you create the Lambda function, you will need to add the Environment Variable **‘POSTMAN_MONITOR_ID’** and set the value to be this ID.

Go to “Integrations” on the main menu, select “Postman Pro API”, and then create a new key. This key will be used in an Environment Variable in Lambda.

Make sure you are logged into BitScoop, then on our [GitHub page](https://github.com/bitscooplabs/bitscoop-ops-buddy/tree/master/fixtures/maps), click the ‘Add to BitScoop’ button next to Postman.
You will be redirected to BitScoop and will see the JSON for the map you just added.
Edit the JSON to insert your API key, then click the ‘+ Create’ button in the upper right-hand corner to save the map.

- Postman Pro API Documentation:  https://docs.api.getpostman.com/

- Postman Monitor: https://www.getpostman.com/docs/monitors

- Postman Documentation: https://www.getpostman.com/docs/

# Google Analytics
Make sure you are logged into BitScoop, then on our [GitHub page](https://github.com/bitscooplabs/bitscoop-ops-buddy/tree/master/fixtures/maps), click the ‘Add to BitScoop’ button next to Google Analytics.
You will be redirected to BitScoop and will see the JSON for the map you just added.
We don’t have an auth_key or auth_secret yet, so leave those fields as is.
Click the ‘+ Create’ button in the upper right-hand corner to save the map.

Calling the Google Analytics API requires OAuth2 authentication, which BitScoop handles for you with minimal work on your end.
You’ll need to add a Google OAuth2 auth_key and auth_secret to the API Map, which we will walk you through now.

Go to the [Google API Console for Analytics](https://console.developers.google.com/apis/api/analytics.googleapis.com/overview) and make sure Analytics is enabled.
Next click on ‘Credentials’ on the left-hand side, underneath ‘Dashboard’ and ‘Library’.
Click on the blue button ‘Create Credentials’ and select ‘OAuth client id’.
Choose application type ‘Web application’, then in ‘Authorized redirect URIs’ enter the Callback URL that can be found on the Details page for the Map you created for Google Analytics; it should be in the form https://auth.api.bitscoop.com/done/<map_id>.
Click ‘Create’ twice; it should show a pop-up with your client ID and secret.
These will be entered in the API Map as the auth_key and auth_secret, respectively, in the ‘auth’ portion of the map.

You will also need to go to [Google Analytics Settings](https://analytics.google.com/analytics/web/#management/Settings/), then select the View you want to use in the right-hand column and then ‘View Settings’ underneath that.
Under Basic Settings you should see the View ID, which you will set as the value for the Environment Variable ‘GOOGLE_GA_VIEW_ID’.
It should look like ga:123456789.

When you have finished the rest of this entire setup and log in to the app to configure your services, you will need to click the button 'Create Google Connection' and follow the workflow that you are redirected to.
This will create a Connection that is used to authorize your calls to Google Analytics.
[We have more documentation and a video tutorial on the topic of Connections if you wish to learn more.](https://bitscoop.com/learn)

- Google Analytics API Documentation:

 https://developers.google.com/analytics/
- Google API Console for Analytics:

 https://console.developers.google.com/apis/api/analytics.googleapis.com/overview

# Google Sign-In
You've already done most of the setup work already prepping the Google Analytics map.
Add the Google Sign-In map to your BitScoop account and add the same Auth Key and Secret you already obtained to it, then save it.
Finally, add the Callback URL for this map to the credentials' 'Authorized redirect URIs'.

### Why multiple maps for Google?

The reason there are separate maps for these two processes is that we want the use of Google accounts to be unique for sign-in, but not for Google Analytics.
If someone has already signed up for an OpsBuddy account with Google account 12345, you can't let anyone else create an OpsBuddy account with it without making login impossible, as you wouldn't know which OpsBuddy account was the right one to log in.
The Sign-In map has a uniqueness constraint so that this doesn't happen.
However, you do want any OpsBuddy account to use any Google account for its Connection for Google Analytics, and it's perfectly fine if multiple OpsBuddy accounts use the same Google Account for Analytics.
To this end, the Analytics map does not have a uniqueness constraint.

Having both services in the same map would be impossible, as the uniqueness constraint is applied to all connections.
You wouldn't be able to use a Google account for Analytics if it had already been used for Sign-In
If you used the Sign-In account for Analytics, you a) could not use Google accounts for Analytics across multiple OpsBuddy accounts and b) would have to sign up for an OpsBuddy account with the Google account you wanted to pull Analytics data from.

# StatusCake

StatusCake delivers accurate global website monitoring and downtime alerts.

You will need a StatusCake account and a StatusCake API Key.
You should create alerts on your vital dependent services and your public site.
Go to “User Details” on the main menu and take note of your Username, and then select “API Keys” to find your API key.
Get the Test ID by selecting ‘Tests’ from the main menu and select the test you wish to use.
The Test ID can be found in the URL under the ‘tid’ parameter.

Example: Test ID 7654321 is derived from

https://app.statuscake.com/AllStatus.php?tid=7654321

Make sure you are logged into BitScoop, then on our [GitHub page](https://github.com/bitscooplabs/bitscoop-ops-buddy/tree/master/fixtures/maps), click the ‘Add to BitScoop’ button next to StatusCake.
You will be redirected to BitScoop and will see the JSON for the map you just added.
Edit the JSON to insert your StatusCake Auth Key and Username.
Then click the ‘+ Create’ button in the upper right-hand corner to save the map.

- StatusCake API Documentation: https://www.statuscake.com/api/

# GitHub
The GitHub endpoint used for this example is publicly accessible and does not require an API key or GitHub account.
This call will only succeed if the repo in question is public.
If you wanted to monitor a private repo, you would need to modify the codebase to create Connections similar to how the Google Analytics workflow does and use the Connection to sign requests.

Make sure you are logged into BitScoop, then on our [GitHub page](https://github.com/bitscooplabs/bitscoop-ops-buddy/tree/master/fixtures/maps), click the ‘Add to BitScoop’ button next to the map for GitHub Demo.
You will be redirected to BitScoop and will see the JSON for the map you just added.
You do not need to add any information to this map.
Click the ‘+ Create’ button in the upper right-hand corner to save the map.

 - GitHub API Documentation https://developer.github.com/

Also make sure that you have created an API key for BitScoop with full permissions to access data, maps and connections, as all calls to the BitScoop API must be signed with one.
