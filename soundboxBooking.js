/*
* Soundbox ID starts from 0
* Block starts from 1*/
const IDpair = ['D101','D102','D103','D104','D105','D106','D107','D108','D109',"A101","A111"]
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
    selectedBlocks=[]
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
    fetchData()
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

async function getRegisted(){
    const geturl = "https://soundbox.v1an.xyz/getBookedSoundbox";
    try {
        const response = await fetch(geturl, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Error fetching soundbox state:", e);
        return null;
    }
}
async function fetchData() {
    const selectedDate = document.getElementById('startDate').value;
    console.log(selectedDate);

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    const data = await fetchSoundboxState(selectedDate);
    const registed = await getRegisted();

    let registedToday=[]
    let today = new Date();
    for(i=0;i<registed.length;i++){

        if (registed[i][2].value==selectedDate.replaceAll("-","")){
            registedToday.push((registed[i][0],registed[i][1]));
            if(timetable[registed[i][1]]>today.getHours()){}
            selectedBlocks.push(registed[i]);
        }
    }
    if (data) {
        createTable(data, selectedDate,registedToday);
        document.getElementById('noDataMessage').style.display = 'none';
    } else {
        document.getElementById('noDataMessage').textContent = 'No data available for the selected date';
        document.getElementById('soundboxTable').style.display = 'none';
    }
}
async function fetchSoundboxState(startDate) {
    const geturl = "https://soundbox.v1an.xyz/getSoundboxState";
    const queryUrl = `${geturl}?startDate=${startDate.replaceAll("-","")}`;
    try {
        const response = await fetch(queryUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Error fetching soundbox state:", e);
        return null;
    }
}

function createTable(data,selectedDate,registedblock) {
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
        for (let colNum = 1; colNum < soundboxNum; colNum++) {
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
            } else if (listInclude(registedblock, colNum, rowNum)) {
                statusButton.classList.add('status-owned');
            }else{
                statusButton.classList.add('status-false');
            }
            statusButton.addEventListener('click', () => {
                if (statusButton.classList.contains('status-chosen')) {
                    statusButton.classList.remove('status-chosen');
                    statusButton.classList.add('status-true');
                    selectedBlocks.splice(selectedBlocks.indexOf([statusButton.getAttribute('col'),statusButton.getAttribute('row')]),1)
                }else if(selectedBlocks.length>=3) {
                    window.alert("Too much time period has been selected.")
                }else if (statusButton.classList.contains('status-true')) {
                    statusButton.classList.remove('status-true');
                    statusButton.classList.add('status-chosen');
                    selectedBlocks.push([statusButton.getAttribute('col'),statusButton.getAttribute('row')]);
                }
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
    const selectedDate = document.getElementById('startDate').value;
    if(selectedBlocks.length<1){
        document.getElementById('submitInfo').style.color='red';
        document.getElementById('submitInfo').textContent = 'No time period is chosen.';
    }else if(selectedBlocks.length>3){
        document.getElementById('submitInfo').style.color='red';
        document.getElementById('submitInfo').textContent = 'Too much time period is chosen.';
    }else {
        let urlPOST = "https://soundbox.v1an.xyz/book";
        for (let i = 0; i < selectedBlocks.length; i++) {
            const queryUrlPOST = `${urlPOST}?block=${selectedBlocks[i][1]}&date=${selectedDate.replaceAll("-", "")}&id=${selectedBlocks[i][0]}`;
            try {
                await fetch(queryUrlPOST, {
                    method: 'POST',
                    credentials: 'include'
                });
                location.reload();
            } catch (e) {
                console.error("Error on posting:", e);
                return null;
            }
        }

    }
}
