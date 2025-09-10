import Joi from 'joi';

export class feedbackquestions {
  static createSchema = Joi.object({
    id: Joi.number().integer().positive().allow(null).optional(),
    question_text: Joi.string().max(255).required(),
    is_active: Joi.boolean().required(),
    order: Joi.number().integer(),
    created_by: Joi.number().integer(),
    created_at: Joi.string(),
    updated_at: Joi.string()
  }).prefs({ abortEarly: false, stripUnknown: true });

  static updateSchema = Joi.object({
    id: Joi.number().integer().positive().allow(null).forbidden(),
    question_text: Joi.string().max(255).optional(),
    is_active: Joi.boolean().optional(),
    order: Joi.number().integer().optional(),
    created_at: Joi.string().forbidden(),
    updated_at: Joi.string().forbidden()
  })
    .custom((v, helpers) => {
      const updatable = ['question_text', 'is_active', 'order', 'created_by', 'created_at'];
      if (!updatable.some(k => v[k] !== undefined)) {
        return helpers.error('any.custom', { message: 'no updatable fields provided' });
      }
      return v;
    })
    .prefs({ abortEarly: false, allowUnknown: false });

  constructor(
    public question_text: string,
    public is_active: boolean,
    public order: number,
    public created_at: String,
    public updated_at: String,
    public id?: number,
  ) { }

  static create(data: any): Promise<feedbackquestions> {
    const { error, value } = this.createSchema.validate(data);

    if (error) {
      const problems = error.details.map(d => ({
        field: d.context?.key || '',
        type: d.type,
        message: d.message
      }));
      return Promise.reject({ problems });
    }

    return Promise.resolve(new feedbackquestions(
      value.question_text,
      value.is_active,
      value.order,
      value.created_at,
      value.updated_at,
      value.id
    ));
  }

  static update(data: any): Promise<Partial<feedbackquestions>> {
    const { error, value } = this.updateSchema.validate(data, { abortEarly: false });

    if (error) {
      const problems = (error.details || []).map(d => ({
        field: d.context?.key || '',
        type: d.type,
        message: d.message
      }));

      return Promise.reject({ problems });
    }

    return Promise.resolve(value as Partial<feedbackquestions>);
  }
}
