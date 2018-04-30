//
//  Ticker.js
//
//
//  Created by Brandon Roehl on 4/24/18.
//

document.addEventListener("DOMContentLoaded", function(){
    Ticker.init();
});

class Ticker {
    static init(e = document.getElementsByTagName('ticker')) {
        // Stop previous tickers if they exist
        if (e instanceof HTMLCollection) {
            for (var i = 0; i < e.length; i++) {
                new Ticker(e[i]);
            }
        } else if (e instanceof HTMLElement) {
            new Ticker(e);
        } else {
            throw new Error('Not an instance of HTMLCollection or HTMLElement');
        }
    }
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error('Not an instance of HTMLElement');
        }
        var ticker = this;
        if (element.ticker == undefined) {
            element.ticker = this;
            ticker.element = element;
        } else {
            ticker = element.ticker;
        }
        // Fail creation with a bad element and throw an error
        if (element.dataset.url == null) {
            throw new Error('Ticker element missing data-url');
        }
        if (element.dataset.value == null) {
            throw new Error('Ticker element missing data-value');
        }
        var time = element.dataset.refreshInterval;
        if (time === undefined) time = 1000;

        ticker.value = 0;
        ticker.display = 0;
        ticker.get();
        if (time != 0) {
            this.refreshInterval = setInterval(function () {
                ticker.get();
            }, time);
        }
        return ticker;
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

                if (ticker.display < ticker.value) {
                    ticker.display += num;
                } else if (ticker.display > ticker.value) {
                    ticker.display -= num;
                } else {
                    clearInterval(ticker.displayInterval);
                    ticker.displayInterval = null;
                }
                ticker.print();
            }, 10);
        }
    }
    print() {
        var string = this.display.toLocaleString();
        this.element.innerHTML = '';
        for (var i = 0; i < string.length; i++) {
            var child = document.createElement('span');
            child.innerHTML = string.charAt(i);
            if (child.innerHTML === ',') {
                child.className = 'tjs-com'
            } else {
                child.className = 'tjs-num';
            }
            this.element.appendChild(child);
        }
    }
    stop() {
        clearInterval(this.refreshInterval);
    }
}
