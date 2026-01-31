# Adding Terminal Easter Eggs

You can add custom easter egg commands to the in-game terminal by editing the JSON file at:

    assets/data/terminal-eastereggs.json

## Format
Each entry in the file should be an object with two fields:
- `command`: The command string the user must type (case-insensitive).
- `response`: The message that will be displayed in the terminal when the command is entered.

Example:

[
  {
    "command": "xyzzy",
    "response": "Nothing happens. (But you feel a strange sense of nostalgia.)"
  },
  {
    "command": "hello",
    "response": "Hi there, agent!"
  }
]

## Steps
1. Open the file: assets/data/terminal-eastereggs.json
2. Add a new object to the array with your desired command and response.
3. Save the file and reload the game/terminal.

Your new command will now work in the terminal!