import { Router } from "express"
import messagesManager from "../dao/dbManagers/messages.js"
import cartsManager from "../dao/dbManagers/carts.js"
import productsModel from "../dao/models/products.js"

const manejadorMensajes = new messagesManager()
const manejadorCarrito = new cartsManager()

const router = Router()

router.get("/", (req, res) => {
    res.render("login")
})

router.get("/messages", async (req, res) => {
    let messages = await manejadorMensajes.getAllMessages()
    res.render("chat", {messages})
})

function auth(req, res, next){
    if(req.session.log){
        return next()
    }else{
        return res.status(401).send("Debes iniciar sesion para ver los productos")
    }

}

router.get("/products", auth, async (req, res) => {
    const {page = 1} = req.query
    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit: 2, page, lean: true})

    const products = docs

    res.render("products", {
        products,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        user: req.session.user
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if(error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"})
        }
        res.send("Sesion cerrada correctamente")
    })
})

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid
    const products = await manejadorCarrito.getProducts(cid)
    res.render("carts", {products})
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/login", (req, res) => {
    res.render("login")
})

export default router
