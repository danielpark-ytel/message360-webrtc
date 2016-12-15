# Overview

This repository holds and contains the source code for the Message360 WebRTC Project.
WebRTC is a service that enables our customers to utilize Real-Time Communications capabilities in their own applications.
Using our V2 Helper Libraries and this developer's version of our WebRTC platform, developer's can tweak and customize the platform and add features of their own.

* You can read more about WebRTC here: [https://webrtc.org/](https://webrtc.org).

The platform exists now as a simple HTML5/AngularJS application that depends on Helper Library methods to communicate with Message360.
The following section explains how to set up and install the WebRTC Platform.



## PHP Installation

### 1. Download script and navigate to desired directory.

1. The easiest way to install is via a bash script that we provide. You can download the script here: [https://google.com](Link to script).

2. After that, navigate to the directory you wish to install the WebRTC platform: `cd install_directory`                                                                                                                                                                                        

### 2. Running the installation script

1. Move the script into the installation directory.

2. We need to set executable permissions onto the script, this can be done by simply entering the following in to the terminal:

`chmod +x script.sh`

3. Replace 'script.sh' with the name of the script that was downloaded.

4. Once done, you can execute the script with `./script.sh`

5. **IMPORTANT**: During the `bower install` portion of the script, you may be prompted with an error: `Unable to find a suitable version for [package], please choose by typing one of the numbers below: `
    * Look for the number that says `is required by webrtc_client` and enter that option prefixed with a '!'. 
    * The '!' prefixed along with your choice will ensure that this choice is remembered for subsequent installs.

Here is a list things the script will be taking care of for you:
* Downloading the WebRTC platform source code from Github.
* Downloading the PHP Helper Library.
* The PHP Helper Library is dependent on Composer, the script will check for installations of Composer and install if necessary.
* Prompt for Message360 Account SID & Auth Token
* Generate Helper Library PHP files and automatically write and configure for usage with the account information provided.
* The WebRTC platform uses NPM and Bower to manage packages and dependencies, it will check to make sure you have NPM and Bower installed and will install if necessary.
* Run `npm install` && `bower install`
* `npm install` will also install Grunt Task Manager, once installed it will run a `grunt` to generate minified and concatenated source code for deployment.



## Deployment

Although you can install the WebRTC platform directly onto a web server, it is **recommended** however that you do an install locally first.
Here are some steps on how to perform a local install, set up a Github repository, and get the code onto a web server (if one is available to you).

### 1. Local Installation

1. Run the script and follow the instructions above on your local machine.

2. If the build went successfully, you should have a WebRTC build in the directory you performed the install, configured for your Message360 Account.

3. Create a Gihub repository to manage and hold this source code.

4. Add the remote origin url for the Github repository and do a `git commit` and `git push`.

5. Once the code is on Github, do an `ssh` into your web server (if you have your own servers available) and pull the repository code down from Github and into your server's webroot.
