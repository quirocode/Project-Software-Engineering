import express from "express" 
import bodyParser from "body-parser" 
import cors from "cors" 
const app = express() 
const port = 3001 //  cambia el puerto si necesitas 
// MIDDLEWARES — siempre antes de las eventss 
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(cors()) 

const items = [ 
{ id: 1, titulo: "Gran pollada", fecha: "Mañana", local:"Surco", categoria: "Conferencia" }, 
] 
let nextId = 2 

app.get("/api/events", (req, res) => { 
res.json({ items }) 
// o simplemente: res.json(items) 
}) 
// ■■ GET — filtrar por query param (?campo=valor) ■■■■■■■■■■ 
app.get("/api/events/search", (req, res) => { 
const {categoria} = req.query // lee ?campo1=... 
if (!categoria) 
return res.status(400).json({ error: "campo1 es requerido" }) 
const result = items.filter(i => 
i.categoria.toLowerCase().includes(categoria.toLowerCase()) 
) 
res.json(result) 
}) 

// ■■ POST — crear ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 
app.post("/api/events", (req, res) => { 
const { titulo, fecha, local, categoria } = req.body 
if (!titulo || !fecha || !local || !categoria ) 
return res.status(400).json({ error: "Faltan campos" }) 
const newItem = { id: nextId++, titulo,fecha,local,categoria } 
items.push(newItem) 
res.status(200).json(newItem) 
// si el examen pide 201: res.status(201).json(newItem) 
}) 
// ■■ PUT — modificar ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 
app.put("/api/events/:id", (req, res) => { 
const index = items.findIndex(i => String(i.id) === req.params.id) 
if (index === -1) return res.status(404).json({ error: "No encontrado" }) 
items[index] = { ...req.body, id: Number(req.params.id) } 
res.json(items[index]) 
}) 
// ■■ DELETE — eliminar ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 
app.delete("/api/events/:id", (req, res) => { 
const index = items.findIndex(i => String(i.id) === req.params.id) 
if (index === -1) return res.status(404).json({ error: "No encontrado" }) 
items.splice(index, 1) 
res.status(200).json({ message: "Eliminado" }) 
}) 
app.listen(port, () => console.log("Servidor en http://localhost:" + port)) 