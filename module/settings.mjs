import { ModuleArtConfig } from "./module-art.mjs";

/**
 * Register all of the system's settings.
 */
export default function registerSystemSettings() {
  // Internal System Migration Version
  game.settings.register("rotv", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Rest Recovery Rules
  game.settings.register("rotv", "restVariant", {
    name: "SETTINGS.RelicsRestN",
    hint: "SETTINGS.RelicsRestL",
    scope: "world",
    config: true,
    default: "normal",
    type: String,
    choices: {
      normal: "SETTINGS.RelicsRestPHB",
      gritty: "SETTINGS.RelicsRestGritty",
      epic: "SETTINGS.RelicsRestEpic"
    }
  });

  // Diagonal Movement Rule
  game.settings.register("rotv", "diagonalMovement", {
    name: "SETTINGS.RelicsDiagN",
    hint: "SETTINGS.RelicsDiagL",
    scope: "world",
    config: true,
    default: "555",
    type: String,
    choices: {
      555: "SETTINGS.RelicsDiagPHB",
      5105: "SETTINGS.RelicsDiagDMG",
      EUCL: "SETTINGS.RelicsDiagEuclidean"
    },
    onChange: rule => canvas.grid.diagonalRule = rule
  });

  // Proficiency modifier type
  game.settings.register("rotv", "proficiencyModifier", {
    name: "SETTINGS.RelicsProfN",
    hint: "SETTINGS.RelicsProfL",
    scope: "world",
    config: true,
    default: "bonus",
    type: String,
    choices: {
      bonus: "SETTINGS.RelicsProfBonus",
      dice: "SETTINGS.RelicsProfDice"
    }
  });

  // Use Honor ability score
  game.settings.register("rotv", "honorScore", {
    name: "SETTINGS.RelicsHonorN",
    hint: "SETTINGS.RelicsHonorL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  // Use Sanity ability score
  game.settings.register("rotv", "sanityScore", {
    name: "SETTINGS.RelicsSanityN",
    hint: "SETTINGS.RelicsSanityL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  // Apply Dexterity as Initiative Tiebreaker
  game.settings.register("rotv", "initiativeDexTiebreaker", {
    name: "SETTINGS.RelicsInitTBN",
    hint: "SETTINGS.RelicsInitTBL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Record Currency Weight
  game.settings.register("rotv", "currencyWeight", {
    name: "SETTINGS.RelicsCurWtN",
    hint: "SETTINGS.RelicsCurWtL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Disable Experience Tracking
  game.settings.register("rotv", "disableExperienceTracking", {
    name: "SETTINGS.RelicsNoExpN",
    hint: "SETTINGS.RelicsNoExpL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Advancements
  game.settings.register("rotv", "disableAdvancements", {
    name: "SETTINGS.RelicsNoAdvancementsN",
    hint: "SETTINGS.RelicsNoAdvancementsL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Collapse Item Cards (by default)
  game.settings.register("rotv", "autoCollapseItemCards", {
    name: "SETTINGS.RelicsAutoCollapseCardN",
    hint: "SETTINGS.RelicsAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  // Allow Polymorphing
  game.settings.register("rotv", "allowPolymorphing", {
    name: "SETTINGS.RelicsAllowPolymorphingN",
    hint: "SETTINGS.RelicsAllowPolymorphingL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Polymorph Settings
  game.settings.register("rotv", "polymorphSettings", {
    scope: "client",
    default: {
      keepPhysical: false,
      keepMental: false,
      keepSaves: false,
      keepSkills: false,
      mergeSaves: false,
      mergeSkills: false,
      keepClass: false,
      keepFeats: false,
      keepSpells: false,
      keepItems: false,
      keepBio: false,
      keepVision: true,
      keepSelf: false,
      keepAE: false,
      keepOriginAE: true,
      keepOtherOriginAE: true,
      keepFeatAE: true,
      keepSpellAE: true,
      keepEquipmentAE: true,
      keepClassAE: true,
      keepBackgroundAE: true,
      transformTokens: true
    }
  });

  // Metric Unit Weights
  game.settings.register("rotv", "metricWeightUnits", {
    name: "SETTINGS.RelicsMetricN",
    hint: "SETTINGS.RelicsMetricL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Critical Damage Modifiers
  game.settings.register("rotv", "criticalDamageModifiers", {
    name: "SETTINGS.RelicsCriticalModifiersN",
    hint: "SETTINGS.RelicsCriticalModifiersL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Critical Damage Maximize
  game.settings.register("rotv", "criticalDamageMaxDice", {
    name: "SETTINGS.RelicsCriticalMaxDiceN",
    hint: "SETTINGS.RelicsCriticalMaxDiceL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Strict validation
  game.settings.register("rotv", "strictValidation", {
    scope: "world",
    config: false,
    type: Boolean,
    default: true
  });

  // Dynamic art.
  game.settings.registerMenu("rotv", "moduleArtConfiguration", {
    name: "ROTV.ModuleArtConfigN",
    label: "ROTV.ModuleArtConfigL",
    hint: "ROTV.ModuleArtConfigH",
    icon: "fa-solid fa-palette",
    type: ModuleArtConfig,
    restricted: true
  });

  game.settings.register("rotv", "moduleArtConfiguration", {
    name: "Module Art Configuration",
    scope: "world",
    config: false,
    type: Object,
    default: {
      rotv: {
        portraits: true,
        tokens: true
      }
    }
  });
}
