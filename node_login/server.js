const express = require('express');
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");


const initializePassport =  require('./passportConfig');

initializePassport(passport);

const PORT = process.env.PORT || 4000;


app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register");
});

app.get("/users/login",checkAuthenticated, (req, res) => {
    res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user });
});



app.get('/users/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "You have logged out");
        res.redirect("/users/login");
    });
});

app.post("/users/register", async (req, res) => {
    console.log("Incoming request:", req.method, req.url);
    console.log("Request body:", req.body);

    let { name, email, password, password2 } = req.body;

    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please Enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        return res.render("register", { errors });
    }

    

    // Hash Password
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
        (err, results) => {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                errors.push({ message: "Email already registered" });
                return res.render('register', { errors });
            } else {
                pool.query(
                    `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, password`,
                    [name, email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        req.flash('success_msg', "You are registered, please log in");
                        res.redirect("/users/login");
                    }
                );
            }
        }
    );
});

app.post("/users/login", passport.authenticate("local",{
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
}));


function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}



// GET /tasks - Retrieve a list of tasks (optionally filtered by user)
app.get('/tasks', checkNotAuthenticated, async (req, res) => {
    const { userId } = req.query;
    let query = 'SELECT * FROM tasks';
    if (userId) query += ' WHERE user_id = $1';
    try {
        const result = await pool.query(query, userId ? [userId] : []);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// POST /tasks - Create a new task
app.post('/tasks', checkNotAuthenticated, async (req, res) => {
    const { title, description, userId } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', checkNotAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET /tasks/edit/:id - Render the edit task page
app.get('/tasks/edit/:id', checkNotAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            const task = result.rows[0];
            res.render('edit', { task });
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// PUT /tasks/:id - Update a task (edit or mark as complete)
app.put('/tasks/:id', checkNotAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, is_complete } = req.body;

    console.log('Updating task:', { title, description, is_complete, id });

    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 RETURNING *',
            [title, description, is_complete, id]
        );
        console.log('Database result:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



