import { FormulaField } from "../fields.mjs";
import SourceField from "../shared/source-field.mjs";
import AttributesFields from "./templates/attributes.mjs";
import CommonTemplate from "./templates/common.mjs";
import DetailsFields from "./templates/details.mjs";
import TraitsFields from "./templates/traits.mjs";

/**
 * System data definition for Vehicles.
 *
 * @property {string} vehicleType                      Type of vehicle as defined in `ROTV.vehicleTypes`.
 * @property {object} attributes
 * @property {object} attributes.ac
 * @property {number} attributes.ac.flat               Flat value used for flat or natural armor calculation.
 * @property {string} attributes.ac.calc               Name of one of the built-in formulas to use.
 * @property {string} attributes.ac.formula            Custom formula to use.
 * @property {string} attributes.ac.motionless         Changes to vehicle AC when not moving.
 * @property {object} attributes.damRed
 * @property {object} attributes.damRed.front
 * @property {object} attributes.damRed.side
 * @property {object} attributes.damRed.rear
 * @property {object} attributes.hp
 * @property {number} attributes.hp.value              Current hit points.
 * @property {number} attributes.hp.max                Maximum allowed HP value.
 * @property {number} attributes.hp.temp               Temporary HP applied on top of value.
 * @property {number} attributes.hp.tempmax            Temporary change to the maximum HP.
 * @property {number} attributes.hp.dt                 Damage threshold.
 * @property {number} attributes.hp.mt                 Mishap threshold.
 * @property {object} attributes.actions               Information on how the vehicle performs actions.
 * @property {boolean} attributes.actions.stations     Does this vehicle rely on action stations that required
 *                                                     individual crewing rather than general crew thresholds?
 * @property {number} attributes.actions.value         Maximum number of actions available with full crewing.
 * @property {object} attributes.actions.thresholds    Crew thresholds needed to perform various actions.
 * @property {number} attributes.actions.thresholds.2  Minimum crew needed to take full action complement.
 * @property {number} attributes.actions.thresholds.1  Minimum crew needed to take reduced action complement.
 * @property {number} attributes.actions.thresholds.0  Minimum crew needed to perform any actions.
 * @property {object} attributes.capacity              Information on the vehicle's carrying capacity.
 * @property {string} attributes.capacity.creature     Description of the number of creatures the vehicle can carry.
 * @property {number} attributes.capacity.cargo        Cargo carrying capacity measured in tons.
 * @property {object} traits
 * @property {string} traits.dimensions                Width and length of the vehicle.
 * @property {object} cargo                            Details on this vehicle's crew and cargo capacities.
 * @property {PassengerData[]} cargo.crew              Creatures responsible for operating the vehicle.
 * @property {PassengerData[]} cargo.passengers        Creatures just takin' a ride.
 * @property {object} details
 * @property {SourceField} details.source              Adventure or sourcebook where this vehicle originated.
 */
export default class VehicleData extends CommonTemplate {

  /** @inheritdoc */
  static _systemType = "vehicle";

  /* -------------------------------------------- */

