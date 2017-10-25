# Configure Ops Buddy

### Set up and configure account
Go to https://opsbuddy.bitscoop.com (the Invoke URL if you have set up your own copy).

If you click the sign up button, you should be redirected to a prompt from Google authorizing the application that was created to have access to your public info.
After authorization, you should be redirected back to the homepage, where you now have an account with the demo project.

From here you can set the credentials and settings for the four services as well as create a Connection to Google for signing the Google Analytics calls.
The Connection you create can be with a different Google account than you used to sign up for the Ops Buddy account, but it must have access to the Google Analytics data you want to retrieve.

If you log out, then click log in, you should be automatically logged back in, though if you have more than one Google account you will have to click on the one you want to use for the login.

### Install and link Alexa skill
Search for the skill 'BitScoop Ops Buddy' and install it.
(If you are running your own copy, [Sign in to an Alexa account](https://alexa.amazon.com) and then follow the Invite URL you received from the Beta Test page to install the beta version of your skill.)
You should be taken to the page for that skill, but if not go to Skills, then click on 'Your Skills', then select the new skill.
Click on Enable, then click on 'Link Account' when that appears.
Sign in with the same Google account you used to sign up with the front-end app.
If all has succeeded, you should see a page saying the skill was successfully linked.

You should now be able to ask any Alexa device 'Ask Ops Buddy how's the stack doing' (for your own copy, replace 'Ops Buddy' with whatever you used for the invocation name), and it should return information from whatever services you enabled and configured properly in the front-end app.
[EchoSim](https://echosim.io/) is a handy Alexa tester if you do not have another device available.
