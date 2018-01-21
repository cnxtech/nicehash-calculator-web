/* jshint esversion: 6 */

(function() {
  "use strict";

  const main = document.getElementById("main");
  const table = document.getElementById("table");
  const lastUpdated = document.getElementById("last-updated");
  const waitMessage = document.getElementById("please-wait");

  const VALUE_PRECISION = 4;

  function nameForAlgorithm(algo) {
    switch (algo) {
      case 0: return "Scrypt";
      case 1: return "SHA256";
      case 2: return "ScryptNf";
      case 3: return "X11";
      case 4: return "X13";
      case 5: return "Keccak";
      case 6: return "X15";
      case 7: return "Nist5";
      case 8: return "NeoScrypt";
      case 9: return "Lyra2RE";
      case 10: return "WhirlpoolX";
      case 11: return "Qubit";
      case 12: return "Quark";
      case 13: return "Axiom";
      case 14: return "Lyra2REv2";
      case 15: return "ScryptJaneNf16";
      case 16: return "Blake256r8";
      case 17: return "Blake256r14";
      case 18: return "Blake256r8vnl";
      case 19: return "Hodl";
      case 20: return "DaggerHashimoto";
      case 21: return "Decred";
      case 22: return "CryptoNight";
      case 23: return "Lbry";
      case 24: return "Equihash";
      case 25: return "Pascal";
      case 26: return "X11Gost";
      case 27: return "Sia";
      case 28: return "Blake2s";
      case 29: return "Skunk";
      default: return "Unknown";
    }
  }

  function createElement(el, opts) {
    const element = document.createElement(el);
    for (const key in opts) {
      if (!opts.hasOwnProperty(key)) {
        continue;
      }
      const val = opts[key];
      element[key] = val;
    }
    return element;
  }

  function getData() {
    return fetch("data.json").then((e) => e.json());
  }

  function renderData(data) {
    const createRow = (meta) => {
      const row = document.createElement("tr");

      const createColumn = (text, opts) => {
        const column = createElement("td", opts || {});
        column.textContent = text;
        return column;
      };

      const fix = (number) => {
        return number.toFixed(VALUE_PRECISION);
      };

      const handlePercent = (number) => {
        number = number.toFixed(2);
        if (number > 0) {
          return "+" + number;
        } else {
          return number;
        }
      };

      const hashUnit = meta.coin.niceHashUnit.displayName;
      const moneyUnit = "BTC/day/" + hashUnit;

      row.appendChild(createColumn(meta.coin.displayName + " (" + meta.coin.abbreviation + ")"));
      row.appendChild(createColumn(nameForAlgorithm(meta.coin.niceHashAlgo)));
      row.appendChild(createColumn(fix(meta.price) + " " + moneyUnit));
      row.appendChild(createColumn(fix(meta.revenue) + " " + moneyUnit));
      row.appendChild(createColumn(fix(meta.profit) + " " + moneyUnit));

      const percentChange = handlePercent((meta.percentChange - 1) * 100);
      row.appendChild(createColumn(percentChange + "%", {
        className: percentChange > 0 ? "cell-green" : "cell-red",
      }));

      return row;
    };

    const coins = data.coins;
    for (const coin of coins) {
      const row = createRow(coin);
      table.appendChild(row);
    }

    const date = new Date(data.lastUpdated);
    lastUpdated.textContent = date.toLocaleString();

    waitMessage.style.display = "none";
  }

  getData().then((data) => renderData(data));
}());
