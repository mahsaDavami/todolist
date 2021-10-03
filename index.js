let indexId;
let values = [];
let StorageArray = [];
let done = 0;
let clickcount = 0;
let deleted_items = 0;
let Tasks = 0;
const MediaWidth = window.matchMedia("(max-width: 500px)");

document.getElementById('deleted').innerHTML = deleted_items;
document.getElementById('dones').innerHTML = done;
document.getElementById('totalTask').innerHTML = Tasks;

let enter;
const inputDesign = () => {
    if (MediaWidth.matches) {
        if (document.getElementById("modal-input")) {
            console.log(document.getElementById("modal-input"));
            enter = document.getElementById("modal-input");
        }
        else {
            modalInput = document.createElement('INPUT');
            modalInput.setAttribute('type', 'text');
            modalInput.setAttribute('Id', 'modal-input');
            modalInput.setAttribute('class', 'mobile-input');
            modalInput.setAttribute('placeholder', 'Type Here...')
            document.getElementById("inputMobile").appendChild(modalInput);
            enter = document.getElementById("modal-input");
            enter.addEventListener("keyup", function (event) {
                if (event.key == "Enter") {
                    event.preventDefault();
                    document.getElementById("add").click();
                }
            });
        }
    }
    else {
        if(document.getElementById('modal-input') ) {document.getElementById('modal-input').style.display = "none";}

        if (document.getElementById("input")) {
            console.log(document.getElementById("input"));
            enter = document.getElementById("input");
        }
        else {
            desktoplInput = document.createElement('INPUT');
            desktoplInput.setAttribute('type', 'text');
            desktoplInput.setAttribute('Id', 'input');
            //desktoplInput.setAttribute('placeholder', 'Type Your Next Task...')
            //desktoplInput.setAttribute('class', 'desktop-input');
            document.getElementById("inputDesktop").appendChild(desktoplInput);
            enter = document.getElementById("input");
            enter.addEventListener("keyup", function (event) {
                if (event.key == "Enter") {
                    event.preventDefault();
                    document.getElementById("add").click();
                }
            });
        }
    }
}
inputDesign();

const resizeEVENT = () => {
    /*if (MediaWidth.matches) {
        enter = document.getElementById("modal-input");
    }
    else {
        document.getElementById('modal-input').style.display = "none";
        enter = document.getElementById("input");
    }*/
    inputDesign();
}

window.addEventListener("resize", resizeEVENT);

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const setRandomColor = (SPAN) => {
    document.getElementById(indexId).style.borderColor = getRandomColor();
}

const loadXml = async () => {

    fetch("http://api.aparat.com/fa/v1/video/video/mostViewedVideos")
        .then(response => response.json())
        .then(responseJson => {
            const apiDoc = responseJson.data;
            let mostviewed;
            let max;
            let maxUsingReduce = () => {
                apiDoc.reduce((total, currentValue, index) => {

                    max = Math.max(total, currentValue.attributes.visit_cnt, index);
                    if (parseInt(total) < parseInt(currentValue.attributes.visit_cnt)) {
                        mostviewed = currentValue;
                    }
                    return max;
                }, apiDoc[0].attributes.visit_cnt)
            }
            maxUsingReduce();

            document.getElementById("advertising").src = mostviewed.attributes.preview_src;
            document.getElementById("myModal").removeAttribute('class', 'modal');
            document.getElementById("myModal").setAttribute('class', 'modalAd');
            document.getElementById("input").disabled = true;
        });
}

const closeAdFunc = () => {
    document.getElementById("myModal").removeAttribute('class', 'modalAd');
    document.getElementById("myModal").setAttribute('class', 'modal');
    document.getElementById("input").disabled = false;
}

const moveToLcal = (StorageArray) => {
    localStorage.removeItem('StorageArray');
    localStorage.setItem('StorageArray', JSON.stringify(StorageArray));
}

const deleting = (indexedList) => {
    let ul = indexedList.parentNode;
    ul.removeChild(indexedList);
}

const completed = (checkList) => {

    if (checkList.classList == "note") {
        checkList.classList.remove("note");
        checkList.classList.add("checked");
        StorageArray[checkList.id].complete = "true";
        localStorage.setItem('doneTasks', done);
        document.getElementById('dones').innerHTML = done;
        moveToLcal(StorageArray);
    }
    else if (checkList.classList == "checked") {
        checkList.classList.remove("checked");
        checkList.classList.add("note");
        StorageArray[checkList.id].complete = "false";
        done--;
        localStorage.setItem('doneTasks', done);
        document.getElementById('dones').innerHTML = done;
        moveToLcal(StorageArray);
    }
}

