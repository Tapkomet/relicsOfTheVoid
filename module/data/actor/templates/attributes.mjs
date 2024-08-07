import { FormulaField } from "../../fields.mjs";
import MovementField from "../../shared/movement-field.mjs";
import SensesField from "../../shared/senses-field.mjs";
import ActiveEffectRotV from "../../../documents/active-effect.mjs";
import RollConfigField from "../../shared/roll-config-field.mjs";
import { convertWeight, simplifyBonus } from "../../../utils.mjs";

/**
 * Shared contents of the attributes schema between various actor types.
 */
export default class AttributesFields {
  /**
   * Fields shared between characters, NPCs, and vehicles.
   *
   * @type {object}
   * @property {object} init
   * @property {string} init.ability     The ability used for initiative rolls.
   * @property {string} init.bonus       The bonus provided to initiative rolls.
   * @property {object} movement
   * @property {number} movement.burrow  Actor burrowing speed.
   * @property {number} movement.climb   Actor climbing speed.
   * @property {number} movement.fly     Actor flying speed.
   * @property {number} movement.swim    Actor swimming speed.
   * @property {number} movement.walk    Actor walking speed.
   * @property {string} movement.units   Movement used to measure the various speeds.
   * @property {boolean} movement.hover  Is this flying creature able to hover in place.
   */
  static get common() {
    return {
      init: new RollConfigField({
        ability: "",
        bonus: new FormulaField({required: true, label: "ROTV.InitiativeBonus"})
      }, { label: "ROTV.Initiative" }),
      movement: new MovementField()
    };
  }

  /* -------------------------------------------- */

  /**
   * Fields shared between characters and NPCs.
   *
   * @type {object}
   * @property {object} attunement
   * @property {number} attunement.max          Maximum number of attuned items.
   * @property {object} senses
   * @property {number} senses.darkvision       Creature's darkvision range.
   * @property {number} senses.blindsight       Creature's blindsight range.
   * @property {number} senses.tremorsense      Creature's tremorsense range.
   * @property {number} senses.truesight        Creature's truesight range.
   * @property {string} senses.units            Distance units used to measure senses.
   * @property {string} senses.special          Description of any special senses or restrictions.
   * @property {string} spellcasting            Primary spellcasting ability.
   * @property {number} exhaustion              Creature's exhaustion level.
   * @property {object} concentration
   * @property {string} concentration.ability   The ability used for concentration saving throws.
   * @property {string} concentration.bonus     The bonus provided to concentration saving throws.
   * @property {number} concentration.limit     The amount of items this actor can concentrate on.
   * @property {object} concentration.roll
   * @property {number} concentration.roll.min  The minimum the d20 can roll.
   * @property {number} concentration.roll.max  The maximum the d20 can roll.
   * @property {number} concentration.roll.mode The default advantage mode for this actor's concentration saving throws.
   */
  static get creature() {
    return {
      attunement: new foundry.data.fields.SchemaField({
        max: new foundry.data.fields.NumberField({
          required: true, nullable: false, integer: true, min: 0, initial: 3, label: "ROTV.AttunementMax"
        })
      }, {label: "ROTV.Attunement"}),
      senses: new SensesField(),
      spellcasting: new foundry.data.fields.StringField({
        required: true, blank: true, initial: "int", label: "ROTV.SpellAbility"
      }),
      stress: new foundry.data.fields.NumberField({
        required: true, nullable: false, integer: true, min: -2, initial: 0, label: "ROTV.Exhaustion"
      }),
      concentration: new RollConfigField({
        ability: "",
        bonuses: new foundry.data.fields.SchemaField({
          save: new FormulaField({required: true, label: "ROTV.SaveBonus"})
        }),
        limit: new foundry.data.fields.NumberField({integer: true, min: 0, initial: 1, label: "ROTV.AttrConcentration.Limit"})
      }, {label: "ROTV.Concentration"})
    };
  }

  /* -------------------------------------------- */
  /*  Data Migration                              */
  /* -------------------------------------------- */

