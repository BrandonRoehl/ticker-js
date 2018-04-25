//
//  Ticker.js
//
//
//  Created by Brandon Roehl on 4/24/18.
//
document.addEventListener("DOMContentLoaded", function(){
    Ticker.init();
});

document.ticker_css_location = document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf("/"));
document.ticker_css_location += "/ticker.css";

class Ticker {
    static init(e = document.getElementsByClassName('ticker-js'), time) {
        document.tickers = [];
        if (e instanceof HTMLCollection) {
            for (var i = 0; i < e.length; i++) {
                document.tickers.push(new Ticker(e[i], time));
            }
        } else if (e instanceof HTMLElement) {
            document.tickers.push(new Ticker(e, time));
        } else {
            throw new Error('Not an instance of HTMLCollection or HTMLElement');
        }
    }
    constructor(element, time = 10000) {
        // Fail creation with a bad element and throw an error
        if (element.dataset.url == null) {
            throw new Error('Ticker element missing data-url');
        }
        if (element.dataset.value == null) {
            throw new Error('Ticker element missing data-value');
        }

        this.element = element;
        this.value = 0;
        this.display = 0;
        var shadow;
        if (element.attachShadow) {
            shadow = element.attachShadow({mode: 'open'});
        } else {
            shadow = element;
        }
        var link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = document.ticker_css_location;
        shadow.appendChild(link);
        this.root = document.createElement('span');
        shadow.appendChild(this.root);

        var ticker = this;
        ticker.get();
        if (time != 0) {
            this.refreshInterval = setInterval(function () {
                ticker.get();
            }, time);
        }
    }
    get() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.element.dataset.url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var ticker = this;
        xhr.onload = function() {
            if (xhr.status === 200) {
                var responseText = JSON.parse(xhr.responseText);
                ticker.value = responseText[ticker.element.dataset.value];
                ticker.refreshDisplay();
            }
        };
        xhr.send();
    }
    refreshDisplay() {
        var ticker = this;
        if (this.displayInterval == null) {
            this.displayInterval = setInterval(function () {
                var num = (ticker.value - ticker.display).toString().length - 2;
                if (num < 0) num = 0;
                num = Math.pow(10, num);
                console.log(num);

                if (ticker.display < ticker.value) {
                    ticker.display += num;
                } else if (ticker.display > ticker.value) {
                    ticker.display -= num;
                } else {
                    clearInterval(ticker.displayInterval);
                    ticker.displayInterval = null;
                    console.log("running");
                }
                ticker.print();
            }, 10);
        }
    }
    print() {
        var string = this.display.toLocaleString();
        this.root.innerHTML = '';
        for (var i = 0; i < string.length; i++) {
            var child = document.createElement('span');
            child.innerHTML = string.charAt(i);
            child.className = 'tjs-num';
            this.root.appendChild(child);
        }
    }
}
