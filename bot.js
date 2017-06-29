//access discord files
const Discord = require("discord.js");
const client = new Discord.Client();
//access discord bot token
const settings = require ("./settings.json");
//google API things
const google = require("googleapis")
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

//prefix for bot commands
const prefix = ">raid ";
//store any response string
var string;
var string2;
var string3;
//store the range of cells to get
var sheetRange;
//possible raid days
var raidDays = ["Friday", "Saturday", "Sunday"];
//boolean to stop certain actions
var keepGoing;

//all 6 BT functions
//day = appropriate raidDay index value
function btRoster(day, msg) {
  //set the range for the get request
  sheetRange = day + "!A2:K29";
  //get the roster data from the appropriate spreadsheet
  return sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange
  }, (err, response) => {
    if (err) console.console.error("There was an error");
    //raid message header
    string = '```=====' + day + " Raid" + "=====\n";
    // string += '==' + "Name-Class \t ~Buff/Rez/Iframe" + "\n"
    string += response.values[0][0] + '========';
    //read each member details
    for (var i = 1; i < response.values.length; i++) {
      //handle Pt # vs name and class
      if (i % 7 == 0) {
        //add Party # to the string
        string += "\n" + response.values[i][0] + '========';
      } else {
        //add names to the string
        string2 = "\n" + (i-Math.floor(i/7)) + ". " + response.values[i][0]
          + "-" + response.values[i][3];
        //try to line up spacing for the party traits
        while (string2.length < 23) string2 += " ";
        string += string2;
      }
      //only print party trait if player has one
      for (var j = 5; j < response.values[i].length; j+=2) {
        if (response.values[i][j] != '') {
          if (response.values[i][j] == 'Y') {
            string += "~Heals ";
          } else {
            string += "~" + response.values[i][j] + " ";
          }
        }
      }
    }
    string += "```";
    //print the roster to the channel
    msg.channel.send(string);
  })
}

function venomskyMechs(day, msg) {
  //set the range for the get request
  sheetRange = day + "!A33:E50";
  return sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange
  }, (err, response) => {
    var string = '```=====' + "First Boss Mechanics" + "=====\n";
    //90% adds
    string += response.values[0][0] + '=====';
    //names, 60 and 30%
    for (var i = 1; i < response.values.length; i++) {
      //handle phase vs add position
      if (response.values[i][2] == null) {
        //phase %
        string += "\n" + response.values[i][0] + "=====";
      } else {
        //add position and PT/names
        string += "\n" + response.values[i][0]
          + " - " + response.values[i][2];
      }
    }
    string += "```";
    //actually send mssg to channel
    msg.channel.send(string);
  })
}

function nightfallMechs(day, msg) {
  //set the range for the get request
  sheetRange = day + "!H33:K45";
  return sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange
  }, (err, response) => {
    var string = '```=====' + "Second Boss Mechanics" + "=====\n";
    //Soul Sep Line
    string += response.values[0][0] + "=====\n";
    //Party 1 SS people
    string += "-" + response.values[1][0] + "\n";
    for (var i = 2; i < 5; i++) {
      //string2 is an attempt to line up the spacing
      string2 = response.values[i][0];
      while (string2.length < 11) string2 += " ";
      string2 += response.values[i][2] + "\n";
      //add the party 1 ss people to the string
      string += string2;
    }
    //secondary SS people
    string += "-" + response.values[9][0] + "\n";
    for (var i = 10; i < 13; i++) {
      string += response.values[i][0] + "  -  " + response.values[i][2] + "\n";
    }
    //outside tanks
    string += response.values[5][0] + "=====\n";
    for (var i = 6; i < 9; i++) {
      string += response.values[i][0] + "  -  " + response.values[i][2] + "\n";
    }
    string += "```";
    //actually send mssg to channel
    msg.channel.send(string);
  })
}

function generalsMechs(day, msg) {
  //set the range for the get request
  sheetRange = day + "!N55:Q74";
  //string1 = blue boss, string2 = red boss
  return sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange
  }, (err, response) => {
    var string = '```=====' + "Third Boss Mechanics" + "=====\n";
    //boss mechs
    //blue boss line
    string += response.values[1][0] + '=====\n';
    //red boss line
    var string2 = response.values[1][2] + '=====\n';
    //Rez Roles
    string += "-Resses: " + response.values[2][0] + ", " + response.values[3][0] + '\n';
    string2 += '-Resses: ' + response.values[2][2] + ", " + response.values[3][2] + '\n';
    //DPS roles per boss
    string += "-DPS:\n";
    string2 += "-DPS:\n";
    for (var i = 5; i < 15; i+=2) {
      //string3 is temporarily used to maintain uniform spacing
      //blue boss
      string3 = response.values[i][0];
      while (string3.length < 13) string3 += " ";
      string3 += response.values[i+1][0] + "\n";
      string += string3;
      //red boss
      string3 = response.values[i][2];
      while (string3.length < 13) string3 += " ";
      string3 += response.values[i+1][2] + "\n";
      string2 += string3;
    }
    //sacrifices
    string += "-" + response.values[15][0] + ": " + response.values[16][0] + "\n";
    string2 += "-" + response.values[15][0] + ": " + response.values[16][2] + "\n";
    //aerial shotcallers
    string += "-" + response.values[17][0] + ": " + response.values[19][0] + "\n";
    string2 += "-" + response.values[17][0] + ": " + response.values[18][0] + "\n";


    //actually send mssg to channel
    string += string2;
    string += "```";
    msg.channel.send(string);
  })
}

