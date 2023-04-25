# How does this work

Every `.json` file is an array of Rich Embeds for discord. The only major
difference to a normal Rich Embed payload is the `message_snowflake` and
the `channel_snowflake` both of which are very important.

- The `message_snowflake` defines which message to update
- The `channel_snowflake` defines which channel to update

## Things to note

- The bot must own the channel
- I've not supported every aspect of the Rich Embed payload.
  - Support for the payload is defined in the `JsonToEmbed.js` if you wish to support more fields than I have.
- I have not implemented any way to do string replacement.

## So now what?

You can now add new files to the `embeds` directory and have them automatically
added to the `+update` command. The command will then accept your json file
as it's argument so for example `+update muted` will use the `embeds/muted.json`
file. Just make sure to get the snowflakes right :D

> Good luck, have fun, don't break it please
>
> \- MiKeY
