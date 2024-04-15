const express = require("express")
const axios = require("axios")
const cors = require("cors")
const redis = require("redis")

const redisClient = redis.createClient();

const app = express()
app.use(cors())

app.get("/photos", async (req,res) =>{
    const albumId =  req.query.albumId
    const key = `photos?albumId=${albumId}`
    const response = await getCache(key, async () => {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
        return response.data
    }
    )

    res.json(response)
     
})

app.get("/photos/:id", async (req,res) =>{
    const id =  req.params.id
    const key = `photos:${id}`
    const response = await getCache(key, async () => {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)
        return response.data
    }
    )

    res.json(response)

     
}
)

function getCache(key,cb){
    return new Promise((resolve,reject) => {
        redisClient.get(key,async  (err,data) => {
            if(err) return reject(err)
            if(data != null) return resolve(data)
            const dataFetched = await cb()
            redisClient.setEx(key,3600,dataFetched)
            resolve(dataFetched)
        })
    })
}

app.listen(3000, () => {    
    console.log(`server on http://localhost:3000`)
}
)