#RulesEngine Engine
The RulesEngine Engine is the top most concept.  Underneath the covers, the RulesEngine Engine is a RulesEngine singleton accessed 
through its static member Engine:

    RulesEngine.Engine

For the remainder of this documentation the RulesEngine Engine is referred to in this notation.

##Text Parsing
There are several ways to initiate the top level parser.  For the purposes of this section we assume the following API

    RulesEngine.Engine.parse(remaining: string, executionContext?: LogExecutionContext): RulesEngineReference

This API parses a full or partial rule and returns it as a RulesEngine.Engine Reference.  It does not load the RulesEngine.
Engine with the results.



The text format begins with the text for the RulesEngine.Engine itself.  By default, that text is simply empty string:

    ''

This is also true of a RuleSet and a Rule.  The implication is that these exist but nothing special has been defined 
on them.

Thus, in the following Condition

    "AAL" like stock.ticker

it is inferred that there is a RulesEngine.Engine and a default RuleSet (see [RuleSet](../rule-set/rule-set.md)).

It is possible to load options into the RulesEngine.Engine programmatically.  It is also possible to include those options 
in the RulesEngine.Engine hints.  Without options the RulesEngine.Engine hints look like empty options with the prefix "rulesEngine":

    <<rulesEngine>>

While it is perfectly legal to include <<rulesEngine>> one would normally not have a reason to do so.

Hints can be used to load custom elements and other settings into the rules engine.  When loaded at the 
RulesEngine.Engine level, these apply anywhere in the rules engine.  Note that previously loaded custom elements are not 
overwritten.  To remove elements...TODO

There are two ways to specify options at the RulesEngine.Engine level.  (Options can 
also be added programmatically of course).

First the full options structure, in which everything is 'optional' can be provide:
only include what you want:
THIS IS NO LONGER THE RIGHT FORMAT
    <<rulesEngine options={
        "dataTypes": [{
            "typeRef": {
                "refName": "Stock",
                "module": {
                    "moduleName": "../../../stock-data-type",
                    "constructor": "StockDataType"
                }
            },
            "literalParserRef": {
                "refName": "StockParser",
                "module": {
                    "moduleName": "../../../stock-parser",
                    "functionName": "getStockParser"
                }
            }
        }],
        functionExpressions: [],
        etc.
    }>> {price: 5.0, PERation: 20.0} is worse than hotStock

The various options are described in [Options](../option.md)

As with all hints, only one hint key is allowed; however if you have both "options" and one of its sub-elements in 
the hint, for example "data-types", both will be loaded.  The second time the RulesEngine.Engine encounters the same 
element definition, it will be ignored (a warning will be logged.)
