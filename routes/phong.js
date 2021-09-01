const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const {checkAuth} = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const handleUndefined = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "P_";
const ROUTER_NAME = "Phòng";
const { phong } = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, ten } = handleUndefined(req.query, ["id", "ten"]);
    const result = await phong.findMany({
        where: { id: { contains: id }, ten: { contains: ten } }
    })
    return res.json(result);
});

router.get("/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await phong.findUnique({
        where: { id: id }
    })
    return res.json(result);
});


router.post('/', validate.validateBodyPhong(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { ten } = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await phong.findMany({
            where: {
                OR: [{ id: id }, { ten: ten }],
            },
            select: {
                id: true,
                ten: true,
            }
        });
        if (object.length > 0) {
            return res.status(400).json({
                "errors": [{
                    "msg": ROUTER_NAME + " đã tồn tại trên hệ thống"
                }]

            })

        } else {
            const newObject = await phong.create({
                data: {
                    id,
                    ten
                }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
});

router.put("/:id", validate.validateBodyPhong(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        "errors": [{
            "msg": "Id params không được để trống"
        }]

    })

    if (errors.isEmpty()) {

        const { ten } = req.body;
        const object = await phong.findUnique({
            where: { id: id }
        });
        if (object) {
            const updateObject = await phong.update({
                where: { id: id },
                data: { ten: ten }
            })
            return res.json(updateObject);
        } else {
            return res.status(400).json({
                "errors": [{
                    msg: ROUTER_NAME + "không tồn tại trên hệ thống"
                }]

            })
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
})


router.delete("/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        "errors": [{
            "msg": "Id params không được để trống"
        }]

    })

    const object = await phong.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteObject = await phong.delete({
            where: { id: id },
        })
        return res.json(deleteObject);
    } else {
        return res.status(400).json({
            "errors": [{
                "msg": ROUTER_NAME + " không tồn tại trên hệ thống"
            }]
        })
    }

})



module.exports = router;