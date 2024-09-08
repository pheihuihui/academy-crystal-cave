const { exec } = require("child_process");
const { readdir, readFileSync, readdirSync, copyFile, copyFileSync, writeFileSync, existsSync } = require("fs");
const { json } = require("stream/consumers");

const BinderToolPath = "D:\\eldenringdump\\BinderTool.v0.7.0-pre4\\BinderTool.exe";
const args = process.argv;
const Language = ["engUS", "jpnJP", "zhoCN"];
const ItemMiddleDir = "item_dlc02-msgbnd-dcx/GR/data/INTERROOT_win64/msg";
const MenuMiddleDir = "menu_dlc02-msgbnd-dcx/GR/data/INTERROOT_win64/msg";
const ItemDirs = Language.map((lang) => `./step_01_fmg/${lang}/${ItemMiddleDir}/${lang}`);
const MenuDirs = Language.map((lang) => `./step_01_fmg/${lang}/${MenuMiddleDir}/${lang}`);
const AllDirs = [...ItemDirs, ...MenuDirs];
const FilesNeeded = {
    item: [
        "AccessoryCaption",
        "AccessoryInfo",
        "AccessoryName",
        "ArtsCaption",
        "ArtsName",
        "GemCaption",
        "GemEffect",
        "GemInfo",
        "GemName",
        "GoodsCaption",
        "GoodsDialog",
        "GoodsInfo",
        "GoodsInfo2",
        "GoodsName",
        "NpcName",
        "PlaceName",
        "ProtectorCaption",
        "ProtectorInfo",
        "ProtectorName",
        "WeaponCaption",
        "WeaponEffect",
        "WeaponInfo",
        "WeaponName",
    ],
    menu: [
        "ActionButtonText",
        "BloodMsg",
        "EventTextForMap",
        "EventTextForTalk",
        "GR_Dialogues",
        "GR_LineHelp",
        "GR_MenuText",
        "LoadingText",
        "LoadingTitle",
        "MovieSubtitle",
        "NetworkMessage",
        "TalkMsg",
        "TalkMsg_FemalePC_Alt",
        "TutorialBody",
        "TutorialTitle",
    ],
};

const AllFileNames = [...FilesNeeded.item, ...FilesNeeded.menu];

if (args[2] && args[2] == "txt") {
    extractTextFromFmg();
} else if (args[2] && args[2] == "json") {
    convertAllTextFilesToJson();
}

function extractTextFromFmg() {
    for (let itemDir of ItemDirs) {
        let fmgs = readdirSync(itemDir);
        for (let fmg of fmgs) {
            let fmgPath = `${itemDir}/${fmg}`;
            if (fmgPath.includes("engUS")) {
                exec(`${BinderToolPath} ${fmgPath} ./step_02_txt/en/${fmg}`);
            }
            if (fmgPath.includes("jpnJP")) {
                exec(`${BinderToolPath} ${fmgPath} ./step_02_txt/jp/${fmg}`);
            }
            if (fmgPath.includes("zhoCN")) {
                exec(`${BinderToolPath} ${fmgPath} ./step_02_txt/zh/${fmg}`);
            }
        }
    }
    for (let menuDir of MenuDirs) {
        let fmgs = readdirSync(menuDir);
        for (let fmg of fmgs) {
            let fmgPath = `${menuDir}/${fmg}`;
            if (fmgPath.includes("engUS")) {
                exec(`${BinderToolPath} ${fmgPath} ./step_02_txt/en/${fmg}`);
            }
            if (fmgPath.includes("jpnJP")) {
                exec(`${BinderToolPath} ${fmgPath} ./step_02_txt/jp/${fmg}`);
            }
            if (fmgPath.includes("zhoCN")) {
                exec(`${BinderToolPath} ${fmgPath} ./step_02_txt/zh/${fmg}`);
            }
        }
    }
}

function convertSingleTextFileToJson(name, lang) {
    let res = {};

    let filePath = `./step_02_txt/${lang}/${name}.fmg.txt`;
    if (existsSync(filePath) == false) return;
    let file = readFileSync(`./step_02_txt/${lang}/${name}.fmg.txt`, "utf8");
    let lines = file.split("\n");
    for (let line of lines) {
        let [number, text] = splitNumberAndText(line);
        if (text != "\t\r") res[number] = text;
    }

    let dlc01filePath = `./step_02_txt/${lang}/${name}_dlc01.fmg.txt`;
    if (existsSync(dlc01filePath) == false) return;
    file = readFileSync(`./step_02_txt/${lang}/${name}_dlc01.fmg.txt`, "utf8");
    lines = file.split("\n");
    for (let line of lines) {
        let [number, text] = splitNumberAndText(line);
        if (text != "\t\r") res[number] = text;
    }

    let str = JSON.stringify(res);
    writeFileSync(`./step_03_json/${lang}/${name}.json`, str);
}

function convertAllTextFilesToJson() {
    for (let name of AllFileNames) {
        for (let lang of ["en", "jp", "zh"]) {
            convertSingleTextFileToJson(name, lang);
        }
    }
}

function splitNumberAndText(text) {
    let numbers = text.match(/\d+/g);
    let number = numbers ? numbers[0] : "";
    let txt = text.replace(`${number}`, "");
    return [number, txt];
}
