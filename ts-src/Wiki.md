- [ReadMe](../ReadMe.md)
- [Wiki Index](./WikiIndex.md)

# @franzzemen/rulesEngine RulesEngine Engine Wiki

Welcome to the RulesEngine Engine.  For purposes of documentation, it will be referred to as either RulesEngine Engine, ReRulesEngine or 
the RulesEngine.Engine.

## Forget The Rest, Let's Get Started!!!!

[Let's get started!](./LetsGetStarted.md)

## Status of Project

The project has moved from _experimental_ to alpha stage, anticipating to move to beta stage by December 31, 2022, and
to production readiness by March 2023 or earlier.

Features are tested and working, but the test coverage is not adequate for beta stage, documentation is in progress and
some backlog that is desired to be added is in flight.

## Release Notes

Release notes and tags are available [here](./ReleaseNotes.md)

## Installation

See [Readme](../ReadMe.md) for installation instructions.

## Contribution

If interested to be a contributor see [this](./Contribution.md)




[comment]: # (Move this somewhere else: ### Formats)

[comment]: # (Move this somewhere else)

[comment]: # (Move this somewhere else: The RulesEngine.Engine is a text interfaced rules engine, the format referred to as 
the Text Format. This means that the
primary convenient way to manipulate it from code or node command line, or other cli is to leverage it's main api with
text based rules.)

[comment]: # (Move this somewhere else: Structurally there are two other formats.)

[comment]: # (Move this somewhere else: The Reference Format is functionless object format, expressible as JSON. This 
format is most useful for document storage
of the rules and may also be for programmatic manipulation of rules.)

[comment]: # (Move this somewhere else: Text Format can be parsed by api into the Reference Format and back again.)

[comment]: # (Move this somewhere else: The third format is the Internal Format, which is the functional format. It 
contains the objects that do all the magic.
Some of the key Internal Objects expose the APIs one will most often use, but you need to know very little about them,
unless you are a code contributor.)

