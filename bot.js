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

//TODO do i need to return the get request?

var btFunctions = require("./btFunctions.js");

//prefix for bot commands
const prefix = ">raid ";
//store any response string
var string;
var string2;
var string3;
//store the range of cells to get
var sheetRange;
//possible raid days
var raidDays = ["Wednesday", "Friday", "Saturday", "Sunday"];

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
    //build the beginning of the PM of possible instructions
    string = "```Raid Boss Commands:\n"
      + "Please use \">raid\" before any command.\n\n";
    //Handle BT Raid instructions
    string += "Black Tower/Skybreak Spire - Format: <raid#> <extra argugment>\n"
      + "\t<raid#>: 'bt1' = Wednesday, 'bt2' = Friday, 'bt3' = Saturday, 'bt4' = Sunday\n";
    //arrays to hold individual BT raid commands
    var btArgs = ["roster", "1", "2", "3", "4"];
    var btArgDescriptions = ["list of all raiders\n",
        "roles for Venomsky Drake\n",
        "roles for Nightfall Imperators\n",
        "roles for Generals\n",
        "roles for Raven King\n",]
    for (var i = 0; i < btArgs.length; i++) {
      string2 = "\t" + btArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += btArgDescriptions[i];
      string += string2;
    }

    //arrays to hold general BT raid commands
    var btGeneralArgs = ["rosters"];
    var btGeneralDescriptions = ["display all BT raid rosters\n"];

    //example for people
    string += "\tex. '>raid bt1 4' => Wednesday RK Mechs\n"
    //miscellaneous commands for all raids or something
    string += "  Misc - Format: bt <extra argument>\n";
    for (var i = 0; i < btGeneralArgs.length; i++) {
      string2 = "\t" + btGeneralArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += btGeneralDescriptions[i];
      string += string2;
    }
    //example
    string += "\tex. '>raid bt rosters' => all BT raid rosters\n";

    //arrays to hold general commands
    var generalArgs = ['search'];
    var generalDescriptions = ['find raid day for a char (not case-sensitive)\n'];

    string += "General Commands - Format: <command> <extra arg>\n"

    for (var i = 0; i < generalArgs.length; i++) {
      string2 = "\t" + generalArgs[i];
      while (string2.length < 10) {
        string2 += " ";
      }
      string2 += generalDescriptions[i];
      string += string2;
    }
    //example
    string += "\tex. '>raid search XScarlyt' => Scar's raid day(s)\n";

    //TODO: FUTURE INSTRUCTION GUIDE HERE

    string += "```";
    msg.channel.send(string);
  }else {
    msg.reply("I don't follow. If lost, use '>raid help'.")
  }

});

client.login(settings.token); //keep bot token login hidden

//node bot.js in cmd to run the bot in discord
