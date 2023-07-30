import { Router } from "express"
import userModel from "../dao/models/Users.model.js"

const router = Router()

router.post("/register", async (req, res) => {
    const {first_name, last_name, email, password} = req.body

    if(!first_name || !last_name || !email || !password) return res.status(400).send({status: "error", error: "Debes completar todos los campos"})

    const exist = await userModel.findOne({email})

    if(exist || email === "adminCoder@coder.com") return res.status(400).send({status: "error", error: "Usuario existente"})

    
    try {
        const user = {
            first_name,
            last_name,
            email,
            password
        }

        let result = await userModel.create(user)
        res.status(200).send({status: "success", message: "Usuario registrado"}) 
    } catch (error) {
        res.status(400).send({status: "error", error: "Error al registrar el usuario"})
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) return res.status(400).send({status: "error", error: "Debes completar todos los campos"})

    let user = await userModel.findOne({email, password})
    if(!user && (email !== "adminCoder@coder.com" && password !== "adminCod3r123")) return res.status(400).send({status: "error", error: "Invalid email or password"})

    let rol = "User"
    
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        rol = "Admin"
        user = {
            first_name: "Admin",
            last_name: "Coder",
            email: email
        }
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        rol: rol
    }

    req.session.log = true

    res.status(200).send({status: "success", payload: req.session.user, message: "Usuario logueado"})
})

router.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if(error){
            res.status(400).json({error: "error logout", mensaje: "Error al cerrar la sesion"})
        }
        res.status(200).send("Sesion cerrada correctamente")
    })
})
export default router