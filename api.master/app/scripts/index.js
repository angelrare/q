var graphData = [], date, columnChart;

//for tests
/*window.data = [{"count":193,"timestamp":"2014-07-28T17:00:00.576Z"},{"count":289,"timestamp":"2014-07-28T16:00:00.566Z"},{"count":304,"timestamp":"2014-07-28T15:00:00.559Z"},{"count":255,"timestamp":"2014-07-28T14:00:00.595Z"},{"count":221,"timestamp":"2014-07-28T13:00:00.583Z"},{"count":213,"timestamp":"2014-07-28T12:00:00.578Z"},{"count":199,"timestamp":"2014-07-28T11:00:00.567Z"},{"count":207,"timestamp":"2014-07-28T10:00:00.559Z"},{"count":195,"timestamp":"2014-07-28T09:00:00.561Z"},{"count":151,"timestamp":"2014-07-28T08:00:00.559Z"},{"count":135,"timestamp":"2014-07-28T07:00:00.560Z"},{"count":110,"timestamp":"2014-07-28T06:00:00.565Z"},{"count":105,"timestamp":"2014-07-28T05:00:00.562Z"},{"count":98,"timestamp":"2014-07-28T04:00:00.570Z"},{"count":104,"timestamp":"2014-07-28T03:00:00.567Z"},{"count":98,"timestamp":"2014-07-28T02:00:00.568Z"},{"count":119,"timestamp":"2014-07-28T01:00:00.561Z"},{"count":123,"timestamp":"2014-07-28T00:00:00.574Z"},{"count":127,"timestamp":"2014-07-27T23:00:00.559Z"},{"count":115,"timestamp":"2014-07-27T22:00:00.579Z"},{"count":115,"timestamp":"2014-07-27T21:00:00.579Z"},{"count":126,"timestamp":"2014-07-27T20:00:00.585Z"},{"count":59,"timestamp":"2014-07-27T19:00:00.559Z"},{"count":142,"timestamp":"2014-07-27T18:00:00.893Z"},{"count":140,"timestamp":"2014-07-27T17:00:00.891Z"},{"count":150,"timestamp":"2014-07-27T16:00:00.894Z"},{"count":155,"timestamp":"2014-07-27T15:00:00.898Z"},{"count":121,"timestamp":"2014-07-27T14:00:00.891Z"},{"count":102,"timestamp":"2014-07-27T13:00:00.903Z"},{"count":114,"timestamp":"2014-07-27T12:00:00.893Z"},{"count":113,"timestamp":"2014-07-27T11:00:00.906Z"},{"count":115,"timestamp":"2014-07-27T10:00:00.893Z"},{"count":93,"timestamp":"2014-07-27T09:00:00.900Z"},{"count":97,"timestamp":"2014-07-27T08:00:00.911Z"},{"count":73,"timestamp":"2014-07-27T07:00:00.915Z"},{"count":78,"timestamp":"2014-07-27T06:00:00.918Z"},{"count":71,"timestamp":"2014-07-27T05:00:00.900Z"},{"count":77,"timestamp":"2014-07-27T04:00:00.916Z"},{"count":87,"timestamp":"2014-07-27T03:00:00.921Z"},{"count":104,"timestamp":"2014-07-27T02:00:00.917Z"},{"count":93,"timestamp":"2014-07-27T01:00:00.913Z"},{"count":110,"timestamp":"2014-07-27T00:00:00.893Z"},{"count":132,"timestamp":"2014-07-26T23:00:00.896Z"},{"count":130,"timestamp":"2014-07-26T22:00:00.911Z"},{"count":102,"timestamp":"2014-07-26T21:00:00.921Z"},{"count":110,"timestamp":"2014-07-26T20:00:00.923Z"},{"count":99,"timestamp":"2014-07-26T19:00:00.904Z"},{"count":146,"timestamp":"2014-07-26T18:00:00.841Z"}];*/

for(i = window.data.length - 1; i >= 0; i --){
    date = new Date(window.data[i].timestamp);
    graphData.push({
        x: date.getUTCDate() + '.' + date.getUTCHours(),
        y: window.data[i].count
    });
}

columnChart = d4.charts.column().outerWidth(900);
d3.select('#graph').datum(graphData).call(columnChart);
