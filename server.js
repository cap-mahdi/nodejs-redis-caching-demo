const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()
app.use(cors())

app.get("/photos", async (req,res) =>{
    const albumId =  req.query.albumId
    const response = await axios.get('https://jsonplaceholder.typicode.com/photos',{
        params: {
            albumId
        }
    })
    res.json(response.data)
     
})

app.get("/photos/:id", async (req,res) =>{
    const id =  req.params.id
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)
    res.json(response.data)
     
}
)

app.listen(3000, () => {    
    console.log(`server on http://localhost:3000`)
}
)