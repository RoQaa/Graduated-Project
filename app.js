const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const AppError=require('./utils/appError');
const tourRouter=require('./Routes/tourRouter');
const userRouter=require('./Routes/userRouter');
const globalErrorHandler=require('./controllers/errorController');
const app = express();

// Global MiddleWares
if(process.env.NODE_ENV==='development'){
app.use(morgan('dev'));
}
// hna bn3ml limitng l3dd el mrat elly log in 34an  el brute force attacks
const limiter =rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'too many requests please try again later'
})

app.use('/api',limiter) // (/api)=> all routes start with /api

app.use(express.json()); //middle ware for req,res json files 3and req.body

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
//Data



//Route Handlers



//function:routing handler, path:route
/*app.get('/api/v1/tours', GetAllTours);
app.post('/api/v1/tours', AddTour);
app.get('/api/v1/tours/:id', GetTour);
app.patch('/api/v1/tours/:id', UpdateTour);
app.delete('/api/v1/tours/:id', DeleteTour);
*/

//Routes


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


app.all('*',(req,res,next)=>{

  // const err = new Error(`Can't find the url ${req.originalUrl} on this server`);
  // err.status='fail';
  // err.statusCode=404;
  next(new AppError(`Can't find the url ${req.originalUrl} on this server`,404));
  
});
app.use(globalErrorHandler);

module.exports=app;
     


