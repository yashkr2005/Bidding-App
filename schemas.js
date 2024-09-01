const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

const d= new Date()
const t = d.getTime()
module.exports.productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        category: Joi.string().required().escapeHTML(),
        //image: Joi.string().required(),
        price: Joi.number().min(0).required(),
        startTime: Joi.date().required().min(0),
        duration: Joi.number().required().min(0.5).max(3)
    }).required()
})

module.exports.biddingSchema = Joi.object({
    bidding: Joi.object({
        price: Joi.number().required().min(0)
    }).required()
})

module.exports.walletSchema = Joi.object({
    walletAdd: Joi.object({
        wallet: Joi.number().required().min(0).max(100000)
    }).required()
})