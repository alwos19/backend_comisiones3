const { Departamento, Usuario } = require('../models/index');
var Sequelize = require('sequelize');
const { or } = Sequelize.Op;

module.exports = {

    async showAll(req, res, next) {

        let rolAuth = req.usuario.roles.nombre;

        if (rolAuth === 'ADMIN' || rolAuth === 'VICERRECTORIA') {
            next();

        } else if (rolAuth === 'COORDINACION') {
            let depAuth = req.usuario.departamentos_id;

            //usuarios con mismo depto del autenticado
            let user = await Usuario.findAll({
                where: { departamentos_id: depAuth },
                include: "comisiones"
            });
            res.json(user);

        } else if (rolAuth === 'DECANATURA') {

            let deptoAuth = await Departamento.findByPk(req.usuario.departamentos_id);
            let facAuth = deptoAuth.facultades_id;

            let deptoUser = await Departamento.findAll({
                raw: true,
                attributes: ["id"],
                where: {
                    facultades_id: facAuth,
                }
            });

            console.log(deptoUser.map(a => a.id));

            //usuarios con mismo depto del autenticado
            let user = await Usuario.findAll({
                where: {
                    departamentos_id: {
                        [or]: deptoUser.map(a => a.id),
                    }
                },
                include: "comisiones"
            });
            res.json(user);


        } else {
            res.json(req.usuario.comisiones);
        }

    },

    async show(req, res, next) {

        // comision.usuarios_id viene del controller (por ruta), 
        //usuario.roles y usuario.id vienen del auth.js

        let rolAuth = req.usuario.roles.nombre;
        let idUser = req.comision.usuarios_id;
        let idAuth = req.usuario.id;
        let depAuth = req.usuario.departamentos_id; //depto del autenticado
        let depUser = req.comision.usuarios.departamentos_id; //depto del usuario de la comision

        console.log(depAuth, depUser);

        if (idAuth === idUser || rolAuth === 'ADMIN' || rolAuth === 'VICERRECTORIA' || (depUser === depAuth && rolAuth === 'COORDINACION')) {
            next();

        } else {
            let deptoUser = await Departamento.findByPk(req.comision.usuarios.departamentos_id);
            let deptoAuth = await Departamento.findByPk(req.usuario.departamentos_id);

            let facAuth = deptoAuth.facultades_id;
            let facUser = deptoUser.facultades_id;

            if (facAuth == facUser && rolAuth === 'DECANATURA') {
                next();

            } else {
                res.status(401).json({ msg: 'No estas autorizado para ver esta página!' })
            }

        }
    },
    update(req, res, next) {
        if (req.usuario.id === req.comision.usuarios_id || req.usuario.roles.nombre === 'ADMIN') {
            next();
        } else {
            res.status(401).json({ msg: 'No estas autorizado!' })
        }
    },
    delete(req, res, next) {
        if (req.usuario.id === req.comision.usuarios_id || req.usuario.roles.nombre === 'ADMIN') {
            next();
        } else {
            res.status(401).json({ msg: 'No estas autorizado!' })
        }
    },
}