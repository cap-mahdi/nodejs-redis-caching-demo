const express = require("express")
const axios = require("axios")
const cors = require("cors")
const Redis = require("redis")

const redisClient = Redis.createClient();
const app = express()
app.use(cors())

app.get("/photos", async (req,res) =>{
    const albumId =  req.query.albumId
    const key = `photos?albumId=${albumId}`
    const response = await getCache(key, async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos',{
            params: {
                albumId
            }
        })
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
    return new Promise(async (resolve,reject) => {
        console.log("key",key)
        try{
            const data = await redisClient.get(key)
            if(data!=null){
                console.log("data",data)
                resolve(JSON.parse(data))
            }
            else{
                console.log("no data")
                const newData = await cb()
                redisClient.set(key,JSON.stringify(newData))
                resolve(newData)
            }
        } catch (error){
            console.error(error)
            reject(error)
        }

})
}

app.listen(3000, async () => {    
    await redisClient.connect()
    console.log(`server on http://localhost:3000`)
}
)