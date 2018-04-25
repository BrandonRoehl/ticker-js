# Ticker JS
This is a very simple JavaScript class designed to make it easy to have
counters on your website update with live data from a JSON source.

## Setup

Include the `js` and `css` file

```html
<script type="text/javascript" src="./ticker.js"></script>
```

Create an element that has the `ticker-js`, `data-url` and `data-value` set
wherever you want the ticker to be displayed

- `data-url` should be the route to a JSON file that is updated with the new value
- `data-value` should be the key in the JSON file to read the number from

```html
<div class="ticker-js" data-url="./data.json" data-value="count"></div>
```

Then to initialize the tickers and start the request you have a couple options.

### By init syntax
```javascript
// common
Ticker.init(); // initialize all ticker-js tickers they refresh every 10000ms

// uncommon
Ticker.init(document.getElementsByClassName('custom-class')); // initialize all custom-class tickers they refresh every 10000ms
Ticker.init(document.getElementById('myTicker')); // initialize a specific element tickers they refresh every 1000ms
Ticker.init(null, 10); // initialize all ticker-js tickers they refresh every 10ms
Ticker.init(null, 0); // initialize all ticker-js tickers they do not refresh
```

### By new syntax
```javascript
// Custom time
var t = new Ticker(document.getElementById('myTicker'));
var t = new Ticker(document.getElementById('myTicker'), 10);
```
