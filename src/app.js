const { envs } = require('./config/env')
const { startServer } = require('./server/server')

const main = () => {
    startServer({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH
    })
}


// funcion agnostica autoconvocada
// se usa asi porque queremos que sea asincrona, para evitar errores dificiles de manejar
(async() => {
    main()
})()