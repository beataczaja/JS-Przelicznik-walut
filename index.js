//helper function
const ce = (tagName) => document.createElement(tagName);
const qs = (selector) => document.querySelector(selector);

let currentRate = "";

//Node
const formDOM = qs("#formResult");

/* Updates */
const getRatesList = () => {
  const url = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const filterOptions = data[0].rates.filter(({ code, mid }) =>
        ["EUR", "USD", "CHF"].includes(code)
      ); //wybieram do listy trzy konkretne valuty
      const selectItem = () => {
        const selectSpan = qs("#selectList");
        filterOptions.forEach(({ code, mid }) => {
          const optionDOM = ce("option");
          optionDOM.value = mid;
          optionDOM.textContent = code;
          selectSpan.appendChild(optionDOM);
        });
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

const resultFn = (newAmountValue, currentRate) => {
  const res = newAmountValue.amount * currentRate;
  const resSpan = qs("#selectResult");
  resSpan.textContent = "to " + res.toFixed(2) + " PLN";
};

/*  Eventy */
formDOM.addEventListener("submit", (e) => {
  e.preventDefault();

  const { newAmount } = e.currentTarget.elements;
  const newAmountValue = { amount: newAmount.value };

  console.log(currentRate);
  resultFn(newAmountValue, currentRate);
});
