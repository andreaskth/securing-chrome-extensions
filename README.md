# Securing Chrome-extensions

This repository contains three showcases of vulnerable Chrome extensions. They were made to exemplify some risks with creating extensions without considering security aspects. Since extensions execute with elevated privileges, any possible vulnerabilities may be exploited by malicious websites to carry out privileged tasks on behalf of the website (a sort of *confused deputy*-attack).

The three vulnerable extensions reside in sub-folders of their own, and each such sub-folder contains a README detailing some brief background theory and how to run the extension. The three extensions are:

* **unsafe-fetch-vuln** (available [here](TODO)), which is an extension that injects unsanitized content fetched from a third-party content provider, leading to leakage of user cookies
* **tracking-vuln** (available [here](TODO)), which is an extension that fetches content from a third-party content provider, inadvertently causing leakage of the user's browsing history to said content provider
* **SOP-vuln** (available [here](TODO)), which is an extension that allows websites to bypass the Same-Origin-Policy, allowing them access to the user's sensitive data

For more background information and possible fixes for the vulnerabilities in the extensions of this repo, you can refer to the report we wrote (also part of this project). It is available in pdf format [here](TODO). (TODO: Add pdf of report in repo, and link to it here.)

## How to make web server externally accessible with `ngrok`

To make a web server externally accessible, you can install [ngrok](https://ngrok.com/) and execute:

```
> ngrok http 3001
```

(replace '3001' with the port number of your server).

Then, look at the *forwarding* field in the `ngrok` output. This is the URL that you can use to access the server. As an example, this URL would be `https://d6ecc19b8dc0.ngrok.io` based on the image below:

![ngrok output](./images/ngrok.png "ngrok example output")

## How to load extensions into your browser locally

To load an extension into your browser locally for testing, go to the **Extensions** view in Chrome (available at: [chrome://extensions/](chrome://extensions/)). In the upper right corner, toggle "Developer Mode" to enable developer features. You should see three new buttons, as in the image below (upper left corner):

![dev-mode](./images/dev-mode.png "Extensions view, developer mode")

Choose **Load unpacked**, and select the extension's folder in the popup:

![choose-extension](./images/choose-extension.png "Choosing extension in popup")

If everything worked, you should now be able to see the extension among your other extensions:

![after-loading-extension](./images/after-loading-extension.png "Extensions view, after loading local extension")