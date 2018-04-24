// add on load
var tickers = [];
document.addEventListener("DOMContentLoaded", function(){
    var elements = document.getElementsByClassName('ticker-js');
    for (var i = 0; i < elements.length; i++) {
        tickers.push(new Ticker(elements[i]));
    }
});

class Ticker {
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
        this.displayInterval = setInterval(function () {
            if (ticker.display < ticker.value) {
                ticker.display += 1;
            } else if (ticker.display > ticker.value) {
                ticker.display -= 1;
            } else {
                clearInterval(ticker.displayInterval);
            }
            ticker.print();
        }, 1);
    }
    print() {
        this.element.innerHTML = this.display.toLocaleString();
    }
}
