const mongoose = require('mongoose');

mongoose.connect(process.env.DATA_BASE_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(()=>{
  console.log('Databsae is connected');
}).catch((err)=>{
  console.log(err);
})

module.exports = mongoose.connection;
