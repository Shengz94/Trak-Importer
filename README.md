# Trak Importer
[Link to the web-app](https://shengz94.github.io/Trakt-Importer/)

## Description
This app imports a list of titles to the history of your Trakt account.

For now it only imports movies and whole shows (all episodes and seasons).

It's splitted into 4 main views.

### Login
This view is composed by only one button that redirects you to Trakt page to log in.

When you log in sucssesfully, the Trak page will redirects you to this web app again.

### Home
Here you have to upload a text (txt) file with the titles you want to import to Trakt.

The format of the txt file should be one title per line.

### Title management
In this view you have to choose which title you want to import to Trakt and which match.

If the app couldn't find any title that match the title from the text file, it will show it and the checkbox will be disabled.

### Result
In this last view you can check which title from the text file was imported and the match information from Trakt (included a link to the match).

### Top Bar
Besides the 4 main views, each view contains a top bar that includes:
* Logo of Trakt (redirects to the Trakt website).
* Web-app's name.
* Logo of Github (redirects to my github's profile).
* User info (User name and avatar).
* Log out button.

# Disclaimer
* This app is not 100% tested, so it can corrupt your Trakt account's history. **Use it at your own risk, I'm not responsible for any damage caused to your account's history.**