  /** @inheritdoc */
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      vehicleType: new foundry.data.fields.StringField({required: true, initial: "water", label: "ROTV.VehicleType"}),
      attributes: new foundry.data.fields.SchemaField({
        ...AttributesFields.common,
        ac: new foundry.data.fields.SchemaField({
          flat: new foundry.data.fields.NumberField({integer: true, min: 0, label: "ROTV.ArmorClassFlat"}),
          calc: new foundry.data.fields.StringField({initial: "default", label: "ROTV.ArmorClassCalculation"}),
          formula: new FormulaField({deterministic: true, label: "ROTV.ArmorClassFormula"}),
          motionless: new foundry.data.fields.StringField({required: true, label: "ROTV.ArmorClassMotionless"})
        }, {label: "ROTV.ArmorClass"}),
        damRed: new foundry.data.fields.SchemaField({
          front: new foundry.data.fields.NumberField({integer: true, min: 0, label: "ROTV.DRFront"}),
          side: new foundry.data.fields.NumberField({integer: true, min: 0, label: "ROTV.DRSide"}),
          rear: new foundry.data.fields.NumberField({integer: true, min: 0, label: "ROTV.DRRear"}),
        }, {label: "ROTV.DR"}),
        hp: new foundry.data.fields.SchemaField({
          value: new foundry.data.fields.NumberField({
            nullable: true, integer: true, min: 0, initial: null, label: "ROTV.HitPointsCurrent"
          }),
          max: new foundry.data.fields.NumberField({
            nullable: true, integer: true, min: 0, initial: null, label: "ROTV.HitPointsMax"
          }),
          temp: new foundry.data.fields.NumberField({integer: true, initial: 0, min: 0, label: "ROTV.HitPointsTemp"}),
          tempmax: new foundry.data.fields.NumberField({integer: true, initial: 0, label: "ROTV.HitPointsTempMax"}),
          dt: new foundry.data.fields.NumberField({
            required: true, integer: true, min: 0, label: "ROTV.DamageThreshold"
          }),
          mt: new foundry.data.fields.NumberField({
            required: true, integer: true, min: 0, label: "ROTV.VehicleMishapThreshold"
          })
        }, {label: "ROTV.HitPoints"}),
        actions: new foundry.data.fields.SchemaField({
          stations: new foundry.data.fields.BooleanField({required: true, label: "ROTV.VehicleActionStations"}),
          value: new foundry.data.fields.NumberField({
            required: true, nullable: false, integer: true, initial: 0, min: 0, label: "ROTV.VehicleActionMax"
          }),
          thresholds: new foundry.data.fields.SchemaField({
            2: new foundry.data.fields.NumberField({
              required: true, integer: true, min: 0, label: "ROTV.VehicleActionThresholdsFull"
            }),
            1: new foundry.data.fields.NumberField({
              required: true, integer: true, min: 0, label: "ROTV.VehicleActionThresholdsMid"
            }),
            0: new foundry.data.fields.NumberField({
              required: true, integer: true, min: 0, label: "ROTV.VehicleActionThresholdsMin"
            })
          }, {label: "ROTV.VehicleActionThresholds"})
        }, {label: "ROTV.VehicleActions"}),
        capacity: new foundry.data.fields.SchemaField({
          creature: new foundry.data.fields.StringField({required: true, label: "ROTV.VehicleCreatureCapacity"}),
          cargo: new foundry.data.fields.NumberField({
            required: true, nullable: false, integer: true, initial: 0, min: 0, label: "ROTV.VehicleCargoCapacity"
          })
        }, {label: "ROTV.VehicleCargoCrew"})
      }, {label: "ROTV.Attributes"}),
      details: new foundry.data.fields.SchemaField({
        ...DetailsFields.common,
        source: new SourceField()
      }, {label: "ROTV.Details"}),
      traits: new foundry.data.fields.SchemaField({
        ...TraitsFields.common,
        size: new foundry.data.fields.StringField({required: true, initial: "lg", label: "ROTV.Size"}),
        di: TraitsFields.makeDamageTrait({label: "ROTV.DamImm"}, {initial: ["poison", "psychic"]}),
        ci: TraitsFields.makeSimpleTrait({label: "ROTV.ConImm"}, {initial: [
          "blinded", "charmed", "deafened", "frightened", "paralyzed",
          "petrified", "poisoned", "stunned", "unconscious"
        ]}),
        dimensions: new foundry.data.fields.StringField({required: true, label: "ROTV.Dimensions"})
      }, {label: "ROTV.Traits"}),
      cargo: new foundry.data.fields.SchemaField({
        crew: new foundry.data.fields.ArrayField(makePassengerData(), {label: "ROTV.VehicleCrew"}),
        passengers: new foundry.data.fields.ArrayField(makePassengerData(), {label: "ROTV.VehiclePassengers"})
      }, {label: "ROTV.VehicleCrewPassengers"})
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static _migrateData(source) {
    super._migrateData(source);
    AttributesFields._migrateInitiative(source.attributes);
    VehicleData.#migrateSource(source);
  }

  /* -------------------------------------------- */

  /**
   * Convert source string into custom object.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateSource(source) {
    if ( source.details?.source && (foundry.utils.getType(source.details.source) !== "Object") ) {
      source.details.source = { custom: source.details.source };
    }
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareBaseData() {
    this.attributes.prof = 0;
    AttributesFields.prepareBaseArmorClass.call(this);
    AttributesFields.prepareBaseEncumbrance.call(this);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    const rollData = this.parent.getRollData({ deterministic: true });
    const { originalSaves } = this.parent.getOriginalStats();

    this.prepareAbilities({ rollData, originalSaves });
    AttributesFields.prepareEncumbrance.call(this, rollData, { validateItem: item =>
      (item.flags.rotv?.vehicleCargo === true) || !["weapon", "equipment"].includes(item.type)
    });
    AttributesFields.prepareHitPoints.call(this, this.attributes.hp);
  }
}

/* -------------------------------------------- */

/**
 * Data structure for an entry in a vehicle's crew or passenger lists.
 *
 * @typedef {object} PassengerData
 * @property {string} name      Name of individual or type of creature.
 * @property {number} quantity  How many of this creature are onboard?
 */

/**
 * Produce the schema field for a simple trait.
 * @param {object} schemaOptions  Options passed to the outer schema.
 * @returns {PassengerData}
 */
function makePassengerData(schemaOptions={}) {
  return new foundry.data.fields.SchemaField({
    name: new foundry.data.fields.StringField({required: true, label: "ROTV.VehiclePassengerName"}),
    quantity: new foundry.data.fields.NumberField({
      required: true, nullable: false, integer: true, initial: 0, min: 0, label: "ROTV.VehiclePassengerQuantity"
    })
  }, schemaOptions);
}
