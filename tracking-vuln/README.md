# Content provider tracking vulnerability

## Brief theory

TODO
- HTTP referer header is leaked

## How to run

### Web server

As outlined in the [main README](../README.md) enter the web server folder (here called 
*image-provider-webserver*) and run `npm install`, and then run `node app.js` in the same folder to start the server. The default port used by the server is 3000; if you are using this port for something else you can change the port in `app.js` (don't forget to change the other occurrences of 3000 in this document as well).

When the web server is running, you can visit `localhost:3000` to verify that you can see a list of links pointing to images.  

To make the web server externally accessible, you can for example utilize *ngrok* as described in the [main README](../README.md).

### Extension

In the content script `egg.js` change the `imageSrc` variable on the first line to point to the URL where the web server is hosted. The addition of `"/images/"` on the second line should not be removed since this path is necessary to access the individual images.

Next, follow the instructions in the [main README](../README.md) to load the extension into your browser locally. 

## Results
Every website you visits will contain a lovely easter egg for you to collect! 

![Easter egg at the KTH website](./images/egg_at_kth.png "Easter egg at the KTH website")

However, every time you visit a website and is greeted by an easter egg, your IP-address and the scheme and the domain of the page is printed in the terminal where you are running the webserver. For example, if you visit `https://www.kth.se/utbildning` then `https://www.kth.se/` is printed along with your IP-address.

## How to fix

TODO
- Don't load images from third-party sites
- Overwrite the HTTP referer header