  /**
   * Migrate the old init.value and incorporate it into init.bonus.
   * @param {object} source  The source attributes object.
   * @internal
   */
  static _migrateInitiative(source) {
    const init = source?.init;
    if ( !init?.value || (typeof init?.bonus === "string") ) return;
    if ( init.bonus ) init.bonus += init.value < 0 ? ` - ${init.value * -1}` : ` + ${init.value}`;
    else init.bonus = `${init.value}`;
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /**
   * Initialize derived AC fields for Active Effects to target.
   * @this {CharacterData|NPCData|VehicleData}
   */
  static prepareBaseArmorClass() {
    const ac = this.attributes.ac;
    ac.armor = 10;
    ac.shield = ac.cover = 0;
    ac.bonus = "";
  }

  /* -------------------------------------------- */

  /**
   * Initialize base encumbrance fields to be targeted by active effects.
   * @this {CharacterData|NPCData|VehicleData}
   */
  static prepareBaseEncumbrance() {
    const encumbrance = this.attributes.encumbrance ??= {};
    encumbrance.multipliers = {
      encumbered: "1", heavilyEncumbered: "1", maximum: "1", overall: "1"
    };
    encumbrance.bonuses = {
      encumbered: "", heavilyEncumbered: "", maximum: "", overall: ""
    };
  }

  /* -------------------------------------------- */

  /**
   * Prepare concentration data for an Actor.
   * @this {CharacterData|NPCData}
   * @param {object} rollData  The Actor's roll data.
   */
  static prepareConcentration(rollData) {
    const { concentration } = this.attributes;
    const abilityId = concentration.ability || CONFIG.ROTV.defaultAbilities.concentration;
    const ability = this.abilities?.[abilityId] || {};
    const bonus = simplifyBonus(concentration.bonuses.save, rollData);
    concentration.save = (ability.save ?? 0) + bonus;
  }

  /* -------------------------------------------- */

  /**
   * Calculate encumbrance details for an Actor.
   * @this {CharacterData|NPCData|VehicleData}
   * @param {object} rollData  The Actor's roll data.
   * @param {object} [options]
   * @param {Function} [options.validateItem]  Determine whether an item's weight should count toward encumbrance.
   */
  static prepareEncumbrance(rollData, { validateItem }={}) {
    const config = CONFIG.ROTV.encumbrance;
    const encumbrance = this.attributes.encumbrance ??= {};
    const baseUnits = CONFIG.ROTV.encumbrance.baseUnits[this.parent.type]
      ?? CONFIG.ROTV.encumbrance.baseUnits.default;
    const unitSystem = game.settings.get("rotv", "metricWeightUnits") ? "metric" : "imperial";

    // Get the total weight from items
    let weight = this.parent.items
      .filter(item => !item.container && (validateItem?.(item) ?? true))
      .reduce((weight, item) => weight + (item.system.totalWeightIn?.(baseUnits[unitSystem]) ?? 0), 0);

    // [Optional] add Currency Weight (for non-transformed actors)
    const currency = this.currency;
    if ( game.settings.get("rotv", "currencyWeight") && currency ) {
      const numCoins = Object.values(currency).reduce((val, denom) => val + Math.max(denom, 0), 0);
      const currencyPerWeight = config.currencyPerWeight[unitSystem];
      weight += convertWeight(
        numCoins / currencyPerWeight,
        config.baseUnits.default[unitSystem],
        baseUnits[unitSystem]
      );
    }

    // Determine the Encumbrance size class
    const keys = Object.keys(CONFIG.ROTV.actorSizes);
    const index = keys.findIndex(k => k === this.traits.size);
    const sizeConfig = CONFIG.ROTV.actorSizes[
      keys[this.parent.flags.rotv?.powerfulBuild ? Math.min(index + 1, keys.length - 1) : index]
    ];
    const sizeMod = sizeConfig?.capacityMultiplier ?? sizeConfig?.token ?? 1;
    let maximumMultiplier;

    const calculateThreshold = threshold => {
            let base = this.abilities.str?.value ?? 0;
            let bonus = 10;
            let multiplier = 1;

            switch (base) {
              case -4:
                base = -2;
                break;
              case -3:
                base = -1.5;
                break;
              case -2:
                base = -1;
                break;
              case -1:
                base = -0.5;
                break;
              case 4:
                base = 3.5;
                break;
              case 5:
                base = 4;
                break;
              case 6:
                base = 4.5;
                break;
            }


                if (base > 6) base = 5;

                return (base * multiplier).toNearest(0.01) + bonus;
    };

    // Populate final Encumbrance values
    encumbrance.value = weight.toNearest(0.01);
    encumbrance.thresholds = {
      encumbered: calculateThreshold("encumbered"),
      heavilyEncumbered: calculateThreshold("heavilyEncumbered"),
      maximum: calculateThreshold("maximum")
    };
    encumbrance.max = encumbrance.thresholds.maximum;
    encumbrance.mod = (sizeMod * maximumMultiplier).toNearest(0.01);
    encumbrance.stops = {
      encumbered: Math.clamp((encumbrance.thresholds.encumbered * 100) / encumbrance.max, 0, 100),
      heavilyEncumbered: Math.clamp((encumbrance.thresholds.heavilyEncumbered * 100) / encumbrance.max, 0, 100)
    };
    encumbrance.pct = Math.clamp((encumbrance.value * 100) / encumbrance.max, 0, 100);
    encumbrance.encumbered = encumbrance.value > encumbrance.heavilyEncumbered;
  }

  /* -------------------------------------------- */

  /**
   * Adjust exhaustion level based on Active Effects.
   * @this {CharacterData|NPCData}
   */
  static prepareExhaustionLevel() {
    const exhaustion = this.parent.effects.get(ActiveEffectRotV.ID.EXHAUSTION);
    const level = exhaustion?.getFlag("rotv", "exhaustionLevel");
    this.attributes.exhaustion = Number.isFinite(level) ? level : 0;
  }

  /* -------------------------------------------- */

  /**
   * Calculate maximum hit points, taking an provided advancement into consideration.
   * @param {object} hp                 HP object to calculate.
   * @param {object} [options={}]
   * @param {HitPointsAdvancement[]} [options.advancement=[]]  Advancement items from which to get hit points per-level.
   * @param {number} [options.bonus=0]  Additional bonus to add atop the calculated value.
   * @param {number} [options.mod=0]    Modifier for the ability to add to hit points from advancement.
   * @this {ActorDataModel}
   */
  static prepareHitPoints(hp, { advancement=[], mod=0, bonus=0 }={}) {
    const base = advancement.reduce((total, advancement) => total + advancement.getAdjustedTotal(mod), 0);
    hp.max = (hp.max ?? 0) + base + bonus;
    if ( this.parent.hasConditionEffect("halfHealth") ) hp.max = Math.floor(hp.max * 0.5);

    hp.effectiveMax = hp.max + (hp.tempmax ?? 0);
    hp.value = Math.min(hp.value, hp.effectiveMax);
    hp.damage = hp.effectiveMax - hp.value;
    hp.pct = Math.clamp(hp.effectiveMax ? (hp.value / hp.effectiveMax) * 100 : 0, 0, 100);
  }

  /* -------------------------------------------- */

  /**
   * Modify movement speeds taking exhaustion and any other conditions into account.
   * @this {CharacterData|NPCData}
   */
  static prepareMovement() {
    const statuses = this.parent.statuses;
    const noMovement = this.parent.hasConditionEffect("noMovement");
    const halfMovement = this.parent.hasConditionEffect("halfMovement");
    const encumbered = statuses.has("encumbered");
    const heavilyEncumbered = statuses.has("heavilyEncumbered");
    const exceedingCarryingCapacity = statuses.has("exceedingCarryingCapacity");
    const crawl = this.parent.hasConditionEffect("crawl");
    const units = this.attributes.movement.units;
    for ( const type in CONFIG.ROTV.movementTypes ) {
      let speed = this.attributes.movement[type];
      if ( noMovement || (crawl && (type !== "walk")) ) speed = 0;
      else {
        if ( halfMovement ) speed *= 0.5;
        if ( heavilyEncumbered ) {
          speed = Math.max(0, speed - (CONFIG.ROTV.encumbrance.speedReduction.heavilyEncumbered[units] ?? 0));
        } else if ( encumbered ) {
          speed = Math.max(0, speed - (CONFIG.ROTV.encumbrance.speedReduction.encumbered[units] ?? 0));
        }
        if ( exceedingCarryingCapacity ) {
          speed = Math.min(speed, CONFIG.ROTV.encumbrance.speedReduction.exceedingCarryingCapacity[units] ?? 0);
        }
      }
      this.attributes.movement[type] = speed;
    }
  }

  /* -------------------------------------------- */

  /**
   * Apply movement and sense changes based on a race item. This method should be called during
   * the `prepareEmbeddedData` step of data preparation.
   * @param {ItemRotV} race                    Race item from which to get the stats.
   * @param {object} [options={}]
   * @param {boolean} [options.force=false]  Override any values on the actor.
   * @this {CharacterData|NPCData}
   */
  static prepareRace(race, { force=false }={}) {
    for ( const key of Object.keys(CONFIG.ROTV.movementTypes) ) {
      if ( !race.system.movement[key] || (!force && (this.attributes.movement[key] !== null)) ) continue;
      this.attributes.movement[key] = race.system.movement[key];
    }
    if ( race.system.movement.hover ) this.attributes.movement.hover = true;
    if ( force && race.system.movement.units ) this.attributes.movement.units = race.system.movement.units;
    else this.attributes.movement.units ??= race.system.movement.units;

    for ( const key of Object.keys(CONFIG.ROTV.senses) ) {
      if ( !race.system.senses[key] || (!force && (this.attributes.senses[key] !== null)) ) continue;
      this.attributes.senses[key] = race.system.senses[key];
    }
    this.attributes.senses.special = [this.attributes.senses.special, race.system.senses.special].filterJoin(";");
    if ( force && race.system.senses.units ) this.attributes.senses.units = race.system.senses.units;
    else this.attributes.senses.units ??= race.system.senses.units;
  }
}
