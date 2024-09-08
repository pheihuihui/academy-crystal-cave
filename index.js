const { exec } = require("child_process");
const { readdir, readFileSync, readdirSync, copyFile, copyFileSync, writeFileSync, existsSync } = require("fs");
const { json } = require("stream/consumers");

const BinderToolPath = "D:\\eldenringdump\\BinderTool.v0.7.0-pre4\\BinderTool.exe";
const MsgPath = "D:\\eldenringdump\\Data0\\msg";
const args = process.argv;
const Language = ["engUS", "jpnJP", "zhoCN"];
const ItemDirs = Language.map((lang) => `${MsgPath}\\${lang}\\item\\msg\\${lang}`);
const MenuDirs = Language.map((lang) => `${MsgPath}\\${lang}\\menu\\msg\\${lang}`);
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
    copyTexts();
} else if (args[2] && args[2] == "json") {
    convertAllTextFilesToJson();
    // convertSingleTextFileToJson("EventTextForMap", "en");
}

function extractTextFromFmg() {
    for (let itemDir of ItemDirs) {
        let fmgs = readdirSync(itemDir);
        for (let fmg of fmgs) {
            let fmgPath = `${itemDir}\\${fmg}`;
            exec(`${BinderToolPath} ${fmgPath}`);
        }
    }
    for (let menuDir of MenuDirs) {
        let fmgs = readdirSync(menuDir);
        for (let fmg of fmgs) {
            let fmgPath = `${menuDir}\\${fmg}`;
            exec(`${BinderToolPath} ${fmgPath}`);
        }
    }
}

function copyTexts() {
    for (let dir of AllDirs) {
        let files = readdirSync(dir);
        for (let file of files) {
            for (let name of AllFileNames) {
                if (file == `${name}.txt`) {
                    console.log(file);
                    if (dir.includes("engUS")) {
                        copyFileSync(`${dir}\\${file}`, `./text/en/${name}.txt`);
                    }
                    if (dir.includes("jpnJP")) {
                        copyFileSync(`${dir}\\${file}`, `./text/jp/${name}.txt`);
                    }
                    if (dir.includes("zhoCN")) {
                        copyFileSync(`${dir}\\${file}`, `./text/zh/${name}.txt`);
                    }
                }
            }
        }
    }
}

function convertSingleTextFileToJson(name, lang) {
    let res = {};
    let filePath = `./text/${lang}/${name}.txt`;
    if (existsSync(filePath) == false) return;
    let file = readFileSync(`./text/${lang}/${name}.txt`, "utf8");
    let lines = file.split("\n");
    for (let line of lines) {
        let [number, text] = splitNumberAndText(line);
        if (text != "\t\r") res[number] = text;
    }
    let str = JSON.stringify(res);
    writeFileSync(`./json/${lang}/${name}.json`, str);
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
