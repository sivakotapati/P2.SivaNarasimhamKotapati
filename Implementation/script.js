let tachometer_min_angle = 48.45;
let tachometer_max_angle = 52.560;
let increase_decrease_angle_unit = 0.002;
let tachometer_move_speed = 500; // in milli secs

let speedometer_min_angle = 48.23;
let speedometer_max_angle = 52.38;
let speedometer_decrease_angle_unit = 0.0002;
let speedometer_move_speed = 400;

let counter = tachometer_min_angle;
let intervalIds = [];
let breakState = false;
let acceleratonState = true;

function accelerateClicked() {
    console.log('accelerate clicked');
    for (let i = 0; i < 100; i++) {
        if(i>10)
        {
            break;
        }
        let id = setInterval(function () {
            intervalIds.push(id);
            console.log("interval id:" + id);
            let new_angle = counter + increase_decrease_angle_unit;
            if (new_angle >= tachometer_max_angle) {
                new_angle = tachometer_max_angle;
                updateTachometerAngle(new_angle);
                return;
            }
            updateTachometerAngle(new_angle);
            counter += increase_decrease_angle_unit;
            console.log(`${i}: ${counter}`);
        },tachometer_move_speed);
    }
}

function breakClicked() {
    console.log('break clicked');
    for (let i = 0; i < 100; i++) {
        if (i > 30) break;
        let id = setInterval(function () {
            intervalIds.push(id);
            console.log("interval id:" + id);
            let new_angle = counter - increase_decrease_angle_unit;
            if (new_angle <= tachometer_min_angle) {
                new_angle = tachometer_min_angle;
                updateTachometerAngle(new_angle);
                return;
            }
            updateTachometerAngle(counter - increase_decrease_angle_unit);
            counter -= increase_decrease_angle_unit;
            console.log(`${i}: ${counter}`);
        })
    }
}

function stopCar() {
    console.log('car stopping..');
}

function updateTachometerAngle(angle)
{
    console.log('updating angle: '+angle);
    $('#tacho-meter-needle').css('transform', `rotate(${angle}rad)`);

    updateSpeedometerAngle(angle - 0.025);
}


function updateSpeedometerAngle(angle){
    console.log('updating angle: '+angle);
    $('#speedo-meter-needle').css('transform', `rotate(${angle}rad)`);
}

function slowDownTachometer(){

}

function slowDownSpeedometer(){
    
}

/************************************************************************************************** */
const left_signal_id = "left_signal";
const right_signal_id = "right_signal";
const signal_on_color = "green";
const signal_off_color = "white"
const singal_on_off_time_in_milliseconds = 900;


const metric_units = "metric";
const imeprial_units = "imperial";

const default_units = metric_units;
let custom_selected_unit = null;

let weather_api_url = "https://api.openweathermap.org/data/2.5/forecast?q=Lubbock,us&APPID=3f2b39ee96bea5d53296ae364ac222de&units=";


$(document).ready(function () {

    $("#move_left").click(function () {
        console.log("move left clicked")
        TurnOnLeftOrRightSignal(left_signal_id);
    });

    $("#move_right").click(function () {
        console.log("move right clicked")
        TurnOnLeftOrRightSignal(right_signal_id);
    });


    $("#stop_move_left").click(function () {
        console.log("stop move left clicked")
        TurnOffLeftOrRightSignal(left_signal_id);
    });

    $("#stop_move_right").click(function () {
        console.log("stop move right clicked")
        TurnOffLeftOrRightSignal(right_signal_id);
    });

    getWeatherAndDisplay();
});

let buttonIds = [
    { id: left_signal_id, intervalId: null, isOn: false },
    { id: right_signal_id, intervalId: null, isOn: false }
];

function TurnOnLeftOrRightSignal(arrowId) {
    if (buttonIds.some(x => x.isOn == true)) {
        console.log("already one signal is on")
        return;
    }

    let on = true;
    var intervalId = setInterval(function () {
        console.log(`${arrowId} is on:${on}`);
        $(`#${arrowId}`).css("color", on ? signal_on_color : signal_off_color);
        on = !on;
        playAudio();
    }, singal_on_off_time_in_milliseconds);

    let element = buttonIds.find(x => x.id == arrowId);
    element.intervalId = intervalId;
    element.isOn = true;
}

