/* 1. helper function
---------------*/
const ce = (tagName) => document.createElement(tagName);
const qs = (selector) => document.querySelector(selector);

/* 2. DOM Nodes
------------*/
const formDOM = qs("#formResult");

/* 3. MODEL - dane aplikacji
-------------------------*/
let currentRate = "";

/* 4. VIEW - funkcje render'ujące View (czyli tworzące DOM)
--------------------------------------------------------*/
const getRatesList = () => {
  const loadingGif = qs("#loading-gif");
  const url = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const filterOptions = data[0].rates.filter(({ code }) =>
        ["EUR", "USD", "CHF"].includes(code)
      ); //{ code } - destrukturyzacja data >> wybieram do select listy trzy konkretne waluty
      const selectItem = () => {
        const selectSpan = qs("#selectList");
        filterOptions.forEach(({ code, mid }) => {
          const optionDOM = ce("option");
          optionDOM.value = mid;
          optionDOM.textContent = code;
          selectSpan.appendChild(optionDOM);
        });
        loadingGif.classList.add("dis-n"); //loader podczas pobierania danych ze strony
        currentRate = filterOptions[0].mid;
        console.log(currentRate);
        selectSpan.addEventListener("change", (e) => {
          currentRate = `${selectSpan.value}`;
          console.log(currentRate);
        });
      };
      selectItem();
    });
};
getRatesList();

/* 5. UPDATE - funkcje zmieniające Model
-------------------------------------*/
const resultFn = (newAmountValue, currentRate) => {
  const res = newAmountValue.amount * currentRate;
  const resSpan = qs("#selectResult");
  resSpan.textContent = "to " + res.toFixed(2) + " PLN";
};

/* 6. Eventy
---------*/
formDOM.addEventListener("submit", (e) => {
  e.preventDefault();

  const { newAmount } = e.currentTarget.elements;
  const newAmountValue = { amount: newAmount.value };

  console.log(currentRate);
  resultFn(newAmountValue, currentRate);
});
