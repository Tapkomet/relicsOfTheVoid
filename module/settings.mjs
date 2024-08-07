import { ModuleArtConfig } from "./module-art.mjs";

/**
 * Register all of the system's settings.
 */
export function registerSystemSettings() {
  // Internal System Migration Version
  game.settings.register("rotv", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Challenge visibility
  game.settings.register("rotv", "challengeVisibility", {
    name: "SETTINGS.RotVChallengeVisibility.Name",
    hint: "SETTINGS.RotVChallengeVisibility.Hint",
    scope: "world",
    config: true,
    default: "player",
    type: String,
    choices: {
      all: "SETTINGS.RotVChallengeVisibility.All",
      player: "SETTINGS.RotVChallengeVisibility.Player",
      none: "SETTINGS.RotVChallengeVisibility.None"
    }
  });


  game.settings.register("rotv", "attackRollVisibility", {
    name: "SETTINGS.RotVAttackRollVisibility.Name",
    hint: "SETTINGS.RotVAttackRollVisibility.Hint",
    scope: "world",
    config: true,
    default: "none",
    type: String,
    choices: {
      all: "SETTINGS.RotVAttackRollVisibility.All",
      hideAC: "SETTINGS.RotVAttackRollVisibility.HideAC",
      none: "SETTINGS.RotVAttackRollVisibility.None"
    }
  });

  // Encumbrance tracking
  game.settings.register("rotv", "encumbrance", {
    name: "SETTINGS.RotVEncumbrance.Name",
    hint: "SETTINGS.RotVEncumbrance.Hint",
    scope: "world",
    config: true,
    default: "none",
    type: String,
    choices: {
      none: "SETTINGS.RotVEncumbrance.None",
      normal: "SETTINGS.RotVEncumbrance.Normal",
      variant: "SETTINGS.RotVEncumbrance.Variant"
    }
  });

  // Rest Recovery Rules
  game.settings.register("rotv", "restVariant", {
    name: "SETTINGS.RotVRestN",
    hint: "SETTINGS.RotVRestL",
    scope: "world",
    config: true,
    default: "normal",
    type: String,
    choices: {
      normal: "SETTINGS.RotVRestPHB",
      gritty: "SETTINGS.RotVRestGritty",
      epic: "SETTINGS.RotVRestEpic"
    }
  });

  // Diagonal Movement Rule
  game.settings.register("rotv", "diagonalMovement", {
    name: "SETTINGS.RotVDiagN",
    hint: "SETTINGS.RotVDiagL",
    scope: "world",
    config: true,
    default: "555",
    type: String,
    choices: {
      555: "SETTINGS.RotVDiagPHB",
      5105: "SETTINGS.RotVDiagDMG",
      EUCL: "SETTINGS.RotVDiagEuclidean"
    },
    onChange: rule => canvas.grid.diagonalRule = rule
  });

  // Allow rotating square templates
  game.settings.register("rotv", "gridAlignedSquareTemplates", {
    name: "SETTINGS.RotVGridAlignedSquareTemplatesN",
    hint: "SETTINGS.RotVGridAlignedSquareTemplatesL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Proficiency modifier type
  game.settings.register("rotv", "proficiencyModifier", {
    name: "SETTINGS.RotVProfN",
    hint: "SETTINGS.RotVProfL",
    scope: "world",
    config: true,
    default: "bonus",
    type: String,
    choices: {
      bonus: "SETTINGS.RotVProfBonus",
      dice: "SETTINGS.RotVProfDice"
    }
  });

  // Allow feats during Ability Score Improvements
  game.settings.register("rotv", "allowFeats", {
    name: "SETTINGS.RotVFeatsN",
    hint: "SETTINGS.RotVFeatsL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Use Honor ability score
  game.settings.register("rotv", "honorScore", {
    name: "SETTINGS.RotVHonorN",
    hint: "SETTINGS.RotVHonorL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  // Use Sanity ability score
  game.settings.register("rotv", "sanityScore", {
    name: "SETTINGS.RotVSanityN",
    hint: "SETTINGS.RotVSanityL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  // Apply Dexterity as Initiative Tiebreaker
  game.settings.register("rotv", "initiativeDexTiebreaker", {
    name: "SETTINGS.RotVInitTBN",
    hint: "SETTINGS.RotVInitTBL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Record Currency Weight
  game.settings.register("rotv", "currencyWeight", {
    name: "SETTINGS.RotVCurWtN",
    hint: "SETTINGS.RotVCurWtL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Disable Experience Tracking
  game.settings.register("rotv", "disableExperienceTracking", {
    name: "SETTINGS.RotVNoExpN",
    hint: "SETTINGS.RotVNoExpL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Advancements
  game.settings.register("rotv", "disableAdvancements", {
    name: "SETTINGS.RotVNoAdvancementsN",
    hint: "SETTINGS.RotVNoAdvancementsL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Concentration Tracking
  game.settings.register("rotv", "disableConcentration", {
    name: "SETTINGS.RotVNoConcentrationN",
    hint: "SETTINGS.RotVNoConcentrationL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Collapse Item Cards (by default)
  game.settings.register("rotv", "autoCollapseItemCards", {
    name: "SETTINGS.RotVAutoCollapseCardN",
    hint: "SETTINGS.RotVAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  // Collapse Chat Card Trays
  game.settings.register("rotv", "autoCollapseChatTrays", {
    name: "SETTINGS.ROTV.COLLAPSETRAYS.Name",
    hint: "SETTINGS.ROTV.COLLAPSETRAYS.Hint",
    scope: "client",
    config: true,
    default: "older",
    type: String,
    choices: {
      never: "SETTINGS.ROTV.COLLAPSETRAYS.Never",
      older: "SETTINGS.ROTV.COLLAPSETRAYS.Older",
      always: "SETTINGS.ROTV.COLLAPSETRAYS.Always"
    }
  });

  // Allow Polymorphing
  game.settings.register("rotv", "allowPolymorphing", {
    name: "SETTINGS.RotVAllowPolymorphingN",
    hint: "SETTINGS.RotVAllowPolymorphingL",
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

  // Allow Summoning
  game.settings.register("rotv", "allowSummoning", {
    name: "SETTINGS.ROTV.ALLOWSUMMONING.Name",
    hint: "SETTINGS.ROTV.ALLOWSUMMONING.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Metric Unit Weights
  game.settings.register("rotv", "metricWeightUnits", {
    name: "SETTINGS.RotVMetricN",
    hint: "SETTINGS.RotVMetricL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Critical Damage Modifiers
  game.settings.register("rotv", "criticalDamageModifiers", {
    name: "SETTINGS.RotVCriticalModifiersN",
    hint: "SETTINGS.RotVCriticalModifiersL",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Critical Damage Maximize
  game.settings.register("rotv", "criticalDamageMaxDice", {
    name: "SETTINGS.RotVCriticalMaxDiceN",
    hint: "SETTINGS.RotVCriticalMaxDiceL",
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

  // Primary Group
  game.settings.register("rotv", "primaryParty", {
    name: "Primary Party",
    scope: "world",
    config: false,
    default: null,
    type: PrimaryPartyData,
    onChange: s => ui.actors.render()
  });

  // Control hints
  game.settings.register("rotv", "controlHints", {
    name: "ROTV.Controls.Name",
    hint: "ROTV.Controls.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
}

/**
 * Data model for tracking information on the primary party.
 *
 * @property {ActorRotV} actor  Group actor representing the primary party.
 */
class PrimaryPartyData extends foundry.abstract.DataModel {
  static defineSchema() {
    return { actor: new foundry.data.fields.ForeignDocumentField(foundry.documents.BaseActor) };
  }
}

/* -------------------------------------------- */

/**
 * Register additional settings after modules have had a chance to initialize to give them a chance to modify choices.
 */
export function registerDeferredSettings() {
  game.settings.register("rotv", "theme", {
    name: "SETTINGS.ROTV.THEME.Name",
    hint: "SETTINGS.ROTV.THEME.Hint",
    scope: "client",
    config: game.release.generation < 12,
    default: "",
    type: String,
    choices: {
      "": "SHEETS.ROTV.THEME.Automatic",
      ...CONFIG.ROTV.themes
    },
    onChange: s => setTheme(document.body, s)
  });

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    setTheme(document.body, game.settings.get("rotv", "theme"));
  });
  matchMedia("(prefers-contrast: more)").addEventListener("change", () => {
    setTheme(document.body, game.settings.get("rotv", "theme"));
  });

  // Hook into core color scheme setting.
  if ( game.release.generation > 11 ) {
    const setting = game.settings.settings.get("core.colorScheme");
    const { onChange } = setting ?? {};
    if ( onChange ) setting.onChange = s => {
      onChange();
      setTheme(document.body, s);
    };
    setTheme(document.body, game.settings.get("core", "colorScheme"));
  }
  else setTheme(document.body, game.settings.get("rotv", "theme"));
}

/* -------------------------------------------- */

/**
 * Set the theme on an element, removing the previous theme class in the process.
 * @param {HTMLElement} element  Body or sheet element on which to set the theme data.
 * @param {string} [theme=""]    Theme key to set.
 * @param {string[]} [flags=[]]  Additional theming flags to set.
 */
export function setTheme(element, theme="", flags=new Set()) {
  element.className = element.className.replace(/\brotv-(theme|flag)-[\w-]+\b/g, "");

  // Primary Theme
  if ( !theme && (element === document.body) ) {
    if ( matchMedia("(prefers-color-scheme: dark)").matches ) theme = "dark";
    if ( matchMedia("(prefers-color-scheme: light)").matches ) theme = "light";
  }
  if ( theme ) {
    element.classList.add(`rotv-theme-${theme.slugify()}`);
    element.dataset.theme = theme;
  }
  else delete element.dataset.theme;

  // Additional Flags
  if ( (element === document.body) && matchMedia("(prefers-contrast: more)").matches ) flags.add("high-contrast");
  for ( const flag of flags ) element.classList.add(`rotv-flag-${flag.slugify()}`);
  element.dataset.themeFlags = Array.from(flags).join(" ");
}
