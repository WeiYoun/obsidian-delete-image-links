import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
interface DeleteImageLinksSettings {
  mySetting: string;
}
const DEFAULT_SETTINGS: DeleteImageLinksSettings = {
  mySetting: "default",
};
export default class DeleteImageLinks extends Plugin {
  settings: DeleteImageLinksSettings;
  async onload() {
    console.log("loading plugin");
    await this.loadSettings();
    this.addRibbonIcon("circle", "delete images", () => {
      // new Notice("This is a notice!");
      this.deleteImageLinks();
    });
    this.addStatusBarItem().setText("Status Bar Text");
    this.addCommand({
      id: "open-sample-modal",
      name: "Open Sample Modal",
      // callback: () => {
      // 	console.log('Simple Callback');
      // },
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new SampleModal(this.app).open();
          }
          return true;
        }
        return false;
      },
    });
    this.addSettingTab(new SampleSettingTab(this.app, this));
    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log("codemirror", cm);
    });
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );
  }
  onunload() {
    console.log("unloading plugin");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }


  async deleteImageLinks() {
    // 获取当前打开的所有笔记
    const notes = this.app.vault.getMarkdownFiles();
  
    // 遍历每个笔记
    for (const note of notes) {
      // 读取笔记的内容
      const content = this.app.vault.read(note);
  
      try {
        const resolvedString: string = await content; // 等待 Promise 解析为字符串
        const modifiedString: string = resolvedString.replace(/!\[[^\]]*\]\([^)]*\)/g, ''); // 使用 replace 方法对字符串进行修改
        console.log(modifiedString);
        this.app.vault.modify(note, modifiedString);
      } catch (error) {
        console.error(error);
      }

      // // 删除图片链接
      // const modifiedContent = content.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  
      // 将修改后的内容写回笔记
      // this.app.vault.modify(note, modifiedContent);
      
    }
  
    // 提示删除成功
    new Notice('All image links have been deleted from your notes.');
  }
  

}



class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }
  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }
  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: DeleteImageLinks;
  constructor(app: App, plugin: DeleteImageLinks) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });
    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}




