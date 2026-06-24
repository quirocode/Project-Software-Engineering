import express    from "express"
import bodyParser from "body-parser"
import cors       from "cors"
const app  = express()
const port = 5000      // ‹ cambia el puerto si necesitas
// MIDDLEWARES — siempre antes de las rutas
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
// nn Datos en memoria nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
// Reemplaza los campos del objeto por los tuyos
const items = [
  { id: 1, nombre: "Peluche", precio: 250, stock: 15},
    { id: 2, nombre: "Bebe", precio: 500, stock: 15},
]
let nextId = 3
// nn GET — retorna todos nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
// Reemplaza /api/ruta por tu endpoint
app.get("/api/cart/items", (req, res) => {
  res.json({ items })
  // o simplemente: res.json(items)
})
// nn GET — por id (/api/ruta/1) nnnnnnnnnnnnnnnnnnnnnnnnnnnn
app.get("/api/cart/items/:id", (req, res) => {
  const item = items.find(i => String(i.id) === req.params.id)
  if (!item) return res.status(404).json({ error: "No encontrado" })
  res.json(item)
})
// nn POST — crear nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
app.post("/api/cart/items", (req, res) => {
  const { nombre, precio, stock} = req.body
  if (!nombre || !precio || stock === undefined)
    return res.status(400).json({ error: "Faltan campos" })
  const newItem = { id: nextId++, nombre, precio, stock}
  items.push(newItem)
  res.status(200).json(newItem)
  // si el examen pide 201: res.status(201).json(newItem)
})
// nn PUT — modificar nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
app.put("/api/cart/items/:id", (req, res) => {
  const index = items.findIndex(i => String(i.id) === req.params.id)
  if (index === -1) return res.status(404).json({ error: "No encontrado" })
  items[index] = { ...req.body, id: Number(req.params.id) }
  res.json(items[index])
})
// nn DELETE — eliminar nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
app.delete("/api/cart/items/:id", (req, res) => {
  const index = items.findIndex(i => String(i.id) === req.params.id)
  if (index === -1) return res.status(404).json({ error: "No encontrado" })
  items.splice(index, 1)
  res.status(200).json({ message: "Eliminado" })
})
app.listen(port, () => console.log("Servidor en http://localhost:" + port))