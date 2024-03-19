const chartData = {
    labels: ["Dairy products", "Home decor", "Clothing&footware", "Kitchenware", "Others"],
    data: [2000, 1700, 10000, 7230, 3623], // sale in amount of above mentioned labels (products category) from total sales amount.
    expenses: [1500, 1200, 8000, 5000, 2500],
    salesP: [],
    MonthlyProfittt: [],
  };
  
  const totalRevenue = (chartData) => {
    let sum = 0;
    for (let i = 0; i < chartData.data.length; i++) {
      sum += chartData.data[i];
    }
    return sum;
  };   
  
  const totalExpense = (chartData) => {
    let sum1 = 0;
    for (let i = 0; i < chartData.expenses.length; i++) {
      sum1 += chartData.expenses[i];
    }
    return sum1;
  };
  
  const Texpense = totalExpense(chartData);
  const Trevenue = totalRevenue(chartData);
  
  const monthlyProfit = (Texpense, Trevenue) => {
    return (Trevenue - Texpense);
  };
  
  const EMprofit = (chartData)=>{
     const Meach = [];
     for(let i =0;i< chartData.data.length;i++){
      const revenue = chartData.data[i];
      const expense = chartData.expenses[i];
      const done = ((revenue - expense));
      Meach.push(done);
    }
    return Meach;
     }
   chartData.MonthlyProfittt = EMprofit(chartData);
   
  const Mprofit = monthlyProfit(Texpense, Trevenue);
  
  const calculatePercentages = (chartData) => {
    const total = totalRevenue(chartData);
    const percentages = [];
    for (let i = 0; i < chartData.data.length; i++) {
      const percentage = (chartData.data[i] / total) * 100;
     let p =  percentage.toFixed(3);
      percentages.push(p);
    }
    return percentages;
  };
  
  chartData.salesP = calculatePercentages(chartData);
  
  const profitData = [
    { category: 'Dairy products', dailyProfit: 200 },
    { category: 'Home decor', dailyProfit: 150},
    { category: 'Clothing&footware', dailyProfit: 250 },
    { category: 'Kitchenware', dailyProfit: 180 },
    { category: 'Others', dailyProfit: 300 },
  ];
  
  const myChart = document.querySelector(".my-chart");
  const ul = document.querySelector(".programming-stats .details ul");
  
  new Chart(myChart, {
    type: "doughnut",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Sales percentage",
          data: chartData.salesP,
        },
      ],
    },
    options: {
      borderWidth: 14,
      borderRadius: 10,
      hoverBorderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const category = data.labels[tooltipItem.index];
            const profit = profitData.find((d) => d.category === category);
            const dailyProfit = profit.dailyProfit;
           const Mprofitt = chartData.MonthlyProfittt;
            return [
              `Category: ${category}`,
              `Daily Profit: Rs.${dailyProfit}`,
              `Monthly Profit: Rs.${Mprofitt}`,
            ];
          },
        },
      },
    },
  });
  
  const populateUl = () => {
    chartData.labels.forEach((l, i) => {
      let li = document.createElement("li");
      const profit = profitData.find((d) => d.category === l);
      const dailyProfit = profit.dailyProfit;
  
      li.innerHTML = `${l}: <span class='percentage'>sales percentage:${chartData.salesP[i]}%</span><br> Monthly Profit:Rs.${chartData.MonthlyProfittt[i]}`;
      ul.appendChild(li);
    });
  
  };
     
      let li = document.createElement("li");
      li.innerHTML = `Total Monthly Profit: Rs.${Mprofit}`;
      ul.appendChild(li);
    
  
  populateUl();