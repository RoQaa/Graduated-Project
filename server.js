const dotenv = require('dotenv');
const mongoose = require('mongoose');

//console.log(undefine var)
process.on('uncaughtException',err =>{
  console.log('UNCAUGHT EXCEPTION , Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

const app = require(`${__dirname}/app.js`);

//read all vars in config file as environment vars
dotenv.config({path:'./config.env'}); 

const DB = process.env.DATABASE.replace(
    '<password>',process.env.PASSWORD
)

mongoose.connect(DB,{
    
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con => console.log('DB connection successful'))

const port =  process.env.PORT || 3000 ;
const server = app.listen(port, () => {
  console.log(`App running in ${port}...`)
});

//fail connect with db 
process.on('unhandledRejection',err=>{
  console.log(err.name, err.message)
  console.log('UNHANDLER REJECTION , Shutting down...')
  //close server and app
  server.close(()=>{
    // 0: success , 1: uncaught exception
    process.exit(1)
  })
})
