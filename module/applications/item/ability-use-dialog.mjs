/**
 * A specialized Dialog subclass for ability usage.
 *
 * @param {ItemRelics} item             Item that is being used.
 * @param {object} [dialogData={}]  An object of dialog data which configures how the modal window is rendered.
 * @param {object} [options={}]     Dialog rendering options.
 */
export default class AbilityUseDialog extends Dialog {
  constructor(item, dialogData={}, options={}) {
    super(dialogData, options);
    this.options.classes = ["rotv", "dialog"];

    /**
     * Store a reference to the Item document being used
     * @type {ItemRelics}
     */
    this.item = item;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /**
   * A constructor function which displays the Spell Cast Dialog app for a given Actor and Item.
   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {ItemRelics} item  Item being used.
   * @returns {Promise}    Promise that is resolved when the use dialog is acted upon.
   */
  static async create(item) {
    if ( !item.isOwned ) throw new Error("You cannot display an ability usage dialog for an unowned item");

    // Prepare data
    const uses = item.system.uses ?? {};
    const resource = item.system.consume ?? {};
    const quantity = item.system.quantity ?? 0;
    const recharge = item.system.recharge ?? {};
    const recharges = !!recharge.value;
    const sufficientUses = (quantity > 0 && !uses.value) || uses.value > 0;

    // Prepare dialog form data
    const data = {
      item: item,
      title: game.i18n.format("ROTV.AbilityUseHint", {type: game.i18n.localize(`ITEM.Type${item.type.capitalize()}`), name: item.name}),
      note: this._getAbilityUseNote(item, uses, recharge),
      consumeSpellSlot: false,
      consumeRecharge: recharges,
      consumeResource: resource.target && (!item.hasAttack || (resource.type !== "ammo")),
      consumeUses: uses.per && (uses.max > 0),
      canUse: recharges ? recharge.charged : sufficientUses,
      createTemplate: game.user.can("TEMPLATE_CREATE") && item.hasAreaTarget,
      errors: []
    };
    if ( item.type === "spell" ) this._getSpellData(item.actor.system, item.system, data);

    // Render the ability usage template
    const html = await renderTemplate("systems/rotv/templates/apps/ability-use.hbs", data);

    // Create the Dialog and return data as a Promise
    const icon = data.isSpell ? "fa-magic" : "fa-fist-raised";
    const label = game.i18n.localize(`ROTV.AbilityUse${data.isSpell ? "Cast" : "Use"}`);
    return new Promise(resolve => {
      const dlg = new this(item, {
        title: `${item.name}: ${game.i18n.localize("ROTV.AbilityUseConfig")}`,
        content: html,
        buttons: {
          use: {
            icon: `<i class="fas ${icon}"></i>`,
            label: label,
            callback: html => {
              const fd = new FormDataExtended(html[0].querySelector("form"));
              resolve(fd.object);
            }
          }
        },
        default: "use",
        close: () => resolve(null)
      });
      dlg.render(true);
    });
  }

  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  /**
   * Get dialog data related to limited spell slots.
   * @param {object} actorData  System data from the actor using the spell.
   * @param {object} itemData   System data from the spell being used.
   * @param {object} data       Data for the dialog being presented.
   * @returns {object}          Modified dialog data.
   * @private
   */
  static _getSpellData(actorData, itemData, data) {

    // Determine whether the spell may be up-cast
    const lvl = itemData.level;
    const consumeSpellSlot = (lvl > 0) && CONFIG.ROTV.spellUpcastModes.includes(itemData.preparation.mode);

    // If can't upcast, return early and don't bother calculating available spell slots
    if (!consumeSpellSlot) {
      return foundry.utils.mergeObject(data, { isSpell: true, consumeSpellSlot });
    }

    // Determine the levels which are feasible
    let lmax = 0;
    const spellLevels = Array.fromRange(10).reduce((arr, i) => {
      if ( i < lvl ) return arr;
      const label = CONFIG.ROTV.spellLevels[i];
      const l = actorData.spells[`spell${i}`] || {max: 0, override: null};
      let max = parseInt(l.override || l.max || 0);
      let slots = Math.clamped(parseInt(l.value || 0), 0, max);
      if ( max > 0 ) lmax = i;
      arr.push({
        level: i,
        label: i > 0 ? game.i18n.format("ROTV.SpellLevelSlot", {level: label, n: slots}) : label,
        canCast: max > 0,
        hasSlots: slots > 0
      });
      return arr;
    }, []).filter(sl => sl.level <= lmax);

    // If this character has pact slots, present them as an option for casting the spell.
    const pact = actorData.spells.pact;
    if (pact.level >= lvl) {
      spellLevels.push({
        level: "pact",
        label: `${game.i18n.format("ROTV.SpellLevelPact", {level: pact.level, n: pact.value})}`,
        canCast: true,
        hasSlots: pact.value > 0
      });
    }
    const canCast = spellLevels.some(l => l.hasSlots);
    if ( !canCast ) data.errors.push(game.i18n.format("ROTV.SpellCastNoSlots", {
      level: CONFIG.ROTV.spellLevels[lvl],
      name: data.item.name
    }));

    // Merge spell casting data
    return foundry.utils.mergeObject(data, { isSpell: true, consumeSpellSlot, spellLevels });
  }

  /* -------------------------------------------- */

  /**
   * Get the ability usage note that is displayed.
   * @param {object} item                                     Data for the item being used.
   * @param {{value: number, max: number, per: string}} uses  Object uses and recovery configuration.
   * @param {{charged: boolean, value: string}} recharge      Object recharge configuration.
   * @returns {string}                                        Localized string indicating available uses.
   * @private
   */
  static _getAbilityUseNote(item, uses, recharge) {

    // Zero quantity
    const quantity = item.system.quantity;
    if ( quantity <= 0 ) return game.i18n.localize("ROTV.AbilityUseUnavailableHint");

    // Abilities which use Recharge
    if ( recharge.value ) {
      return game.i18n.format(recharge.charged ? "ROTV.AbilityUseChargedHint" : "ROTV.AbilityUseRechargeHint", {
        type: game.i18n.localize(`ITEM.Type${item.type.capitalize()}`)
      });
    }

    // Does not use any resource
    if ( !uses.per || !uses.max ) return "";

    // Consumables
    if ( item.type === "consumable" ) {
      let str = "ROTV.AbilityUseNormalHint";
      if ( uses.value > 1 ) str = "ROTV.AbilityUseConsumableChargeHint";
      else if ( item.system.quantity === 1 && uses.autoDestroy ) str = "ROTV.AbilityUseConsumableDestroyHint";
      else if ( item.system.quantity > 1 ) str = "ROTV.AbilityUseConsumableQuantityHint";
      return game.i18n.format(str, {
        type: game.i18n.localize(`ROTV.Consumable${item.system.consumableType.capitalize()}`),
        value: uses.value,
        quantity: item.system.quantity,
        max: uses.max,
        per: CONFIG.ROTV.limitedUsePeriods[uses.per]
      });
    }

    // Other Items
    else {
      return game.i18n.format("ROTV.AbilityUseNormalHint", {
        type: game.i18n.localize(`ITEM.Type${item.type.capitalize()}`),
        value: uses.value,
        max: uses.max,
        per: CONFIG.ROTV.limitedUsePeriods[uses.per]
      });
    }
  }
}
