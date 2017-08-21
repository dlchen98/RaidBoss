//access discord files
const Discord = require("discord.js");
const client = new Discord.Client();
//access discord bot token
const settings = require ("./settings.json");

//google API things
const google = require("googleapis");
const credentials = require("./credentials.json");
const sheets = google.sheets('v4');
//acess Low BT Test spreadsheet
//Low BT test sheet
// const spreadsheetId = '1l8G5b2nIdnem8VVDT38-vMC4ZV-smypmXUMGE03kL-U';
//actual Low BT Sheet
const spreadsheetId = '1ExiLg3TrSTdTSEQk3VFWSMr7TLgwRkA8-0ZazfUKFU8';
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  [
    'https://www.googleapis.com/auth/spreadsheets'
  ],
  null
);
google.options({auth});

//access Skybreak Spire/Black Tower raid functions
var btFunctions = require("./btFunctions.js");
//access Temple of Eluvium raid functions
var vtFunctions = require("./vtFunctions.js");
//access general misc. functions to help parse get request data
var misc = require("./miscFunctions.js");

//prefix for bot commands
const prefix = ">raid ";
//store any response string
var string;
var string2;
var string3;
//store the range of cells to get
var sheetRange;
//BT Raid Days
var raidDays = ["Wednesday", "Thursday", "Early Fri.", "Late Fri."];
//VT raidsv
var vtRaids = ["VT1","VT2","VT3"];

//bot login message
client.on('ready', () => {
  //print to the CMD
  console.log(`Logged in as ${client.user.username}!`);
});

//bot actions
client.on('message', msg => {
  //only continue if the bot prefix is used
  if (!msg.content.startsWith(prefix)) return;
  //run only if it's not replying to a bot
  if (msg.author.bot) return;
  //save any extra args after the instruction
  var args = msg.content.split(' ').slice(1);
  //concatonate all the extra args
  var result = args.join(' ');

  //check if user wants to see something BT related
  //also check if command has valid # of parameters
  if (args[0].startsWith("bt") && args[1] != null) {
    //decide which raid day it is
    switch(args[0]) {
      case "bt1":
        btFunctions.btRaidOptions(args[1], raidDays[0],msg, sheets, spreadsheetId);
        break;
      case "bt2":
        btFunctions.btRaidOptions(args[1], raidDays[1],msg, sheets, spreadsheetId);
        break;
      case "bt3":
        btFunctions.btRaidOptions(args[1], raidDays[2],msg, sheets, spreadsheetId);
        break;
      case "bt4":
        btFunctions.btRaidOptions(args[1], raidDays[3],msg, sheets, spreadsheetId);
        break;
      case "bt":
        if (args[1] == "rosters") {
          btFunctions.btRosterList(raidDays,msg, sheets, spreadsheetId);
          break;
        }
      default:
        msg.reply("Don't think that Spire option exists. If lost, use '>raid help'.");
    }
  } else
  //VT related thingymajigies
  if (args[0].startsWith("vt") && args[1] != null) {
    //decide which raid day it is
    switch(args[0]) {
      case "vt1":
        vtFunctions.vtRaidOptions(args[1], vtRaids[0],msg, sheets, spreadsheetId);
        break;
      case "vt2":
        vtFunctions.vtRaidOptions(args[1], vtRaids[1],msg, sheets, spreadsheetId);
        break;
      case "vt3":
        vtFunctions.vtRaidOptions(args[1], vtRaids[2],msg, sheets, spreadsheetId);
        break;
      default:
        msg.reply("Don't think that Temple option exists. If lost, use '>raid help'.");
    }
  } else
  //search for a player in the raid rosters
  if (msg.content.startsWith(prefix + 'search')) {
    if (args[1] != null) {
      //make the entire query name lowercase
      string = args[1].toLowerCase();
      //add on any extra words (ie 'The RNGsus')
      for (var i = 2; i < args.length; i++) {
        string += " " + args[i].toLowerCase();
      }
      //search the BT rosters for queried name
      btFunctions.searchPlayerBT(string,msg, sheets, spreadsheetId, raidDays);
    } else {
      msg.channel.send("Did you gimme a name? If lost, use '>raid help'.");
    }
  } else
  //reply with list of possible instructions
  if (msg.content.startsWith(prefix + 'help')) {
    misc.cmdListHelp(msg,string,string2);
  }else {
    msg.reply("I don't follow. If lost, use '>raid help'.")
  }

});

client.login(settings.token); //keep bot token login hidden

//node bot.js in cmd to run the bot in discord
