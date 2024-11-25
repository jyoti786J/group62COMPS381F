const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: ['your_cookie_secret'] }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student_records', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.error(err));

// Configure Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) return done(null, false);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false);
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// Routes
app.use('/users', userRoutes);
app.use('/students', studentRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
