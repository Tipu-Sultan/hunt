document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const monthYearDiv = document.getElementById('month-year');
    const excludeDatesInput = document.getElementById('exclude-dates');
    const numberOfDaysDiv = document.getElementById('number-of-days');
    const leadCountInput = document.getElementById('lead-count');
    const expectedDrrInput = document.getElementById('expected-ddr');
    const lastUpdateInput = document.getElementById('last-update');
    const dataTableBody = document.getElementById('data-table-body'); // Corrected the table reference
  
    startDateInput.addEventListener('input', updateMonthYear);
    endDateInput.addEventListener('input', updateMonthYear);
    endDateInput.addEventListener('input', calculateDays);
    excludeDatesInput.addEventListener('input', calculateDays);
    leadCountInput.addEventListener('input', calculateExpectedDrr);
    lastUpdateInput.addEventListener('click', saveData);
  
    const saveButton = document.getElementById('last-update');
    let data = [];
  
    saveButton.addEventListener('click', () => {
      const newData = calculateValues();
      data.push(newData);
      displayData(data);
      localStorage.setItem('drrData', JSON.stringify(data));
    });
  
    function calculateValues() {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      const excludedDates = excludeDatesInput.value
        .split(',')
        .map((date) => new Date(date.trim()));
      const numberOfLeads = parseInt(leadCountInput.value);
  
      const startMonthYear = startDate.toLocaleDateString('en-us', {
        month: 'long',
        year: 'numeric',
      });
      const endMonthYear = endDate.toLocaleDateString('en-us', {
        month: 'long',
        year: 'numeric',
      });
      monthYearDiv.textContent = `${startMonthYear} - ${endMonthYear}`;
  
      const totalDays =
        Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      let excludedDays = 0;
      for (const date of excludedDates) {
        if (date >= startDate && date <= endDate) {
          excludedDays++;
        }
      }
      const actualDays = totalDays - excludedDays;
      numberOfDaysDiv.textContent = `${actualDays} days`;
  
      const expectedDrr = (numberOfLeads / actualDays).toFixed(2);
      expectedDrrInput.value = expectedDrr;
  
      const currentDate = new Date();
      const lastUpdate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
      return {
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        monthYear: `${startMonthYear} - ${endMonthYear}`,
        excludedDates: excludeDatesInput.value,
        actualDays,
        leadCount: leadCountInput.value,
        expectedDrr,
        lastUpdate:lastUpdate
      };
    }
  
    function updateMonthYear() {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
      
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const startMonth = start.getMonth() + 1; // Adding 1 as getMonth() returns 0-based month
          const endMonth = end.getMonth() + 1;
      
          monthYearDiv.textContent = `${startMonth}`;
        }
      }
      
      
      
  
    function calculateDays() {
      const start = new Date(startDateInput.value);
      const end = new Date(endDateInput.value);
      const excluded = excludeDatesInput.value.split(',').map(date => new Date(date));
  
      const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      const excludedDays = excluded.filter(date => date >= start && date <= end).length;
  
      numberOfDaysDiv.textContent = `${totalDays - excludedDays} days`;
    }
  
    function calculateExpectedDrr() {
      const numberOfLeads = parseInt(leadCountInput.value);
      const totalDays = parseInt(numberOfDaysDiv.textContent.split(' ')[0]);
  
      if (!isNaN(numberOfLeads) && !isNaN(totalDays) && totalDays !== 0) {
        const expectedDrr = (numberOfLeads / totalDays).toFixed(2);
        expectedDrrInput.value = expectedDrr;
      }
    }
  
    function saveData() {
      const date = new Date().toLocaleDateString();
      const leadCount = leadCountInput.value;
  
      const row = dataTableBody.insertRow(); // Corrected the table reference
      const dateCell = row.insertCell(0);
      const leadCountCell = row.insertCell(1);
  
      dateCell.textContent = date;
      leadCountCell.textContent = leadCount;
    }
  
    function displayData(data) {
      dataTableBody.innerHTML = ''; // Clear previous data
  
      data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>NA</td>
            <td>${index + 1}</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
            <td>${item.monthYear}</td>
            <td>${item.excludedDates}</td>
            <td>${item.actualDays}</td>
            <td>${item.leadCount}</td>
            <td>${item.expectedDrr}</td>
            <td>${item.lastUpdate}</td>`;
        dataTableBody.appendChild(row);
      });
    }
  
    function loadFromLocalStorage() {
      let savedData = localStorage.getItem('drrData');
      if (savedData) {
        data = JSON.parse(savedData);
        displayData(data);
      }
    }
  
    loadFromLocalStorage();
  });
  