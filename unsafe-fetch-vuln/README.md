# Unsafe fetch vulnerability

## Brief theory

When fetching content from third party content providers, extensions should take care to santizie the fetched content to avoid getting injected with malicious code. Even if the extension programmer trusts the third party content provider, there is no way to guarantee that the content provider has not been compromised.

This extension showcases the risks of fetching data and injecting it as HTML in the extension, without sanitizing it. By returning malicious code, the content provider is able to fool the extension into leaking the user's browser cookies.

## How to run

### Web server

In the `web-server` folder, run `npm install` to fetch required dependencies (this will create the `node_modules` folder, containing the dependencies). Then, run `node app.js` to start the server. If you are using port 3001 for something else, you can change the port in `app.js` (don't forget to change the other occurrences of 3001 in this README as well).

When the web server is running, you can visit `localhost:3001/hacker/foo` to verify that you see the following message in the terminal:  

```
New request to /hacker: foo
```

To make the web server externally accessible, you can use [ngrok](https://ngrok.com/) as described in the [main README](https://github.com/andreaskth/securing-chrome-extensions#how-to-make-web-server-externally-accessible-with-ngrok). Once you have a URL for the server, copy that URL to the `URL` variable in `app.js`. As an example, this URL would be `https://d6ecc19b8dc0.ngrok.io` based on the image in the main README.

If you wish, you can also change the `DEBUG` and `HACKER_MODE` variables in `app.js`. The `DEBUG` flag will toggle `alert()`s for different stages of the attack, and the `HACKER_MODE` flag toggles whether the web server returns benign content or not.

### Extension

In the background script of the extension (`extension-fetches-script/background.js`), change the `contentURL` variable to contain the same URL as for the web server (in our example from above, `https://d6ecc19b8dc0.ngrok.io`). **NOTE** that you should only replace the *domain* part of the URL, not the entire path (i.e. keep the `/fetch` part).

Next, follow the instructions in the [main README](https://github.com/andreaskth/securing-chrome-extensions#how-to-load-extensions-into-your-browser-locally) to load the extension into your browser locally. When this is done, grab the extension's ID, and add it in the `extensionID` variable in the extension's content script (`extension-fetches-script/content.js`).

## Results
Now, when you navigate to any webpage containing an HTML element with `id=content` – such as [this page](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) – the extension will insert content from your web server into the page. If `HACKER_MODE` is disabled, benign content is shown:

![Benign content](./images/cors-with-content.png "Benign content")

---

And when `HACKER_MODE` is enabled (emulating a malicious or compromised content provider), nothing is shown to the user:

![No content](./images/cors-no-content.png "No content")

---

But, in the terminal you will see the leaked cookies of the user:

![Leaked cookies](./images/leaked-cookies.png "Leaked cookies")

## How to fix

As mentioned in the beginning of this README, the problem here is that the extension trusts the content provider to return benign content. To solve this, the extension should sanitize the content it fetches. For example, if we expect the content provider to return only certain HTML tags, it makes sense to remove any other tags if they are sent.

An even better idea might be to instead fetch only "plain" data from a content provider (such as plain text) and then have the extension take care of what the HTML should look like. If data fetched from the content provider is treated as text, it does not matter what the "payload" looks like, since it will not be executed.