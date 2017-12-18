const ChatBot = require('vk-chat-bot');

// For easy time formatting
const moment = require('moment');

// Server port
const port = process.env.PORT;

var params = {
  vk_api_key: process.env.VK_API_KEY,

  // Confirmation parameters, can be found in group Callback API settings
  confirmation_token: process.env.CONFIRMATION_TOKEN,
  group_id: process.env.GROUP_ID,

  // Secret key, set it in group Callback API settings
  secret: process.env.SECRET,

  // Command prefix, optional
  cmd_prefix: process.env.CMD_PREFIX
}

// initialize the bot
bot = new ChatBot(params);

// When user allowed to send messages to him
bot.on("message_allow", ($) => {
  $.text("Hello, thanks for allowing us to send you messages.");
});

// If no matching handler is found
bot.on("no_match", ($) => {
  $.text("I don't know how to respond to your message.");
});

// Example: if cmd_prefix is "/", we search for "/test"
bot.cmd("test", "sure thing tests something", ($) => {
  $.text("Test success! Your message content was: '" + $.msg + "'.");
});

// Example: if cmd_prefix is "/", we search for "/help"
bot.cmd("help", "shows the help message", ($) => {
  // bot.help() returns the help message
  $.text("Test Bot v1.0" + bot.help());
});

// When the message contains a word "hi", "hello" or "hey"
// Ignoring case with /i
bot.regex(/h(i|ello|ey)/i, ($) => {
  $.text("Hello, I am a test bot. You said: " + $.msg);
});

bot.cmd("now", "reports the current date and time in UTC", ($) => {
  var m = moment(); m.utc(); now = m.format('MMMM Do YYYY [(]dddd[)] hh:mm:ss A');
  $.text("It is " + now + " UTC now.");
});

bot.start(port);
