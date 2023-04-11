
import express, { request, response } from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';
import { pool } from './db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT ?? 8000


// AGREGAR UNA NUEVA TAREA A LA LISTA DE TAREAS POR HACER
app.post('/add-new-todo', async (request, response) => {
    const { user_email, title, progress, date } = request.body
    const id = uuidv4()
    try {
        const newToDo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
            [id, user_email, title, progress, date]) // DEBEN DE IR EN EL ORDEN DEL COMANDO SQL
        response.json({
            'message': 'agregado exitosamente'
        })
    } catch (error) {
        console.log(error)
    }
})

// OBTENER TODA LA LISTA DE TAREAS POR HACER
app.get('/todos', async (request, response) => {
    try {
        const todos = await pool.query('SELECT * FROM todos')
        response.json(todos.rows)
    } catch (error) {
        console.log(error)
    }
})

// EDITAR UN REGISTRO
app.put('/edit-todo/:id', async (request, response) => {
    const { id } = request.params
    const { user_email, title, progress, date } = request.body
    try {
        const editToDo = await pool.query(`UPDATE todos SET user_email=$1, title=$2, progress=$3, date=$4 WHERE id=$5;`,
            [user_email, title, progress, date, id]) // DEBEN DE IR EN EL ORDEN DEL COMANDO SQL
        response.json(editToDo)
    } catch (error) {
        console.log(error)
    }
})

//ELIMINAR UN REGISTRO
app.delete('/delete-todo/:id', async (request, response) => {
    const { id } = request.params
    try {
        const deleteToDo = await pool.query(`DELETE FROM todos WHERE id=$1;`, [id])
        response.json(deleteToDo)
    } catch (error) {
        console.log(error)
    }
})

// SIGNUP
app.post('/sign-up', async (request, response) => {
    const { email, password } = request.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    try {
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
            [email, hashedPassword])
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        response.json({ email, token })

    } catch (error) {
        console.log(error)
        error ? response.json({ detail: error.detail }) : ''
    }

})

// LOGIN
app.post('/login', async (request, response) => {
    const { email, password } = request.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        !users.rows.length ? response.json({ detail: 'User doesn´t exist' }) : ''

        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        success ?
            response.json({ 'email': users.rows[0].email, token })
            : response.json({ detail: 'login failed' })

    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`La aplicación está corriendo en el puerto ${port}`)
})