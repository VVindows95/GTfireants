var http = require('http');
var fs = require('fs');

const PORT=8080; 

// Declare static folder to be served. It contains the js, images, css, etc.
app.use(express.static('Simulation'));

// Serve the index.html for all the other requests so that the
// router in the javascript app can render the necessary components
app.get('*',function(req,res){
  res.sendFile(path.join('/index.html'));
});

fs.readFile('./index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});