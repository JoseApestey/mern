import { Router } from "express"
import { productDao } from "../dao/mongoDao/product.dao.js"

const router = Router()

router.get("/", async (req, res) => {
    const { limit, page, sort, category, status } = req.query;
    try {
      const options = {
        limit: limit || 10,
        page: page || 1,
        sort: {
          price: sort === "asc" ? 1 : -1,
        },
        lean: true,
      };
  
      if (status) {
        const products = await productDao.getAll({ status: status }, options);
        return res.json({ status: "ok", payload: products });
      }
  
      if (category) {
        const products = await productDao.getAll({ category: category }, options);
        return res.json({ status: "ok", payload: products });
      }
  
      const products = await productDao.getAll({}, options);
      res.json({ status: "ok", payload: products });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  });

router.get("/:pid", async (req,res)=>{
    const {pid} = req.params
    try {

        const product = await productDao.getById(pid)
        console.log(product)
        
        res.send(product)

    }catch (err){
        console.log(err)
        res.send(err.message)
    }
})

router.post("/", async (req,res)=>{
    const body = req.body
    try {
        const product = await productDao.create(body)
        
        res.json({ playload: product})

    }catch (err){
        console.log(err)
        res.send(err.message)
    }
})


router.put("/:pid", async (req,res)=>{ 
    const {pid} = req.params
    const body = req.body
    try {

        const findProduct = await productDao.getById(pid)
        if(!findProduct) return res.json({status:"error", message:`product id ${pid} no encontrado`})

        const product = await productDao.update(pid, body)
        
        res.json({status: "succes" , playload: "products"})

    }catch (err){
        console.log(err)
        res.send(err.message)
    }
})

router.delete("/:pid", async (req,res)=>{
    const {pid} = req.params
    
    try {
        const findProduct = await productDao.delete(pid)
        if(!findProduct) return res.json({status:"error", message:`product id ${pid} no encontrado`})

        const product = await productDao.delete(pid)
        
       res.json({status: "succes" , playload: `product id ${pid} eliminado`})

    }catch (err){
        console.log(err)
        res.send(err.message)
    }
})



export default router