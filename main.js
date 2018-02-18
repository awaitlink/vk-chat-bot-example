const ChatBot = require('vk-chat-bot') // vk-chat-bot library
const moment = require('moment') // For easy time formatting

const port = process.env.PORT // Server port

var params = {
  vk_api_key: process.env.VK_API_KEY,
  confirmation_token: process.env.CONFIRMATION_TOKEN, // Can be found in group Callback API settings
  group_id: process.env.GROUP_ID, // Can be found in group Callback API settings
  secret: process.env.SECRET, // Secret key, set it in group Callback API settings

  cmd_prefix: process.env.CMD_PREFIX // Command prefix, optional
}

var bot = new ChatBot(params) // Initialize the bot

bot.on('message_allow', $ => {
  $.text('Hello, thanks for allowing us to send you messages.')
  // $.send() is called automatically after the handler
})

bot.on('message_edit', $ => {
  $.text('You edited a message, now it looks like this: ' + $.msg)
})

bot.on('no_match', $ => {
  $.text("I don't know how to respond.")
})

// If cmd_prefix is "/", we search for "/help" in the beginning of the message
bot.cmd('help', 'shows the help message', $ => {
  // bot.help() returns the full help message
  $.text('Test Bot v1.0' + bot.help())

  // Attach a nice image from https://vk.com/team?z=photo6492_456240778
  $.attach('photo', 6492, 456240778)
})

bot.cmd('now', 'reports the current date and time in UTC', $ => {
  // Format time using 'moment' library
  var now = moment().utc().format('MMMM Do YYYY [(]dddd[)] hh:mm:ss A')

  $.text('It is ' + now + ' UTC now.')
})

bot.cmd('info', 'gets some information about you', $ => {
  // Call VK API to get information about the user
  $.api.scheduleCall('users.get', { user_ids: $.uid }, (json) => {
    var userInfo = json.response[0]

    var name = userInfo.first_name
    var surname = userInfo.last_name

    $.text('User ID: ' + $.uid + '\nName: ' + name + ' ' + surname)

    // Because the API request may finish after the handler,
    // make sure to send() the message
    $.send()
  })
})

// When the message contains a word "hi", "hello" or "hey"
// Ignoring case with /i
bot.regex(/h(i|ello|ey)/i, $ => {
  $.text('Hello, I am a test bot. You said: ' + $.msg)
})

bot.start(port)
