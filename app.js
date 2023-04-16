const express = require('express');
const morgan = require('morgan');
const AppError=require(`${__dirname}/utils/appError`);
const tourRouter=require(`${__dirname}/Routes/tourRouter`);
const userRouter=require(`${__dirname}/Routes/userRouter`);
const globalErrorHandler=require(`${__dirname}/Controllers/errorController`);
const app = express();

//MiddleWares

app.use(morgan('dev'));
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


app.use('/tours',tourRouter);
app.use('/users',userRouter);


app.all('*',(req,res,next)=>{

  // const err = new Error(`Can't find the url ${req.originalUrl} on this server`);
  // err.status='fail';
  // err.statusCode=404;
  next(new AppError(`Can't find the url ${req.originalUrl} on this server`,404));
  
});
app.use(globalErrorHandler);

module.exports=app;
     