function sync() {
    if (typeof (Storage) !== "undefined") {
        const transforming = JSON.parse(localStorage.getItem('StorageArray'));
        clickcount = JSON.parse(localStorage.getItem('clickcount'));
        Tasks = JSON.parse(localStorage.getItem('allTasks'));
        done = JSON.parse(localStorage.getItem('doneTasks'));

        for (let n = 0; transforming[n] !== undefined; n++) {
            if (transforming[n] !== null) {
                let parsing = (transforming[n]);
                values[n] = parsing.value;
                StorageArray[n] = parsing;
            }
        }

        deleted_items = Tasks - StorageArray.length;
        document.getElementById('deleted').innerHTML = deleted_items;
        document.getElementById('totalTask').innerHTML = Tasks;
        if (done === null) {
            done = 0;
            document.getElementById('dones').innerHTML = done;
        }
        else { document.getElementById('dones').innerHTML = done; }
        if (Tasks === null) {
            Tasks = 0;
            document.getElementById('totalTask').innerHTML = Tasks;
        }
        mapping(values);
    }
}

sync();

function next_line() {
    let x;
    let index2 = StorageArray.length;
    clickcount = clickcount + 1;
    localStorage.setItem('clickcount', clickcount);

    if (clickcount % 6 === 0) {
        loadXml();
    }
    else {
        if (MediaWidth.matches) {
            if (document.getElementById('modal-input').style.display == "block") {
                enter = document.getElementById("modal-input");
                x = document.getElementById('modal-input').value;
            }
            else {
                document.getElementById('modal-input').style.display = "block";
                enter = document.getElementById("modal-input");
                x = document.getElementById('modal-input').value;
                return;
            }
            //clickcount = clickcount - 1;
            document.getElementById('modal-input').value=null;
        }
        else {
            x = document.getElementById('input').value;
            enter = document.getElementById('input');
            //clickcount = clickcount - 1;
            document.getElementById('input').value=null;
        }
        console.log(enter);
        let time = new Date();
        const hour = time.getHours();
        const minutes = time.getMinutes();
        time = hour + ' : ' + minutes;
        const Storage_Obj = { key: index2, value: x, complete: "false", date: time };
        StorageArray[index2] = Storage_Obj;
        moveToLcal(StorageArray, index2);
        index2 = index2 + 1;
        Tasks = Tasks + 1;
        localStorage.setItem('allTasks', Tasks);
        document.getElementById('totalTask').innerHTML = Tasks;
        values.push(x);
        sync();
    }
}

function mapping(values) {
    indexId = 0;
    document.getElementById('list').innerHTML = "";

    for (let i = 0; i < values.length; i++) {

        let myDIV = document.createElement('SPAN');
        myDIV.setAttribute('class', 'note');
        myDIV.innerText = values[i];

        let SPAN = document.createElement('LI');
        SPAN.setAttribute('class', 'note');
        SPAN.setAttribute('id', indexId);

        SPAN.appendChild(myDIV);
        let d = document.createElement('DIV');
        d.innerHTML = StorageArray[i].date;
        d.setAttribute('class', 'date');

        document.getElementById('list').appendChild(SPAN);

        let tikbox = document.createElement('INPUT');
        let closeBtn = document.createElement('button');

        tikbox.setAttribute('type', 'checkbox');
        tikbox.setAttribute('class', 'tik');

        tikbox.onclick = function () {
            let checkList = this.parentNode;
            if (checkList.classList == "note") {
                done++;
            }
            completed(checkList);
        };

        if (StorageArray[i].complete === "true") {
            let item = document.getElementById('list');
            let child = item.children[i];
            completed(child);
            tikbox.checked = true;
            document.getElementById('dones').innerHTML = done;
        }
        document.getElementById('dones').innerHTML = done;

        SPAN.appendChild(tikbox);
        closeBtn.setAttribute('type', 'button');
        closeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        closeBtn.setAttribute('class', 'remove');

        closeBtn.onclick = function () {

            let indexedList = this.parentNode;
            deleting(indexedList);
            delete values[indexedList.id];
            delete StorageArray[indexedList.id];
            let st = [];
            for (let n = m = 0; n < StorageArray.length; n++) {
                if (StorageArray[n] != undefined || null) {
                    st[m] = StorageArray[n];
                    st[m].key = m;
                    m = m + 1;
                }
            }
            StorageArray = st;
            let ShiftArray = [];
            for (n = 0; n < StorageArray.length; n++) {
                ShiftArray[n] = StorageArray[n].value;
            }
            values = ShiftArray;
            moveToLcal(StorageArray);
            deleted_items = Tasks - StorageArray.length;
            document.getElementById('deleted').innerHTML = deleted_items;
            sync();
        };
        closeBtn.appendChild(d);
        SPAN.appendChild(closeBtn);
        setRandomColor();

        indexId = indexId + 1;
    }
}