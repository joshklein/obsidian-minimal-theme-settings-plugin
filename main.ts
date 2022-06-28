import { App, Workspace, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class MinimalTheme extends Plugin {
  settings: MinimalSettings;

  async onload() {

  await this.loadSettings();

  this.addSettingTab(new MinimalSettingTab(this.app, this));

  this.addStyle();

  // Watch for system changes to color theme 

  let media = window.matchMedia('(prefers-color-scheme: dark)');

  let updateSystemTheme = () => {
    if (media.matches && this.settings.useSystemTheme) {
      console.log('Dark mode active');
      this.updateDarkStyle()

    } else if (this.settings.useSystemTheme) {
      console.log('Light mode active');
      this.updateLightStyle()
    }
  }
  media.addEventListener('change', updateSystemTheme);

  // Remove system theme listener when we unload

  this.register(() => media.removeEventListener('change', updateSystemTheme));

  updateSystemTheme();

  // Check state of Obsidian Settings

  let settingsUpdate = () => {
    // @ts-ignore
    const fontSize = this.app.vault.getConfig('baseFontSize');
    this.settings.textNormal = fontSize;

    // @ts-ignore
    if (this.app.vault.getConfig('foldHeading')) {
      this.settings.folding = true;
      this.saveData(this.settings);
      console.log('Folding is on');
    } else {
      this.settings.folding = false;
      this.saveData(this.settings);
      console.log('Folding is off');
    }
    document.body.classList.toggle('minimal-folding', this.settings.folding);
    // @ts-ignore
    if (this.app.vault.getConfig('showLineNumber')) {
      this.settings.lineNumbers = true;
      this.saveData(this.settings);
      console.log('Line numbers are on');
    } else {
      this.settings.lineNumbers = false;
      this.saveData(this.settings);
      console.log('Line numbers are off');
    }
    document.body.classList.toggle('minimal-line-nums', this.settings.lineNumbers);
    // @ts-ignore
    if (this.app.vault.getConfig('readableLineLength')) {
      this.settings.readableLineLength = true;
      this.saveData(this.settings);
      console.log('Readable line length is on');
    } else {
      this.settings.readableLineLength = false;
      this.saveData(this.settings);
      console.log('Readable line length is off');
    }
    document.body.classList.toggle('minimal-readable', this.settings.readableLineLength);
    document.body.classList.toggle('minimal-readable-off', !this.settings.readableLineLength);
  }
  
  // @ts-ignore
  this.registerEvent(app.vault.on('config-changed', settingsUpdate));

  settingsUpdate();

  const lightStyles = ['minimal-light', 'minimal-light-tonal', 'minimal-light-contrast', 'minimal-light-white'];
  const darkStyles = ['minimal-dark', 'minimal-dark-tonal', 'minimal-dark-black'];
  const imgGridStyles = ['img-grid','img-grid-ratio','img-nogrid'];
  const tableWidthStyles = ['table-100','table-default-width','table-wide','table-max'];
  const iframeWidthStyles = ['iframe-100','iframe-default-width','iframe-wide','iframe-max'];
  const imgWidthStyles = ['img-100','img-default-width','img-wide','img-max'];
  const mapWidthStyles = ['map-100','map-default-width','map-wide','map-max'];
  const chartWidthStyles = ['chart-100','chart-default-width','chart-wide','chart-max'];
  const theme = ['moonstone', 'obsidian'];

  this.addCommand({
      id: 'increase-body-font-size',
      name: 'Increase body font size',
      callback: () => {
        this.settings.textNormal = this.settings.textNormal + 0.5;
        this.saveData(this.settings);
        this.setFontSize();
      }
    });

  this.addCommand({
      id: 'decrease-body-font-size',
      name: 'Decrease body font size',
      callback: () => {
        this.settings.textNormal = this.settings.textNormal - 0.5;
        this.saveData(this.settings);
        this.setFontSize();
      }
    }); 

  this.addCommand({
      id: 'toggle-minimal-dark-cycle',
      name: 'Cycle between dark mode styles',
      callback: () => {
        this.settings.darkStyle = darkStyles[(darkStyles.indexOf(this.settings.darkStyle) + 1) % darkStyles.length];
        this.saveData(this.settings);
        this.updateDarkStyle();
      }
    });  

  this.addCommand({
      id: 'toggle-minimal-light-cycle',
      name: 'Cycle between light mode styles',
      callback: () => {
        this.settings.lightStyle = lightStyles[(lightStyles.indexOf(this.settings.lightStyle) + 1) % lightStyles.length];
        this.saveData(this.settings);
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-hidden-borders',
      name: 'Toggle sidebar borders',
      callback: () => {
        this.settings.bordersToggle = !this.settings.bordersToggle;
        this.saveData(this.settings);
        this.refresh();
      }
    });


  this.addCommand({
      id: 'toggle-colorful-headings',
      name: 'Toggle colorful headings',
      callback: () => {
        this.settings.colorfulHeadings = !this.settings.colorfulHeadings;
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-focus-mode',
      name: 'Toggle focus mode',
      callback: () => {
        this.settings.focusMode = !this.settings.focusMode;
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'cycle-minimal-table-width',
      name: 'Cycle between table width options',
      callback: () => {
        this.settings.tableWidth = tableWidthStyles[(tableWidthStyles.indexOf(this.settings.tableWidth) + 1) % tableWidthStyles.length];
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'cycle-minimal-image-width',
      name: 'Cycle between image width options',
      callback: () => {
        this.settings.imgWidth = imgWidthStyles[(imgWidthStyles.indexOf(this.settings.imgWidth) + 1) % imgWidthStyles.length];
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'cycle-minimal-iframe-width',
      name: 'Cycle between iframe width options',
      callback: () => {
        this.settings.iframeWidth = iframeWidthStyles[(iframeWidthStyles.indexOf(this.settings.iframeWidth) + 1) % iframeWidthStyles.length];
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'cycle-minimal-chart-width',
      name: 'Cycle between chart width options',
      callback: () => {
        this.settings.chartWidth = chartWidthStyles[(chartWidthStyles.indexOf(this.settings.chartWidth) + 1) % chartWidthStyles.length];
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'cycle-minimal-map-width',
      name: 'Cycle between map width options',
      callback: () => {
        this.settings.mapWidth = mapWidthStyles[(mapWidthStyles.indexOf(this.settings.mapWidth) + 1) % mapWidthStyles.length];
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-img-grid',
      name: 'Toggle image grids',
      callback: () => {
        this.settings.imgGrid = !this.settings.imgGrid;
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-switch',
      name: 'Switch between light and dark mode',
      callback: () => {
        this.settings.theme = theme[(theme.indexOf(this.settings.theme) + 1) % theme.length];
        this.saveData(this.settings);
        this.updateTheme();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-light-default',
      name: 'Use light mode (default)',
      callback: () => {
        this.settings.lightStyle = 'minimal-light';
        this.saveData(this.settings);
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-light-white',
      name: 'Use light mode (all white)',
      callback: () => {
        this.settings.lightStyle = 'minimal-light-white';
        this.saveData(this.settings);
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-light-tonal',
      name: 'Use light mode (low contrast)',
      callback: () => {
        this.settings.lightStyle = 'minimal-light-tonal';
        this.saveData(this.settings);
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-light-contrast',
      name: 'Use light mode (high contrast)',
      callback: () => {
        this.settings.lightStyle = 'minimal-light-contrast';
        this.saveData(this.settings);
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-dark-default',
      name: 'Use dark mode (default)',
      callback: () => {
        this.settings.darkStyle = 'minimal-dark';
        this.saveData(this.settings);
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-dark-tonal',
      name: 'Use dark mode (low contrast)',
      callback: () => {
        this.settings.darkStyle = 'minimal-dark-tonal';
        this.saveData(this.settings);
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-dark-black',
      name: 'Use dark mode (true black)',
      callback: () => {
        this.settings.darkStyle = 'minimal-dark-black';
        this.saveData(this.settings);
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-atom-light',
      name: 'Switch light color scheme to Atom (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-atom-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-default-light',
      name: 'Switch light color scheme to default (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-default-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-gruvbox-light',
      name: 'Switch light color scheme to Gruvbox (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-gruvbox-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-everforest-light',
      name: 'Switch light color scheme to Everforest (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-everforest-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-macos-light',
      name: 'Switch light color scheme to macOS (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-macos-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-notion-light',
      name: 'Switch light color scheme to Notion (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-notion-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-nord-light',
      name: 'Switch light color scheme to Nord (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-nord-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-solarized-light',
      name: 'Switch light color scheme to Solarized (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-solarized-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });


  this.addCommand({
      id: 'toggle-minimal-things-light',
      name: 'Switch light color scheme to Things (light)',
      callback: () => {
        this.settings.lightScheme = 'minimal-things-light';
        this.saveData(this.settings);
        this.updateLightScheme();
        this.updateLightStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-atom-dark',
      name: 'Switch color scheme to Atom (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-atom-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-dracula-dark',
      name: 'Switch color scheme to Dracula (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-dracula-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-default-dark',
      name: 'Switch dark color scheme to default (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-default-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-gruvbox-dark',
      name: 'Switch dark color scheme to Gruvbox (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-gruvbox-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-everforest-dark',
      name: 'Switch dark color scheme to Everforest (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-everforest-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-macos-dark',
      name: 'Switch light color scheme to macOS (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-macos-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-nord-dark',
      name: 'Switch dark color scheme to Nord (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-nord-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-notion-dark',
      name: 'Switch dark color scheme to Notion (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-notion-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-solarized-dark',
      name: 'Switch dark color scheme to Solarized (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-solarized-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

  this.addCommand({
      id: 'toggle-minimal-things-dark',
      name: 'Switch dark color scheme to Things (dark)',
      callback: () => {
        this.settings.darkScheme = 'minimal-things-dark';
        this.saveData(this.settings);
        this.updateDarkScheme();
        this.updateDarkStyle();
      }
    });

    this.addCommand({
      id: 'toggle-minimal-dev-block-width',
      name: 'Dev — Show block widths',
      callback: () => {
        this.settings.devBlockWidth = !this.settings.devBlockWidth;
        this.saveData(this.settings);
        this.refresh();
      }
    });

  this.refresh()

}

  onunload() {
    console.log('Unloading Minimal Theme Settings plugin');
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // refresh function for when we change settings
  refresh() {
    // re-load the style
    this.updateStyle()
  }

  // add the styling elements we need
  addStyle() {
    // add a css block for our settings-dependent styles
    const css = document.createElement('style');
    css.id = 'minimal-theme';
    document.getElementsByTagName("head")[0].appendChild(css);

    // add the main class
    document.body.classList.add('minimal-theme');

    // update the style with the settings-dependent styles
    this.updateStyle();
  }

  setFontSize() {
    // @ts-ignore
    this.app.vault.setConfig('baseFontSize', this.settings.textNormal);
    // @ts-ignore
    this.app.updateFontSize();
  }

  // update the styles (at the start, or as the result of a settings change)
  updateStyle() {
    this.removeStyle();

    document.body.addClass(this.settings.darkScheme);
    document.body.addClass(this.settings.lightScheme);

    document.body.classList.toggle('borders-none', !this.settings.bordersToggle);
    document.body.classList.toggle('borders-title', this.settings.bordersTitle);
    document.body.classList.toggle('colorful-headings', this.settings.colorfulHeadings);
    document.body.classList.toggle('fancy-cursor', this.settings.fancyCursor);
    document.body.classList.toggle('colorful-active', this.settings.colorfulActiveStates);
    document.body.classList.toggle('minimal-focus-mode', this.settings.focusMode);
    document.body.classList.toggle('links-int-on', this.settings.underlineInternal);
    document.body.classList.toggle('links-ext-on', this.settings.underlineExternal);
    document.body.classList.toggle('system-shade', this.settings.useSystemTheme);
    document.body.classList.toggle('full-width-media', this.settings.fullWidthMedia);
    document.body.classList.toggle('img-grid', this.settings.imgGrid);
    document.body.classList.toggle('minimal-dev-block-width', this.settings.devBlockWidth);
    document.body.classList.toggle('minimal-status-off', !this.settings.minimalStatus);
    document.body.classList.toggle('full-file-names', !this.settings.trimNames);
    document.body.classList.toggle('labeled-nav', this.settings.labeledNav);
    document.body.classList.toggle('trim-cols', this.settings.trimCols);
    document.body.classList.toggle('minimal-icons-off', !this.settings.minimalIcons);
    document.body.classList.toggle('minimal-folding', this.settings.folding);
    document.body.classList.toggle('frosted-sidebar', this.settings.frostedSidebar);

    document.body.removeClass('table-wide','table-max','table-100','table-default-width',
      'iframe-wide','iframe-max','iframe-100','iframe-default-width',
      'img-wide','img-max','img-100','img-default-width',
      'chart-wide','chart-max','chart-100','chart-default-width',
      'map-wide','map-max','map-100','map-default-width');
    document.body.addClass(this.settings.chartWidth);
    document.body.addClass(this.settings.tableWidth);
    document.body.addClass(this.settings.imgWidth);
    document.body.addClass(this.settings.iframeWidth);
    document.body.addClass(this.settings.mapWidth);

    // get the custom css element
    const el = document.getElementById('minimal-theme');
    if (!el) throw "minimal-theme element not found!";
    else {
      // set the settings-dependent css
      el.innerText = 
        'body.minimal-theme{'
        // font-normal can be removed in a couple months once people upgrade the theme
        + '--font-normal:' + this.settings.textNormal + 'px;'
        + '--font-small:' + this.settings.textSmall + 'px;'
        + '--line-height:' + this.settings.lineHeight + ';'
        + '--line-width:' + this.settings.lineWidth + 'rem;'
        + '--line-width-wide:' + this.settings.lineWidthWide + 'rem;'
        + '--max-width:' + this.settings.maxWidth + '%;'
        + '--max-col-width:' + this.settings.maxColWidth + ';'
        + '--font-editor-override:' + this.settings.editorFont + ';'
        + '--accent-h:' + this.settings.accentHue + ';'
        + '--accent-s:' + this.settings.accentSat + '%;}';
    }
  }

  refreshSystemTheme() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    if (isDarkMode && this.settings.useSystemTheme) {
        console.log('Dark mode active');
        this.updateDarkStyle()

      } else if (this.settings.useSystemTheme) {
        console.log('Light mode active');
        this.updateLightStyle()
      }
  }

  updateDarkStyle() {
    document.body.removeClass(
      'theme-light',
      'minimal-dark',
      'minimal-dark-tonal',
      'minimal-dark-black'
    );
    document.body.addClass(this.settings.darkStyle);
    document.getElementsByClassName('mod-left-split')[0].removeClass('theme-dark');
    // @ts-ignore
    this.app.setTheme('obsidian');
    // @ts-ignore
    this.app.vault.setConfig('theme', 'obsidian');
    this.app.workspace.trigger('css-change');
  }

  updateLightStyle() {
    document.body.removeClass(
      'theme-dark',
      'minimal-light',
      'minimal-light-tonal',
      'minimal-light-contrast',
      'minimal-light-white'
    );
    document.body.addClass(this.settings.lightStyle);
    if (this.settings.lightStyle == 'minimal-light-contrast') {
      document.getElementsByClassName('mod-left-split')[0].addClass('theme-dark');
    } else {
      document.getElementsByClassName('mod-left-split')[0].removeClass('theme-dark'); 
    }
    // @ts-ignore
    this.app.setTheme('moonstone');
    // @ts-ignore
    this.app.vault.setConfig('theme', 'moonstone');
    this.app.workspace.trigger('css-change');
  }

  updateDarkScheme() {
    document.body.removeClass(
      'minimal-atom-dark',
      'minimal-default-dark',
      'minimal-dracula-dark',
      'minimal-everforest-dark',
      'minimal-gruvbox-dark',
      'minimal-macos-dark',
      'minimal-nord-dark',
      'minimal-notion-dark',
      'minimal-solarized-dark',
      'minimal-things-dark'
    );
    document.body.addClass(this.settings.darkScheme);
  }

  updateLightScheme() {
    document.body.removeClass(
      'minimal-atom-light',
      'minimal-default-light',
      'minimal-everforest-light',
      'minimal-gruvbox-light',
      'minimal-macos-light',
      'minimal-nord-light',
      'minimal-notion-light',
      'minimal-solarized-light',
      'minimal-things-light'
    );
    document.body.addClass(this.settings.lightScheme);
  }

  updateTheme() {
    // @ts-ignore
    this.app.setTheme(this.settings.theme);
    // @ts-ignore
    this.app.vault.setConfig('theme', this.settings.theme);
    this.app.workspace.trigger('css-change');
    if (this.settings.theme == 'moonstone' && this.settings.lightStyle == 'minimal-light-contrast') {
      document.getElementsByClassName('mod-left-split')[0].addClass('theme-dark');
    } else {
      document.getElementsByClassName('mod-left-split')[0].removeClass('theme-dark'); 
    }
  }

  removeStyle() {
    document.body.removeClass('minimal-light','minimal-light-tonal','minimal-light-contrast','minimal-light-white','minimal-dark','minimal-dark-tonal','minimal-dark-black');
    document.body.addClass(this.settings.lightStyle,this.settings.darkStyle);
  }

}

interface MinimalSettings {
  theme: string;
  accentHue: number;
  accentSat: number;
  lightStyle: string;
  darkStyle: string;
  lightScheme: string;
  darkScheme: string;
  uiFont: string;
  textFont: string;
  editorFont: string;
  monoFont: string;
  colorfulHeadings: boolean;
  fancyCursor: boolean;
  colorfulActiveStates: boolean,
  frostedSidebar: boolean;
  minimalIcons: boolean;
  trimNames: boolean;
  labeledNav: boolean;
  bordersToggle: boolean;
  bordersTitle: boolean;
  focusMode: boolean;
  lineHeight: number;
  lineWidth: number;
  lineWidthWide: number;
  maxWidth: number;
  trimCols: boolean;
  maxColWidth: string;
  imgGrid: boolean;
  devBlockWidth: boolean;
  tableWidth: string;
  iframeWidth: string;
  imgWidth: string;
  chartWidth: string;
  mapWidth: string;
  fullWidthMedia: boolean,
  minimalStatus: boolean,
  textNormal: number;
  textSmall: number;
  underlineInternal: boolean;
  underlineExternal: boolean;
  useSystemTheme: boolean;
  folding: boolean;
  lineNumbers: boolean;
  readableLineLength: boolean;
}

const DEFAULT_SETTINGS: MinimalSettings = {
  theme: 'moonstone',
  accentHue: 201,
  accentSat: 17,
  lightStyle: 'minimal-light',
  darkStyle: 'minimal-dark',
  lightScheme: 'minimal-default-light',
  darkScheme: 'minimal-default-dark',
  editorFont: '',
  lineHeight: 1.5,
  lineWidth: 40,
  lineWidthWide: 50,
  maxWidth: 88,
  trimCols: true,
  maxColWidth: '18em',
  textNormal: 16,
  textSmall: 13,
  imgGrid: false,
  imgWidth: 'img-default-width',
  tableWidth: 'table-default-width',
  iframeWidth: 'iframe-default-width',
  mapWidth: 'map-default-width',
  chartWidth: 'chart-default-width',
  colorfulHeadings: false,
  minimalIcons: true,
  colorfulActiveStates: false,
  fancyCursor: false,
  frostedSidebar: true,
  trimNames: true,
  labeledNav: false,
  fullWidthMedia: true,
  bordersToggle: true,
  bordersTitle: false,
  minimalStatus: true,
  focusMode: false,
  underlineInternal: true,
  underlineExternal: true,
  useSystemTheme: false,
  folding: true,
  lineNumbers: false,
  readableLineLength: false,
  devBlockWidth: false,
}

class MinimalSettingTab extends PluginSettingTab {


  plugin: MinimalTheme;
  constructor(app: App, plugin: MinimalTheme) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let {containerEl} = this;

    containerEl.empty();
    containerEl.createEl('h3', {text: 'Minimal Theme Settings'});

    const mainDesc = containerEl.createEl('p');

      mainDesc.appendText('Need help? Explore the ');
      mainDesc.appendChild(
        createEl('a', {
          text: "Minimal documentation",
          href: "https://minimal.guide",
        })
      );
      mainDesc.appendText(' or visit the ');
      mainDesc.appendChild(
        createEl('strong', {
          text: "#minimal",
        })
      );
      mainDesc.appendText(' channel in the official Obsidian Discord. You can support continued development by ');
      mainDesc.appendChild(
        createEl('a', {
          text: "buying me a coffee",
          href: "https://www.buymeacoffee.com/kepano",
        })
      );
      mainDesc.appendText(' ☕');

    containerEl.createEl('br');
    containerEl.createEl('h3', {text: 'Color scheme'});

    const colorDesc = containerEl.createEl('p');

      colorDesc.appendChild(
        createEl('span', {
          text: 'To create a completely custom color scheme use '
          })
        );
      colorDesc.appendChild(
        createEl('a', {
          text: "Style Settings plugin",
          href: "obsidian://show-plugin?id=obsidian-style-settings",
        })
      );
      colorDesc.appendText('.');

      new Setting(containerEl)
        .setName('Light mode color scheme')
        .setDesc('Preset color options for light mode')
        .addDropdown(dropdown => dropdown
          .addOption('minimal-default-light','Default')
          .addOption('minimal-atom-light','Atom')
          .addOption('minimal-everforest-light','Everforest')
          .addOption('minimal-gruvbox-light','Gruvbox')
          .addOption('minimal-macos-light','macOS')
          .addOption('minimal-nord-light','Nord')
          .addOption('minimal-notion-light','Notion')
          .addOption('minimal-solarized-light','Solarized')
          .addOption('minimal-things-light','Things')
          .setValue(this.plugin.settings.lightScheme)
        .onChange((value) => {
          this.plugin.settings.lightScheme = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.updateLightScheme();
        }));

      new Setting(containerEl)
        .setName('Light mode background contrast')
        .setDesc('Level of contrast between sidebar and main content')
        .addDropdown(dropdown => dropdown
          .addOption('minimal-light','Default')
          .addOption('minimal-light-white','All white')
          .addOption('minimal-light-tonal','Low contrast')
          .addOption('minimal-light-contrast','High contrast')
          .setValue(this.plugin.settings.lightStyle)
        .onChange((value) => {
          this.plugin.settings.lightStyle = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.removeStyle();
        }));

      new Setting(containerEl)
        .setName('Dark mode color scheme')
        .setDesc('Preset colors options for dark mode')
        .addDropdown(dropdown => dropdown
          .addOption('minimal-default-dark','Default')
          .addOption('minimal-atom-dark','Atom')
          .addOption('minimal-dracula-dark','Dracula')
          .addOption('minimal-everforest-dark','Everforest')
          .addOption('minimal-gruvbox-dark','Gruvbox')
          .addOption('minimal-macos-dark','macOS')
          .addOption('minimal-nord-dark','Nord')
          .addOption('minimal-notion-dark','Notion')
          .addOption('minimal-solarized-dark','Solarized')
          .addOption('minimal-things-dark','Things')
          .setValue(this.plugin.settings.darkScheme)
          .onChange((value) => {
            this.plugin.settings.darkScheme = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.updateDarkScheme();
          }));

      new Setting(containerEl)
        .setName('Dark mode background contrast')
        .setDesc('Level of contrast between sidebar and main content')
        .addDropdown(dropdown => dropdown
          .addOption('minimal-dark','Default')
          .addOption('minimal-dark-tonal','Low contrast')
          .addOption('minimal-dark-black','True black')
          .setValue(this.plugin.settings.darkStyle)
          .onChange((value) => {
            this.plugin.settings.darkStyle = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.removeStyle();
          }));

      new Setting(containerEl)
        .setName('Accent color hue')
        .setDesc('For links and interactive elements in default color scheme')
        .addSlider(slider => slider
            .setLimits(0, 360, 1)
            .setValue(this.plugin.settings.accentHue)
          .onChange((value) => {
            this.plugin.settings.accentHue = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

      new Setting(containerEl)
        .setName('Accent color saturation')
        .setDesc('For links and interactive elements in default color scheme')
        .addSlider(slider => slider
            .setLimits(0, 100, 1)
            .setValue(this.plugin.settings.accentSat)
          .onChange((value) => {
            this.plugin.settings.accentSat = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    containerEl.createEl('br');
    containerEl.createEl('h3');
    containerEl.createEl('h3', {text: 'Features'});

    new Setting(containerEl)
      .setName('Match system setting for light or dark mode')
      .setDesc('Automatically switch based on your OS setting')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.useSystemTheme)
          .onChange((value) => {
            this.plugin.settings.useSystemTheme = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refreshSystemTheme();
            })
          );

    new Setting(containerEl)
      .setName('Text labels for primary navigation')
      .setDesc('Navigation in left sidebar uses text labels (see documentation for localization support)')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.labeledNav)
          .onChange((value) => {
            this.plugin.settings.labeledNav = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    new Setting(containerEl)
      .setName('Colorful cursor')
      .setDesc('Editor cursor uses your accent color')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.fancyCursor)
          .onChange((value) => {
            this.plugin.settings.fancyCursor = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Colorful active states')
      .setDesc('Active file and menu items use your accent color')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.colorfulActiveStates)
          .onChange((value) => {
            this.plugin.settings.colorfulActiveStates = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Colorful headings')
      .setDesc('Headings use a different color for each size')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.colorfulHeadings)
          .onChange((value) => {
            this.plugin.settings.colorfulHeadings = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Minimal status bar')
      .setDesc('Use narrow status bar')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.minimalStatus)
          .onChange((value) => {
            this.plugin.settings.minimalStatus = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    new Setting(containerEl)
      .setName('Trim file names in sidebars')
      .setDesc('Use ellipses to fit file names on a single line')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.trimNames)
          .onChange((value) => {
            this.plugin.settings.trimNames = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    new Setting(containerEl)
      .setName('Translucent sidebar')
      .setDesc('Use frosted glass effect for sidebar when "Translucent window" is on in Appearance settings')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.frostedSidebar)
          .onChange((value) => {
            this.plugin.settings.frostedSidebar = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

      new Setting(containerEl)
        .setName('Sidebar borders')
        .setDesc('Display divider lines between sidebar elements')
        .addToggle(toggle => toggle.setValue(this.plugin.settings.bordersToggle)
          .onChange((value) => {
            this.plugin.settings.bordersToggle = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

      new Setting(containerEl)
        .setName('Title bar border')
        .setDesc('Display border below pane title (if borders are not hidden)')
        .addToggle(toggle => toggle.setValue(this.plugin.settings.bordersTitle)
          .onChange((value) => {
            this.plugin.settings.bordersTitle = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    new Setting(containerEl)
      .setName('Focus mode')
      .setDesc('Hide title bar and status bar, hover to display (can be toggled with hotkey)')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.focusMode)
          .onChange((value) => {
            this.plugin.settings.focusMode = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Underline internal links')
      .setDesc('Show underlines on internal links')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.underlineInternal)
          .onChange((value) => {
            this.plugin.settings.underlineInternal = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Underline external links')
      .setDesc('Show underlines on external links')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.underlineExternal)
          .onChange((value) => {
            this.plugin.settings.underlineExternal = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Custom icons')
      .setDesc('Replace default icons with Minimal set')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.minimalIcons)
          .onChange((value) => {
            this.plugin.settings.minimalIcons = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Maximize media')
      .setDesc('Images and videos fill the width of the line')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.fullWidthMedia)
          .onChange((value) => {
            this.plugin.settings.fullWidthMedia = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    containerEl.createEl('br');
    containerEl.createEl('h3');
    containerEl.createEl('h3', {text: 'Layout'});

    const layoutDesc = containerEl.createEl('p');

      layoutDesc.appendChild(
        createEl('span', {
          text: 'The following options require the '
          })
        );
      layoutDesc.appendChild(
        createEl('a', {
          text: "Contextual Typography plugin",
          href: "obsidian://show-plugin?id=obsidian-contextual-typography",
        })
      );
      layoutDesc.appendText('. These options can also be defined on a per-file basis using YAML, ');
      layoutDesc.appendChild(
        createEl('a', {
          text: "see documentation",
          href: "https://minimal.guide/Features/Block+width",
        })
      );
      layoutDesc.appendText(' for details.');

    new Setting(containerEl)
      .setName('Image grids')
      .setDesc('Turn consecutive images into columns — to make a new row, add an extra line break between images')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.imgGrid)
          .onChange((value) => {
            this.plugin.settings.imgGrid = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          }));

    new Setting(containerEl)
      .setName('Chart width')
      .setDesc('Default width for chart blocks')
      .addDropdown(dropdown => dropdown
        .addOption('chart-default-width','Default')
        .addOption('chart-wide','Wide line width')
        .addOption('chart-max','Maximum line width')
        .addOption('chart-100','100% pane width')
        .setValue(this.plugin.settings.chartWidth)
          .onChange((value) => {
            this.plugin.settings.chartWidth = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
        );

    new Setting(containerEl)
      .setName('Iframe width')
      .setDesc('Default width for iframe blocks')
      .addDropdown(dropdown => dropdown
        .addOption('iframe-default-width','Default')
        .addOption('iframe-wide','Wide line width')
        .addOption('iframe-max','Maximum line width')
        .addOption('iframe-100','100% pane width')
        .setValue(this.plugin.settings.iframeWidth)
          .onChange((value) => {
            this.plugin.settings.iframeWidth = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
        );

    new Setting(containerEl)
      .setName('Image width')
      .setDesc('Default width for image blocks')
      .addDropdown(dropdown => dropdown
        .addOption('img-default-width','Default')
        .addOption('img-wide','Wide line width')
        .addOption('img-max','Maximum line width')
        .addOption('img-100','100% pane width')
        .setValue(this.plugin.settings.imgWidth)
          .onChange((value) => {
            this.plugin.settings.imgWidth = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
        );

    new Setting(containerEl)
      .setName('Map width')
      .setDesc('Default width for map blocks')
      .addDropdown(dropdown => dropdown
        .addOption('map-default-width','Default')
        .addOption('map-wide','Wide line width')
        .addOption('map-max','Maximum line width')
        .addOption('map-100','100% pane width')
        .setValue(this.plugin.settings.mapWidth)
          .onChange((value) => {
            this.plugin.settings.mapWidth = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
        );

    new Setting(containerEl)
      .setName('Table width')
      .setDesc('Default width for table and Dataview blocks')
      .addDropdown(dropdown => dropdown
        .addOption('table-default-width','Default')
        .addOption('table-wide','Wide line width')
        .addOption('table-max','Maximum line width')
        .addOption('table-100','100% pane width')
        .setValue(this.plugin.settings.tableWidth)
          .onChange((value) => {
            this.plugin.settings.tableWidth = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
        );

    containerEl.createEl('br');
    containerEl.createEl('h3');
    containerEl.createEl('h3', {text: 'Tables'});

    new Setting(containerEl)
      .setName('Trim Dataview columns')
      .setDesc('Disables word wrapping in table cells, and trims long text')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.trimCols)
          .onChange((value) => {
            this.plugin.settings.trimCols = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Dataview maximum column width')
      .setDesc('Maximum width for Dataview columns, accepts any CSS width value')
      .addText(text => text.setPlaceholder('')
        .setValue((this.plugin.settings.maxColWidth || '') + '')
        .onChange((value) => {
          this.plugin.settings.maxColWidth = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    containerEl.createEl('br');
    containerEl.createEl('h3');
    containerEl.createEl('h3', {text: 'Typography'});

    new Setting(containerEl)
      .setName('Body font size')
      .setDesc('Used for the main text (default 16)')
      .addText(text => text.setPlaceholder('16')
        .setValue((this.plugin.settings.textNormal || '') + '')
        .onChange((value) => {
          this.plugin.settings.textNormal = parseFloat(value);
          this.plugin.saveData(this.plugin.settings);
          this.plugin.setFontSize();
        }));

    new Setting(containerEl)
      .setName('Sidebar font size')
      .setDesc('Used for text in the sidebars (default 13)')
      .addText(text => text.setPlaceholder('13')
        .setValue((this.plugin.settings.textSmall || '') + '')
        .onChange((value) => {
          this.plugin.settings.textSmall = parseFloat(value);
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    new Setting(containerEl)
      .setName('Line height')
      .setDesc('Line height of text (default 1.5)')
      .addText(text => text.setPlaceholder('1.5')
        .setValue((this.plugin.settings.lineHeight || '') + '')
        .onChange((value) => {
          this.plugin.settings.lineHeight = parseFloat(value);
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    new Setting(containerEl)
      .setName('Normal line length')
      .setDesc('Number of characters per line (default 40)')
      .addText(text => text.setPlaceholder('40')
        .setValue((this.plugin.settings.lineWidth || '') + '')
        .onChange((value) => {
          this.plugin.settings.lineWidth = parseInt(value.trim());
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    new Setting(containerEl)
      .setName('Wide line length')
      .setDesc('Number of characters per line for wide elements (default 50)')
      .addText(text => text.setPlaceholder('50')
        .setValue((this.plugin.settings.lineWidthWide || '') + '')
        .onChange((value) => {
          this.plugin.settings.lineWidthWide = parseInt(value.trim());
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    new Setting(containerEl)
      .setName('Maximum line length %')
      .setDesc('Percentage of space inside a pane that a line can fill (default 88)')
      .addText(text => text.setPlaceholder('88')
        .setValue((this.plugin.settings.maxWidth || '') + '')
        .onChange((value) => {
          this.plugin.settings.maxWidth = parseInt(value.trim());
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    containerEl.createEl('br');
    containerEl.createEl('h3');
    containerEl.createEl('h3', {text: 'Editor font'});
    containerEl.createEl('p', {text: 'Overrides the text font defined in Obsidian Appearance settings when in edit mode'});

    new Setting(containerEl)
      .setName('Editor font')
      .setDesc('Use the exact name of the font as it appears on your system')
      .addText(text => text.setPlaceholder('')
        .setValue((this.plugin.settings.editorFont || '') + '')
        .onChange((value) => {
          this.plugin.settings.editorFont = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        }));

    containerEl.createEl('br');
    containerEl.createEl('h3', {text: 'Support development'});

    const donateText = containerEl.createEl('p');

      donateText.appendChild(
        createEl('span', {
          text: 'If you enjoy Minimal, consider '
          })
        );
      donateText.appendChild(
        createEl('a', {
          text: "buying me a coffee",
          href: "https://www.buymeacoffee.com/kepano",
        })
      );
      donateText.appendChild(
        createEl('span', {
          text: ', and following me on Twitter '
          })
        );
      donateText.appendChild(
        createEl('a', {
          text: "@kepano",
          href: "https://twitter.com/kepano",
        })
      );

    const div = containerEl.createEl('div', {
      cls: 'minimal-donation',
    });

    const parser = new DOMParser();
    div.appendChild(
      createDonateButton(
        'https://www.buymeacoffee.com/kepano',
        parser.parseFromString(buyMeACoffee, 'text/xml').documentElement,
      ),
    );


  }
}

const createDonateButton = (link: string, img: HTMLElement): HTMLElement => {
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.addClass('minimal-donate-button');
  a.appendChild(img);
  return a;
};

const buyMeACoffee = `
<svg width="150" height="42" viewBox="0 0 260 73" style="margin-right:10px" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 11.68C0 5.22932 5.22931 0 11.68 0H248.2C254.651 0 259.88 5.22931 259.88 11.68V61.32C259.88 67.7707 254.651 73 248.2 73H11.68C5.22931 73 0 67.7707 0 61.32V11.68Z" fill="#FFDD00"/>
<path d="M52.2566 24.0078L52.2246 23.9889L52.1504 23.9663C52.1802 23.9915 52.2176 24.0061 52.2566 24.0078Z" fill="#0D0C22"/>
<path d="M52.7248 27.3457L52.6895 27.3556L52.7248 27.3457Z" fill="#0D0C22"/>
<path d="M52.2701 24.0024C52.266 24.0019 52.2619 24.0009 52.258 23.9995C52.2578 24.0022 52.2578 24.0049 52.258 24.0076C52.2624 24.007 52.2666 24.0052 52.2701 24.0024Z" fill="#0D0C22"/>
<path d="M52.2578 24.0094H52.2643V24.0054L52.2578 24.0094Z" fill="#0D0C22"/>
<path d="M52.6973 27.3394L52.7513 27.3086L52.7714 27.2973L52.7897 27.2778C52.7554 27.2926 52.7241 27.3135 52.6973 27.3394Z" fill="#0D0C22"/>
<path d="M52.3484 24.0812L52.2956 24.031L52.2598 24.0115C52.279 24.0454 52.3108 24.0705 52.3484 24.0812Z" fill="#0D0C22"/>
<path d="M39.0684 56.469C39.0262 56.4872 38.9893 56.5158 38.9609 56.552L38.9943 56.5306C39.0169 56.5098 39.0489 56.4853 39.0684 56.469Z" fill="#0D0C22"/>
<path d="M46.7802 54.9518C46.7802 54.9041 46.7569 54.9129 46.7626 55.0826C46.7626 55.0687 46.7683 55.0549 46.7708 55.0417C46.7739 55.0115 46.7764 54.982 46.7802 54.9518Z" fill="#0D0C22"/>
<path d="M45.9844 56.469C45.9422 56.4872 45.9053 56.5158 45.877 56.552L45.9103 56.5306C45.9329 56.5098 45.9649 56.4853 45.9844 56.469Z" fill="#0D0C22"/>
<path d="M33.6307 56.8301C33.5987 56.8023 33.5595 56.784 33.5176 56.7773C33.5515 56.7937 33.5855 56.81 33.6081 56.8226L33.6307 56.8301Z" fill="#0D0C22"/>
<path d="M32.4118 55.6598C32.4068 55.6103 32.3916 55.5624 32.3672 55.519C32.3845 55.5642 32.399 55.6104 32.4106 55.6573L32.4118 55.6598Z" fill="#0D0C22"/>
<path d="M40.623 34.7221C38.9449 35.4405 37.0404 36.2551 34.5722 36.2551C33.5397 36.2531 32.5122 36.1114 31.5176 35.834L33.2247 53.3605C33.2851 54.093 33.6188 54.7761 34.1595 55.2739C34.7003 55.7718 35.4085 56.0482 36.1435 56.048C36.1435 56.048 38.564 56.1737 39.3716 56.1737C40.2409 56.1737 42.8474 56.048 42.8474 56.048C43.5823 56.048 44.2904 55.7716 44.831 55.2737C45.3716 54.7759 45.7052 54.0929 45.7656 53.3605L47.594 33.993C46.7769 33.714 45.9523 33.5286 45.0227 33.5286C43.415 33.5279 42.1196 34.0817 40.623 34.7221Z" fill="white"/>
<path d="M26.2344 27.2449L26.2633 27.2719L26.2821 27.2832C26.2676 27.2688 26.2516 27.2559 26.2344 27.2449Z" fill="#0D0C22"/>
<path d="M55.4906 25.6274L55.2336 24.3307C55.0029 23.1673 54.4793 22.068 53.2851 21.6475C52.9024 21.513 52.468 21.4552 52.1745 21.1768C51.881 20.8983 51.7943 20.4659 51.7264 20.0649C51.6007 19.3289 51.4825 18.5923 51.3537 17.8575C51.2424 17.2259 51.1544 16.5163 50.8647 15.9368C50.4876 15.1586 49.705 14.7036 48.9269 14.4025C48.5282 14.2537 48.1213 14.1278 47.7082 14.0254C45.7642 13.5125 43.7202 13.324 41.7202 13.2165C39.3197 13.084 36.9128 13.1239 34.518 13.3359C32.7355 13.4981 30.8581 13.6942 29.1642 14.3108C28.5451 14.5364 27.9071 14.8073 27.4364 15.2856C26.8587 15.8733 26.6702 16.7821 27.0919 17.515C27.3917 18.0354 27.8996 18.4031 28.4382 18.6463C29.1398 18.9597 29.8726 19.1982 30.6242 19.3578C32.7172 19.8204 34.885 20.0021 37.0233 20.0794C39.3932 20.175 41.767 20.0975 44.1256 19.8474C44.7089 19.7833 45.2911 19.7064 45.8723 19.6168C46.5568 19.5118 46.9961 18.6168 46.7943 17.9933C46.553 17.2479 45.9044 16.9587 45.1709 17.0712C45.0628 17.0882 44.9553 17.1039 44.8472 17.1196L44.7692 17.131C44.5208 17.1624 44.2723 17.1917 44.0238 17.219C43.5105 17.2743 42.9959 17.3195 42.4801 17.3547C41.3249 17.4352 40.1665 17.4722 39.0088 17.4741C37.8712 17.4741 36.7329 17.4421 35.5978 17.3673C35.0799 17.3333 34.5632 17.2902 34.0478 17.2378C33.8134 17.2133 33.5796 17.1875 33.3458 17.1586L33.1233 17.1303L33.0749 17.1234L32.8442 17.0901C32.3728 17.0191 31.9014 16.9374 31.435 16.8387C31.388 16.8283 31.3459 16.8021 31.3157 16.7645C31.2856 16.7269 31.2691 16.6801 31.2691 16.6319C31.2691 16.5837 31.2856 16.5369 31.3157 16.4993C31.3459 16.4617 31.388 16.4356 31.435 16.4251H31.4438C31.848 16.339 32.2553 16.2655 32.6638 16.2014C32.8 16.18 32.9366 16.159 33.0736 16.1385H33.0774C33.3332 16.1215 33.5903 16.0757 33.8448 16.0455C36.0595 15.8151 38.2874 15.7366 40.5128 15.8104C41.5933 15.8419 42.6731 15.9053 43.7485 16.0147C43.9798 16.0386 44.2098 16.0637 44.4399 16.092C44.5279 16.1027 44.6165 16.1153 44.7051 16.1259L44.8836 16.1517C45.404 16.2292 45.9217 16.3233 46.4367 16.4339C47.1997 16.5999 48.1796 16.6539 48.519 17.4898C48.6271 17.7551 48.6761 18.0499 48.7359 18.3283L48.8119 18.6834C48.8139 18.6898 48.8154 18.6963 48.8163 18.7029C48.9961 19.5409 49.176 20.379 49.3562 21.217C49.3694 21.2789 49.3697 21.3429 49.3571 21.4049C49.3445 21.4669 49.3193 21.5257 49.2829 21.5776C49.2466 21.6294 49.2 21.6732 49.146 21.7062C49.092 21.7392 49.0317 21.7608 48.969 21.7695H48.964L48.854 21.7846L48.7453 21.799C48.4009 21.8439 48.056 21.8858 47.7107 21.9247C47.0307 22.0022 46.3496 22.0693 45.6674 22.1259C44.3119 22.2386 42.9536 22.3125 41.5927 22.3477C40.8992 22.3662 40.2059 22.3748 39.5129 22.3735C36.7543 22.3713 33.9981 22.211 31.2578 21.8933C30.9611 21.8581 30.6645 21.8204 30.3678 21.7821C30.5978 21.8116 30.2006 21.7594 30.1202 21.7481C29.9316 21.7217 29.7431 21.6943 29.5545 21.6658C28.9216 21.5709 28.2924 21.454 27.6607 21.3515C26.8971 21.2258 26.1667 21.2887 25.476 21.6658C24.909 21.976 24.4501 22.4518 24.1605 23.0297C23.8626 23.6456 23.7739 24.3163 23.6407 24.9781C23.5074 25.6399 23.3 26.3521 23.3786 27.0315C23.5477 28.4979 24.5728 29.6895 26.0473 29.956C27.4345 30.2074 28.8292 30.4111 30.2276 30.5846C35.7212 31.2574 41.2711 31.3379 46.7818 30.8247C47.2305 30.7828 47.6787 30.7371 48.1262 30.6876C48.266 30.6723 48.4074 30.6884 48.5401 30.7348C48.6729 30.7812 48.7936 30.8566 48.8934 30.9557C48.9932 31.0548 49.0695 31.1749 49.1169 31.3073C49.1642 31.4397 49.1814 31.5811 49.167 31.7209L49.0275 33.0773C48.7463 35.8181 48.4652 38.5587 48.184 41.299C47.8907 44.1769 47.5955 47.0545 47.2984 49.9319C47.2146 50.7422 47.1308 51.5524 47.047 52.3624C46.9666 53.16 46.9552 53.9827 46.8038 54.7709C46.5649 56.0103 45.7258 56.7715 44.5015 57.0499C43.3798 57.3052 42.2339 57.4392 41.0836 57.4497C39.8083 57.4566 38.5336 57.4 37.2583 57.4069C35.897 57.4145 34.2295 57.2887 33.1786 56.2756C32.2553 55.3856 32.1277 53.9921 32.002 52.7872C31.8344 51.192 31.6682 49.5971 31.5036 48.0023L30.5796 39.1344L29.9819 33.3966C29.9718 33.3017 29.9618 33.208 29.9524 33.1125C29.8807 32.428 29.3961 31.758 28.6324 31.7926C27.9788 31.8215 27.2359 32.3771 27.3125 33.1125L27.7557 37.3664L28.672 46.1657C28.9331 48.6652 29.1935 51.165 29.4533 53.6653C29.5036 54.1442 29.5507 54.6244 29.6035 55.1034C29.8908 57.7205 31.8895 59.131 34.3646 59.5282C35.8102 59.7607 37.291 59.8085 38.758 59.8324C40.6386 59.8626 42.538 59.9348 44.3877 59.5942C47.1287 59.0914 49.1853 57.2611 49.4788 54.422C49.5626 53.6024 49.6464 52.7826 49.7302 51.9626C50.0088 49.2507 50.2871 46.5386 50.5649 43.8263L51.4737 34.9641L51.8904 30.9026C51.9112 30.7012 51.9962 30.5118 52.133 30.3625C52.2697 30.2132 52.4509 30.1119 52.6497 30.0736C53.4335 29.9208 54.1827 29.66 54.7402 29.0635C55.6277 28.1138 55.8043 26.8756 55.4906 25.6274ZM26.0071 26.5035C26.019 26.4979 25.997 26.6003 25.9876 26.6481C25.9857 26.5758 25.9895 26.5117 26.0071 26.5035ZM26.0831 27.0918C26.0894 27.0874 26.1083 27.1126 26.1278 27.1428C26.0982 27.1151 26.0794 27.0944 26.0825 27.0918H26.0831ZM26.1579 27.1905C26.185 27.2364 26.1994 27.2653 26.1579 27.1905V27.1905ZM26.3082 27.3125H26.3119C26.3119 27.3169 26.3188 27.3213 26.3214 27.3257C26.3172 27.3208 26.3126 27.3164 26.3075 27.3125H26.3082ZM52.6132 27.1302C52.3317 27.3979 51.9074 27.5224 51.4882 27.5846C46.7868 28.2823 42.0169 28.6355 37.264 28.4796C33.8624 28.3633 30.4967 27.9856 27.129 27.5098C26.799 27.4633 26.4414 27.403 26.2145 27.1597C25.7871 26.7009 25.997 25.777 26.1083 25.2226C26.2101 24.7148 26.405 24.0378 27.009 23.9656C27.9518 23.8549 29.0466 24.2528 29.9794 24.3942C31.1023 24.5656 32.2295 24.7028 33.3609 24.8059C38.1892 25.2459 43.0986 25.1774 47.9056 24.5337C48.7817 24.416 49.6548 24.2792 50.5246 24.1233C51.2996 23.9844 52.1588 23.7236 52.6271 24.5262C52.9482 25.073 52.991 25.8046 52.9413 26.4225C52.926 26.6917 52.8084 26.9448 52.6126 27.1302H52.6132Z" fill="#0D0C22"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M81.1302 40.1929C80.8556 40.7169 80.4781 41.1732 79.9978 41.5604C79.5175 41.9479 78.9571 42.2633 78.3166 42.5062C77.6761 42.7497 77.0315 42.9131 76.3835 42.9964C75.7352 43.0799 75.106 43.0727 74.4963 42.9735C73.8863 42.8749 73.3674 42.6737 72.9408 42.3695L73.4214 37.3779C73.8633 37.2261 74.4197 37.0703 75.0909 36.9107C75.7619 36.7513 76.452 36.6371 77.1613 36.5689C77.8705 36.5003 78.5412 36.5084 79.1744 36.5917C79.8068 36.6753 80.3065 36.8765 80.6725 37.1958C80.8707 37.378 81.0387 37.5754 81.176 37.7883C81.313 38.0011 81.3969 38.2214 81.4276 38.4493C81.5037 39.0875 81.4047 39.6687 81.1302 40.1929ZM74.153 29.5602C74.4734 29.3627 74.8585 29.1877 75.3083 29.0356C75.7581 28.8841 76.2195 28.7774 76.6923 28.7167C77.1648 28.6562 77.6262 28.6481 78.0763 28.6938C78.5258 28.7395 78.9228 28.8647 79.2659 29.0697C79.6089 29.2751 79.8643 29.5714 80.032 29.9586C80.1997 30.3464 80.2456 30.8365 80.1693 31.429C80.1083 31.9001 79.9211 32.2991 79.6089 32.6256C79.2963 32.9526 78.9147 33.2259 78.4652 33.4462C78.0154 33.6668 77.5388 33.8415 77.0356 33.9702C76.5321 34.0997 76.0477 34.1949 75.5828 34.2553C75.1176 34.3163 74.7137 34.3545 74.3706 34.3692C74.0273 34.3845 73.8021 34.3921 73.6956 34.3921L74.153 29.5602ZM83.6007 36.9676C83.3566 36.4361 83.0287 35.9689 82.6172 35.5658C82.2054 35.1633 81.717 34.8709 81.1531 34.6885C81.3969 34.491 81.6371 34.1795 81.8737 33.7539C82.1099 33.3288 82.3119 32.865 82.4796 32.3636C82.6474 31.8619 82.762 31.357 82.8229 30.8478C82.8836 30.3389 82.8607 29.902 82.7544 29.537C82.4947 28.6256 82.087 27.9114 81.5303 27.3946C80.9734 26.8782 80.3257 26.5211 79.586 26.3233C78.8462 26.1264 78.0304 26.0842 77.1383 26.1981C76.2462 26.312 75.3347 26.5361 74.4049 26.8704C74.4049 26.7946 74.4124 26.7148 74.4278 26.6312C74.4426 26.548 74.4504 26.4604 74.4504 26.369C74.4504 26.1411 74.3361 25.9439 74.1074 25.7765C73.8787 25.6093 73.6155 25.5107 73.3183 25.4801C73.0209 25.45 72.731 25.5142 72.4489 25.6738C72.1665 25.8334 71.9721 26.1264 71.8656 26.5511C71.7434 27.9189 71.6215 29.3398 71.4996 30.8134C71.3774 32.2875 71.248 33.7767 71.1107 35.2812C70.9735 36.7855 70.8362 38.2784 70.6989 39.7598C70.5616 41.2414 70.4244 42.6659 70.2871 44.0333C70.333 44.4436 70.4473 44.7629 70.6304 44.9907C70.8133 45.2189 71.0268 45.3556 71.2709 45.401C71.5147 45.4467 71.7704 45.4045 72.0371 45.2755C72.3038 45.1469 72.5365 44.9222 72.735 44.6032C73.3447 44.9375 74.0311 45.1541 74.7938 45.253C75.5561 45.3516 76.3298 45.3516 77.1157 45.253C77.9007 45.1541 78.6747 44.9682 79.4374 44.6943C80.1997 44.4211 80.8936 44.079 81.519 43.669C82.1441 43.2586 82.6703 42.7911 83.0975 42.2671C83.5244 41.7426 83.8065 41.1767 83.9437 40.5691C84.081 39.946 84.119 39.3231 84.0581 38.7C83.9971 38.0771 83.8445 37.5 83.6007 36.9676Z" fill="#0D0C23"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M105.915 49.0017C105.832 49.5031 105.713 50.0311 105.561 50.586C105.408 51.1403 105.229 51.6458 105.023 52.1018C104.818 52.5575 104.589 52.9256 104.337 53.207C104.085 53.488 103.815 53.606 103.525 53.5606C103.296 53.5297 103.151 53.3854 103.091 53.1274C103.029 52.8686 103.029 52.5497 103.091 52.17C103.151 51.7901 103.269 51.3607 103.445 50.8821C103.62 50.4035 103.834 49.9284 104.085 49.4577C104.337 48.9864 104.623 48.5347 104.943 48.1015C105.264 47.6686 105.599 47.3075 105.95 47.0189C106.026 47.11 106.06 47.3378 106.053 47.7028C106.045 48.0674 105.999 48.5006 105.915 49.0017ZM113.67 39.1097C113.464 38.8819 113.213 38.7529 112.915 38.7223C112.618 38.6919 112.317 38.859 112.012 39.2237C111.813 39.5883 111.562 39.9379 111.257 40.2722C110.952 40.6067 110.635 40.9103 110.307 41.1839C109.98 41.4572 109.667 41.6931 109.37 41.8903C109.072 42.0881 108.84 42.2324 108.672 42.3235C108.611 41.8374 108.576 41.3132 108.569 40.7507C108.561 40.1886 108.573 39.619 108.603 39.0415C108.649 38.2209 108.744 37.393 108.889 36.557C109.034 35.7213 109.244 34.9007 109.518 34.0951C109.518 33.67 109.419 33.3242 109.221 33.0582C109.022 32.7924 108.782 32.625 108.5 32.5567C108.218 32.4885 107.929 32.5264 107.631 32.6707C107.334 32.8153 107.078 33.0775 106.865 33.4569C106.682 33.9586 106.472 34.5207 106.236 35.1436C105.999 35.7667 105.732 36.4012 105.435 37.0469C105.138 37.6931 104.806 38.3197 104.44 38.9273C104.074 39.5354 103.674 40.075 103.239 40.5457C102.804 41.0168 102.331 41.3854 101.821 41.6512C101.31 41.9172 100.757 42.0349 100.162 42.0045C99.8876 41.9285 99.6893 41.7235 99.5675 41.3889C99.4453 41.0549 99.373 40.6368 99.3504 40.1354C99.3275 39.634 99.3504 39.0831 99.4189 38.4828C99.4877 37.8828 99.5791 37.2863 99.6934 36.6938C99.8078 36.101 99.9337 35.5389 100.071 35.0071C100.208 34.4753 100.337 34.0268 100.46 33.6622C100.643 33.2218 100.643 32.8529 100.46 32.5567C100.277 32.2604 100.025 32.0631 99.705 31.964C99.3846 31.8654 99.0489 31.8694 98.6983 31.9755C98.3474 32.0819 98.0958 32.3173 97.9435 32.682C97.684 33.3054 97.4475 34.004 97.2342 34.779C97.0206 35.5539 96.8491 36.3558 96.7197 37.1836C96.5896 38.0121 96.5171 38.8327 96.502 39.6456C96.5011 39.6985 96.5037 39.7488 96.5034 39.8014C96.1709 40.6848 95.854 41.3525 95.553 41.7992C95.1641 42.377 94.7253 42.6277 94.2375 42.5513C94.0236 42.4603 93.8832 42.2477 93.8147 41.9132C93.7453 41.5792 93.7227 41.1689 93.7453 40.6822C93.7688 40.1964 93.826 39.6456 93.9171 39.0299C94.0091 38.4146 94.1229 37.7764 94.2601 37.1154C94.3977 36.4541 94.5425 35.7899 94.6949 35.121C94.8472 34.4525 94.9845 33.8218 95.107 33.2291C95.0916 32.6973 94.9352 32.291 94.6377 32.0097C94.3405 31.7289 93.9247 31.6187 93.3913 31.6791C93.0253 31.8312 92.7542 32.029 92.579 32.2719C92.4034 32.5148 92.2623 32.8265 92.1558 33.2062C92.0946 33.404 92.0032 33.799 91.8813 34.3918C91.7591 34.984 91.603 35.6644 91.4123 36.4315C91.2217 37.1992 90.9967 38.0005 90.7376 38.8362C90.4781 39.6719 90.1885 40.4283 89.8684 41.1041C89.548 41.7801 89.1972 42.3235 88.8161 42.7338C88.4348 43.1438 88.023 43.3113 87.5807 43.2352C87.3366 43.1895 87.1805 42.9388 87.112 42.4831C87.0432 42.0271 87.0319 41.4653 87.0775 40.7964C87.1233 40.1279 87.2148 39.3946 87.352 38.5971C87.4893 37.7993 87.63 37.0434 87.7752 36.3289C87.92 35.6149 88.0535 34.984 88.1756 34.4372C88.2975 33.8901 88.3814 33.5254 88.4272 33.3433C88.4272 32.9026 88.3277 32.5495 88.1298 32.2832C87.9313 32.0178 87.6913 31.8503 87.4092 31.7818C87.1268 31.7136 86.8372 31.7514 86.54 31.8957C86.2426 32.0403 85.9872 32.3026 85.7736 32.682C85.6973 33.0923 85.598 33.5674 85.4761 34.1067C85.3539 34.6459 85.2361 35.2006 85.1218 35.7705C85.0074 36.3404 84.9003 36.8988 84.8014 37.4459C84.7021 37.993 84.6299 38.4716 84.584 38.8819C84.5536 39.2008 84.519 39.5923 84.4813 40.0556C84.443 40.5194 84.4238 41.0092 84.4238 41.5257C84.4238 42.0427 84.4618 42.5554 84.5385 43.0643C84.6145 43.5735 84.7518 44.0408 84.95 44.4659C85.1482 44.8915 85.4265 45.2408 85.7852 45.5144C86.1433 45.7879 86.5972 45.9397 87.1463 45.9704C87.7101 46.0005 88.202 45.9591 88.6217 45.8449C89.041 45.731 89.4221 45.5523 89.7654 45.3091C90.1084 45.0665 90.421 44.7776 90.7033 44.443C90.9851 44.1091 91.2637 43.7444 91.5383 43.3491C91.7974 43.9269 92.1329 44.3748 92.5447 44.694C92.9565 45.013 93.3913 45.2032 93.8486 45.2637C94.306 45.3241 94.7715 45.2602 95.2442 45.0699C95.7167 44.8803 96.1436 44.5573 96.5252 44.1012C96.7762 43.8216 97.0131 43.5038 97.2354 43.1525C97.3297 43.317 97.4301 43.4758 97.543 43.6224C97.9168 44.1091 98.424 44.443 99.0645 44.6255C99.7506 44.808 100.421 44.8386 101.077 44.7169C101.733 44.5954 102.358 44.3748 102.953 44.0559C103.548 43.7366 104.101 43.3532 104.612 42.9047C105.122 42.4565 105.568 41.9895 105.95 41.5028C105.934 41.8524 105.927 42.1832 105.927 42.4944C105.927 42.8061 105.919 43.1438 105.904 43.5088C105.141 44.0408 104.421 44.679 103.742 45.4233C103.064 46.1676 102.469 46.9616 101.958 47.8051C101.447 48.6483 101.047 49.5031 100.757 50.3691C100.467 51.2357 100.326 52.0445 100.334 52.7969C100.341 53.549 100.521 54.206 100.871 54.7681C101.222 55.3306 101.794 55.7331 102.587 55.9763C103.411 56.2348 104.135 56.242 104.76 55.9991C105.386 55.7559 105.931 55.3531 106.396 54.791C106.861 54.2289 107.242 53.549 107.54 52.7512C107.837 51.9534 108.073 51.1215 108.249 50.2555C108.424 49.3894 108.535 48.5379 108.58 47.7028C108.626 46.8668 108.626 46.1219 108.58 45.4687C109.892 44.9219 110.967 44.2305 111.806 43.3945C112.645 42.5594 113.338 41.6778 113.887 40.7507C114.055 40.5229 114.112 40.2493 114.059 39.9304C114.006 39.6111 113.876 39.3376 113.67 39.1097Z" fill="#0D0C23"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M142.53 37.6515C142.575 37.3022 142.644 36.9335 142.735 36.546C142.827 36.1585 142.941 35.7823 143.079 35.4177C143.216 35.0531 143.376 34.7379 143.559 34.4718C143.742 34.2061 143.937 34.0161 144.142 33.9019C144.348 33.7883 144.558 33.7995 144.771 33.936C145 34.0731 145.141 34.3617 145.195 34.8021C145.248 35.2433 145.195 35.7141 145.034 36.2155C144.874 36.7172 144.588 37.1879 144.177 37.6286C143.765 38.0696 143.208 38.3579 142.507 38.4947C142.476 38.2824 142.484 38.0011 142.53 37.6515ZM150.456 38.5857C150.204 38.5103 149.964 38.5025 149.735 38.5632C149.506 38.6239 149.361 38.7835 149.301 39.042C149.178 39.5281 148.984 40.0258 148.717 40.5347C148.45 41.0439 148.122 41.5262 147.734 41.9822C147.345 42.438 146.906 42.8408 146.418 43.1901C145.93 43.5397 145.419 43.7904 144.886 43.9422C144.351 44.1096 143.91 44.1284 143.559 43.9991C143.208 43.8705 142.93 43.6498 142.724 43.3384C142.518 43.027 142.369 42.6508 142.278 42.2101C142.186 41.7694 142.133 41.3137 142.118 40.8424C142.987 40.9034 143.761 40.7478 144.44 40.3751C145.118 40.0032 145.694 39.509 146.167 38.8937C146.639 38.2784 146.998 37.587 147.242 36.8195C147.485 36.0524 147.623 35.2887 147.653 34.5288C147.669 33.8146 147.562 33.2108 147.333 32.7169C147.105 32.2233 146.796 31.839 146.407 31.5658C146.018 31.2922 145.572 31.1326 145.069 31.0872C144.566 31.0415 144.054 31.11 143.536 31.2922C142.91 31.505 142.381 31.8506 141.946 32.3294C141.512 32.808 141.149 33.3629 140.86 33.9933C140.57 34.6239 140.341 35.3038 140.173 36.033C140.005 36.7626 139.883 37.4806 139.807 38.1873C139.739 38.8214 139.702 39.4278 139.689 40.013C139.657 40.0874 139.625 40.1588 139.59 40.2383C139.354 40.7782 139.079 41.3062 138.766 41.8226C138.454 42.3394 138.107 42.7725 137.726 43.1218C137.344 43.4714 136.948 43.5929 136.536 43.4865C136.292 43.426 136.159 43.1444 136.136 42.6433C136.113 42.1416 136.139 41.5187 136.216 40.7741C136.292 40.0298 136.38 39.2239 136.479 38.3579C136.578 37.4918 136.628 36.664 136.628 35.8737C136.628 35.1898 136.498 34.5329 136.239 33.9019C135.979 33.2718 135.625 32.7473 135.175 32.3294C134.725 31.9113 134.203 31.634 133.608 31.4975C133.013 31.3605 132.373 31.4518 131.687 31.7708C131 32.09 130.455 32.5382 130.051 33.1157C129.647 33.6934 129.277 34.3009 128.942 34.9391C128.819 34.4528 128.641 34.0011 128.404 33.583C128.167 33.1651 127.878 32.8005 127.535 32.4888C127.191 32.1776 126.806 31.9344 126.38 31.7595C125.953 31.5851 125.502 31.4975 125.03 31.4975C124.572 31.4975 124.149 31.5851 123.76 31.7595C123.371 31.9344 123.017 32.1583 122.696 32.4318C122.376 32.7056 122.087 33.013 121.827 33.3551C121.568 33.6969 121.339 34.0352 121.141 34.3692C121.11 33.9742 121.076 33.6286 121.038 33.332C121 33.0359 120.931 32.7852 120.832 32.5801C120.733 32.3748 120.592 32.2193 120.409 32.1129C120.226 32.0067 119.967 31.9532 119.632 31.9532C119.464 31.9532 119.296 31.9874 119.128 32.0556C118.96 32.1241 118.811 32.2193 118.682 32.3407C118.552 32.4627 118.453 32.6105 118.385 32.7852C118.316 32.9598 118.297 33.1614 118.327 33.3892C118.342 33.5566 118.385 33.7576 118.453 33.9933C118.522 34.2289 118.587 34.5369 118.648 34.9163C118.708 35.2962 118.758 35.756 118.796 36.2953C118.834 36.8349 118.846 37.4959 118.831 38.2784C118.815 39.0611 118.758 39.9763 118.659 41.0248C118.56 42.0733 118.403 43.289 118.19 44.6714C118.16 44.9907 118.282 45.2492 118.556 45.4467C118.831 45.6439 119.143 45.7578 119.494 45.7885C119.845 45.8188 120.177 45.7578 120.489 45.6063C120.802 45.4539 120.981 45.1882 121.027 44.8085C121.072 44.0943 121.16 43.3347 121.29 42.529C121.419 41.724 121.579 40.9262 121.77 40.1359C121.961 39.346 122.178 38.5938 122.422 37.8793C122.666 37.1651 122.937 36.5347 123.234 35.9876C123.532 35.4405 123.84 35.0039 124.161 34.6771C124.481 34.3504 124.816 34.187 125.167 34.187C125.594 34.187 125.926 34.3805 126.162 34.7679C126.398 35.1557 126.566 35.6536 126.666 36.2609C126.765 36.869 126.81 37.5341 126.803 38.2555C126.795 38.9773 126.765 39.6724 126.711 40.341C126.658 41.0098 126.597 41.606 126.528 42.1303C126.46 42.6545 126.41 43.0157 126.38 43.2129C126.38 43.5625 126.513 43.8395 126.78 44.0448C127.046 44.2498 127.344 44.3716 127.672 44.4095C128 44.4476 128.309 44.3866 128.598 44.227C128.888 44.0674 129.056 43.7982 129.102 43.4179C129.254 42.324 129.464 41.2264 129.731 40.1247C129.997 39.023 130.303 38.0355 130.646 37.1616C130.989 36.2878 131.37 35.5735 131.79 35.0189C132.209 34.4646 132.655 34.187 133.128 34.187C133.371 34.187 133.559 34.3544 133.688 34.6884C133.818 35.0227 133.883 35.4784 133.883 36.0559C133.883 36.4815 133.848 36.9184 133.78 37.3666C133.711 37.8148 133.631 38.2784 133.54 38.7569C133.448 39.2358 133.368 39.7256 133.299 40.227C133.231 40.7287 133.196 41.2527 133.196 41.7998C133.196 42.1797 133.235 42.6204 133.311 43.1218C133.387 43.6229 133.532 44.0983 133.745 44.5462C133.959 44.9947 134.252 45.3744 134.626 45.6858C135 45.9973 135.476 46.1531 136.056 46.1531C136.925 46.1531 137.695 45.9669 138.366 45.5947C139.037 45.2226 139.613 44.7365 140.093 44.1362C140.118 44.1047 140.141 44.0711 140.165 44.0399C140.202 44.1287 140.235 44.2227 140.276 44.3071C140.604 44.9756 141.05 45.4921 141.615 45.857C142.178 46.2216 142.842 46.4229 143.605 46.4611C144.367 46.4987 145.198 46.3581 146.098 46.0392C146.769 45.796 147.352 45.4921 147.848 45.1275C148.343 44.7628 148.789 44.3184 149.186 43.7941C149.583 43.2699 149.945 42.6658 150.273 41.9822C150.601 41.2981 150.932 40.5159 151.268 39.6342C151.329 39.3916 151.272 39.1751 151.097 38.9848C150.921 38.7951 150.708 38.6621 150.456 38.5857Z" fill="#0D0C23"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M162.887 36.0434C162.81 36.4918 162.707 36.986 162.578 37.525C162.448 38.0646 162.284 38.623 162.086 39.2004C161.888 39.7779 161.644 40.2984 161.354 40.7616C161.064 41.2254 160.733 41.5935 160.359 41.8671C159.985 42.1406 159.555 42.2546 159.066 42.2089C158.822 42.1788 158.635 42.0117 158.506 41.7075C158.376 41.4038 158.308 41.0161 158.3 40.545C158.292 40.0743 158.334 39.5575 158.426 38.9951C158.517 38.4333 158.658 37.8821 158.849 37.3426C159.04 36.8036 159.272 36.3056 159.547 35.8496C159.821 35.3939 160.138 35.0405 160.496 34.7898C160.854 34.5391 161.247 34.4217 161.674 34.4365C162.101 34.4518 162.559 34.6643 163.047 35.0747C163.016 35.2725 162.963 35.5954 162.887 36.0434ZM171.019 37.787C170.782 37.6656 170.538 37.6392 170.287 37.7075C170.035 37.7757 169.856 38.0076 169.749 38.4026C169.688 38.8283 169.551 39.3294 169.338 39.9069C169.124 40.4843 168.861 41.0317 168.548 41.5478C168.236 42.0646 167.877 42.494 167.473 42.8358C167.069 43.1778 166.638 43.3337 166.181 43.3028C165.799 43.2727 165.532 43.079 165.38 42.7218C165.227 42.3647 165.147 41.9168 165.14 41.3769C165.132 40.838 165.186 40.2301 165.3 39.5538C165.414 38.8777 165.552 38.2054 165.712 37.5363C165.872 36.868 166.036 36.2258 166.204 35.6105C166.371 34.9951 166.508 34.4747 166.616 34.0493C166.738 33.6693 166.699 33.3466 166.501 33.0803C166.303 32.8149 166.055 32.6246 165.758 32.5107C165.46 32.3967 165.159 32.3664 164.854 32.4196C164.549 32.4728 164.351 32.6362 164.259 32.9094C163.359 32.1345 162.494 31.7166 161.663 31.6559C160.831 31.5952 160.065 31.7776 159.364 32.203C158.662 32.6284 158.041 33.2437 157.5 34.0493C156.958 34.8549 156.52 35.7322 156.184 36.6818C155.849 37.6314 155.639 38.6004 155.555 39.5879C155.471 40.5757 155.536 41.4761 155.75 42.289C155.963 43.1018 156.34 43.7669 156.882 44.283C157.423 44.7998 158.159 45.0583 159.089 45.0583C159.501 45.0583 159.898 44.9747 160.279 44.8076C160.66 44.6401 161.011 44.4426 161.331 44.2148C161.651 43.9869 161.933 43.7475 162.178 43.4968C162.421 43.2461 162.612 43.0373 162.749 42.8699C162.856 43.417 163.032 43.8808 163.276 44.2605C163.519 44.6401 163.798 44.9521 164.111 45.1948C164.423 45.4376 164.751 45.6164 165.094 45.7306C165.437 45.8445 165.769 45.9015 166.089 45.9015C166.806 45.9015 167.477 45.6583 168.102 45.1719C168.727 44.6861 169.288 44.0893 169.784 43.3829C170.279 42.6762 170.687 41.9319 171.007 41.1491C171.328 40.3666 171.541 39.6715 171.648 39.0634C171.755 38.8355 171.735 38.5964 171.591 38.3457C171.446 38.095 171.255 37.909 171.019 37.787Z" fill="#0D0C23"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M212.194 50.3701C212.064 50.8866 211.862 51.3238 211.587 51.6806C211.313 52.0377 210.97 52.2239 210.558 52.2393C210.299 52.2543 210.101 52.1175 209.963 51.8289C209.826 51.5401 209.731 51.1679 209.678 50.7122C209.624 50.2562 209.601 49.747 209.609 49.1849C209.616 48.6227 209.639 48.0681 209.678 47.521C209.715 46.9742 209.761 46.4647 209.815 45.9939C209.868 45.5226 209.91 45.1586 209.94 44.9C210.459 44.9608 210.89 45.1846 211.233 45.5723C211.576 45.9598 211.839 46.4193 212.022 46.9514C212.205 47.4831 212.312 48.0568 212.343 48.6722C212.373 49.2875 212.323 49.8534 212.194 50.3701ZM203.913 50.3701C203.783 50.8866 203.581 51.3238 203.307 51.6806C203.032 52.0377 202.689 52.2239 202.277 52.2393C202.018 52.2543 201.82 52.1175 201.683 51.8289C201.545 51.5401 201.45 51.1679 201.397 50.7122C201.343 50.2562 201.32 49.747 201.328 49.1849C201.336 48.6227 201.358 48.0681 201.397 47.521C201.434 46.9742 201.48 46.4647 201.534 45.9939C201.587 45.5226 201.629 45.1586 201.66 44.9C202.178 44.9608 202.609 45.1846 202.952 45.5723C203.295 45.9598 203.558 46.4193 203.741 46.9514C203.924 47.4831 204.031 48.0568 204.062 48.6722C204.092 49.2875 204.042 49.8534 203.913 50.3701ZM195.415 37.4241C195.399 37.7884 195.365 38.1114 195.312 38.3925C195.258 38.6741 195.186 38.8522 195.095 38.9283C194.927 38.8369 194.721 38.6018 194.477 38.2216C194.233 37.8419 194.042 37.4122 193.905 36.9336C193.768 36.4551 193.725 35.9843 193.779 35.5205C193.832 35.0573 194.073 34.6967 194.5 34.4379C194.667 34.3468 194.812 34.3809 194.934 34.5405C195.056 34.7001 195.155 34.9318 195.232 35.2357C195.308 35.5399 195.361 35.8892 195.392 36.2842C195.422 36.6795 195.43 37.0591 195.415 37.4241ZM193.39 41.9711C193.154 42.2215 192.89 42.4381 192.601 42.6206C192.311 42.803 192.014 42.9398 191.709 43.0309C191.404 43.1223 191.129 43.1448 190.885 43.0991C190.199 42.9627 189.673 42.666 189.307 42.2103C188.941 41.7545 188.708 41.219 188.609 40.6037C188.51 39.9881 188.521 39.3308 188.644 38.6319C188.765 37.933 188.971 37.2835 189.261 36.6832C189.551 36.0829 189.902 35.5662 190.313 35.1333C190.725 34.7001 191.175 34.4306 191.663 34.3239C191.48 35.0989 191.419 35.9007 191.48 36.7286C191.541 37.5568 191.739 38.3355 192.075 39.0648C192.288 39.506 192.544 39.9082 192.841 40.2729C193.139 40.6378 193.501 40.9492 193.928 41.2075C193.806 41.466 193.626 41.7204 193.39 41.9711ZM218.702 37.6519C218.747 37.3026 218.816 36.9336 218.908 36.5462C218.999 36.159 219.114 35.7828 219.251 35.4181C219.388 35.0532 219.548 34.738 219.731 34.4723C219.914 34.2065 220.108 34.0163 220.314 33.9024C220.52 33.7884 220.73 33.7997 220.943 33.9365C221.172 34.0735 221.313 34.3621 221.367 34.8025C221.42 35.2435 221.367 35.7142 221.207 36.2159C221.046 36.7173 220.761 37.1884 220.349 37.6288C219.937 38.07 219.38 38.3583 218.679 38.4951C218.648 38.2826 218.656 38.0015 218.702 37.6519ZM227.921 37.6519C227.966 37.3026 228.035 36.9336 228.126 36.5462C228.218 36.159 228.332 35.7828 228.47 35.4181C228.607 35.0532 228.767 34.738 228.95 34.4723C229.133 34.2065 229.328 34.0163 229.533 33.9024C229.739 33.7884 229.949 33.7997 230.162 33.9365C230.391 34.0735 230.532 34.3621 230.586 34.8025C230.639 35.2435 230.586 35.7142 230.425 36.2159C230.265 36.7173 229.979 37.1884 229.568 37.6288C229.156 38.07 228.599 38.3583 227.898 38.4951C227.867 38.2826 227.875 38.0015 227.921 37.6519ZM236.488 38.9852C236.312 38.7955 236.099 38.6625 235.847 38.5862C235.595 38.5104 235.355 38.5029 235.126 38.5636C234.897 38.6244 234.752 38.784 234.692 39.0422C234.57 39.5286 234.375 40.0262 234.108 40.5349C233.841 41.0444 233.514 41.5267 233.125 41.9824C232.736 42.4381 232.297 42.8412 231.81 43.1905C231.321 43.5401 230.81 43.7908 230.277 43.9423C229.743 44.1101 229.301 44.1289 228.95 43.9996C228.599 43.8706 228.321 43.6503 228.115 43.3389C227.909 43.0271 227.761 42.6512 227.669 42.2103C227.578 41.7699 227.524 41.3142 227.509 40.8428C228.378 40.9038 229.152 40.7483 229.831 40.3755C230.509 40.0034 231.085 39.5092 231.558 38.8939C232.031 38.2788 232.389 37.5874 232.633 36.82C232.877 36.0526 233.014 35.2892 233.045 34.5293C233.06 33.815 232.953 33.211 232.724 32.7171C232.496 32.2235 232.187 31.8395 231.798 31.5662C231.409 31.2924 230.963 31.133 230.46 31.0874C229.957 31.0417 229.445 31.1105 228.927 31.2924C228.302 31.5055 227.772 31.851 227.338 32.3296C226.903 32.8085 226.54 33.3634 226.251 33.9934C225.961 34.6244 225.732 35.3039 225.564 36.0335C225.396 36.7627 225.274 37.481 225.199 38.1874C225.124 38.873 225.084 39.5292 225.075 40.1572C225.017 40.2824 224.956 40.4082 224.889 40.5349C224.622 41.0444 224.295 41.5267 223.906 41.9824C223.517 42.4381 223.078 42.8412 222.591 43.1905C222.102 43.5401 221.592 43.7908 221.058 43.9423C220.524 44.1101 220.082 44.1289 219.731 43.9996C219.38 43.8706 219.102 43.6503 218.896 43.3389C218.691 43.0271 218.542 42.6512 218.45 42.2103C218.359 41.7699 218.305 41.3142 218.29 40.8428C219.159 40.9038 219.933 40.7483 220.612 40.3755C221.29 40.0034 221.866 39.5092 222.339 38.8939C222.811 38.2788 223.17 37.5874 223.414 36.82C223.658 36.0526 223.795 35.2892 223.826 34.5293C223.841 33.815 223.734 33.211 223.506 32.7171C223.277 32.2235 222.968 31.8395 222.579 31.5662C222.19 31.2924 221.744 31.133 221.241 31.0874C220.738 31.0417 220.227 31.1105 219.708 31.2924C219.083 31.5055 218.553 31.851 218.119 32.3296C217.684 32.8085 217.321 33.3634 217.032 33.9934C216.742 34.6244 216.513 35.3039 216.346 36.0335C216.178 36.7627 216.056 37.481 215.98 38.1874C215.936 38.5859 215.907 38.9722 215.886 39.3516C215.739 39.4765 215.595 39.6023 215.442 39.7258C214.916 40.1514 214.363 40.5349 213.784 40.8769C213.204 41.219 212.601 41.5001 211.977 41.7204C211.351 41.9408 210.71 42.0738 210.055 42.1192L211.473 26.9847C211.565 26.6655 211.519 26.3847 211.336 26.1415C211.153 25.8983 210.916 25.7312 210.627 25.6401C210.337 25.5488 210.028 25.5566 209.7 25.6627C209.372 25.7694 209.102 26.0126 208.888 26.3919C208.781 26.9697 208.671 27.7597 208.557 28.7625C208.442 29.7653 208.328 30.8595 208.213 32.0448C208.099 33.23 207.985 34.4532 207.87 35.7142C207.756 36.9759 207.657 38.1533 207.573 39.2472C207.569 39.2958 207.566 39.3398 207.562 39.3878C207.429 39.5005 207.299 39.6142 207.161 39.7258C206.635 40.1514 206.082 40.5349 205.503 40.8769C204.923 41.219 204.321 41.5001 203.696 41.7204C203.07 41.9408 202.429 42.0738 201.774 42.1192L203.192 26.9847C203.284 26.6655 203.238 26.3847 203.055 26.1415C202.872 25.8983 202.635 25.7312 202.346 25.6401C202.056 25.5488 201.747 25.5566 201.419 25.6627C201.091 25.7694 200.821 26.0126 200.607 26.3919C200.501 26.9697 200.39 27.7597 200.276 28.7625C200.161 29.7653 200.047 30.8595 199.933 32.0448C199.818 33.23 199.704 34.4532 199.589 35.7142C199.475 36.9759 199.376 38.1533 199.292 39.2472C199.29 39.2692 199.289 39.2891 199.287 39.3111C199.048 39.4219 198.786 39.519 198.503 39.6006C198.213 39.6844 197.885 39.7339 197.519 39.7489C197.58 39.4751 197.63 39.1712 197.668 38.8369C197.706 38.5029 197.737 38.1533 197.76 37.7884C197.782 37.4241 197.79 37.0591 197.782 36.6945C197.774 36.3296 197.755 35.9956 197.725 35.6914C197.649 35.0385 197.508 34.4191 197.302 33.8338C197.096 33.2491 196.818 32.7593 196.467 32.3637C196.116 31.9687 195.678 31.7027 195.151 31.5662C194.626 31.4294 194.012 31.4748 193.31 31.7027C192.273 31.5662 191.339 31.6613 190.508 31.9878C189.677 32.3149 188.956 32.7894 188.346 33.4122C187.736 34.0357 187.237 34.7684 186.848 35.6119C186.459 36.4551 186.2 37.3214 186.07 38.21C186.015 38.5868 185.988 38.9618 185.98 39.336C185.744 39.8177 185.486 40.2388 185.201 40.5921C184.797 41.0935 184.377 41.5038 183.943 41.8228C183.508 42.142 183.077 42.3852 182.65 42.5523C182.223 42.7198 181.842 42.8337 181.507 42.8941C181.11 42.9702 180.729 42.978 180.363 42.917C179.997 42.8565 179.661 42.6816 179.357 42.3927C179.112 42.1802 178.925 41.8381 178.796 41.3671C178.666 40.896 178.59 40.3608 178.567 39.7602C178.544 39.1599 178.567 38.533 178.636 37.8798C178.705 37.2266 178.822 36.6072 178.99 36.0222C179.158 35.4372 179.371 34.913 179.631 34.4492C179.89 33.9862 180.195 33.6554 180.546 33.4579C180.744 33.4886 180.866 33.606 180.912 33.811C180.958 34.0163 180.969 34.2595 180.946 34.5405C180.923 34.8219 180.889 35.1105 180.843 35.4066C180.797 35.703 180.775 35.9502 180.775 36.1474C180.851 36.5577 180.999 36.877 181.221 37.1048C181.441 37.3327 181.69 37.466 181.964 37.5036C182.239 37.5417 182.509 37.4773 182.776 37.3098C183.043 37.143 183.26 36.877 183.428 36.512C183.443 36.5274 183.466 36.5349 183.497 36.5349L183.817 33.6404C183.909 33.2451 183.847 32.8958 183.634 32.5919C183.42 32.288 183.138 32.113 182.788 32.0676C182.345 31.4294 181.747 31.0914 180.992 31.0532C180.237 31.0154 179.463 31.2623 178.67 31.7941C178.182 32.144 177.751 32.626 177.378 33.2413C177.004 33.857 176.699 34.5405 176.463 35.2926C176.226 36.0448 176.058 36.8391 175.959 37.6748C175.86 38.5104 175.841 39.3236 175.902 40.1133C175.963 40.9038 176.104 41.6484 176.325 42.347C176.546 43.0462 176.855 43.6312 177.252 44.102C177.587 44.5123 177.968 44.8127 178.395 45.0027C178.822 45.1927 179.268 45.3101 179.734 45.3558C180.199 45.4012 180.66 45.3821 181.118 45.2988C181.575 45.2155 182.01 45.0978 182.421 44.9454C182.955 44.7482 183.505 44.4972 184.069 44.1933C184.633 43.8897 185.174 43.5248 185.693 43.0991C185.966 42.8753 186.228 42.6313 186.482 42.3696C186.598 42.6553 186.727 42.9317 186.882 43.1905C187.294 43.8741 187.85 44.429 188.552 44.8544C189.253 45.2797 190.115 45.4844 191.137 45.4697C192.235 45.4544 193.249 45.1774 194.18 44.6378C195.11 44.0988 195.872 43.3042 196.467 42.256C197.358 42.256 198.234 42.1096 199.096 41.819C199.089 41.911 199.081 42.0079 199.075 42.0966C199.014 42.9019 198.983 43.4487 198.983 43.7376C198.968 44.239 198.934 44.8581 198.88 45.5949C198.827 46.332 198.793 47.1069 198.778 47.9198C198.763 48.7326 198.793 49.5532 198.869 50.3817C198.945 51.2096 199.105 51.962 199.349 52.6383C199.593 53.3141 199.94 53.8878 200.39 54.3591C200.84 54.8299 201.431 55.1112 202.163 55.2023C202.941 55.3084 203.612 55.1717 204.176 54.792C204.74 54.412 205.198 53.8918 205.549 53.2308C205.899 52.5695 206.147 51.8061 206.292 50.9401C206.437 50.074 206.479 49.2039 206.418 48.3301C206.357 47.4562 206.196 46.6321 205.937 45.8575C205.678 45.0822 205.319 44.444 204.862 43.9423C205.137 43.8669 205.465 43.7226 205.846 43.5095C206.227 43.2969 206.62 43.0575 207.024 42.7915C207.123 42.7261 207.221 42.6573 207.32 42.5902C207.283 43.1286 207.264 43.5126 207.264 43.7376C207.249 44.239 207.215 44.8581 207.161 45.5949C207.108 46.332 207.073 47.1069 207.058 47.9198C207.043 48.7326 207.073 49.5532 207.15 50.3817C207.226 51.2096 207.386 51.962 207.63 52.6383C207.874 53.3141 208.221 53.8878 208.671 54.3591C209.121 54.8299 209.712 55.1112 210.444 55.2023C211.221 55.3084 211.892 55.1717 212.457 54.792C213.021 54.412 213.478 53.8918 213.83 53.2308C214.18 52.5695 214.428 51.8061 214.573 50.9401C214.718 50.074 214.759 49.2039 214.699 48.3301C214.637 47.4562 214.477 46.6321 214.218 45.8575C213.959 45.0822 213.601 44.444 213.143 43.9423C213.418 43.8669 213.745 43.7226 214.127 43.5095C214.508 43.2969 214.9 43.0575 215.305 42.7915C215.515 42.6533 215.724 42.5107 215.932 42.3641C216.01 43.1072 216.179 43.759 216.448 44.3073C216.776 44.9761 217.222 45.4925 217.787 45.8575C218.351 46.2218 219.014 46.4234 219.777 46.4612C220.539 46.4988 221.37 46.3586 222.271 46.0393C222.941 45.7965 223.525 45.4925 224.02 45.1279C224.516 44.763 224.962 44.3185 225.358 43.7946C225.381 43.7642 225.403 43.7313 225.425 43.7006C225.496 43.9134 225.574 44.1179 225.667 44.3073C225.995 44.9761 226.441 45.4925 227.006 45.8575C227.569 46.2218 228.233 46.4234 228.996 46.4612C229.758 46.4988 230.589 46.3586 231.489 46.0393C232.16 45.7965 232.744 45.4925 233.239 45.1279C233.735 44.763 234.181 44.3185 234.577 43.7946C234.974 43.27 235.336 42.666 235.664 41.9824C235.992 41.2985 236.323 40.5164 236.659 39.6347C236.72 39.3918 236.663 39.1752 236.488 38.9852Z" fill="#0D0C23"/>
</svg>`;