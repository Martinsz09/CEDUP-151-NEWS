require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const connectDB = require('./database/db');
const methodOverride = require('method-override');


const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'segredo_do_caderninho', 
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use('/', userRoutes);
app.use('/home', homeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