function ravenMechs(day, msg) {
  //set the range for the get request
  sheetRange = day + "!N1:Q29";

  return sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange
  }, (err, response) => {
    var string = '```=====' + response.values[0][0] + "=====\n";
    //outer adds
    string += response.values[1][0] + '=====\n';
    //86,56,26%s
    for (var i = 2; i < 11; i+=3) {
      //% add header
      string += "-" + response.values[i][0] + '\n';
      //handle the 8 people per add
      for (var j = 0; j < 8; j++) {
        //string2 handles the 8 people individually
        string2 = response.values[i+1+Math.floor(j/4)][j%4];
        //adjust to uniform spacing
        while (string2.length < 13) string2 += " ";
        //make a new line after 4 names
        if ( (j+1)%4 == 0) string2 += "\n";
        //add the name to the output string
        string += string2;
      }
    }
    //innner adds
    string += response.values[11][0] + '=====\n';
    //86 and 56%
    for (var i = 12; i < 16; i+=3) {
      string += "-" + response.values[i][0] + ' adds\n';
      string += response.values[i+1][1] + '\n'
        + response.values[i+2][0] + '\n'
        + response.values[i+2][2] + '\n'
    }
    //26% header
    string += "-" + response.values[18][0] + ' adds\n';
    //print the (up to) 6 names of 26% people
    for (var i = 0; i < 8; i++) {
      //check if cell is empty
      if (response.values[19+Math.floor(i/4)][i%4] == null) {
        //do nothing
      } else {
        //string2 is the individual name
        string2 = response.values[19+Math.floor(i/4)][i%4];
        //apply uniform spacing
        while (string2.length < 13) string2 += " ";
        //create a new line after the 4th name
        if ((i+1)%4 == 0) string2 += "\n";
        //add individual name to the response string
        string += string2;
      }
    }
    string += "\n";
    //Other Roles
    string += "-" + response.values[21][0] + '\n';
    //stack caller
    string += response.values[22][0] + ': ' + response.values[23][0] + '\n';
    //calling boss rotations
    string += response.values[24][0] + ': ' + response.values[25][0]
      + ", " + response.values[26][0] + "\n";
    //RK TANK
    string += response.values[27][0] + ': ' + response.values[28][0] + '\n';

    string += "```";
    //actually send mssg to channel
    msg.channel.send(string);
  })
}

function btRaidOptions(chosenOption, day, msg) {
  //based on the chosen option, print the approrpriate roster
  switch (chosenOption) {
    case "roster":
      btRoster(day, msg);
      break;
    case "1":
      venomskyMechs(day, msg);
      break;
    case "2":
      nightfallMechs(day, msg);
      break;
    case "3":
      generalsMechs(day, msg);
      break;
    case "4":
      ravenMechs(day, msg);
      break;
    default:
      msg.reply("I don't think that Spire option exists. If lost, use '>raid help'.");
  }
}

function btRosterList(raidDays,msg) {
  //print rosters for all BT raids
  for (var i = 0; i < raidDays.length; i++) {
    btRoster(raidDays[i],msg);
  }
}

//general raid functions
function searchPlayerBT(name, msg) {
  //start the return message
  string = "```" + name + "'s BT raid day(s):\n";

  var nameRaids = [];

  //iterate through all the raid days
  for (var i = 0; i < raidDays.length; i++) {
    //one get request per raid day roster every 500ms
    setTimeout(searchPlayerHelper, 500, name, msg, i, nameRaids);
  }

  for (var day in nameRaids) {
    string += day;
  }

  string += "```\n";

  msg.channel.send(string);
}

function searchPlayerHelper(name,msg, index, nameRaids) {
  //set the range for the get request
  sheetRange = raidDays[index] + "!A3:A29";

  //one get request per raid day roster
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange
  }, (err, response) => {
    if (err) console.log(error);

    //search the roster for the name
    for (var j = 0; j < response.values.length; j++) {
      //if theyre in the roster they raid on this day
      if (response.values[j][0] === name) {
        //should only print one message
        nameRaids.push(raidDays[index]);
        console.log(nameRaids[index]);
      }
    }
  })
}

//misc. functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        btRaidOptions(args[1], raidDays[0],msg);
        break;
      case "bt2":
        btRaidOptions(args[1], raidDays[1],msg);
        break;
      case "bt3":
        btRaidOptions(args[1], raidDays[2],msg);
        break;
      case "bt":
        if (args[1] == "rosters") {
          btRosterList(raidDays,msg);
          break;
        }
      default:
        msg.reply("Don't think that Spire option exists. If lost, use '>raid help'.");
    }
  } else
  //search for a player in the raid rosters
  if (msg.content.startsWith(prefix + 'search')) {
    if (args[1] != null) {
      searchPlayerBT(capitalizeFirstLetter(args[1]),msg);
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
      + "\t<raid#>: 'bt1' = Friday, 'bt2' = Saturday, 'bt3' = Sunday\n";
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
    string += "\tex. '>raid bt1 4' => Friday RK Mechs\n"
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
