/**
 * The RotV game system for Foundry Virtual Tabletop
 * Author: Tapkomet
 */

// Import Configuration
import ROTV from "./module/config.mjs";
import registerSystemSettings from "./module/settings.mjs";

// Import Submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as migrations from "./module/migration.mjs";
import * as utils from "./module/utils.mjs";
import {ModuleArt} from "./module/module-art.mjs";

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
  migrations,
  utils
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  globalThis.rotv = game.rotv = Object.assign(game.system, globalThis.rotv);
  console.log(`RotV | Initializing the RotV Game System - Version ${rotv.version}\n${ROTV.ASCII}`);

  /** @deprecated */
  Object.defineProperty(rotv, "entities", {
    get() {
      foundry.utils.logCompatibilityWarning(
        "You are referencing the 'rotv.entities' property which has been deprecated and renamed to "
        + "'rotv.documents'. Support for this old path will be removed in a future version.",
        { since: "RotV 2.0", until: "RotV 2.2" }
      );
      return rotv.documents;
    }
  });

  /** @deprecated */
  Object.defineProperty(rotv, "rollItemMacro", {
    get() {
      foundry.utils.logCompatibilityWarning(
        "You are referencing the 'rotv.rollItemMacro' method which has been deprecated and renamed to "
        + "'rotv.documents.macro.rollItem'. Support for this old path will be removed in a future version.",
        { since: "RotV 2.0", until: "RotV 2.2" }
      );
      return rotv.documents.macro.rollItem;
    }
  });

  /** @deprecated */
  Object.defineProperty(rotv, "macros", {
    get() {
      foundry.utils.logCompatibilityWarning(
        "You are referencing the 'rotv.macros' property which has been deprecated and renamed to "
        + "'rotv.documents.macro'. Support for this old path will be removed in a future version.",
        { since: "RotV 2.0", until: "RotV 2.2" }
      );
      return rotv.documents.macro;
    }
  });

  // Record Configuration Values
  CONFIG.ROTV = ROTV;
  CONFIG.ActiveEffect.documentClass = documents.ActiveEffectRelics;
  CONFIG.Actor.documentClass = documents.ActorRelics;
  CONFIG.Item.documentClass = documents.ItemRelics;
  CONFIG.Token.documentClass = documents.TokenDocumentRelics;
  CONFIG.Token.objectClass = canvas.TokenRelics;
  CONFIG.time.roundTime = 6;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Roll = dice.D20Roll;
  CONFIG.MeasuredTemplate.defaults.angle = 53.13; // Relics cone RAW should be 53.13 degrees
  CONFIG.ui.combat = applications.combat.CombatTrackerRelics;

  // Register System Settings
  registerSystemSettings();

  // Validation strictness.
  _determineValidationStrictness();

  // Configure module art.
  game.rotv.moduleArt = new ModuleArt();

  // Remove honor & sanity from configuration if they aren't enabled
  if ( !game.settings.get("rotv", "honorScore") ) {
    delete ROTV.abilities.hon;
    delete ROTV.abilityAbbreviations.hon;
  }
  if ( !game.settings.get("rotv", "sanityScore") ) {
    delete ROTV.abilities.san;
    delete ROTV.abilityAbbreviations.san;
  }

  // Patch Core Functions
  Combatant.prototype.getInitiativeRoll = documents.combat.getInitiativeRoll;

  // Register Roll Extensions
  CONFIG.Dice.rolls.push(dice.D20Roll);
  CONFIG.Dice.rolls.push(dice.DamageRoll);

  // Hook up system data types
  CONFIG.Actor.systemDataModels = dataModels.actor.config;
  CONFIG.Item.systemDataModels = dataModels.item.config;
  CONFIG.JournalEntryPage.systemDataModels = dataModels.journal.config;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("rotv", applications.actor.ActorSheetRelicsCharacter, {
    types: ["character"],
    makeDefault: true,
    label: "ROTV.SheetClassCharacter"
  });
  Actors.registerSheet("rotv", applications.actor.ActorSheetRelicsNPC, {
    types: ["npc"],
    makeDefault: true,
    label: "ROTV.SheetClassNPC"
  });
  Actors.registerSheet("rotv", applications.actor.ActorSheetRelicsVehicle, {
    types: ["vehicle"],
    makeDefault: true,
    label: "ROTV.SheetClassVehicle"
  });
  Actors.registerSheet("rotv", applications.actor.GroupActorSheet, {
    types: ["group"],
    makeDefault: true,
    label: "ROTV.SheetClassGroup"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("rotv", applications.item.ItemSheetRelics, {
    makeDefault: true,
    label: "ROTV.SheetClassItem"
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "rotv", applications.journal.JournalClassPageSheet, {
    label: "ROTV.SheetClassClassSummary",
    types: ["class"]
  });

  // Preload Handlebars helpers & partials
  utils.registerHandlebarsHelpers();
  utils.preloadHandlebarsTemplates();
});

/**
 * Determine if this is a 'legacy' world with permissive validation, or one where strict validation is enabled.
 * @internal
 */
function _determineValidationStrictness() {
  dataModels.SystemDataModel._enableV10Validation = game.settings.get("rotv", "strictValidation");
}

/**
 * Update the world's validation strictness setting based on whether validation errors were encountered.
 * @internal
 */
async function _configureValidationStrictness() {
  if ( !game.user.isGM ) return;
  const invalidDocuments = game.actors.invalidDocumentIds.size + game.items.invalidDocumentIds.size;
  const strictValidation = game.settings.get("rotv", "strictValidation");
  if ( invalidDocuments && strictValidation ) {
    await game.settings.set("rotv", "strictValidation", false);
    game.socket.emit("reload");
    foundry.utils.debouncedReload();
  }
}

/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * Prepare attribute lists.
 */
Hooks.once("setup", function() {
  CONFIG.ROTV.trackableAttributes = expandAttributeList(CONFIG.ROTV.trackableAttributes);
  CONFIG.ROTV.consumableResources = expandAttributeList(CONFIG.ROTV.consumableResources);
  game.rotv.moduleArt.registerModuleArt();
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
  // Configure validation strictness.
  _configureValidationStrictness();

  // Apply custom compendium styles to the SRD rules compendium.
  const rules = game.packs.get("rotv.rules");
  rules.apps = [new applications.journal.SRDCompendium(rules)];

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if ( ["Item", "ActiveEffect"].includes(data.type) ) {
      documents.macro.createRelicsMacro(data, slot);
      return false;
    }
  });

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const cv = game.settings.get("rotv", "systemMigrationVersion") || game.world.flags.rotv?.version;
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !cv && totalDocuments === 0 ) return game.settings.set("rotv", "systemMigrationVersion", game.system.version);
  if ( cv && !isNewerVersion(game.system.flags.needsMigrationVersion, cv) ) return;

  // Perform the migration
  if ( cv && isNewerVersion(game.system.flags.compatibleMigrationVersion, cv) ) {
    ui.notifications.error(game.i18n.localize("MIGRATION.RelicsVersionTooOldWarning"), {permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", gameCanvas => {
  gameCanvas.grid.diagonalRule = game.settings.get("rotv", "diagonalMovement");
  SquareGrid.prototype.measureDistances = canvas.measureDistances;
});

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatMessage", documents.chat.onRenderChatMessage);
Hooks.on("getChatLogEntryContext", documents.chat.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => documents.ItemRelics.chatListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => documents.ItemRelics.chatListeners(html));
Hooks.on("getActorDirectoryEntryContext", documents.ActorRelics.addDirectoryContextOptions);

/* -------------------------------------------- */
/*  Bundled Module Exports                      */
/* -------------------------------------------- */

export {
  applications,
  canvas,
  dataModels,
  dice,
  documents,
  migrations,
  utils,
  ROTV
};
