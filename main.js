const ChatBot = require('vk-chat-bot') // vk-chat-bot library
const moment = require('moment') // For easy time formatting

const port = process.env.PORT // Server port

var params = {
  vk_token: process.env.VK_API_KEY,
  confirmation_token: process.env.CONFIRMATION_TOKEN, // Can be found in group Callback API settings
  group_id: process.env.GROUP_ID, // Can be found in group Callback API settings
  secret: process.env.SECRET, // Secret key, set it in group Callback API settings

  cmd_prefix: process.env.CMD_PREFIX // Command prefix, optional
}

var bot = new ChatBot(params) // Initialize the bot

bot.on('message_edit', $ => {
  $.text('You edited a message, now it looks like this: ' + $.msg)
})

// If cmd_prefix is "/", we search for "/help" in the beginning of the message
bot.cmd('help', $ => {
  // bot.help() returns the full help message
  $.text('Test Bot v1.0' + bot.help())

  // Attach a nice image from https://vk.com/team?z=photo6492_456240778
  $.attach('photo', 6492, 456240778)
}, 'shows the help message')

bot.cmd('keyboard', $ => {
  var Keyboard = $.kbd.Keyboard
  var Button = $.kbd.Button
  var colors = $.kbd.colors

  // Set 'true' instead of 'false' to make it disapper after a button was pressed
  var kbd = new Keyboard([
    // Rows
    [
      new Button('Default'),
      new Button('Primary', colors.primary),
      new Button('Negative', colors.negative),
      new Button('Positive', colors.positive)
    ],
    [
      new Button('Maximum rows is 10, columns - 4.')
    ],
  ], false)

  $.text('Here is your keyboard, as promised.')
  $.keyboard(kbd)
}, 'demo keyboard')

bot.cmd('rmkbd', $ => {
  $.text('Ok, ok, no keyboard for you.')
  $.removeKeyboard()
}, 'removes keyboard')

bot.cmd('now', $ => {
  // Format time using 'moment' library
  var now = moment().utc().format('MMMM Do YYYY [(]dddd[)] hh:mm:ss A')

  $.text('It is ' + now + ' UTC now.')
}, 'reports the current date and time in UTC')

bot.cmd('info', async $ => {
  var uid = $.obj.from_id
  // Call VK API to get information about the user
  var response = await $.api.scheduleCall('users.get', { user_ids: uid })
  var userInfo = response[0]

  var name = userInfo.first_name
  var surname = userInfo.last_name

  $.text(`User ID: ${uid}\nName: ${name} ${surname}`)
}, 'uses VK API to get some information about you')

// When the message contains a word "hi", "hello" or "hey"
// Ignoring case with /i
bot.regex(/h(i|ello|ey)/i, $ => {
  $.text('Hello, I am a test bot. You said: ' + $.msg)
})

bot.on('no_match', $ => {
  $.text("I don't know how to respond.")
})

bot.on('message_allow', $ => {
  $.text('Hello, thanks for allowing us to send you messages.')
  // $.send() is called automatically after the handler
})

bot.on('message_typing_state', $ => {
  $.text('Type faster please, I can\'t wait to see your message!')
})

bot.on('handler_error', $ => {
  $.text("Oops, looks like something went wrong.")
})

bot.noEventWarnings() // Prevent warnings about missing event handlers

bot.start(port)
