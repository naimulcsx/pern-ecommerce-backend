import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoute.js';
import productCategory from './routes/productRoute.js'

const app = express();

app.use( express.json() );

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/category', categoryRoutes); 
app.use('/product', productCategory);

//not found route 

// global error handler

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// endpoint -> app.js -> router -> controller -> data-return
