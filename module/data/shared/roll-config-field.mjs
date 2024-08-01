const { StringField, NumberField, SchemaField } = foundry.data.fields;

/**
 * Field for storing data for a specific type of roll.
 */
export default class RollConfigField extends foundry.data.fields.SchemaField {
  constructor({roll={}, ability="", ...fields}={}, options={}) {
    const opts = { initial: null, nullable: true, min: 1, max: 20, integer: true };
    fields = {
      ability: new StringField({required: true, initial: ability, label: "ROTV.AbilityModifier"}),
      roll: new SchemaField({
        min: new NumberField({...opts, label: "ROTV.Minimum"}),
        max: new NumberField({...opts, label: "ROTV.Maximum"}),
        mode: new NumberField({choices: [-1, 0, 1], initial: 0, label: "ROTV.AdvantageMode"}),
        ...roll
      }),
      ...fields
    };
    super(fields, options);
  }
}
