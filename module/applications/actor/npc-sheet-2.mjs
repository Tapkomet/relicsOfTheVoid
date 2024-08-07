import ActorSheetRotVNPC from "./npc-sheet.mjs";
import ActorSheetV2Mixin from "./sheet-v2-mixin.mjs";
import { simplifyBonus } from "../../utils.mjs";

/**
 * An Actor sheet for NPCs.
 * @mixes ActorSheetV2
 */
export default class ActorSheetRotVNPC2 extends ActorSheetV2Mixin(ActorSheetRotVNPC) {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rotv2", "sheet", "actor", "npc", "vertical-tabs"],
      width: 700,
      height: 700,
      resizable: true,
      scrollY: [".sheet-body"],
      tabs: [{ navSelector: ".tabs", contentSelector: ".tab-body", initial: "features" }]
    });
  }

  /** @override */
  static TABS = [
    { tab: "features", label: "ROTV.Features", icon: "fas fa-list" },
    { tab: "inventory", label: "ROTV.Inventory", svg: "backpack" },
    { tab: "spells", label: "TYPES.Item.spellPl", icon: "fas fa-book" },
    { tab: "effects", label: "ROTV.Effects", icon: "fas fa-bolt" },
    { tab: "biography", label: "ROTV.Biography", icon: "fas fa-feather" }
  ];

  /**
   * The description currently being edited.
   * @type {string|null}
   */
  editingDescriptionTarget = null;

  /* -------------------------------------------- */

  get template() {
    if ( !game.user.isGM && this.actor.limited ) return "systems/rotv/templates/actors/limited-sheet-2.hbs";
    return "systems/rotv/templates/actors/npc-sheet-2.hbs";
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _renderOuter() {
    const html = await super._renderOuter();
    const source = document.createElement("div");
    source.classList.add("source-book");
    source.innerHTML = `
      <span></span>
      <a class="config-button" data-action="source" data-tooltip="ROTV.SourceConfig"
         aria-label="${game.i18n.localize("ROTV.SourceConfig")}">
        <i class="fas fa-cog"></i>
      </a>
    `;
    html[0].querySelector(".window-title")?.insertAdjacentElement("afterend", source);
    source.querySelector(".config-button").addEventListener("click", this._onConfigMenu.bind(this));
    return html;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _render(force=false, options={}) {
    await super._render(force, options);
    const [source] = this.element.find(".source-book");
    if ( !source ) return;
    const sourceEditable = this.isEditable && (this._mode === this.constructor.MODES.EDIT);
    source.querySelector(".config-button")?.toggleAttribute("hidden", !sourceEditable);
    source.querySelector(":scope > span").innerText = this.actor.system.details.source.label;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getData(options) {
    const context = await super.getData(options);
    const { attributes, resources } = this.actor.system;
    context.encumbrance = attributes.encumbrance;

    // Ability Scores
    Object.entries(context.abilities).forEach(([k, ability]) => {
      ability.key = k;
      ability.abbr = CONFIG.ROTV.abilities[k]?.abbreviation ?? "";
      ability.baseValue = context.source.abilities[k]?.value ?? 0;
      ability.icon = CONFIG.ROTV.abilities[k]?.icon;
    });

    // Show Death Saves
    context.showDeathSaves = !foundry.utils.isEmpty(this.actor.classes)
      || this.actor.getFlag("rotv", "showDeathSaves");

    // Speed
    context.speed = Object.entries(CONFIG.ROTV.movementTypes).reduce((obj, [k, label]) => {
      const value = attributes.movement[k];
      if ( value ) {
        obj[k] = { label, value };
        if ( (k === "fly") && attributes.movement.hover ) obj.fly.icons = [{
          icon: "fas fa-cloud", label: game.i18n.localize("ROTV.MovementHover")
        }];
      }
      return obj;
    }, {});

    // Skills & Tools
    context.skills = Object.fromEntries(Object.entries(context.skills).filter(([, v]) => v.value));

    // Senses
    context.senses.passivePerception = {
      label: game.i18n.localize("ROTV.PassivePerception"), value: this.actor.system.skills.prc.passive
    };

    // Legendary Actions & Resistances
    const plurals = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    ["legact", "legres"].forEach(res => {
      const { max, value } = resources[res];
      context[res] = Array.fromRange(max, 1).map(n => {
        const i18n = res === "legact" ? "LegAct" : "LegRes";
        const filled = value >= n;
        const classes = ["pip"];
        if ( filled ) classes.push("filled");
        return {
          n, filled,
          tooltip: `ROTV.${i18n}`,
          label: game.i18n.format(`ROTV.${i18n}N.${plurals.select(n)}`, { n }),
          classes: classes.join(" ")
        };
      });
    });
    context.hasLegendaries = resources.legact.max || resources.legres.max || resources.lair.initiative;

    // Spellcasting
    this._prepareSpellcasting(context);

    // Biographies
    const enrichmentOptions = {
      secrets: this.actor.isOwner, async: true, relativeTo: this.actor, rollData: context.rollData
    };

    context.enriched = {
      public: await TextEditor.enrichHTML(this.actor.system.details.biography.public, enrichmentOptions),
      value: context.biographyHTML
    };

    if ( this.editingDescriptionTarget ) {
      context.editingDescriptionTarget = this.editingDescriptionTarget;
      context.enriched.editing = this.editingDescriptionTarget.endsWith("public")
        ? context.enriched.public
        : context.enriched.value;
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _prepareItems(context) {
    super._prepareItems(context);
    const classes = [];
    const inventory = {};
    const inventoryTypes = Object.entries(CONFIG.Item.dataModels)
      .filter(([, model]) => model.metadata?.inventoryItem)
      .sort(([, lhs], [, rhs]) => (lhs.metadata.inventoryOrder - rhs.metadata.inventoryOrder));
    for ( const [type] of inventoryTypes ) {
      inventory[type] = { label: `${CONFIG.Item.typeLabels[type]}Pl`, items: [], dataset: { type } };
      if ( type === "container" ) context.containers = inventory.container.items;
    }
    const features = context.features.filter(section => {
      if ( section.dataset.type === "loot" ) {
        section.items.forEach(i => inventory[i.type]?.items.push(i));
        return false;
      }
      if ( (section.dataset.type === "feat") ) {
        if ( !("activation.type" in section.dataset) ) section.dataset.type = "passive";
        for ( let i = section.items.length; i--; ) {
          const item = section.items[i];
          if ( (item.type === "class") || (item.type === "subclass") ) {
            classes.push(item);
            section.items.splice(i, 1);
            context.itemContext[item.id].prefixedImage = item.img ? foundry.utils.getRoute(item.img) : null;
          }
        }
      }
      if ( section.dataset.type === "weapon" ) inventory.weapon.items = section.items;
      return true;
    });
    // TODO: These labels should be pluralised.
    Object.entries(CONFIG.ROTV.abilityActivationTypes).forEach(([type, label]) => features.push({
      label, items: [], hasActions: true, dataset: { type }
    }));
    context.features = {
      sections: features,
      filters: [
        { key: "action", label: "ROTV.Action" },
        { key: "move", label: "ROTV.MoveAction" },
        { key: "bonus", label: "ROTV.BonusAction" },
        { key: "reaction", label: "ROTV.Reaction" },
        { key: "legendary", label: "ROTV.LegendaryActionLabel" },
        { key: "lair", label: "ROTV.LairActionLabel" }
      ]
    };
    features.forEach(section => {
      section.categories = [
        { classes: "item-uses", label: "ROTV.Uses", partial: "rotv.column-uses" },
        { classes: "item-roll", label: "ROTV.SpellHeader.Roll", partial: "rotv.column-roll" },
        { classes: "item-formula", label: "ROTV.SpellHeader.Formula", partial: "rotv.column-formula" },
        { classes: "item-controls", partial: "rotv.column-feature-controls" }
      ];
    });
    context.inventory = Object.values(inventory);
    context.inventory.push({ label: "ROTV.Contents", items: [], dataset: { type: "all" } });
    context.classes = classes;
    context.hasClasses = classes.length;
  }

  /* -------------------------------------------- */

  /**
   * Prepare spellcasting data for display.
   * @param {object} context  The display context.
   * @protected
   */
  _prepareSpellcasting(context) {
    const { abilities, attributes, bonuses, details } = this.actor.system;
    context.spellcasting = [];
    const msak = simplifyBonus(bonuses.msak.attack, context.rollData);
    const rsak = simplifyBonus(bonuses.rsak.attack, context.rollData);
    // TODO: Consider if we want to handle multiclassing for NPC spellcasters.
    const spellcaster = Object.values(this.actor.classes).find(cls => cls.system.spellcasting.progression !== "none");
    const ability = spellcaster?.spellcasting.ability ?? attributes.spellcasting;
    const spellAbility = abilities[ability];
    const mod = spellAbility?.mod ?? 0;
    const attackBonus = msak === rsak ? msak : 0;
    context.spellcasting.push({
      label: game.i18n.format("ROTV.SpellcastingClass", { class: spellcaster?.name ?? game.i18n.format("ROTV.NPC") }),
      level: spellcaster?.system.levels ?? details.spellLevel,
      ability: {
        ability, mod,
        label: CONFIG.ROTV.abilities[ability]?.abbreviation
      },
      attack: mod + attributes.prof + attackBonus,
      save: spellAbility?.dc ?? 0,
      noSpellcaster: !spellcaster,
      concentration: {
        mod: attributes.concentration.save,
        tooltip: game.i18n.format("ROTV.AbilityConfigure", { ability: game.i18n.localize("ROTV.Concentration") })
      }
    });
  }

  /* -------------------------------------------- */
  /*  Event Listeners & Handlers                  */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".short-rest").on("click", this._onShortRest.bind(this));
    html.find(".long-rest").on("click", this._onLongRest.bind(this));

    if ( this.isEditable ) {
      html.find(".editor-edit").on("click", this._onEditBiography.bind(this));
    }
  }

  /* -------------------------------------------- */

  /**
   * Take a short rest, calling the relevant function on the Actor instance.
   * @param {Event} event             The triggering click event.
   * @returns {Promise<RestResult>}  Result of the rest action.
   * @protected
   */
  async _onShortRest(event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.shortRest();
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, calling the relevant function on the Actor instance.
   * @param {Event} event             The triggering click event.
   * @returns {Promise<RestResult>}  Result of the rest action.
   * @protected
   */
  async _onLongRest(event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.longRest();
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async activateEditor(name, options={}, initialContent="") {
    options.relativeLinks = true;
    options.plugins = {
      menu: ProseMirror.ProseMirrorMenu.build(ProseMirror.defaultSchema, {
        compact: true,
        destroyOnSave: true,
        onSave: () => {
          this.saveEditor(name, { remove: true });
          this.editingDescriptionTarget = null;
        }
      })
    };
    return super.activateEditor(name, options, initialContent);
  }

  /* -------------------------------------------- */

  /**
   * Handle editing a biography section.
   * @param {PointerEvent} event  The triggering event.
   * @protected
   */
  _onEditBiography(event) {
    const { target } = event.currentTarget.closest("[data-target]").dataset;
    this.editingDescriptionTarget = target;
    this.render();
  }
}
