# bs
IDPA

## Setup
```
1. Install XAMPP. You need MySQL and Apache.
2. Click on Shell in XAMPP
3. Start both
4. Enter "mysqladmin.exe -u root password root"
5. Close Shell
6. Click Config and select "phpMyAdmin"
7. change the password to 'root' (it's empty)
8. Restart MySQL and Apache
9. Log into phpmyadmin
10. Create new database called "bs_db"
11. Go to import and select the "db.sql" file
12. Click ok
13. Install NodeJS 9.x.x
14. In the root folder create a file called "cookies.json"
15. Open terminal in the root folder
16. Enter "npm install"
17. To start the project enter: "npm start". It's available under "localhost:3000"
18. You may want to logout on the website to flush the cookies first to let the dev server setup properly
19. For the unit tests and coverage run "npm test"
20. Coverage is also saved as html files in the folder "coverage". Mainfile: index.html
21. To make a release type "npm run build"
22. To serve the release type "npm run serve"

NOTES: Do not type "npm run report-coverage"!!!!
```
