/**
 * Field for storing movement data.
 */
export default class MovementField extends foundry.data.fields.SchemaField {
  constructor(fields={}, options={}) {
    const numberConfig = { required: true, nullable: true, min: 0, step: 0.1, initial: null };
    fields = {
      burrow: new foundry.data.fields.NumberField({ ...numberConfig, label: "ROTV.MovementBurrow" }),
      climb: new foundry.data.fields.NumberField({ ...numberConfig, label: "ROTV.MovementClimb" }),
      fly: new foundry.data.fields.NumberField({ ...numberConfig, label: "ROTV.MovementFly" }),
      swim: new foundry.data.fields.NumberField({ ...numberConfig, label: "ROTV.MovementSwim" }),
      walk: new foundry.data.fields.NumberField({ ...numberConfig, label: "ROTV.MovementWalk" }),
      units: new foundry.data.fields.StringField({
        required: true, nullable: true, blank: false, initial: null, label: "ROTV.MovementUnits"
      }),
      hover: new foundry.data.fields.BooleanField({required: true, label: "ROTV.MovementHover"}),
      ...fields
    };
    Object.entries(fields).forEach(([k, v]) => !v ? delete fields[k] : null);
    super(fields, { label: "ROTV.Movement", ...options });
  }
}
