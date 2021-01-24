Date.prototype.getWeekNumber = function() {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

const pixelsPerHour = 8;
const ganttBody = document.getElementById("ganttBody");
const ganttLabels = document.getElementById("ganttLabels");
const pixelsPerDay = 32;

let totalDays = 0;

const initialisePersonLabels = function(numOfRows) {
    for (let i = 1; i <= numOfRows; i++) {
        const div = document.createElement("div");

        div.classList.add("gantt-row")
        div.classList.add("person-label-row")
        div.classList.add("gantt-cell")

        div.innerText = `Person ${i}`;

        ganttLabels.append(div);
    }
};

const initialisePersonBodyRows = function(numOfRows) {
    const ganttPersonRows = document.createElement("div");
    ganttPersonRows.id = "ganttPersonRows";
    ganttPersonRows.classList.add("gantt-person-rows");

    for (let i = 1; i <= numOfRows; i++) {
        const personRow = document.createElement("div");

        personRow.id = `person-row-${i}`;
        personRow.classList.add("gantt-row")
        personRow.classList.add("person-row")

        ganttPersonRows.append(personRow);

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let totalPixels = 0;

        for (let i = 0; i < 5; i++) {
            const ganttItem = document.createElement("div");
            ganttItem.classList.add("gantt-item");

            const width = getRandomInt(20, 80);
            const left = getRandomInt(totalPixels, totalPixels + 30);

            ganttItem.style.width = width + 'px';
            ganttItem.style.left = left + 'px';
            ganttItem.setAttribute("title", `Item - ${i}`);

            totalPixels += width + left;

            const ganttItemContent = document.createElement("div");
            ganttItemContent.classList.add("gantt-content");
            ganttItemContent.innerText = `Item - ${i}`;

            ganttItem.append(ganttItemContent);
            personRow.append(ganttItem);
        }
    }

    ganttPersonRows.style.width = totalDays * pixelsPerDay + 'px';
    ganttBody.append(ganttPersonRows);
};

const initialiseGanttHeader = function() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthLimit = 3;

    // Add day row
    const dayRow = document.createElement("div");
    dayRow.classList.add("gantt-row");
    dayRow.classList.add("gantt-day-row");

    // Add week row
    const weekRow = document.createElement("div");
    weekRow.classList.add("gantt-row");
    weekRow.classList.add("gantt-week-row");

    // Add month row
    const monthRow = document.createElement("div");
    monthRow.classList.add("gantt-row");
    monthRow.classList.add("gantt-month-row");

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function endOfWeek(date) {
        const day = date.getDay();
        return day === 0;
    }

    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    let date = new Date();

    let daysInWeek = 0;
    let currentMonth = date.getMonth();
    for (let i = date.getMonth(); i < currentMonth + monthLimit; i++) {

        const year = date.getFullYear();
        let month = date.getMonth();
        const day = date.getDate();

        const numOfDays = daysInMonth(month + 1, year);

        for (let j = day; j <= numOfDays; j++) {
            totalDays++;
            date.setDate(j);
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("gantt-cell");
            dayDiv.classList.add("gantt-day");
            dayDiv.setAttribute("title", date.toString());


            dayDiv.innerText = j;

            dayRow.append(dayDiv);
            daysInWeek++;

            if (isWeekend(date)) {
                dayDiv.classList.add("blocked")
            }

            if (endOfWeek(date)) {
                const weekDiv = document.createElement("div");
                weekDiv.classList.add("gantt-cell");
                weekDiv.classList.add("gantt-week");

                weekDiv.innerText = `Week ${date.getWeekNumber()}`

                weekDiv.style.width = daysInWeek * pixelsPerDay + 'px';

                weekRow.append(weekDiv);
                daysInWeek = 0;
            }

            if (j === numOfDays) {
                const monthDiv = document.createElement("div");
                monthDiv.classList.add("gantt-cell");
                monthDiv.classList.add("gantt-month");
                monthDiv.innerText = `${monthNames[date.getMonth()]}`;
                monthDiv.style.width = (numOfDays - day + 1) * pixelsPerDay + 'px';
                monthRow.append(monthDiv);
            }
        }

        if (daysInWeek) {
            const weekDiv = document.createElement("div");
            weekDiv.classList.add("gantt-cell");
            weekDiv.classList.add("gantt-week");

            weekDiv.innerText = `Week ${date.getWeekNumber()}`

            weekDiv.style.width = daysInWeek * pixelsPerDay + 'px';

            weekRow.append(weekDiv);
            daysInWeek = 0;
        }

        if (month === 11) {
            month = 0;
            date.setFullYear(date.getFullYear() + 1);
        } else {
            month++;
        }

        date.setDate(1);
        date.setMonth(month);
    }



    const headerDiv = document.createElement("div");
    headerDiv.classList.add("gantt-headers");

    headerDiv.append(monthRow);
    headerDiv.append(weekRow);
    headerDiv.append(dayRow);

    headerDiv.style.width = totalDays * pixelsPerDay + 'px';
    ganttBody.append(headerDiv);
}();

