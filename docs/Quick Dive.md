# Quick Dive
YourN3xt features & system quick dive.

## Contents
- [Quick Dive](#quick-dive)
  - [Contents](#contents)
    - [Features](#features)
      - [Log](#log)
      - [Commands](#commands)
      - [Plugin](#plugin)
    - [Information](#information)
      - [Plugin](#plugin-1)
    - [System](#system)
    - [Others](#others)

### Features
#### Log
- Customizable style
- Customizable prefix
- Customizable colors(Future plan)

#### Commands
- help
- use
- setVar(Future plan)
- errors
- plugin
- version
- exit
- run
- options
- info

#### Plugin
- Python support.
- Ability to use other plugins as a function in your plugin(Portable only)(Future plan).

### Information
#### Plugin
Template:
- name
- aliases(Future plan)
- description
- authors
- references
- platforms
- arch
- options
  - name
  - description
  - default
  - required
  - verifier(Future plan)
- portable
  - name
  - type
- disclosureDate
- createdDate(Future plan)

Constructor:
- log
- info
- dependencies

### System
- All commands are redirected to **YourN3xt.faline** function It's the one handling all the commands.
- Most of the useful codes are converted into a function so It's flexible.

### Others
- Supports python(Both External & Internal)
- Tor support(Future plan)