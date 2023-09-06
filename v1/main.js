const CATEGORIES = [{
        name: "technology",
        color: "#3b82f6"
    },
    {
        name: "science",
        color: "#16a34a"
    },
    {
        name: "finance",
        color: "#ef4444"
    },
    {
        name: "society",
        color: "#eab308"
    },
    {
        name: "entertainment",
        color: "#db2777"
    },
    {
        name: "health",
        color: "#14b8a6"
    },
    {
        name: "history",
        color: "#f97316"
    },
    {
        name: "news",
        color: "#8b5cf6"
    },
];
const btn = document.querySelector('.sharebtn');
const form = document.querySelector('.fact-form');
const factsList = document.querySelector('.facts-list');


//render facts in list 
factsList.innerHTML = '';
loadFacts();
async function loadFacts() {
    const res = await fetch(
      "https://jilbezjtoitpjvxdbpyf.supabase.co/rest/v1/facts",
      {
        headers: {
          
        },
      }
    );
    const data = await res.json();
    //const filterData = data.filter((fact) => fact.category)
    createFacts(data);
}


function createFacts(dataArray) {
    const htmlArr = dataArray.map(
      (fact) => `<li class="fact">
              <p>
                ${fact.text}
                <a
                  class="source"
                  href="${fact.source}"
                  target="_blank"
                  >(Source)</a
                >
              </p>
              <span class="tag" style="background-color: ${
                CATEGORIES.find((cat) => (cat.name === fact.category)).color
              }"
                >${fact.category}</span
              >
              <div class="vote-buttons">
                <button>👍 ${fact.votesInteresting}</button>
                <button>🤯 ${fact.votesMindBlowing}</button>
                <button>⛔️ ${fact.votesFalse}</button>
              </div>`
    );
    const html = htmlArr.join('');
    factsList.insertAdjacentHTML('afterbegin', html);
}





//toggle form
btn.addEventListener('click', function () {
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        btn.textContent = "Close";
    } else {
        form.classList.add('hidden');
        btn.textContent = "Share a fact";
    }
})