function TurnOffLeftOrRightSignal(arrowId) {
    let element = buttonIds.find(x => x.id == arrowId);
    let intervalId = element?.intervalId;

    if (intervalId != undefined && intervalId != null) {
        clearInterval(intervalId);
        element.isOn = false;
        $(`#${arrowId}`).css("color", signal_off_color);
    }
}

function playAudio() {
    console.log("playing audio");;
}

function getWeatherAndDisplay() {
    // $.ajax({
    //     url: weather_api_url + (custom_selected_unit ? custom_selected_unit : default_units), success: function (response) {
    //         DisplayWeather(response);
    //     }
    // })
    // let json_file_path = (custom_selected_unit == metric_units) ? "sample_weather_response_deg.json" : "sample_weather_response_fah.json"
    // $.getJSON(json_file_path, function (json) {
    //     DisplayWeather(json);
    // });
}
function DisplayWeather(response) {
    if (!response) {
        return;
    }
    let rows = "";
    for (let i = 0; i < 3 /*response.list.length*/; i++) {
        let data = response.list[i];
        let imageSource = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        let date = new Date(data.dt_txt);

        let day = `${getDayDescriptionFromDay(date.getDay())}, ${getMonthDescription(date.getMonth() + 1)},${formateDate(date.getDate())}`;

        rows += gettableRow(data.dt_txt, day, data.main.temp_min, data.main.temp_max, imageSource, data.main.feels_like);
    }
    let table = "<table id = 'temperature-table' class='temperature-table'>" + rows + "</table>"

    let existing_table = $('#temperature-table');
    if (existing_table) {
        existing_table.remove();
    }

    $('#notification_section').append(table);
    $('#temperature-table').resizable().draggable();

    // var items = [
    //     { content: table }, // will default to location (0,0) and 1x1
    //     { w: 2, content: 'another longer widget!' } // will be placed next at (1,0) and 2x1
    // ];
    // var grid = GridStack.init();
    // grid.load(items);
    // grid.addWidget(table);
}

// function formateMonth(input) {
//     return ("0" + (input + 1)).slice(-2);
// }

function formateDate(input) {
    return ("0" + input).slice(-2);
}

function getDayDescriptionFromDay(day) {
    let dayDescription = "";
    switch (day) {

        case 0:
            dayDescription = "Sunday";
            break;
        case 1:
            dayDescription = "Monday";
            break;

        case 2:
            dayDescription = "Tuesday";
            break;

        case 3:
            dayDescription = "Wednesday";
            break;

        case 4:
            dayDescription = "Thursday";
            break;

        case 5:
            dayDescription = "Friday";
            break;

        case 6:
            dayDescription = "Saturday"
            break;

        default:
    }
    return dayDescription;
}
function getMonthDescription(input) {
    let result = "";
    switch (input) {
        case 1: result = "January";
            break;
        case 2: result = "February";
            break;
        case 3: result = "March";
            break;
        case 4: result = "April";
            break;
        case 5: result = "May";
            break;
        case 6: result = "June";
            break;
        case 7: result = "July";
            break;
        case 8: result = "August";
            break;
        case 9: result = "September";
            break;
        case 10: result = "October";
            break;
        case 11: result = "November";
            break;
        case 12: result = "December";
            break;
    }
    return result;
}

function gettableRow(date, day, minTemp, maxTemp, imageSource, feelsLike) {
    let row = `<tr><td>${date}</td><td>${day}</td><td>min:${minTemp}, max:${maxTemp}, feels like: ${feelsLike}</td><td><img src=${imageSource}></td></tr>`;
    return row;
}

function tempUnitsChanged(element) {
    console.log("temp units changed");
    console.log(element);
    console.log(element.value);

    let selected_units = element.value;
    switch (selected_units) {
        case "Degrees": custom_selected_unit = metric_units;
            break;
        case "Fahrenheit": custom_selected_unit = imeprial_units;
            break;
    }
    getWeatherAndDisplay();
}