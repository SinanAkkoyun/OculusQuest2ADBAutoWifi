# OculusQuest2ADBAutoWifi
Connect your Oculus device (or any other Android ADB) via a simple command with WiFi!

# Installation:
```
npm i -g https://github.com/SinanAkkoyun/OculusQuest2ADBAutoWifi
```
Done! Now, call `adbwifisetup` whenever you wanna connect to your Quest.
(in order to enable scripts on windows run `set-executionpolicy remotesigned` as an admin)

YOU MAY NEED TO MODIFY THE SDK PLATFORM-TOOLS PATH AS I DID NOT IMPLEMENT AN AUTO DETECTION FOR NOW

# Developing
To develop on this, run:
```
git clone https://github.com/SinanAkkoyun/OculusQuest2ADBAutoWifi
cd OculusQuest2ADBAutoWifi
npm i
```
Make your desired changes. After that, run `npm i -g` in the directory in order to install it as a CLI tool.
Now, in order to connect, run:
`adbwifisetup`

Have fun!
