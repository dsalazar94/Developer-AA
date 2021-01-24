const express = require('express');

const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
const app_path = '/dist';

app.use('/', express.static(path.join(__dirname,app_path)))
.get('*', (req, res) => res.sendFile(path.join(__dirname,app_path + '/index.html')))
.listen(PORT, ()=>console.log(`Listinig on ${PORT}`));

