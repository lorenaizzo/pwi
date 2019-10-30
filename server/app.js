'use strict'
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var session = require('express-session');
var hbs = require('express-handlebars');
var nodemailer = require('nodemailer');


var app = express();

// Forma 2: crea un prefijo, asi no se conoce la carpeta real
// el usuario escribe por ejemplo http://localhost:3000/static/index.html y accede a la carpeta paginas
app.use('/', express.static('paginas'));


app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://3.80.30.175']
}));

app.use(session({
    secret: 'h1n1', 
    cookie: {
        secure: false,
        httpOnly: false
    } 
}));

// Conexion con la base de datos
try {
    mongoose.connect('mongodb://localhost/dieta', {useNewUrlParser: true});
    console.log('conexion exitosa con la base de datos');
}
catch(err) {
    console.log('Hubo errores en la conexion con la base de datos: ' + err);
}

// Esquemas -> estructuras de la coleccion
const Schema = mongoose.Schema;


const schemas = {

    diario: new Schema({
        comida: {type: String},
        alimento: {type: String},
	    fecha: {type: Date}
    },{collection: "diario"}),

    usuario: new Schema({
        nombreUsuario: {type: String},
        password: {type: String}
     },{collection: "usuario"})
};




// Modelo -> abstraccion de los esquemas que vamos a utilizar para operar con la BD
// siempre que debamos hacer operaciones (insertar, eliminar, actualizar, etc) sobre la BD
// debemos utilizar modelos
const models = {
    Diario: mongoose.model('diario', schemas.diario),
    Usuario: mongoose.model('usuario', schemas.usuario)
};


// Handlebars configuracion
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// Para trabajar con formularios
app.use(express.urlencoded());


app.get('/contacto', function(req, res){
    res.render('formulario', {tipoFormulario: 'Contacto'});
});



app.post('/api/login', async function (req, res) {
    var result = null;
console.log("api/login");
        if(!req.body.nombreUsuario || req.body.nombreUsuario && req.body.nombreUsuario == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "nombreUsuario", "message": "es vacio", "code": "required"}]
            });
            return;

        }

        if(!req.body.password || req.body.password && req.body.password == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "password", "message": "es vacio", "code": "required"}]
            });
            return;

        }

        try{

            result = await models.Usuario.findOne({'nombreUsuario': req.body.nombreUsuario, 'password': req.body.password});
    
            if(result) {
                req.session.usuarioId = result._id;
                res.send({status: 'ok'});
            }
            else {
                res.status(401).send({status: 'error'});
            }

        }
        catch (error) {
            res.status(500).send("error" + error);
        }
    

});



app.get('/api/diario', async function (req, res) {
/*
    if(!req.session.usuarioId) {
        res.status(403).send();
        return;
    }

*/    var result = null;

    try{
        result = await models.Diario.find();
        res.send(result);
    }
    catch (error) {
        res.send("error" + error);
    }
 
});


app.get('/api/diario/:id', async function (req, res) {
    if(!req.session.usuarioId) {
        res.status(403).send();
        return;

    }

    var result = null;

    try{

        result = await models.Diario.findById(req.params.id);

        res.send(result);
    }
    catch (error) {
        res.send("error" + error);
    }
 
});



app.post('/api/diario', async function (req, res) {
    if(!req.session.usuarioId) {
        res.status(403).send();
        return;

    }

    var result = null;
    var unaComida = null

    try {

        if(!req.body.comida || req.body.comida && req.body.comida == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "comida", "message": "es vacio", "code": "required"}]
            });
            return;

        }

        if(!req.body.fecha || req.body.fecha && req.body.fecha == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "fecha", "message": "es vacio", "code": "required"}]
            });
            return;

        }

        if(!req.body.alimento || req.body.alimento && req.body.alimento == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "alimentos", "message": "es vacio", "code": "required"}]
            });
            return;

        }


        unaComida = new models.Diario({
            comida : req.body.comida,
            fecha: req.body.fecha,
            alimento: req.body.alimento});


        result = await unaComida.save();


        res.json(result);

    }
    catch (error) {
        res.send('error ' + error);
    }
}) 


app.put('/api/diario/:id', async function (req, res) {
    if(!req.session.usuarioId) {
        res.status(403).send();
        return;

    }

    var unaComida = null;
    var result = null;

    try{

        if(!req.body.comida || req.body.comida && req.body.comida == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "comida", "message": "es vacio", "code": "required"}]
            });
            return;

        }

        if(!req.body.fecha || req.body.fecha && req.body.fecha == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "fecha", "message": "es vacio", "code": "required"}]
            });
            return;

        }

        if(!req.body.alimento || req.body.alimento && req.body.alimento == "") {
            res.status(400).json({
                "status": "error",
                "validations": [{"field": "alimentos", "message": "es vacio", "code": "required"}]
            });
            return;

        }


        unaComida = await models.Diario.findById(req.params.id);

        unaComida.comida = req.body.comida;
        unaComida.fecha = req.body.fecha;
        unaComida.alimento = req.body.alimento;

        result = await unaComida.save();

        res.send(result);
    }
    catch (error) {
        res.send("error" + error);
    }
 
});



app.delete('/api/diario/:id', async function (req, res) {
    if(!req.session.usuarioId) {
        res.status(403).send();
        return;

    }

    var result = null;

    try{

        result = await models.Diario.deleteOne({_id:req.params.id});

        res.send(result);
    }
    catch (error) {
        res.send("error" + error);
    }
 
});


app.post('/contacto', async function (req, res) {

    try {
        var error = null;

        if (!req.body.nombre || req.body.nombre && req.body.nombre == '') {
            error.push('El nombre es obligatorio');
        } 

        if (!req.body.apellido || req.body.apellido && req.body.apellido == '') {
            error.push('El apellido es obligatorio');
        }

        if (!req.body.email || req.body.email && req.body.email == '') {
            error.push('El e-mail es obligatorio');
        }

        if (!req.body.mensaje || req.body.mensaje && req.body.mensaje == '') {
            error.push('Debes enviarme algun mensaje!');
        }

        if (error) {
            res.render('formulario', {error: error})
            return;
        }

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mailParaAprender',
                pass: 'Cursos1369'
            }
        });
        
        let info = await transporter.sendMail({
            from: '"'+req.body.nombre+' '+req.body.apellido+'" <'+req.body.email+'>',
            to: 'mailParaAprender@gmail.com, '+req.body.email,
            subject: 'Nuevo mensaje proveniente del sitio web',
            text: req.body.mensaje,
            html: '<p>'+req.body.mensaje+'<b>'
        });


        res.redirect('/')
    } 
    catch(err) {

        res.render('formulario', {error: err});
    }

});




// Armamos el servidor
app.listen(3000);
console.log('Ejemplo de aplicacion escuchando en el port 3000!');

