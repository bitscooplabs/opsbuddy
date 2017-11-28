# 1 . Create accounts, add API maps to BitScoop, and set up authorization
First, you need to [create a BitScoop account](https://bitscoop.com/signup) as well as [an AWS account](https://portal.aws.amazon.com/billing/signup) and a Google account.

You will need to add five Maps to your BitScoop account as detailed below.

Also make sure that you have created an [API key for BitScoop](https://bitscoop.com/keys) with full permissions to access data, maps and connections, as all calls to the BitScoop API must be signed with one.
Permissions can be modified by clicking on the 'Details' button for the key once it has been created; by default keys have no permissions enabled.

## Add API Maps to BitScoop

Templates of the Maps you need to add are below.
Just click on the 'Add to BitScoop' button next to each one.

| API Map   | File Name       |                                                                                                                                                                                                                                    |
|----------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Postman Pro API Monitors | postman.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/postman.json) |
| Google Analytics Data | google_analytics.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/google_analytics.json) |
| Google Sign-In | google_sign_in.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/google_sign_in.json) |
| StatusCake Health Alerts | statuscake.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/statuscake.json) |
| GitHub Issues | github.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-ops-buddy/master/fixtures/maps/github.json) |

Upon clicking each button, you will be redirected to BitScoop and will see the JSON for the map you just added.
Click the ‘+ Create’ button in the upper right-hand corner to save the map.
Make sure to add all five maps.

### Extra steps for Google maps
For the two Google maps, you will need to add OAuth2 auth_key and auth_secret fields from credentials you will generate.
This will allow the app to create Connections for each user that contain the authentication data necessary to sign calls for social login and calling the Analytics API.
Since you need to have information from the map before you can create the credentials, leave those fields as-is, and come back and edit those maps later when the credentials are ready.

When signed into a Google account, go to the [Google API Console for Analytics](https://console.developers.google.com/apis/api/analytics.googleapis.com/overview) and make sure Analytics is enabled.
Do the same for [Google People API](https://console.developers.google.com/apis/api/people.googleapis.com/overview).
Next click on [Credentials](https://console.developers.google.com/apis/credentials) on the left-hand side, underneath ‘Dashboard’ and ‘Library’.
Click on the blue button ‘Create Credentials’ and select ‘OAuth client id’.
Choose application type ‘Web application’, then in ‘Authorized redirect URIs’ enter the Callback URL that can be found on the Details page for the Map you created for Google Analytics; if it's not present, enter https://auth.api.bitscoop.com/done/<map_id>.
Also enter the Callback URL for the Google Sign-In Map.
Click ‘Create’ twice; it should show a pop-up with your client ID and secret.
Enter these in the two Google API Maps as the auth_key and auth_secret, respectively, in the ‘auth’ portion of the maps.

[We have more documentation and a video tutorial on the topic of Connections if you wish to learn more.](https://bitscoop.com/learn)

#### Why multiple maps for Google?

The reason there are separate maps for these two processes is that we want the use of Google accounts to be unique for sign-in, but not for Google Analytics.
If someone has already signed up for an OpsBuddy account with Google account 12345, you can't let anyone else create an OpsBuddy account with it without making login impossible, as you wouldn't know which OpsBuddy account was the right one to log in.
The Sign-In map has a uniqueness constraint so that this doesn't happen.
However, you do want any OpsBuddy account to use any Google account for its Connection for Google Analytics, and it's perfectly fine if multiple OpsBuddy accounts use the same Google Account for Analytics.
To this end, the Analytics map does not have a uniqueness constraint.

Having both services in the same map would be impossible, as the uniqueness constraint is applied to all connections.
You wouldn't be able to use a Google account for Analytics if it had already been used for Sign-In
If you used the Sign-In account for Analytics, you a) could not use Google accounts for Analytics across multiple OpsBuddy accounts and b) would have to sign up for an OpsBuddy account with the Google account you wanted to pull Analytics data from.
