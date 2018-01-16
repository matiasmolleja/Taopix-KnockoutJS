# Taopix-KnockoutJS

[Taopix](http://taopix.com) provides an example site for its Multiline Basket API. It uses JQuery to update the DOM. I need to use that API in different sites and the databinding features of KnockoutJS are very good at providing the separation between behaviour and presentation that I require.
So I made this thing.


## Disclaimer
The example site provided by Taopix is extremely simple. Just an empty site to quickly understand what's needed. This repo is the same. You need to adapt it to your own site or online shop. I did that for a couple of Nopcommerce powered sites and it works like a charm for me.

I don't include the original Taopix files, you have to get it from Taopix, and add to them the files in this repo.

The version of the Taopix script I have used is "Version 2.0.0 - Thursday, 27th April 2017". 

## How it works
The example from Taopix is almost unmodified. It manages all the logic regarding communication with the server, localization, cookie management, etc...

My code overrides the functions that handle some of the responses from the server to update a couple of KnockoutJS ViewModels. The result is that, instead of JQuery searching for some ids and class names in the DOM, which creates unwanted coupling, we update the data in the viewmodels and from that point on KnockoutJS takes care of keeping the view in sync with them. After that, if you need to use the API in several sites you will only need to update the html and css, keeping the javascript intact.

For the override to be effective you only need to be sure that tpxBasketAPICustomize.js is loaded after the original file, tpxHighLevelBasketAPI.js.
If you do it that way, when an update arrives from Taopix, chances are that the only thing you need to do is replace the old file.


## How to use

* First put online the example site that Taopix provides. Once you have it working, use the modifications provided here.

* Replace index.html and hlcreate.html.

* Copy tpx-ko.css to ./css

* Copy all javascript files to ./js

Edit tpxBasketAPICustomize.js. Use your server's url in the line that says: var kServerURL = "";

See the site working. And then use it as a reference to include it in your own site.


