const { all } = require("../routes");

const { TipoSolicitud } = require('../models/index')

module.exports = {

    //SHOW ALL
    async all(req, res) {
        let tipos_solicitud = await TipoSolicitud.findAll({
            include: "comisiones"
        });
        res.json(tipos_solicitud);
    },

    //SHOW ID
    async show(req, res) {
        let tipos_solicitud = await TipoSolicitud.findByPk(req.params.id, {
            include: "comisiones"
        });

        if (!tipos_solicitud) {
            res.status(404).json({ msg: "Tipo de Solicitud no encontrado!" });
        } else {
            res.json(tipos_solicitud);
        }
    },

    //CREATE
    async create(req, res) {
        const tipos_solicitud = await TipoSolicitud.build({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
        });
        await tipos_solicitud.save().then(function(newtipos_solicitud) {
            console.log(newtipos_solicitud);
            res.status(200).send({
                status: 200,
                message: 'El tipo de solicitud se creó con éxito!'
            });
        }).catch(function(error) {
            console.log(error.message);
            return res.status(400).send({
                status: 404,
                message: error.message
            });
        })
    },

    //UPDATE
    async update(req, res) {
        const id = req.params.id;
        const tipos_solicitud = TipoSolicitud.update({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
        }, {
            where: {
                id: req.params.id,
            }
        }).then(function(newtipos_solicitud) {
            console.log(newtipos_solicitud);
            res.status(200).send({
                status: 200,
                message: 'El tipo de solicitud se actualizó con éxito!'
            });
        }).catch(function(error) {
            console.log(error.message);
            return res.status(400).send({
                status: 404,
                message: error.message
            });
        });
    },

    //DELETE
    async delete(req, res) {
        let tipos_solicitud = await TipoSolicitud.findByPk(req.params.id);

        if (!tipos_solicitud) {
            res.status(404).json({ msg: "Tipo de Solicitud no encontrado!" });
        } else {
            tipos_solicitud.destroy().then(tipos_solicitud => {
                res.json({ msg: "El Tipo de Solicitud ha sido eliminado!" })
            })
        }
    },

    //SHOW NAME
    async showName(req, res) {
        let tipos_solicitud = await TipoSolicitud.find({
            where: {
                nombre: req.params.nombre
            }
        });

        if (!tipos_solicitud) {
            res.status(404).json({ msg: "Tipo de Solicitud no encontrado!" });
        } else {
            res.json(tipos_solicitud);
        }
    },
}