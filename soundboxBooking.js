/*
* Soundbox ID starts from 0
* Block starts from 1*/
function parseDateString(dateString) {
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(5, 7), 10)-1; // Months are 0-based in JS
    const day = parseInt(dateString.slice(8, 10), 10)+1; // don't know the reason of +1
    return new Date(year, month, day);
}
const serverUrl="https://soundbox.v1an.xyz/";
const milisecondPerDay=24 * 60 * 60 * 1000;
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
let chosenBlocks=[];
let selectedBlocks=[];
let currentDisplayDate=new Date(); //current display date is today before 6p.m., tomorrow after 6p.m.. Do not change its value after it is set it onload
let username="";
window.onload = async function () {
    selectedBlocks = []
    let today = new Date();
    if (today.getHours() >= 18) {
        today.setDate(today.getDate() + 1);
    }
    currentDisplayDate.setDate(today.getDate());

    today = today.toISOString().split('T')[0];

    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('startDate').value = today;

    fetchData();
    const userinfo = await getUserInfo();
    username=userinfo["name"];
    console.log(username);
    document.getElementById('username').innerHTML=username;

};
function listInclude(d,c,r){
    let flag=false;
    d.forEach((item)=>{
        if(((item.toString())==(([c,r]).toString()))) {
            flag=true;
        }
    });
        return flag;
}
function previousDate(){
    let displayedDate=document.getElementById('startDate').value;
    let d=parseDateString(displayedDate);
    d.setTime(d.getTime()-milisecondPerDay);
    document.getElementById('startDate').value = d.toISOString().split('T')[0];
    if(d.getDate()<=currentDisplayDate.getDate()){
        document.getElementById('previousBtn').classList.add('inactive');
    }else{
        document.getElementById('previousBtn').classList.remove('inactive');
    }
    if(d.getDate()>=(currentDisplayDate+2)){
        document.getElementById('nextBtn').classList.add('inactive');
    }else{
        document.getElementById('nextBtn').classList.remove('inactive');
    }
    fetchData();
}
function nextDate(){
    let displayedDate=document.getElementById('startDate').value;
    let d=parseDateString(displayedDate);
    d.setTime(d.getTime()+milisecondPerDay);
    console.log(d.getDate())
    console.log(currentDisplayDate.getDate())
    document.getElementById('startDate').value = d.toISOString().split('T')[0];
    if(d.getDate()<=currentDisplayDate.getDate()){
        document.getElementById('previousBtn').classList.add('inactive');
    }else{
        document.getElementById('previousBtn').classList.remove('inactive');
    }
    if(d.getDate()>=(currentDisplayDate+2)){
        document.getElementById('nextBtn').classList.add('inactive');
    }else{
        document.getElementById('nextBtn').classList.remove('inactive');
    }
    fetchData();
}
async function getRegisted(){
    const geturl = `${serverUrl}getBookedSoundbox`;
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
async function getUserInfo(){
    const geturl = `${serverUrl}getUserInfo`;
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

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }
    selectedBlocks=[];

    const data = await fetchSoundboxState(selectedDate);
    console.log(data);
    if(data["error"]== "no token"){
        window.location.replace("/");
    }
    const registed = await getRegisted();

    let registedToday=[]
    for(i=0;i<registed.length;i++){
        if (registed[i][2]==selectedDate.replaceAll("-","")){
            registedToday.push([registed[i][0],registed[i][1]]);

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
    const geturl = `${serverUrl}getSoundboxState`;
    const queryUrl = `${geturl}?startDate=${startDate.replaceAll("-","")}`;
    try {
        const response = await fetch(queryUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        return result;
    } catch (e) {
        window.location.replace("/login_page.html");
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
            } else if (!listInclude(data, colNum, rowNum)) {
                statusButton.classList.add('status-true');
                statusButton.setAttribute('row', rowNum.toString());
                statusButton.setAttribute('col', colNum.toString());
            } else if (listInclude(registedblock, colNum, rowNum)) {
                statusButton.classList.add('status-owned');
                chosenBlocks.push([colNum, rowNum]);
            }else{
                statusButton.classList.add('status-false');
            }
            statusButton.addEventListener('click', () => {
                if (statusButton.classList.contains('status-chosen')) {
                    statusButton.classList.remove('status-chosen');
                    statusButton.classList.add('status-true');
                    selectedBlocks.splice(selectedBlocks.indexOf([statusButton.getAttribute('col'),statusButton.getAttribute('row')]),1)
                }else if((selectedBlocks.length+chosenBlocks.length)>=3) {
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
        let urlPOST = `${serverUrl}book`;
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
