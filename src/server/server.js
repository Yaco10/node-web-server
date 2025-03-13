const express = require('express')
const path = require('path')

const startServer = (options) => {
    const {port, public_path = 'public'} = options
     
    const app = express()

    //para utilizar middlewares se utiliza use (express)
    app.use(express.static(public_path)) //contenido estatico que se presenta disponible

    app.get('*', (req, res) => {
        const indexPath = path.join(__dirname + `../../../${public_path}/index.html`) 
        res.sendFile(indexPath)
    })

    app.listen(port, () => {
        console.log(`escuchando en el puerto ${port}`)
    }) //abre un puerto y escucha por el mismo

}

module.exports = {
    startServer
}