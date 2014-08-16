Taggability
===========

Taggability is a tool that allows you to assign multiple tags to multiple
articles from your Readability reading list. It helps you maintain a clean and
organized article collection.



How it works
------------

Check out [taggability.io][1] to see it in action. All you need is a Readability account.



Install
-------

You need [Node.js][11] installed. Clone/Download this repository. Open your console and go to the directory.

**Install with:**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ npm install
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**API keys**

Create a `config.json` file and enter your Readability API credentials as follow. ([get yours here][10])

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
	"key" : "MY_API_KEY_HERE",
	"secret" : "MY_API_SECRET_HERE"
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(Optional) If you want to run the app on a remote server, you need to add a line in your `config.json` as follow (without `http://` nor the trailing `/`):

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	"url" : "www.myawesomeurl.com"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


**Run with:**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$ node app
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once the server is running, go to `http://localhost:3000`.



To Do (already planned)
-----------------------

- Refactor app.js to separate routes, server, etc.
- Add auto-loading pagination for bookmarks.
- Display notifications for user actions (success/failure).
- Responsive layout for tablets.



About
-----

I'm [Sam][13], a web designer & front-end developer from Paris, France.

I'm an intense user of Readability, where I like to keep important articles to refer to someday.

After a couple of years using the (great) service, I had more than 1,500 articles in my reading list. None of them was tagged. Manually editing all those bookmarks with the regular Readability interface wasn't an option, so I decided to create a tool that would help me do that.

This was also an excuse to create an app as a side project and play with Node.js.



Contribute
----------

You are strongly encouraged to make Taggability better. Dig into the code, report a bug, suggest something, share the love... Contact me on [Twitter][13] or by email at hello@taggability.io!



Disclaimer
----------

I’m not a *real* back-end developer :) so please forgive me for any mistakes or bad
practice in the code.


Credits
-------

Fonts by [Typekit][2] & icons by [Entypo][3].

Taggability is built on [Node.js][4] using the following open-source resources:

-   [passport-readability][5] by Jared Hanson

-   [node-readability-client][6] by Robin Murphy ([forked][7])

-   [jQuery-Tags-Input][8] by XOXCO

And, of course, the [Readability Reader API][9].

**Thank you** [Guillaume C.][14] & [Guillaume C.][15] for your precious advice!



License
--------

This project is published under the MIT License (MIT).

2014 - Created by [Samuel Lemaresquier][13].



[1]: <http://taggability.io>

[2]: <http://typekit.com/>

[3]: <http://entypo.com/>

[4]: <http://nodejs.org/>

[5]: <https://github.com/jaredhanson/passport-readability>

[6]: <https://github.com/robinjmurphy/node-readability-api>

[7]: <https://github.com/twekz/node-readability-api>

[8]: <https://github.com/xoxco/jQuery-Tags-Input>

[9]: <https://www.readability.com/developers/api>

[10]: <https://www.readability.com/settings/account>

[11]: <http://nodejs.org/>

[12]: <https://npmjs.org/>

[13]: <http://twitter.com/twekz>

[14]: <http://github.com/aout>

[15]: <http://github.com/gcasalis>