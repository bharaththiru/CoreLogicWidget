# WidgetUpskilling Application

This application allows you to search for property details and interact with Zoho CRM.

## Setup

1. Install the Zet CLI using npm:

```bash
npm install -g zet
```

2. Navigate to Directory

   ```bash
   cd WidgetUpskilling
   ```

3. Run Widget

   ```bash
   zet run
   ```

4. Open another terminal, navigate to app directory inside WidgetUpskilling and run the server:

   ```bash
   cd WidgetUpskilling/app
   node server.js
   ```

## Usage

1. If it has been more than 12 hours since the last use, click the blue Generate Token button in the application. This will generate a new CoreLogic token and display it in the server-side terminal.
2. Copy this token and assign it to the accessToken variable in the server.js file.
3. Terminate the server (Ctrl+C in the terminal) and rerun it to make the changes take effect.
4. Refresh the widget page.
5. Search for an address (e.g., ‘2 Albert Avenue’) and click Go.
6. Choose the desired address from the search results to see the core details.
7. At the bottom of the core details, there is a Generate Zoho Token button. If it has been more than 1 hour since the last use, click this button to generate a Zoho token.
8. To do this, you need to go to the Zoho API console and create a grant token with all module permissions. Copy this grant token, and use it as the zohoGrantToken value in both the script.js and server.js files.
9. Terminate the server and rerun it to make the changes take effect.
10. After this, you can just click the Refresh Zoho Token button if the access token expires after 1 hour.

## Known Issues

Currently, there is an error where the generated access token is returning a response saying “invalid token”, although the permissions were ALL permissions regarding modules. This issue is being investigated.

