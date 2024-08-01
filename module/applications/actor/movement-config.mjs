import BaseConfigSheet from "./base-config.mjs";

/**
 * A simple form to set actor movement speeds.
 */
export default class ActorMovementConfig extends BaseConfigSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rotv"],
      template: "systems/rotv/templates/apps/movement-config.hbs",
      width: 300,
      height: "auto",
      keyPath: "system.attributes.movement"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${game.i18n.localize("ROTV.MovementConfig")}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options={}) {
    const source = this.document.toObject();
    const movement = foundry.utils.getProperty(source, this.options.keyPath) ?? {};
    const raceData = this.document.system.details?.race?.system?.movement ?? {};

    // Allowed speeds
    const speeds = source.type === "group" ? {
      land: "ROTV.MovementLand",
      water: "ROTV.MovementWater",
      air: "ROTV.MovementAir"
    } : {
      walk: "ROTV.MovementWalk",
      burrow: "ROTV.MovementBurrow",
      climb: "ROTV.MovementClimb",
      fly: "ROTV.MovementFly",
      swim: "ROTV.MovementSwim"
    };

    return {
      movement,
      movements: Object.entries(speeds).reduce((obj, [k, label]) => {
        obj[k] = { label, value: movement[k], placeholder: raceData[k] ?? 0 };
        return obj;
      }, {}),
      selectUnits: Object.hasOwn(movement, "units"),
      canHover: Object.hasOwn(movement, "hover"),
      units: CONFIG.ROTV.movementUnits,
      unitsPlaceholder: game.i18n.format("ROTV.AutomaticValue", {
        value: CONFIG.ROTV.movementUnits[raceData.units ?? Object.keys(CONFIG.ROTV.movementUnits)[0]]?.toLowerCase()
      }),
      keyPath: this.options.keyPath
    };
  }
}
