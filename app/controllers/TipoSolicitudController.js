const { TipoSolicitud, Comision } = require('../models/index')

module.exports = {


    //SHOW ALL
    async all(req, res) {
        let tipos_solicitud = await TipoSolicitud.findAll({
            include: [{
                model: Comision,
                as: 'comisiones',
                attributes: ["id", "createdAt"],
            }]
        });
        res.json(tipos_solicitud);
    },

    //FIND BY ID
    async find(req, res, next) {

        let tipos_solicitud = await TipoSolicitud.findByPk(req.params.id, {
            include: [{
                model: Comision,
                as: 'comisiones',
                attributes: ["id", "createdAt"],
            }]
        });

        if (!tipos_solicitud) {
            res.status(404).json({ msg: `El Tipo de Solicitud ${req.params.id} no ha sido encontrado!` });
        } else {
            req.tipos_solicitud = tipos_solicitud;
            next();
        }
    },

    //SHOW ID
    async show(req, res) {
        res.json(req.tipos_solicitud);
    },

    //CREATE
    async create(req, res) {
        const tipos_solicitud = await TipoSolicitud.build({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
        });
        await tipos_solicitud.save().then(function(newtipos_solicitud) {
            console.log(newtipos_solicitud);
            res.status(201).send({
                status: 201,
                message: `El tipo de ${newtipos_solicitud.nombre} solicitud se creó con éxito!`
            });
        }).catch(function(error) {
            console.log(error.message);
            return res.status(400).send({
                status: 400,
                message: error.message
            });
        })
    },

    //UPDATE
    async update(req, res) {
        TipoSolicitud.update({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
        }, {
            where: {
                id: req.params.id,
            }
        }).then(function(newtipos_solicitud) {
            console.log(newtipos_solicitud);
            res.status(201).send({
                status: 201,
                message: `El tipo de solicitud ${req.body.nombre} se actualizó con éxito!`
            });
        }).catch(function(error) {
            console.log(error.message);
            return res.status(400).send({
                status: 400,
                message: error.message
            });
        });
    },

    //DELETE
    async delete(req, res) {

        req.tipos_solicitud.destroy().then(tipos_solicitud => {
            res.json({ msg: `El Tipo de Solicitud ${tipos_solicitud.nombre} ha sido eliminado!` })
        })

    },

    //SHOW NAME
    async showName(req, res) {
        let tipos_solicitud = await TipoSolicitud.find({
            where: {
                nombre: req.params.nombre
            }
        });

        if (!tipos_solicitud) {
            res.status(404).json({ msg: `El Tipo de Solicitud ${req.params.nombre} no ha sido encontrado!` });
        } else {
            res.json(tipos_solicitud);
        }
    },
}