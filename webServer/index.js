const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');

const port = 3000;


app.use('/', express.static(__dirname+'/sites'))

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(compression({
    threshold: 0
}));

app.get('/model', (req, res) => {
    const filePath = path.join(__dirname+"/models/"+req.query.model);
    res.sendFile(filePath);
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