const initialisePersonRows = function(numOfRows) {
    initialisePersonLabels(numOfRows);
    initialisePersonBodyRows(numOfRows);
}(10);

document.querySelectorAll(".gantt-item").forEach(ganttItem => {
    ganttItem.onmousedown = function(event) {
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

        if (!elemBelow) return;

        let initialDroppable = elemBelow.closest('.person-row');

        let shiftX = Math.round(event.clientX - ganttItem.getBoundingClientRect().left);
        let shiftY = Math.round(event.clientY - ganttItem.getBoundingClientRect().top);

        ganttItem.style.position = 'absolute';
        ganttItem.style.left = event.pageX - shiftX - ganttLabels.offsetWidth - 11 + 'px';
        ganttItem.style.top = event.pageY - shiftY - 10 + 'px';
        ganttItem.style.zIndex = 1000;

        ganttBody.append(ganttItem);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            ganttItem.style.left = pageX - shiftX - ganttLabels.offsetWidth - 11 + 'px';
            ganttItem.style.top = pageY - shiftY - 11 + 'px';
        }

        let currentDroppable = null;

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            ganttItem.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            ganttItem.hidden = false;

            // mousemove events may trigger out of the window (when the ganttItem is dragged off-screen)
            // if clientX/clientY are out of the window, then elementFromPoint returns null
            if (!elemBelow) return;

            // potential droppables are labeled with the class "droppable" (can be other logic)
            let droppableBelow = elemBelow.closest('.person-row');

            if (currentDroppable != droppableBelow) {
                // we're flying in or out...
                // note: both values can be null
                //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
                //   droppableBelow=null if we're not over a droppable now, during this event

                if (currentDroppable) {
                    // the logic to process "flying out" of the droppable (remove highlight)
                    leaveDroppable(currentDroppable);
                }
                currentDroppable = droppableBelow;
                if (currentDroppable) {
                    // the logic to process "flying in" of the droppable
                    enterDroppable(currentDroppable);
                }
            }
        }

        document.addEventListener('mousemove', onMouseMove);

        ganttItem.onmouseup = function() {
            let droppable = currentDroppable || initialDroppable;

            droppable.append(ganttItem);
            droppable.classList.remove("droppable");


            const itemHeight = getComputedStyle(document.documentElement).getPropertyValue('--item-padding');

            ganttItem.style.top = itemHeight;;
            document.removeEventListener('mousemove', onMouseMove);
            ganttItem.onmouseup = null;
        };

    };

    function enterDroppable(elem) {
        elem.classList.add("droppable");
    }

    function leaveDroppable(elem) {
        elem.classList.remove("droppable");
    }

    ganttItem.ondragstart = function() {
        return false;
    };
})