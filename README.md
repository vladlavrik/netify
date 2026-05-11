## `Netify`
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
- Adding an extra response delay
- Cancel requests on the client.  
- The above changes can be made according to predefined rules, by script or by making changes to an intercepted request (like breakpoint).
----

## Building from Source

### Prerequisites
- Node.js 18 or later (LTS version recommended)
- npm

### Build Instructions

1. Install dependencies:
```bash
npm install
```

2. Build for development (with watch mode):
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

The built extension will be in the `build/` directory. Load it in Chrome:
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `build/` directory

#### Troubleshooting

If you encounter the error `"Error: error:0308010C:digital envelope routines::unsupported"`, use the OpenSSL legacy provider:
```bash
NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

----

Netify is fully free and open source. You can thank the author by making a small donation  
[!["Donate with PayPal"](screenshots/donate-button.png)](https://www.paypal.com/donate/?hosted_button_id=49WGRXS8GF9PU)
