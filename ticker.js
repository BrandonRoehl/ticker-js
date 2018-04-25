// add on load


class Ticker {
    static init(klass, time) {
        if (klass == undefined) {
            klass = 'ticker-js';
        }
        document.tickers = [];
        var elements = document.getElementsByClassName(klass);
        for (var i = 0; i < elements.length; i++) {
            document.tickers.push(new Ticker(elements[i], time));
        }
    }
    constructor(element, time) {
        this.element = element;
        this.value = 0;
        this.display = 0;
        var ticker = this;
        ticker.get();
        if (time == undefined) {
            time = 10000;
        }
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
        this.element.innerHTML = '';
        for (var i = 0; i < string.length; i++) {
            var child = document.createElement('span');
            child.innerHTML = string.charAt(i);
            child.className = 'tjs-num';
            this.element.appendChild(child);
        }
    }
}
