document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("requestForm");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const inputValue = document.getElementById("entryBox").value.trim();
  
      fetch(`https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade?q=${inputValue}&pp=50&p=0&_=1557934352427&stance=2`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Received data:", data);
          displayHits(data.hits);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
  
      document.getElementById("entryBox").value = "";
    });
  });
  

  function displayHits(hits) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
  
    const grouped = {};
  
    hits.forEach((hit) => {
      const category = hit.category || "Uncategorized";
      const groupKey = hit.group || "No Group";
      const currency = hit.currency || "No Currency";
  
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][groupKey]) {
        grouped[category][groupKey] = {};
      }
      if (!grouped[category][groupKey][currency]) {
        grouped[category][groupKey][currency] = [];
      }
      grouped[category][groupKey][currency].push(hit);
    });

    for (const category in grouped) {
      const categoryDetails = document.createElement("details");
      const categorySummary = document.createElement("summary");
      categorySummary.textContent = `Category: ${category}`;
      categoryDetails.appendChild(categorySummary);
  
      const groupGroups = grouped[category];
      for (const groupKey in groupGroups) {
        const groupDetails = document.createElement("details");
        const groupSummary = document.createElement("summary");
        groupSummary.textContent = `Group: ${groupKey}`;
        groupDetails.appendChild(groupSummary);
  
        const currencyGroups = groupGroups[groupKey];
        for (const currency in currencyGroups) {
          const currencyDetails = document.createElement("details");
          const currencySummary = document.createElement("summary");
          currencySummary.textContent = `Currency: ${currency}`;
          currencyDetails.appendChild(currencySummary);
  
          const ul = document.createElement("ul");
          currencyGroups[currency].forEach((hit) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
  
            // Build the full URL (assuming Trading Economics root URL)
            a.href = "https://tradingeconomics.com" + hit.url;
            a.textContent = hit.pretty_name || hit.name;
            a.target = "_blank";
  
            li.appendChild(a);
            ul.appendChild(li);
          });
          currencyDetails.appendChild(ul);
          groupDetails.appendChild(currencyDetails);
        }
        categoryDetails.appendChild(groupDetails);
      }
      resultsContainer.appendChild(categoryDetails);
    }
  }
  
  