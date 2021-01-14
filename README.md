# TuneIn

A WebSocket server used to transmit information to any TuneIn app that tries to connect to it via its HTTP url

## Setup

1. Create a Spotify application at https://developer.spotify.com/dashboard/applications (make sure to keep your application's page open for later)

2. Click edit settings
<img src="https://i.imgur.com/jdZYARb.png" width="800" />

3. Enter `http://localhost` as a redirect uri and click "Add"
<img src="https://i.imgur.com/2M2FJyT.png" />

4. Go to `https://accounts.spotify.com/authorize?client_id=<YOUR_CLIENT_ID>&redirect_uri=http://localhost&scope=user-read-playback-state&response_type=code&show_dialog=true` (replace `<YOUR_CLIENT_ID>` with your actual client's id) and click agree
<img src="https://i.imgur.com/1q1mqah.png" height="500" />

5. You should see something like this
<img src="https://i.imgur.com/tAijCLo.png" width="500" />

6. Copy the url in your search box
<img src="https://i.imgur.com/BJci7NI.png" width="900" />

7. Open DevTools by pressing Ctrl+Shft+I (or the combination specific to your browser)

8. Then navigate to to "Console" tab (or your browser's equivalent) and paste the url between two single quotes
<img src="https://i.imgur.com/qtLKelN.png" width="600" />

9. At the end of the line type `.split("=")[1]`, press enter, and save the output somewhere for later

10. Go to https://www.base64encode.net/

11. In the text box enter `<YOUR_CLIENT_ID>:<YOUR_CLIENT_SECRET>` (replace `<YOUR_CLIENT_ID>` and `<YOUR_CLIENT_SECRET>` with your actual values from https://developer.spotify.com/dashboard/applications

12. Press "Encode" and copy the output

10. Open `cmd` on Windows or a terminal on macOS/Linux.

11. Type `curl -H "Authorization: Basic <OUTPUT_HERE>" -d grant_type=authorization_code -d code=<CODE_FROM_EARLIER> -d redirect_uri=http%3A%2F%2Flocalhost https://accounts.spotify.com/api/token > output.txt` (replace `<OUTPUT_HERE>` with your copied output and `<CODE_FROM_EARLIER>` with your saved code from step 9)

12. Open `C:\Users\<your_username>\output.txt` on Windows (or the equivalent for your operating system)

13. It should say something like `{"access_token":"BQCRWpB8.....1hcxKsks","token_type":"Bearer","expires_in":3600,"refresh_token":"AQD.....FVUPjQ","scope":"user-read-playback-state"}`. If it doesn't you will need to restart from step 4
<img src="https://i.imgur.com/uxPncLR.png" />

14. Fork this repository. Be sure to make your fork private!

15. In your fork create a file called `config.json` in the root directory

16. Enter this context (replace all necessary values)
```json
{
  "client_id": "your client id",
  "client_secret": "your client secret",
  "access_token": "access_token from output.txt",
  "refresh_token": "refresh_token from output.txt",
  "expires_in": 3600,
  "fetched_timestamp": "the current timestamp (you can get it from https://www.currenttimestamp.com/). remove the double quotes after pasting"
}
```

16. Go to https://www.heroku.com/ and login/sign up. You should be redirected to https://dashboard.heroku.com/apps

17. Create a new app
<img src="https://i.imgur.com/fCbOI1H.png" />

18. Choose your app name and region. Then click "Create app"
<img src="https://i.imgur.com/nrJFGWq.png" />

19. Under "Deployment method" click "GitHub" then "Connect to GitHub"
<img src="https://i.imgur.com/EvCIzMC.png" />

20. Authorize Heroku
<img src="https://i.imgur.com/GTgPefE.png" />

21. Under "Deployment method" there should be an area like this
<img src="https://i.imgur.com/z9VeTvz.png" />

22. Type "tunein-server" (or the name of your fork) and click search
<img src="https://i.imgur.com/XwyB3bT.png" />

23. Next to your repository click "Connect"

24. Scroll down to "Manual deploy" and click "Deploy branch

