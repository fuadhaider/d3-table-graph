// // function myFunction() {
// //     var x = document.getElementById("myFile").value;
// //     x.disabled = true;
// //     document.getElementById('x').innerHTML = x;
// // }
// // detect a change in a file input with an id of “the-file-input”
// $("#csv-file").change(function() {
//     // will log a FileList object, view gifs below
//     // console.log(this.files);
//     renderFile(this.files[0]);
// });
// 
// // render the image in our view
// function renderFile(file) {
// 
//   // generate a new FileReader object
//   var reader = new FileReader();
// 
//   // inject an image with the src url
//   reader.onload = function(event) {
//     url = event.target.result
//     $('#table-container').html("<img src='" + url + "' />")
//   }
// 
//   // when the file is read it triggers the onload event above.
//   reader.readAsDataURL(file);
// }
$( document ).ready(function() {
  $('#upload-file').click(function () {
    $("#tableMain tr").remove();

    // console.log(this.files);
    var rdr = new FileReader();
    // console.log(rdr);
    rdr.onload = function (e) {
      //get the rows into an array
      var therows = e.target.result.split("\n");
      //loop through the rows
      for (var row = 0; row < therows.length; row++  ) {
        //build a new table row
        var newrow = "";
        //get the columns into an array
        var columns = therows[row].split(",");
        //get number of columns
        var colcount=columns.length;
        				
        newrow = "<tr><td>" +  columns[0] +  "</td><td>" +  columns[1] +  "</td></tr>";  
        $('#tableMain').append(newrow);						
      }
    }
    rdr.readAsText($("#csv-file")[0].files[0]);
  });
});      

//chart
// taking window measurements
var width = window.innerWidth * 0.8;
var height = window.innerHeight / 2;

// parsing date with month name
var parseTime = d3.timeParse("%d-%b-%y");

// setting x y ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

 
var xyGraph = d3.select("#xy-graph"); 

// Getting CSV data
// function loadCSV(url) {
  // console.log(url);
  
  // defining graph line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.price); });
      
  // d3.csv(url).then(function(data {
  function loadCharts() {
    // var data = $('tbody tr').first().find('td:eq(0)').toArray();
    
    // var data;
    // $('#tableMain tr').each(function(row, tr){
    // data = data 
    //     + $(tr).find('td:eq(0)').text() + ' '  // Task No.
    //     + $(tr).find('td:eq(1)').text() + ' '  // Date
    //     // + $(tr).find('td:eq(2)').text() + ' '  // Description
    //     // + $(tr).find('td:eq(3)').text() + ' '  // Task
    //     + '\n';
    // });
    
    var data = new Array();
    
    $('#tableMain tr').each(function(row, tr){
        data[row]={
            "date" : $(tr).find('td:eq(0)').text()
            , "price" :$(tr).find('td:eq(1)').text()
            // , "description" : $(tr).find('td:eq(2)').text()
            // , "task" : $(tr).find('td:eq(3)').text()
        }
    }); 
    data.shift();  // first row is the table header - so remove

    console.log(data);
    // formatting data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.price = +d.price;
    });

    // Scaling range of data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);

    // Graph line path.
    xyGraph.select("path")
        .data([data])
        .attr("d", valueline);

    // X Axis
    xyGraph.select("#x-axis")
        .call(d3.axisBottom(x));

    // Y Axis
    xyGraph.select("#y-axis")
        .call(d3.axisLeft(y));
  // });
}