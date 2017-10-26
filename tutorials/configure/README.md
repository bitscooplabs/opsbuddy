# Configure Ops Buddy

## Set up Ops Buddy account
Go to https://opsbuddy.bitscoop.com (the Invoke URL if you have set up your own copy).

If you click the sign up button, you should be redirected to a prompt from Google authorizing Ops Buddy to have access to your public info.
After authorization, you should be redirected back to the homepage, where you now have an account with the demo project.

From here you can set the credentials and settings for the four services as well as create a Connection to Google for signing the Google Analytics calls.
The Connection you create can be with a different Google account than you used to sign up for the Ops Buddy account, but it must have access to the Google Analytics data you want to retrieve.

If you log out, then click log in, you should be automatically logged back in, though if you have more than one Google account you will have to click on the one you want to use for the login.


## Set up service accounts
You must set up and configure accounts for Postman, Google, and StatusCake to retrieve information from them.
GitHub does not require any setup since it only pulls from public repos, which does not require any authentication, but you do have to enter the repo name and the repo owner name.

### Postman
You will need to create a Postman account at https://www.getpostman.com/.

In Postman, create a Monitor for an API you wish to test, then click on the Monitor.
The Monitor’s ID should be the last thing in the URL path, e.g. https://<appname>.postman.co/monitors/<monitor_id>.

Go to 'Integrations' on the main menu, select 'Postman Pro API', and then create a new key.

Enter the Monitor ID and API Key into the Ops Buddy configuration, and make sure to enable Postman.

- Postman Pro API Documentation:  https://docs.api.getpostman.com/

- Postman Monitor: https://www.getpostman.com/docs/monitors

- Postman Documentation: https://www.getpostman.com/docs/

### Google Analytics
When signed into a Google account, go to the [Google API Console for Analytics](https://console.developers.google.com/apis/api/analytics.googleapis.com/overview) and make sure Analytics is enabled.

Next go to [Google Analytics Settings](https://analytics.google.com/analytics/web/#management/Settings/), then select the View you want to use in the right-hand column and then ‘View Settings’ underneath that.
Under Basic Settings you should see the View ID; it should look like ga:123456789.
Enter this into the Ops Buddy Configuration and save.

You must also click the button 'Create Google Connection' and follow the prompts that come up to give Ops Buddy permission to use Google Analytics on your behalf.

- Google Analytics API Documentation: https://developers.google.com/analytics/

- Google API Console for Analytics: https://console.developers.google.com/apis/api/analytics.googleapis.com/overview

### StatusCake
You will need to create a StatusCake account at https://www.statuscake.com/.

Go to 'User Details' on the main menu and take note of your Username, and then select 'API Keys' to find your API key.
Click on 'New Test' on the left-hand side and configure it as desired, then click 'Save Now' in the lower left-hand corner.
View the Details for that test; the Test ID can be found in the URL under the ‘tid’ parameter.

Example: Test ID 7654321 is derived from

https://app.statuscake.com/AllStatus.php?tid=7654321

You will need to enter the Test ID, API Key, and Username in the Ops Buddy Configuration.
Make sure to save them.

- StatusCake API Documentation: https://www.statuscake.com/api/

# GitHub
The GitHub endpoint used for this example is publicly accessible and does not require an API key or GitHub account.
This call will only succeed if the repo in question is public.
If you set up a copy yourself, you could modify the code to create Connections to GitHub in a similar manner to how it creates Connections to Google, which would allow users to get information about private repos.

All you have to do is enter the repo name and repo owner name in the configuration and save it.

Example: https://github.com/nodejs/node

Repo Name is 'node' and Repo Owner Name is 'nodejs'.

 - GitHub API Documentation https://developer.github.com/

## Install and link Alexa skill
Search for the skill 'BitScoop Ops Buddy' and install it.
(If you are running your own copy, [Sign in to an Alexa account](https://alexa.amazon.com) with an email for which you enabled beta testing, then follow the Invite URL you received from the Beta Test page to install the beta version of your skill.)
You should be taken to the page for that skill, but if not go to Skills, then click on 'Your Skills', then select the new skill.
Click on Enable, then click on 'Link Account' when that appears.
Sign in with the same Google account you used to sign up for your Ops Buddy account.
If all has succeeded, you should see a page saying the skill was successfully linked.

You should now be able to ask any Alexa device 'Ask Ops Buddy how's the stack doing' (for your own copy, replace 'Ops Buddy' with whatever you used for the invocation name), and it should return information from whatever services you enabled and configured properly in the front-end app.
[EchoSim](https://echosim.io/) is a handy Alexa tester if you do not have another device available.
