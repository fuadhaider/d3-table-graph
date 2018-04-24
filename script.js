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