//Load CSV in browser and create data table
$( document ).ready(function() {
  $('.js-button--upload').click(function () {
    //remove previous table data
    $("#js-table tr").remove();
    var reader = new FileReader();
    reader.onload = function(e) {
      var therows = e.target.result.split("\n");
      //get the rows into an array
      var newrow = "";
      var columns = therows[0].split(",");
      //insert CSV header
      newrow = "<tr><td>" + columns[0] + "</td><td>" + columns[1] +"</td></tr>";  
      $('#js-table').append(newrow);
      //insert rest of CSV data looping through the rows
      for (var row = 1; row < therows.length; row++) {
        //build a new table row
        newrow = "";
        //get the column cells of each row into individual arrays
        columns = therows[row].split(",");
        //with input tag
        newrow = "<tr><td>" + columns[0] + "</td><td><input value=\"" +
        columns[1] + "\"></td></tr>";  
        $('#js-table').append(newrow);						
      }
    }
    reader.readAsText($(".js-input")[0].files[0]);
  });
});      

//creating graphs
function loadCharts() {
  // taking window measurements
  var width = window.innerWidth * 0.8;
  var height = window.innerHeight / 2;
  //parsing date with month name
  var parseTime = d3.timeParse("%d-%b-%y");
  // setting x y ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var xyGraph = d3.select("#js-svg__g-line-graph"); 
  var barGraph = d3.select("#js-svg__g-bar-graph");

  // defining graph line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var data = [];
  //data array of date and value objects
  $('#js-table tr').each(function(row, tr) {
    data[row] = {
        "date": $(tr).find('td:eq(0)').text()
        , "value" :$(tr).find('input').val()
    }
  }); 
  // removing CSV header
  data.shift();

  // formatting data
  data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.value = +d.value;
  });

  // Scaling range of data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);
  // z.domain(data.map(function(d) { return d.date; }));

  // Graph line path.
  xyGraph.select("#js-svg__path-xy-line")
    .data([data])
    .attr("d", valueline);

  //create circle graph  
  xyGraph.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("class", "js--circle")
  .attr("r", 6)
  .attr("cx", function(d) { return x(d.date); })
  .attr("cy", function(d) { return y(d.value); });

  //update circle graph
  xyGraph.selectAll("circle")
  .data(data)
  .attr("class", "js--circle")
  .attr("r", 6)
  .attr("cx", function(d) { return x(d.date); })
  .attr("cy", function(d) { return y(d.value); });

  //click interaction with table
  xyGraph.selectAll("circle")
    .data(data)
    .on("click", function(d, i){
    $("tr").removeClass("js-table__tr--highlight");
    $("tr").eq(i+1).addClass("js-table__tr--highlight");
  });

  // Graph bar
  barGraph.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", function(d) {return x(d.date); })
      .attr("y", function(d) { return y(d.value); })
      // .attr("width", z.rangeBand());
      // .attr("width", x.bandwidth());
      .attr("width", function(d) {return 1+"vw";})
      .attr("height", function(d) { return height - y(d.value);})
      .attr("fill","olive");
      
  // Graph bar
  barGraph.selectAll("rect")
      .data(data)
      .attr("x", function(d) {return x(d.date); })
      .attr("width", function(d) {return 1+"vw";})
      // .attr("width", x.bandwidth())
      // .attr("width", z.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) {return height - y(d.value);})
      .attr("fill","olive");
      
  //click interaction with table
  barGraph.selectAll("rect")
    .data(data)
    .on("click", function(d, i) {
    $("tr").removeClass("js-table__tr--highlight");
    $("tr").eq(i+1).addClass("js-table__tr--highlight");
  });

  // line X Axis
  xyGraph.select(".g-x-axis")
      .call(d3.axisBottom(x));

  // line Y Axis
  xyGraph.select(".g-y-axis")
      .call(d3.axisLeft(y));
      
  // bar X Axis
  barGraph.select(".g-x-axis")
      .call(d3.axisBottom(x));

  // bar Y Axis
  barGraph.select(".g-y-axis")
      .call(d3.axisLeft(y));
}