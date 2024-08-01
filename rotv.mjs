/**
 * The RotV game system for Foundry Virtual Tabletop
 * Author: Tapkomet
 */

// Import Configuration
import ROTV from "./module/config.mjs";
import { registerSystemSettings, registerDeferredSettings } from "./module/settings.mjs";

// Import Submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as enrichers from "./module/enrichers.mjs";
import * as Filter from "./module/filter.mjs";
import * as migrations from "./module/migration.mjs";
import * as utils from "./module/utils.mjs";
import {ModuleArt} from "./module/module-art.mjs";
import TooltipsRotV from "./module/tooltips.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.rotv = {
  applications,
  canvas,
  config: ROTV,
  dataModels,
  dice,
  documents,
  enrichers,
  Filter,
  migrations,
  utils
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  globalThis.rotv = game.rotv = Object.assign(game.system, globalThis.rotv);
  console.log(`RotV RotV | Initializing the RotV Fifth Game System - Version ${rotv.version}\n${ROTV.ASCII}`);

  // TODO: Remove when v11 support is dropped.
  CONFIG.compatibility.excludePatterns.push(/filePicker|select/);
  CONFIG.compatibility.excludePatterns.push(/foundry\.dice\.terms/);
  CONFIG.compatibility.excludePatterns.push(
    /aggregateDamageRoll|configureDamage|preprocessFormula|simplifyRollFormula/
  );
  CONFIG.compatibility.excludePatterns.push(/core\.sourceId/);

  // Record Configuration Values
  CONFIG.ROTV = ROTV;
  CONFIG.ActiveEffect.documentClass = documents.ActiveEffectRotV;
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.Actor.documentClass = documents.ActorRotV;
  CONFIG.ChatMessage.documentClass = documents.ChatMessageRotV;
  CONFIG.Combat.documentClass = documents.CombatRotV;
  CONFIG.Combatant.documentClass = documents.CombataetRotV;
  CONFIG.Item.collection = dataModels.collection.ItemsRotV;
  CONFIG.Item.compendiumIndexFields.push("system.container");
  CONFIG.Item.documentClass = documents.ItemRotV;
  CONFIG.Token.documentClass = documents.TokenDocumeetRotV;
  CONFIG.Token.objectClass = canvas.TokenRotV;
  CONFIG.User.documentClass = documents.UserRotV;
  CONFIG.time.roundTime = 6;
  Roll.TOOLTIP_TEMPLATE = "systems/rotv/templates/chat/roll-breakdown.hbs";
  CONFIG.Dice.BasicRoll = dice.BasicRoll;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Roll = dice.D20Roll;
  CONFIG.MeasuredTemplate.defaults.angle = 53.13; // RotV cone RAW should be 53.13 degrees
  CONFIG.Note.objectClass = canvas.NoteRotV;
  CONFIG.ui.combat = applications.combat.CombatTrackerRotV;
  CONFIG.ui.items = rotv.applications.item.ItemDirectoryRotV;

  // Register System Settings
  registerSystemSettings();

  // Configure module art
  game.rotv.moduleArt = new ModuleArt();

  // Configure tooltips
  game.rotv.tooltips = new TooltipsRotV();

  // Set up status effects
  _configureStatusEffects();

  // Remove honor & sanity from configuration if they aren't enabled
  if ( !game.settings.get("rotv", "honorScore") ) delete ROTV.abilities.hon;
  if ( !game.settings.get("rotv", "sanityScore") ) delete ROTV.abilities.san;

  // Register Roll Extensions
  CONFIG.Dice.rolls = [dice.BasicRoll, dice.D20Roll, dice.DamageRoll];

  // Hook up system data types
  CONFIG.Actor.dataModels = dataModels.actor.config;
  CONFIG.Item.dataModels = dataModels.item.config;
  CONFIG.JournalEntryPage.dataModels = dataModels.journal.config;

  // Add fonts
  _configureFonts();

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("rotv", applications.actor.ActorSheetRotVCharacter, {
    types: ["character"],
    label: "ROTV.SheetClassCharacterLegacy"
  });
  DocumentSheetConfig.registerSheet(Actor, "rotv", applications.actor.ActorSheetRotVCharacter2, {
    types: ["character"],
    makeDefault: true,
    label: "ROTV.SheetClassCharacter"
  });
  Actors.registerSheet("rotv", applications.actor.ActorSheetRotVNPC, {
    types: ["npc"],
    makeDefault: true,
    label: "ROTV.SheetClassNPCLegacy"
  });
  DocumentSheetConfig.registerSheet(Actor, "rotv", applications.actor.ActorSheetRotVNPC2, {
    types: ["npc"],
    makeDefault: true,
    label: "ROTV.SheetClassNPC"
  });
  Actors.registerSheet("rotv", applications.actor.ActorSheetRotVVehicle, {
    types: ["vehicle"],
    makeDefault: true,
    label: "ROTV.SheetClassVehicle"
  });
  Actors.registerSheet("rotv", applications.actor.GroupActorSheet, {
    types: ["group"],
    makeDefault: true,
    label: "ROTV.SheetClassGroup"
  });

  DocumentSheetConfig.unregisterSheet(Item, "core", ItemSheet);
  DocumentSheetConfig.registerSheet(Item, "rotv", applications.item.ItemSheetRotV, {
    makeDefault: true,
    label: "ROTV.SheetClassItem"
  });
  DocumentSheetConfig.unregisterSheet(Item, "rotv", applications.item.ItemSheetRotV, { types: ["container"] });
  DocumentSheetConfig.registerSheet(Item, "rotv", applications.item.ContainerSheet, {
    makeDefault: true,
    types: ["container"],
    label: "ROTV.SheetClassContainer"
  });

  DocumentSheetConfig.registerSheet(JournalEntry, "rotv", applications.journal.JournalSheetRotV, {
    makeDefault: true,
    label: "ROTV.SheetClassJournalEntry"
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "rotv", applications.journal.JournalClassPageSheet, {
    label: "ROTV.SheetClassClassSummary",
    types: ["class", "subclass"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "rotv", applications.journal.JournalMapLocationPageSheet, {
    label: "ROTV.SheetClassMapLocation",
    types: ["map"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "rotv", applications.journal.JournalRulePageSheet, {
    label: "ROTV.SheetClassRule",
    types: ["rule"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "rotv", applications.journal.JournalSpellListPageSheet, {
    label: "ROTV.SheetClassSpellList",
    types: ["spells"]
  });

  CONFIG.Token.prototypeSheetClass = applications.TokenConfigRotV;
  DocumentSheetConfig.unregisterSheet(TokenDocument, "core", TokenConfig);
  DocumentSheetConfig.registerSheet(TokenDocument, "rotv", applications.TokenConfigRotV, {
    label: "ROTV.SheetClassToken"
  });

  // Preload Handlebars helpers & partials
  utils.registerHandlebarsHelpers();
  utils.preloadHandlebarsTemplates();

  // Enrichers
  enrichers.registerCustomEnrichers();

  // Exhaustion handling
  documents.ActiveEffectRotV.registerHUDListeners();
});

/* -------------------------------------------- */

/**
 * Configure explicit lists of attributes that are trackable on the token HUD and in the combat tracker.
 * @internal
 */
function _configureTrackableAttributes() {
  const common = {
    bar: [],
    value: [
      ...Object.keys(ROTV.abilities).map(ability => `abilities.${ability}.value`),
      ...Object.keys(ROTV.movementTypes).map(movement => `attributes.movement.${movement}`),
      "attributes.ac.value", "attributes.init.total"
    ]
  };

  const altSpells = Object.entries(ROTV.spellPreparationModes).reduce((acc, [k, v]) => {
    if ( !["prepared", "always"].includes(k) && v.upcast ) acc.push(`spells.${k}`);
    return acc;
  }, []);

  const creature = {
    bar: [
      ...common.bar,
      "attributes.hp",
      ...altSpells,
      ...Array.fromRange(Object.keys(ROTV.spellLevels).length - 1, 1).map(l => `spells.spell${l}`)
    ],
    value: [
      ...common.value,
      ...Object.keys(ROTV.skills).map(skill => `skills.${skill}.passive`),
      ...Object.keys(ROTV.senses).map(sense => `attributes.senses.${sense}`),
      "attributes.spelldc"
    ]
  };

  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: [...creature.bar, "resources.primary", "resources.secondary", "resources.tertiary", "details.xp"],
      value: [...creature.value]
    },
    npc: {
      bar: [...creature.bar, "resources.legact", "resources.legres"],
      value: [...creature.value, "details.cr", "details.spellLevel", "details.xp.value"]
    },
    vehicle: {
      bar: [...common.bar, "attributes.hp"],
      value: [...common.value]
    },
    group: {
      bar: [],
      value: []
    }
  };
}

/* -------------------------------------------- */

/**
 * Configure which attributes are available for item consumption.
 * @internal
 */
function _configureConsumableAttributes() {
  const altSpells = Object.entries(ROTV.spellPreparationModes).reduce((acc, [k, v]) => {
    if ( !["prepared", "always"].includes(k) && v.upcast ) acc.push(`spells.${k}.value`);
    return acc;
  }, []);

  CONFIG.ROTV.consumableResources = [
    ...Object.keys(ROTV.abilities).map(ability => `abilities.${ability}.value`),
    "attributes.ac.flat",
    "attributes.hp.value",
    ...Object.keys(ROTV.senses).map(sense => `attributes.senses.${sense}`),
    ...Object.keys(ROTV.movementTypes).map(type => `attributes.movement.${type}`),
    ...Object.keys(ROTV.currencies).map(denom => `currency.${denom}`),
    "details.xp.value",
    "resources.primary.value", "resources.secondary.value", "resources.tertiary.value",
    "resources.legact.value", "resources.legres.value",
    ...altSpells,
    ...Array.fromRange(Object.keys(ROTV.spellLevels).length - 1, 1).map(level => `spells.spell${level}.value`)
  ];
}

/* -------------------------------------------- */

/**
 * Configure additional system fonts.
 */
function _configureFonts() {
  Object.assign(CONFIG.fontDefinitions, {
    Roboto: {
      editor: true,
      fonts: [
        { urls: ["systems/rotv/fonts/roboto/Roboto-Regular.woff2"] },
        { urls: ["systems/rotv/fonts/roboto/Roboto-Bold.woff2"], weight: "bold" },
        { urls: ["systems/rotv/fonts/roboto/Roboto-Italic.woff2"], style: "italic" },
        { urls: ["systems/rotv/fonts/roboto/Roboto-BoldItalic.woff2"], weight: "bold", style: "italic" }
      ]
    },
    "Roboto Condensed": {
      editor: true,
      fonts: [
        { urls: ["systems/rotv/fonts/roboto-condensed/RobotoCondensed-Regular.woff2"] },
        { urls: ["systems/rotv/fonts/roboto-condensed/RobotoCondensed-Bold.woff2"], weight: "bold" },
        { urls: ["systems/rotv/fonts/roboto-condensed/RobotoCondensed-Italic.woff2"], style: "italic" },
        {
          urls: ["systems/rotv/fonts/roboto-condensed/RobotoCondensed-BoldItalic.woff2"], weight: "bold",
          style: "italic"
        }
      ]
    },
    "Roboto Slab": {
      editor: true,
      fonts: [
        { urls: ["systems/rotv/fonts/roboto-slab/RobotoSlab-Regular.ttf"] },
        { urls: ["systems/rotv/fonts/roboto-slab/RobotoSlab-Bold.ttf"], weight: "bold" }
      ]
    }
  });
}

/* -------------------------------------------- */

/**
 * Configure system status effects.
 */
function _configureStatusEffects() {
  const addEffect = (effects, {special, ...data}) => {
    data = foundry.utils.deepClone(data);
    data._id = utils.staticID(`rotv${data.id}`);
    if ( foundry.utils.isNewerVersion(game.version, 12) ) {
      data.img = data.icon ?? data.img;
      delete data.icon;
    }
    effects.push(data);
    if ( special ) CONFIG.specialStatusEffects[special] = data.id;
  };
  CONFIG.statusEffects = Object.entries(CONFIG.ROTV.statusEffects).reduce((arr, [id, data]) => {
    const original = CONFIG.statusEffects.find(s => s.id === id);
    addEffect(arr, foundry.utils.mergeObject(original ?? {}, { id, ...data }, { inplace: false }));
    return arr;
  }, []);
  for ( const [id, {label: name, ...data}] of Object.entries(CONFIG.ROTV.conditionTypes) ) {
    addEffect(CONFIG.statusEffects, { id, name, ...data });
  }
  for ( const [id, data] of Object.entries(CONFIG.ROTV.encumbrance.effects) ) {
    addEffect(CONFIG.statusEffects, { id, ...data, hud: false });
  }
}

/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * Prepare attribute lists.
 */
Hooks.once("setup", function() {
  // Configure trackable & consumable attributes.
  _configureTrackableAttributes();
  _configureConsumableAttributes();

  CONFIG.ROTV.trackableAttributes = expandAttributeList(CONFIG.ROTV.trackableAttributes);
  game.rotv.moduleArt.registerModuleArt();
  TooltipsRotV.activateListeners();
  game.rotv.tooltips.observe();

  // Register settings after modules have had a chance to initialize
  registerDeferredSettings();

  // Apply table of contents compendium style if specified in flags
  game.packs
    .filter(p => p.metadata.flags?.display === "table-of-contents")
    .forEach(p => p.applicationClass = applications.journal.TableOfContentsCompendium);

  // Apply custom item compendium
  game.packs.filter(p => p.metadata.type === "Item")
    .forEach(p => p.applicationClass = applications.item.ItemCompendiumRotV);
});

/* --------------------------------------------- */

/**
 * Expand a list of attribute paths into an object that can be traversed.
 * @param {string[]} attributes  The initial attributes configuration.
 * @returns {object}  The expanded object structure.
 */
function expandAttributeList(attributes) {
  return attributes.reduce((obj, attr) => {
    foundry.utils.setProperty(obj, attr, true);
    return obj;
  }, {});
}

/* --------------------------------------------- */

/**
 * Perform one-time pre-localization and sorting of some configuration objects
 */
Hooks.once("i18nInit", () => utils.performPreLocalization(CONFIG.ROTV));

/* -------------------------------------------- */
/*  Foundry VTT Ready                           */
/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if ( ["Item", "ActiveEffect"].includes(data.type) ) {
      documents.macro.createRotVMacro(data, slot);
      return false;
    }
  });

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const cv = game.settings.get("rotv", "systemMigrationVersion") || game.world.flags.rotv?.version;
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !cv && totalDocuments === 0 ) return game.settings.set("rotv", "systemMigrationVersion", game.system.version);
  if ( cv && !foundry.utils.isNewerVersion(game.system.flags.needsMigrationVersion, cv) ) return;

  // Compendium pack folder migration.
  if ( foundry.utils.isNewerVersion("3.0.0", cv) ) {
    migrations.reparentCompendiums("RotV SRD Content", "RotV SRD Content");
  }

  // Perform the migration
  if ( cv && foundry.utils.isNewerVersion(game.system.flags.compatibleMigrationVersion, cv) ) {
    ui.notifications.error("MIGRATION.RotVVersionTooOldWarning", {localize: true, permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  System Styling                              */
/* -------------------------------------------- */

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatPopout", documents.ChatMessageRotV.onRenderChatPopout);
Hooks.on("getChatLogEntryContext", documents.ChatMessageRotV.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => {
  documents.ItemRotV.chatListeners(html);
  documents.ChatMessageRotV.onRenderChatLog(html);
});
Hooks.on("renderChatPopout", (app, html, data) => documents.ItemRotV.chatListeners(html));

Hooks.on("chatMessage", (app, message, data) => applications.Award.chatMessage(message));

Hooks.on("renderActorDirectory", (app, html, data) => documents.ActorRotV.onRenderActorDirectory(html));
Hooks.on("getActorDirectoryEntryContext", documents.ActorRotV.addDirectoryContextOptions);

Hooks.on("renderCompendiumDirectory", (app, [html], data) => applications.CompendiumBrowser.injectSidebarButton(html));
Hooks.on("getCompendiumEntryContext", documents.ItemRotV.addCompendiumContextOptions);
Hooks.on("getItemDirectoryEntryContext", documents.ItemRotV.addDirectoryContextOptions);

Hooks.on("renderJournalPageSheet", applications.journal.JournalSheetRotV.onRenderJournalPageSheet);

Hooks.on("targetToken", canvas.TokenRotV.onTargetToken);

/* -------------------------------------------- */
/*  Bundled Module Exports                      */
/* -------------------------------------------- */

export {
  applications,
  canvas,
  dataModels,
  dice,
  documents,
  enrichers,
  Filter,
  migrations,
  utils,
  ROTV
};
