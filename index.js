'use strict'

const hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
const path = require('path')
const hbs = require('handlebars')
const vision = require('@hapi/vision')

const server = hapi.server({
    port: process.env.PORT || 4000,
    host: 'localhost' ,
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
})

async function init(){
    
    try {
        await server.start()
        await server.register(inert)
        await server.register(vision)
        server.views({
            engines: {
                hbs: hbs
            },
            relativeTo: __dirname,
            path: 'views',
            layout: true,
            layoutPath: 'views'
        })
        server.route({
            method: 'GET',
            path: '/',
            handler: (req, h) => {
                return h.view('mapa', {
                    title: 'Mapa de Tio Taxi'
                })
            }
        })
        server.route({
            method: 'Post',
            path: '/coordenadas',
            handler: (req, h) => {
                console.log(req.payload);
                return 'Fechas obtenidas'
            }
        })
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory:{
                    path: '.',
                    index: 'index.html'
                }
            }
        })
    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }
    console.log(`Servidor on: ${server.info.uri}`);
}
init()