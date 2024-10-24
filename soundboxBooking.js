/*
* Soundbox ID starts from 0
* Block starts from 1*/
const url = "https://soundbox.v1an.xyz/getSoundboxState";
const IDpair = ['D101','D102','D103','D104','D105','D106','D107','D108','D109',"A101","A111","A777"]
const timetable = [
    new Date().setHours(8, 40, 0, 0),
    new Date().setHours(9, 20, 0, 0),
    new Date().setHours(10, 50, 0, 0),
    new Date().setHours(11, 40, 0, 0),
    new Date().setHours(12, 30, 0, 0),
    new Date().setHours(14, 5, 0, 0),
    new Date().setHours(14, 55, 0, 0),
    new Date().setHours(15, 40, 0, 0),
    new Date().setHours(16, 45, 0, 0),
    new Date().setHours(17, 40, 0, 0),
    new Date().setHours(18, 35, 0, 0)
];
let selectedBlocks=[]
window.onload = function() {
    //document.cookie="token=eyJ0eXAiOiJKV1QiLCJub25jZSI6InVWdG5rb3l1YzA2MmRzb0RWSEE5ZzlqdWVlWjduRGt3d3BiMU9tTGFYOHMiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5"
    let today = new Date();
    if(today.getHours() >= 18) {
        today.setDate(today.getDate()+1);
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 3);
    const maxDateString = today.toISOString().split('T')[0];
    today=today.toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('startDate').setAttribute('max', maxDateString);
    document.getElementById('startDate').value = today;
};
function listInclude(d,c,r){
    let flag=true
    d.forEach((item)=>{
        if(((item.toString())==(([c,r]).toString()))) {
            flag=false;
        }
    });
        return flag;
}
async function fetchData() {
    const selectedDate = document.getElementById('startDate').value;


    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    const data = await fetchSoundboxState(selectedDate, selectedDate);
    if (data) {
        createTable(data, selectedDate);
        document.getElementById('noDataMessage').style.display = 'none';
    } else {
        document.getElementById('noDataMessage').textContent = 'No data available for the selected date';
        document.getElementById('soundboxTable').style.display = 'none';
    }
}
async function fetchSoundboxState(startDate, endDate) {
    const queryUrl = `${url}?startDate=${startDate.replaceAll("-","")}&endDate=${endDate.replaceAll("-","")}&token=eyJ0eXAiOiJKV1QiLCJub25jZSI6Ing1MFV5REtTUzBzU2YwcUhGdGhxSnNXZ3BtTkR6QU5SR001WnBlV2J6cEUiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5`;

    try {
        const response = await fetch(queryUrl, {
            method: 'GET',
            credentials: 'omit',
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Error fetching soundbox state:", e);
        return null;
    }
}

function createTable(data,selectedDate) {
    const date = new Date();
    const table = document.getElementById("soundboxTable");
    table.innerHTML = '';
    const headerRow = document.createElement("tr");
    const emptyHeaderCell = document.createElement("th");
    headerRow.appendChild(emptyHeaderCell);
    IDpair.forEach(id => {
        const th = document.createElement("th");
        th.textContent = `SoundBox ${id}`;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    const soundboxNum=12;
    const blockNum=10;
    let T;
    let Select;
    for (let rowNum = 1; rowNum <= blockNum; rowNum++) {

        const row = document.createElement("tr");

        const blockCell = document.createElement("td");
        blockCell.textContent = "B" + rowNum;
        row.appendChild(blockCell);
        for (let colNum = 0; colNum < soundboxNum; colNum++) {
            const buttonCell = document.createElement("td");
            const statusButton = document.createElement("button");
            statusButton.classList.add('status-btn');
            T = new Date(timetable[rowNum-1])
            Select = new Date(selectedDate)
            if ((T < date) && (date.getDate() == Select.getDate())) {
                statusButton.classList.add('status-passed');
            } else if (listInclude(data, colNum, rowNum)) {
                statusButton.classList.add('status-true');
                statusButton.setAttribute('row', rowNum.toString());
                statusButton.setAttribute('col', colNum.toString());
            } else {
                statusButton.classList.add('status-false');
            }
            statusButton.addEventListener('click', () => {
                if (statusButton.classList.contains('status-true')) {
                    statusButton.classList.remove('status-true');
                    statusButton.classList.add('status-chosen');
                    selectedBlocks.push([statusButton.getAttribute('col'),statusButton.getAttribute('row')]);
                } else if (statusButton.classList.contains('status-chosen')) {
                    statusButton.classList.remove('status-chosen');
                    statusButton.classList.add('status-true');
                    selectedBlocks.splice(selectedBlocks.indexOf([statusButton.getAttribute('col'),statusButton.getAttribute('row')]),1)
                }
                console.log(selectedBlocks);
            });
            buttonCell.appendChild(statusButton);
            row.appendChild(buttonCell);
        }
        ;
        table.appendChild(row);
    };

    document.getElementById('soundboxTable').style.display = 'table';
}
async function submit(){
    // let urlPOST="https://soundbox.v1an.xyz/book";
    // try {
    //     await fetch(urlPOST, {
    //         method: 'POST',
    //         credentials: 'include',
    //     });
    // } catch (e) {
    //     console.error("Error on posting:", e);
    //     return null;
    // }
}