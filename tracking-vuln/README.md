# Content provider tracking vulnerability

## Brief theory

We have an extension that spawns easter eggs on the websites you visit and let's you collect these eggs. This extension loads the images from a third-party webserver. Each time a new egg is to be spawned, an HTTP-request is sent to this third-party image provider. Since we spawn an egg each time the user loads a page, an HTTP request is sent each time the user loads a page.

The problem with this extension is that when the HTTP requests are sent they contain not only the IP-address of the user but also the name of the website (more precisely [the domain, the host and the scheme](https://webmasters.stackexchange.com/questions/69477/how-to-understand-scheme-host-domainport-path-filename)) the request is sent from; set in the so-called HTTP "referer" header. This means that each time the user loads a website, its name and the IP-address of the user is sent to the third-party image provider. This allows the image provider to construct the browsing history of a user if it so wishes.

## How to run

### Web server
As outlined in the [main README](../README.md) enter the web server folder (here called 
*image-provider-webserver*) and run `npm install`, and then run `node app.js` in the same folder to start the server. The default port used by the server is 3000; if you are using this port for something else you can change the port in `app.js` (don't forget to change the other occurrences of 3000 in this document as well).

When the web server is running, you can visit `localhost:3000` to verify that you can see a list of links pointing to images.  

To make the web server externally accessible, you can for example utilize *ngrok* as described in the [main README](../README.md).

### Extension
The vulnerable extensions is located in *vulnerable-easter-eggstention*. In the content script `egg.js` change the `imageSrc` variable on the first line to point to the URL where the web server is hosted. The addition of `"/images/"` on the second line should not be removed since this path is necessary to access the individual images.

Next, follow the instructions in the [main README](../README.md) to load the extension into your browser locally. 

## Results
Every website you visit will contain a lovely easter egg for you to collect! 

![Easter egg at the KTH website](./images/egg_at_kth.png "Easter egg at the KTH website")

However, every time you visit a website and is greeted by an easter egg, your IP-address and the host, the scheme and the domain of the page is printed in the terminal where you are running the webserver. For example, if you visit `https://www.kth.se/utbildning` then `https://www.kth.se/` is printed along with your IP-address.

## How to fix
The first thing to consider is to not load the images from a third-party provider: this would eliminate this issue altogether. Instead you could just bundle the images with the extension. Here, we will instead showcase an alternative solution if you for some reason insist on loading the images from a third party provider.

(Note that when referring to line numbers, the original lines are intended, NOT the lines after you have started making changes. Also note that we provide a fixed version of the extension so you do not have to follow along with these instrcutions to test it out)

### egg.js of the vulnerable extension
The first thing we have to do is to replace the way we are getting the image; when directly setting the `src` attribute we have no control over the outgoing HTTP-request. Thus we remove line 38. We also replace line 66 (which would add the egg to the page) with the following:
```javascript
fetch(imageSrc + color + "_egg.png", {referrerPolicy:"no-referrer"})
	.then(res => res.blob())
	.then(blob => {
		imgSrc = URL.createObjectURL(blob)
		egg.src = imgSrc
		document.body.prepend(egg);
	})
``` 
This code makes an HTTP-request to the image URL and specifies that we do not want to include the "referer" header. Then it transforms the response so that we get a URL that we can use for source for our image. Lastly we add the egg to the page.

However, this introduces a new problem. When sending our HTTP-request in this fashion we get a new header in the request: "origin". This header will similarly to the "referer" give away our visited website. To fix this we have to send our request through a proxy. We have provided a simple proxy server in the folder *proxy-server*, see the [section below](#proxyServer) for details. 

We create a variable for the proxyServer address at the top of the file `let proxyServer = "the_proxy_address"`, and update the code snippet above to:
```javascript
fetch(proxyServer + "?url=" + imageSrc + color + "_egg.png", {referrerPolicy:"no-referrer"})
	.then(res => res.blob())
	.then(blob => {
		imgSrc = URL.createObjectURL(blob)
		egg.src = imgSrc
		document.body.prepend(egg);
	})
```
Here we send the image URL as a query parameter to our proxy.

### app.js of the image-provider
While this server is supposedly out of your control (hence why it being able to track you is a problem) it is worth noting that due to the change of how we perform the HTTP-request, it is necessary that the server allows [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) for your origin for any image you request. This would look something like this in the server code: `res.header("Access-Control-Allow-Origin", "*");`.

### <a name="proxyServer">Proxy server</a>
In the *proxy-server* folder, the `app.js` file contains a simple proxy server. This proxy server will serve the purpose of hiding your "origin" by being the one issuing the HTTP-request to the image provider. All it does is receiving your original HTTP-request and then redirecting it to the image provider.

 To run it enter the folder and run `npm install` and then `node app.js`. The default port is 3001; this can be changed in the `app.js` file. Similarly to the malicious webserver (the image provider) this proxy needs to be made visible (for example with *ngrok*), and then have the URL it is visible on added to the `proxyServer` variable in the `egg.js` file.

### How to run the safe extension
If you want to see all changes made between the vulnerability and the fix, have a look at [this commit](https://github.com/andreaskth/securing-chrome-extensions/commit/89991010ae52044e0ffa748dae207573cf43afa1). The folder *rerouted-http-easter-eggstention* contains the safe version of the extension. To summarize what you have to do to run this:
* Make both servers visible outside of your local environment (for example through *ngrok*).
* Update the URL of the image-provider (the malicious server) on *rerouted-http-easter-eggstention/egg.js* line 1.
* Update the URL of the proxy server on *rerouted-http-easter-eggstention/egg.js* line 3.
* Run `node app.js` in both the *proxy-server* folder and the *image-provider-webserver* folder (change the necessary ports beforehand if you have port 3000 and/or 3001 occupied).
* Load the safe extension of folder *rerouted-http-easter-eggstention* into your browser and load a website.

The proxy server will still see what website you visit, but this is fine since you control it. The image provider should not be able to see it anymore.