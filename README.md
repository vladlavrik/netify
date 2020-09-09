## `Netify`
Debugging proxy that will allow you to intercept and mutate requests from a web page
Netify is a debugging proxy that will allow you to intercept and mutate your requests, like Fiddler or Charles, but it more compact and implemented directly in the Chrome devtools.

<div align="center">
<img src="screenshots/promo.png" width="720" align="center">
</div>

### Features that Netify gives you:
- Filter requests for proxy by URL, method or type of resource.
- Redirect request to arbitrary URL.
- Adding, replacing and removing request headers.
- Replacing a request body with text/JSON, Base64 or form data.
- Replacing a response status code.
- Adding, replacing and removing response headers.
- Replacing a response body with a text value, Base64, or file's content.
- Cancel requests on the client.

### FAQ
Q. Netify shows a blank page when I open it, why is this happening?  
A. This is sometimes caused by your "Cookies and other site data" being set too strict, you can add an exception for the extension:    

1. Copy `chrome://settings/cookies?search=Sites+that+can+always+use+cookies` into the URL bar and press enter.    
2. Scroll down until you find the words "Sites that can always use cookies" highlighted in yellow.  
3. Click the "Add" button to the right of the highlighted words.  
4. Paste the extension ID (`mdafhjaillpdogjdigdkmnoddeoegblj`) into the "site" text box in the popup, then click the add button.    

If you still have netify open, right click the blank netify page and click "reload frame".    
If you already closed netify, just re-open it.    
The netify window should no longer give you a blank screen.    
