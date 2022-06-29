// input range    // source: https://codepen.io/Em-An/pen/mvJveV
async function inputRange() {
    "use strict";
    
    (function () {
        var supportsMultiple = self.HTMLInputElement && "valueLow" in HTMLInputElement.prototype,
            descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

        self.multirange = function (input) {
            if (supportsMultiple || input.classList.contains("multirange")) {
                return;
            }

            var value = input.getAttribute("value"),
                values = value === null ? [] : value.split(","),
                min = +(input.min || 0),
                max = +(input.max || 100),
                ghost = input.cloneNode();

            input.classList.add("multirange", "original");
            ghost.classList.add("multirange", "ghost");

            input.value = values[0] || min + (max - min) / 2;
            ghost.value = values[1] || min + (max - min) / 2;

            input.parentNode.insertBefore(ghost, input.nextSibling);

            Object.defineProperty(input, "originalValue", descriptor.get ? descriptor : {
                get: function () {
                    return this.value;
                },
                set: function (v) {
                    this.value = v;
                }
            });

            Object.defineProperties(input, {
                valueLow: {
                    get: function () {
                        return Math.min(this.originalValue, ghost.value);
                    },
                    set: function (v) {
                        this.originalValue = v;
                    },
                    enumerable: true
                },
                valueHigh: {
                    get: function () {
                        return Math.max(this.originalValue, ghost.value);
                    },
                    set: function (v) {
                        ghost.value = v;
                    },
                    enumerable: true
                }
            });

            if (descriptor.get) {
                Object.defineProperty(input, "value", {
                    get: function () {
                        return this.valueLow + "," + this.valueHigh;
                    },
                    set: function (v) {
                        var values = v.split(",");
                        this.valueLow = values[0];
                        this.valueHigh = values[1];
                        update();
                    },
                    enumerable: true
                });
            }

            if (typeof input.oninput === "function") {
                ghost.oninput = input.oninput.bind(input);
            }

            function update() {
                ghost.style.setProperty("--low", 100 * ((input.valueLow - min) / (max - min)) + 1 + "%");
                ghost.style.setProperty("--high", 100 * ((input.valueHigh - min) / (max - min)) - 1 + "%");

                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, false);
                input.dispatchEvent(event);
            }

            input.addEventListener("input", update);
            ghost.addEventListener("input", update);

            update();
        };
        multirange.init = function () {
            [].slice.call(document.querySelectorAll("input[type=range][multiple]:not(.multirange)")).forEach(multirange);
        };

        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", multirange.init);
        } else {
            multirange.init();
        }

    })();
   
    const ajaxResponse = await fetch(`api/acc`);
    const places = await ajaxResponse.json();
    console.log(places.length);
	console.log(parseFloat(places[0].price).toFixed(2));
	console.log(parseFloat(places[places.length-1].price).toFixed(2));

	var slider = document.querySelector('#slider')
    var lowGBPAmount = document.querySelector('.lowGBPAmount')
    var highGBPAmount = document.querySelector('.highGBPAmount')
    var min = 0.00
    var max = parseFloat(places[places.length-1].price).toFixed(2)


    console.log(min, max);
    slider.addEventListener('change', function () {
        lowGBPAmount.textContent = formatPrice(min + ((max - min) * (slider.valueLow / 100)));
        highGBPAmount.textContent = formatPrice(min + ((max - min) * (slider.valueHigh / 100)));

    });

    function formatPrice(price) {
        if (price != 0) {
            var formattedPrice = '£' + parseFloat(price, 10).toFixed(2).toString().replace(/(\d+)(?=(\d{3})+\.?)/g, '£1,');
            return formattedPrice;
        }
    }
}
inputRange();