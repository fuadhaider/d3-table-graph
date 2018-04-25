
$( document ).ready(function() {
  $('.js-button--upload').click(function () {
    $("#tableMain tr").remove();
    var rdr = new FileReader();
    // console.log(rdr); // rdr null object
    rdr.onload = function (e) {
      // console.log(rdr); rdr loaded with \n and ,
      var therows = e.target.result.split("\n");
      // console.log(therows);
      //get the rows into an array

      //loop through the rows
      for (var row = 0; row < therows.length; row++ ) {
        //build a new table row
        var newrow = "";
        //get the column cells of each row into individual arrays
        var columns = therows[row].split(",");
        // console.log(columns);
        //get number of columns
        // var colcount = columns.length;

        newrow = "<tr><td>" +  columns[0] +  "</td><td><input value=\"" +  columns[1] +  "\"></td></tr>";  
        $('#tableMain').append(newrow);						
      }
    }
    rdr.readAsText($(".js-input")[0].files[0]);
    //read first line of file
  });
});      

//chart
// taking window measurements
var width = window.innerWidth * 0.8;
var height = window.innerHeight / 2;



  // d3.csv(url).then(function(data {
  function loadCharts() {
  
    // parsing date with month name
    var parseTime = d3.timeParse("%d-%b-%y");

    // setting x y ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // var z = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);

    var xyGraph = d3.select(".js-svg__g-line-graph"); 
    var barGraph = d3.select(".js-svg__g-bar-graph");

    // Getting CSV data
    
      
      // defining graph line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.price); });
    
    var data = new Array();
    
    $('#tableMain tr').each(function(row, tr) {
        data[row] = {
            "date" : $(tr).find('td:eq(0)').text()
            , "price" :$(tr).find('input').val()
        }
    }); 
    data.shift();  // first row is the table header - so remove
    //data array of date and price objects
     
    // formatting data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.price = +d.price;
    });


    // Scaling range of data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);
    // z.domain(data.map(function(d) { return d.date; }));

    // Graph line path.
    xyGraph.select(".path-xy-line")
        .data([data])
        .attr("d", valueline);
        
    xyGraph.selectAll("circle")
      .data(data)
      .enter().append("circle")
      // .filter(function(d) { return d.year == '2008' })
      .attr("class", "circle")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.price); });
      
    xyGraph.selectAll("circle")
      .data(data)
      // .filter(function(d) { return d.year == '2008' })
      .attr("class", "circle")
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.price); });
      
      xyGraph.selectAll("circle")
        .data(data)
      .on("click", function(d, i){
        // console.log(i);
        // $( "tr:eq(i)" ).addClass( "hot" );
        $("tr").removeClass("hot");
        $("tr").eq(i+1).addClass( "hot" );
      });
      
      // Graph bar
      barGraph.selectAll("bar")
          .data(data)
          .enter().append("rect")
          .attr("x", function(d) {return x(d.date); })
          .attr("y", function(d) { return y(d.price); })
          .attr("height", function(d) { return height - y(d.price);})
          // .attr("width", z.rangeBand());
          // .attr("width", x.bandwidth());
          .attr("width", function(d) {return 2+"vw";});

        // Graph bar
        barGraph.selectAll("bar")
            .data(data)
            .attr("x", function(d) {return x(d.date); })
            .attr("width", function(d) {return 2+"vw";})
            // .attr("width", x.bandwidth())
            // .attr("width", z.rangeBand())
            .attr("y", function(d) { return y(d.price); })
            .attr("height", function(d) {return height - y(d.price);});

          barGraph.selectAll("rect")
            .data(data)
            .on("click", function(d, i) {
            $("tr").removeClass("hot");
            $("tr").eq(i+1).addClass( "hot" );
          });


    // X Axis
    xyGraph.select(".g-x-axis")
        .call(d3.axisBottom(x));

    // Y Axis
    xyGraph.select(".g-y-axis")
        .call(d3.axisLeft(y));
        
    // X Axis
    barGraph.select(".g-x-axis")
        .call(d3.axisBottom(x));

    // Y Axis
    barGraph.select(".g-y-axis")
        .call(d3.axisLeft(y));
}