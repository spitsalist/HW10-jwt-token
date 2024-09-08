import express from 'express'
import router from './router/router.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(router)


app.listen(PORT, async () => {
   try {
    console.log(`Server is running on port ${PORT}`)
   }catch(e){
    console.log('Error connecting to database',e)
   }
})