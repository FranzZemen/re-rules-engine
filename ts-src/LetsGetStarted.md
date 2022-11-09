- [ReadMe](../ReadMe.md)
- [Wiki](./ts-src/Wiki.md)
- [Wiki Index](./WikiIndex.md)

# Let's Get Started

We'll start with examples of rules.

Assume you have variable stock data streaming, at least some of the format looks like:

    interface StockDomain1 {
        previousTicker: StockDomain1,
        ticker: string,
        price: number,
        peRatio: number,
        canTrade: boolean,
        tradedToday: boolean,
        lastTick: string,
        reference: number,
        history?: {price: number, timestamp: string}[]
    }

And an instance of the stream looks like:

    const domain:StockDomain1 = {
      previousTicker: {
        ticker: 'JPM',
        price: 100.0,
        lastPrice: 99.90,
        peRation: 15.0,
        canTrade: false,
        tradedToday: false,
        lastTick: '2020-10-24T08:45:00',
        reference: 745
      }
      ticker: 'ZEM',
      price: 5.0,
      lastPrice: 4.9,
      peRatio: 20.0,
      canTrade: true,
      tradedToday: false,
      lastTick:'2020-10-24T09:30:00',
      reference: 1956,
      history: [{
        price: 4.9, timestamp: '2020-10-24T08:24:00'
      },{
        price: 4.7, timestamp: '2020-10-24T07:35:00'
      },{
        price: 5.1, timestamp: '2020-10-24T06:00:00'
      }]
    }

## Simple Condition Examples

### Attribute Compared To Value

    'canTrade is true'

### Attribute Compared to Attribute

    'price > lastPrice'                               // Data type determined at runtime (allowUnknownTypes: true)

    '<<ex data-type=Float>> price > lastPrice'        // Data type determined at parse time

### Attribute Compared to Nested Value

    'peRatio >= previousTicker.peRation'

### Attribute Compared to Nested Value

    'price > history[2].price'

### Timestamp comparisons

    'lastTick m> history[2].timestamp'

## Logical Conditions Example

### Simple And

    'canTrade = true and price > lastPrice'

### Simple Or

    'price > lastPrice or peRatio < 15.0'

### And and Or

    'canTrade = true and price > lastPrice or peRatio < 15.0'  // True if canTrade and either price > lastPrice or peRatio < 15.0

### Nesting

    '(canTrade = true and price > lastPrice) or peRatio < 15.0' // True if both canTrade and price < lastPrice OR if peRatio < 15.0

### Unlimited Nesting

    'canTrade and ((price > lastPrice or peRation < 15.0) and previousTicker.tradedToday = false)'

## Formula Expressions

### Simple Formula With Nested Attribute And Value Expressions

    '#[peRatio / price * 1.256 - 1.0] < 49.0'

### Nested Formulas

    '#[peRatio / #[price * 5]] <= 35.0'

## Function Expressions

### Parameterless Function

    '@Funds > #[10000.0 * price]

### Function with Parameters

    '@Stochastic[ticker, 4.0] < 49%'

### Function With Complex Parameters

    '@Stochastic[@BestCompetitor[ticker, #[4.0 * price * @CustomVariance]] < 35%

## Sets

### In Example
    
    'price in [3.5, 4.9, 5.0]'

### Synonyms

    '[3.5, 4.9, 5.0] contains price'

### In With Attributes

    'price not in [3.5, 4.9, history[0].price]]'





If want to execute a rule so that you can take action on it.  See Example 1:

    let result = RulesEngine.Engine.execute(domain, 'price < 6.99 and reference = 1956').result as ReResult;
    log.info({},`result.valid is ${result.valid}`);
    if(result.valid) {
      ...
    }
    

Then log output might look something like this:

    2022-10-17T02:23:10.726 INFO:
    {
      message: 'result.valid is true',
      repo: 'rulesEngine',
      sourceFile: 'documentation.test',
      method: 'Example 1',
      data: {}
    }





You desire to take some action if the ticker = "ZEM" and the price is greater than $5. You decide to externalize this
decision, potentially to allow a user through UI to alter the ticker and/or price. Instead of writing custom code for
that functionality alone, you will leverage the RulesEngine Engine, so you have a standardized externalized way of quickly
making critical business logic changes.

You decide you need to know when the price is greater than 5.0 for a ticker called "ZEM". The rule you write for this
decision point is:

    ticker = "ZEM" and price > 5.0

The rule might be executed using the following API:

    if(RulesEngine.Engine.awaitRuleExecution(dataDomain, 'ticker = "ZEM" and price > 5.0')) {
        // log the result
    }

    where data is an instance of the shape you are evaluationg, for example

    {ticker: "ZEM", price: 6.0} ---> valid
    {ticker: "ZEM", price: 5.0} ---> invalid
    {ticker: "ZEM", price: 4.0} ---> invalid

You could parametrize the above, potentially linking the editing capability to a UI and allowing analysts to vary 
the parameters themselves, or even allow them to build entirely new rules.

The main advantage to this approach is that critical sequences of business logic can be programmed in an orderly manner
once for any rule condition that may appear later. You are not changing the logic, just the decision criteria.

Looking at our rule...

    ticker = "ZEM" and price > 5.0

...you'll notice a few things that should be familiar.  First, it has two expressions, one comparing ticker and the 
other price.  It also has a logical combination shown by the logical operator "and".  In other words, both 
expressions must be true.  The rule makes use of comparators "=" and ">", and finally it seems to magically operate 
on attributes "ticker" and "price".  

In fact to the RulesEngine Engine, this 'rule' contains a Logical Condition **_A and B_**, a Condition **_ticker = 
"ZEM"_**, a Condition **_price > 5.0_**, and the Expressions **_ticker_**, **_"ZEM"_**, _**price**_ and **_5.0_**.  
However, to you it was just a natural language format that you have seen likely many times.

Some of the magic of this RulesEngine Engine (beyond just being a rules engine) is that its _Text Format_ is very 
English-like, and makes building rules intuitive.  Behind the scenes it parses the Text Format into more easily 
manipulated formats.  More on that later; users of the RulesEngine Engine will most likely deal predominantly with the 
Text Format.

## Introducing Whitespace and Other Formatting Concepts

Give the primary use case involves the Text Format, it is worth describing up front how white space is used in rule 
constructs, because with complex rules formatting becomes important to readability.

In this section, we'll make liberal use of terms we haven't yet defined; we just want to focus on the conventions for 
whitespace, and we'll define unknown terms elsewhere.

Generally rules are described using text. In our documentation we show that text unquoted, for example:

    ticker = "ZEM" and price > 5.0

Of course, if we wrote down that as text in a system that needs literal text to be quoted, say Javascript, we'd need to
put quotes around the text literal. When doing so, use single quotes, since double quotes are used inside of rule
constructs:

    const myRuLe = 'ticker = "ZEM" and price > 5.0'

If you'rulesEngine storing and manipulating rules in another language, make sure to honor the internal double quotes, even if you
need to escape them!

Moreover, the RulesEngine Engine accepts the common whitespace codes including the space, the tab, the newline and the
carriage return, in any quantity. Where there is a limitation, the documentation will make that clear.

For example, leveraging the multi-line quote in Typescript the rule can be written as:

    `ticker = "ZEM"
        and
     price > 5.0`

Hints (to be defined elsewhere) can also be multi-line and whitespace is allowed around the "=" symbol:

    <<ex
      type = Attribute
      data-type
      =
      Float
    >> price > 5.0

Of course, one would use whitespace to make the rule more legible, unlike the contrived example above.

## Introducing Logical Conditions, Logical Operators, Conditions, Expressions, Comparators and Operators

The above rule construct...

    ticker = "ZEM" and price > 5.0

is known as a Logical Condition. In fact, it is the intersection of two smaller constructs known as Conditions,
intersected with the logical operator "and". There are four Logical Operators in the RulesEngine Engine, from which all
logical combinations can be made (with helper brackets - below). The four Logical Operators are:

- and
- and not
- or
- or not

Returning to the rule construct, we break down the Logical Condition into two "Conditions":

    ticker = "ZEM"                  // A Condition
    price > 5.0                     // A Condition
    ticker = "ZEM" and price > 5.0  // A Logical Condition

Despite the naming similarities, Logical Conditions and Conditions are two separate things entirely.  A Logical 
Condition is a construct that combines or excludes (and/or) other constructs, including itself.  For example, if A, 
B, C, D and E are other constructs then..

    A or B and (C or D) and E 

...is a Logical Condition.  Here, C might also be a Logical Condition, for example:

    C:  F and not G

making the first Logical Condition...

    A or B and ((F and not G) or D) and E

A Logical Condition, at run-time, always evaluates to either true or false.

A Condition is a construct that is most of often contained in a Logical Condition and is simply a rule 
construct that compares two expressions using a Comparator.  It is either true or false.  A Condition has a Right 
Hand Side (RHS) and a Left Hand Side (LHS) Expression, so we say that a Condition is...

    A Left Hand Side Expression (LHS) Compared To A Right Hand Side Expression (RHS)

An Expression simply expresses data; it can however be as simple as a constant, as powerful as an attribute, or as 
complex as a Formula or Function, among other things.

In our rule...

    ticker = "ZEM" and price > 5.0

...there are 4 Expressions: 

- ticker
- "ZEM"
- price
- 5.0

Both ticker and price are known as Attribute Expressions, as they point to an attribute in the data domain.  "ZEM" 
and 5.0 are Value Expressions as they have explicit constant values.  

Virtually all the rules one will build will leverage Attribute and Value Expressions; they are the most common kind. 
There are other types of Expressions, for example Function Expressions:

    @MultiplyInput[price, 0.5]

This is a contrived Function Expression that behind the scenes invokes a function that multiplies price by 0.5 and 
returns the result.  One thing to note here is that price and 0.5 are also Expressions.  In other words, advanced 
Expressions can themselves contain Expressions.  Expressions have a universal construct to represent data that makes 
them very convenient, even outside of Conditions themselves.

Another example of an Expression is a Formula Expression.  A simple example of a Formula Expresson is:

    @+[(price * 0.5)

By coincidence does the exact same thing as the Function Expression, but is explicit about multiplying the price 
Attribute Expression by the 0.5 Value Expression using the Operator "*".

In general operator oriented calculations are best expressed as Formula Expressions, while other calculations, even 
asynchronous ones, are best expressed by Function Expressions.

Let's blow your mind:

    @+[@MultiplyInput[price, 0.5] * 2]

Is a Formula Expression that operates on a Function Expression and Value Expression that leverages an attribute 
Expression which itself leverages a Attribute Expression and a Value Expression.  All of this is legal in the RulesEngine 
Engine, and why we created the Text Format.  Just try and imagine what this would look like in JSON (actually, the 
RulesEngine Engine can convert this text to JSON).

There are other, rarer types of Expressions that you may need, these are covered in detailed documentation on 
Expressions.

## Introducing Data Types

The typed oriented engineers will realize there is a glaring omission in the previous section, and that is features 
on data types.  In fact, data types are a first class concept in the RulesEngine Engine.

Data types drive several behaviors and features, most importantly that comparisons of Expressions are limited to 
identical data types.  It makes little sense, without some form of explicit or implicit conversion to compare text to a 
number.  

The RulesEngine Engine provides for the expected standard data types.  At the same time, basic data types are insufficient to 
express and one of the powerful features of the RulesEngine Engine is the ability to easily create and use more complex data 
types.

The basic or "standard" data types are:

- Text
- Number (integer)
- Float
- Boolean
- Date
- Time
- Timestamp

Because Expressions represent data, Expressions "have" a Data Type.

For example in our sample rule...

    ticker = "ZEM" and price > 5.0

...the Attribute and Value Expressions "ticker" and "ZEM" have a Data Type of Text, while the Attribute and 
Value Expressions price and 5.0 have a Data Type of Float.

It may seem obvious why the RulesEngine Engine implicitly knows the Data Type for Value Expressions such as "ZEM" and 5.0. 
After all these are representations of text and floating point numbers.  It may seem less obvious how the RulesEngine 
Engine knows the same for the Attribute Expressions.  The answer is that within the first Condition, "ZEM" 
constrains the Data Type to Text, and the RulesEngine Engine infers the same Data Type for ticker.  Similarly, for the 
second Condition.

If the RulesEngine Engine can infer the Data Type, that is all that is needed.  Documentation on Data Types explains the 
common literal formats for "standard" Data Types, but in this case suffice it to say that anything enclosed in 
double quotes, for which there isn't a registered custom Data Type will always be inferred to be Text, and a 
floating point number with a decimal will always be inferred as Float under the same conditions.

What does it mean to say "there isn't a registered custom Data Type" in the above paragraph?  That's a little beyond 
the scope of this introductory documentation, but as a teaser, let us say we created a Custom Data Type called Morse,
represented by dashes '-' and underscores '_', enclosed in double quotes, for which there were unique patterns 
(alphabet). Such a custom Data Type would be registered with the RulesEngine Engine and it would know to infer it ahead of 
Text where applicable.  Thus "--- ___ ---" which is the universal symbol of SOS in Morse would have a Data Type of 
Morse, but "a-- ___ ---" would have a Data Type of Text.

This concludes the Quick Start.

# TODO: MOVE THE REST OF THIS SOMEWHERE ELSE



 
## A Little More On Comparators

We said that a Comparator compares two Expressions, and we said that the comparison must be along identical Data Types,
or converted to identical Data Types in some manner.

This implies that Comparators are bound to Data Types. In other words, for every Data Type, there is a list of usable
Comparators.   This fact will be useful to remember if you create Custom Data Types, because in general you will 
need to also create/register Comparators for that Data Type.
## Introducing Expression Types

In our Logical Condition...

    ticker = "ZEM" and price > 5.0

... we identified Expressions ticker, "ZEM", price and 5.0. In fact, we have two types of Expressions here, namely
Attribute and Value Expressions.

Starting with Value Expressions, these are Expressions that are literal - you can literally see the value
(noting that behind the scenes, the Value Expression literal format is the literal format of the Data Type it
represents). Value Expressions are the simplest to understand because we can relate to them, i.e. "some text", 4, 5.0,
true, "10-24-1967" etc.

For custom data types, A Value Expressions might look like "--- ___ ---" (Morse data type) or even...

    {
        "ticker": "ZEM",
        "price": 5.0,
        "peRatio": 15.5
    }

... for a fictitious "Stock" Data Type (note that we are not defining a Stock Data Type in this Quick Start, we are
leveraging Attribute Expressions to get to the individual fields).

Moving on to Attribute Expressions, these are Expressions that point to fields in the Data Domain (the Data Domain is
the object passed in for evaluation).

Attribute Expressions are simply the path to the attribute of interest. It can be a top level field, a nested field, an
array element and so on. Here are some examples of the usage pattern:

    price               -> simple price attribute
    stock.price         -> nested simple price attribte
    allStocks["ZEM"]    -> field in all Stocks called "ZEM" which hypothetically contains a stock object
    [0]                 -> A JSON Array, element 0
    [0].price           -> A JSON Array whose element 0 is a stock object, from which we get the price
    ... and so on

You can write an infinite number of rules just leveraging Attribute Expressions and Value Expressions, but want if you
want more sophisticated constructs? Here are the Expression Types currently supported:

- Value Expression:  As discussed a literal expression
- Attribute Expression:  As discussed, points to a field in the data domain
- Function Expression:  An expression whose logical can be user defined, then exposed in a simple syntax. It can take
  parameters which themselves are Expressions.
- Formula Expression:  A formula expression, made up of Operators operating on other Expressions
- Set Expression:  An Expression that is a Set of Expressions
- Condition Expression:  Similar to a Condition, but evaluable outside of the context of a Logical Condition
- Logical Condition Expression:  Similar to a Logical Condition, but evaluble outside of the context of a Rule

It is beyond the scope of this Quick Start to dive into each of these Expressions, but over time you will undoubtedly
use most of them.

## Introduction To Hints

Hints are text fragments that can be optional or required and supplied within the rule itself. One of the most often
used hints will be to provide a Data Type hint to a Condition where it cannot be inferred. For example, the following
condition compares two Attribute Expressions, but the RulesEngine Engine has no way of inferring the Data Type at inspection
time:

    stock.price < limit

In order to provide the RulesEngine Engine the ability to know the Data Type at inspection time we need to provide at least
one Data Type Hint (if we don't, then a Data Type of Unknown will be assigned, and the RulesEngine Engine will attemp to
resolve it through inference at run time, if that option is set. If that option is not set, indeterminate Data Types
will throw an error any time the Rule is manipulated):

    <<ex data-type=Float>> stock.price < limit

In the above...

    <<ex data-type=Float>>

... is a Hint. Hints are always encased in double angular brackets "<<" and ">>". In the RulesEngine Engine, Hints always have
a prefix that immediately follows the opening angular brackets. In this current example the prefix is
"ex" which signifies a Hint block for the expression that follows. Hints can be unary, i.e. just a key or a key, value
pair separated by an "=" symbol. If more than one hint is needed, they must all be put in the same hint block. Hint
values can take on several formats. If they are one word, they can be unquoted or double quoted. If they are multiple
words, they require double quotes. They can also be legal JSON object definitions, and can take on other unique
formatting as the case may be.

For current purposes, we'll cover two hints applicable to Expressions.

The first data type to cover is the above binary hint, having the key "data-type" and value Float. The value of the
"data-type" hint is always the refName (or just name) of the Data Type whether it is one of the so called standard Data
Types or a custom defined one.

Note that the data-type hint is not necessary if the data type is inferrable, but can be used to force underlying type
conversion. For example...

    <<ex data-type=Number>> "10.0" 

... treats the "10.0" text as a Number instead of as Text. Similarly, if below the attribute volatilityIndex comes in as
an integer(Number) at run time, the following...

    <<ex data-type=Text>> stock.volatilityIndex ~ "4*"

...coverts the number to Text before using the Comparator "like" to compare it to anything that starts with a 4

The second expression hint type is the type of Expression, with the key "type". It is almost always optional, but can be
used either for clarity.

For instance in...

    <<ex type=Value data-type=Number>> "10.0"

...the type is completely unnecessary because the Expression will be assumed to be a Value Expression, but it is added
for clarity (but...is it really more clear???).

Note that incongruency between what is specified and the actual expression will throw an error:

    <<ex type=Value>> stock.price

This will throw an error because unquoted stock.price cannot be interpreted as a Value Expression. There is no Data Type
that would define stock.price as a literal value (assuming the user did not create one).

## Introduction To The RulesEngine API

Writing rules is great, but we really want to run them. There are several objects that purposefully expose APIs.  
Here we will focus on some key API of the RulesEngine.Engine singleton.

### Execute a Rule

There are many ways to execute rules, and we already saw one of them above:

    RulesEngine.Engine.awaitExecution(dataDomain, 'ticker = "ZEM" and price > 5.0')

This executes a specific rule expressed as text and returns the execution result.

The full Typescript signature of this API is:

    awaitExecution = (domain: any, ruleText: string, ec?: LogExecutionContext) => RuleResult | Promise<RuleResult>;

Meaning it is a function that takes 3 parameters, including one optional parameter, and returns either a Result
(RuleResult) or a Promise to one.

Any options set on the RulesEngine.Engine are applied (and additional options can be included in the Rule text). The function
itself does not accept Options.

If the text passed doesn't correspond to rule constructs, the RulesEngine.Engine will search its schema for a rule by that
textual name and execute the first instance it finds. Alternatively, if the text is a properly constructed rule it will
compile and execute it, but it will not add it to the schema.

At this point, you might wonder a few things; namely why would a Rule (potentially) return a Promise and what is this
object called the Execution Context?

#### Why RulesEngine May Return Promises

In general, Rule evaluation will not return a Promise. At the current time, all "standard" package constructs are
synchronous for rule execution as there is generally no i/o etc.

However, at least one rule construct _may_ return a Promise, and potentially others as well. A user defined rule
construct might be asynchronous and the most obvious one is the Function Expression.

While we did not go into detail in this Quick Start on Function Expressions, suffice it to say that they represent
externalized capability, and thus may return Promises by design. It's entirely possible that rule execution, for
instance is dependent on a database lookup provided by a Function Expression. Let's take our example of comparing a
stock price; what if the stock price is not in the data domain? It's quite logical that it might be directly obtained
from an API. We can wrap the API call and expose it as a Function Expression for rulesEngine-use, passing in the ticker, which
itself may come from the data domain:

    @CurrentStockPrice[ticker] > 5.0

Of course, i/o such as exteran API calls should almost always be asynchronous, so the RulesEngine Engine allows it.

If the RulesEngine Engine encounteres an asynchronous result anywhere during its execution of RulesEngine, Rule Sets, Applications
etc., it will switch to Promise based asynchronous execution from that point on.

Tip:  The RulesEngine Engine provides a type guard, "isPromise" to quickly evaluate whether it is a Promise that is returned.

#### What Is The Execution Context

The Execution Context, represented by the shape interface definition LogExecutionContext is an optional object passed to
almost all methods in the RulesEngine Engine and supports logging, 'thread' tracing and so on. For the RulesEngine Engine the most
important feature is its logging definition.

We will cover the Execution Context in more detail elsewhere. Suffice it to say for now that if it is omitted, the
default implementation logger will be the console.

### The RulesEngine.Engine

The RulesEngine.Engine is a singleton of type RulesEngine (plural). It is not possible to create another instance of RulesEngine
within a process space as its constructor is private.

The RulesEngine.Engine contains APIs to impact its schema or to impact rule constructs that are not part of its schema.  
The schema of the RulesEngine.Engine is a list of Applications (below).

There are two ways to utilize the RulesEngine.Engine, and they can be used interchangeably. The first is to keep all rule
constructs in a separate place and execute them through the RulesEngine.Engine and other various constructs, define below. The
second is to add them to the overall RulesEngine.Engine schema and execute them from there. The choice of approach is up to
the user, but both have merit.

We already covered one important RulesEngine.Engine API:

#### Execute a single Rule

    awaitRuleExecution = (domain: any, ruleText: string | string[3], ec?: LogExecutionContext) 
      => RuleResult | Promise<RuleResult>

    executeRule = (domain: any, ruleText: string | string[3], ec?: LogExecutionContext) => RuleResult

Examples:

    RulesEngine.Engine.executeRule({ticker: "ZEM", price: 5.0}, '<<ru>> <<ex type=Attribute data-type=Float>> price < 10.0');

    RulesEngine.Engine.executeRule({ticker: "ZEM", price: 5.0}, 'price < 10.0');

    RulesEngine.Engine.executeRule({ticker: "ZEM", price: 5.0}, ['Financial Triggers', 'Buy Triggers', 'ZEM Trigger'];

#### Execute a Rule Set

    awaitRuleSetExecution = (domain: any, ruleset: string | string[2], ec?: ExcecutionContextI) 
      => RuleSetResult | Promise<RuleSetResult>


    executeRuleSet = (domain: any, ruleset: string | string[2], ec?: ExcecutionContextI) => RuleSetResult

Examples:

    RulesEngine.Engine.executeRuleSet({ticker: "ZEM", price: 5.0}, '<<rs>> <<ru>> price < 10.0');

    RulesEngine.Engine.executeRuleSet({ticker: "ZEM", price: 5.0}, 'price < 10.0');

    RulesEngine.Engine.executeRuleSet({ticker: "ZEM", price: 5.0}, ['Financial Triggers', 'Buy Triggers']);

#### Execute an Application

    awaitApplicationExecution = (domain: any, application: string, ec?: LogExecutionContext)
      => ApplicationResult | Promise<ApplicationResult>

    executeApplication = (domain: any, application: string, ec?: LogExecutionContext) => ApplicationResult

Example using the Application and Rule Set hints:

    RulesEngine.Engine.executeApplication({ticker: "ZEM", price: 5.0}, '<<ap>> <<rs>> <<ru>> price < 10.0');

or not using the hints, since they are not necessary in this context:

    RulesEngine.Engine.executeApplication({ticker: "ZEM", price: 5.0}, 'price < 10.0');

Executing a named Application:

    RulesEngine.Engine.executeApplication({ticker: "ZEM", price: 5.0}, 'Financial Triggers');

====>>> HERE

#### Execute a RulesEngine Engine Schema

    awaitExecution = (domain: any, rules?: string, ec?: LogExecutionContext)
      => RulesEngineREsult | Promise<RulesEngineResult>

    execute = (domain: any, rules?: string, ec?: LogExecutionContext) => RulesEngineREsult

#### Add an application to the RulesEngine.Engine schema

    addApplication = (app: Application | ApplicationReference | string, ec?: LogExecutionContext);

This adds an application to the RulesEngine.Engine schema. For the purposes of this Quick Start, assume the input is a textual
Application construct. Application and ApplicationReference are covered elsewhere.

#### Add a Rule Set to the RulesEngine.Engine schema

    addRuleSet = (appRef: string, ruleSet: RuleSet | RuleSetReference | string, ec?: LogExecutionContext);

#### Add a Rule to the RulesEngine.Engine schema

    addRule = (appRef: string, ruleSetRef: string, rule: Rule | RuleReference | string, ec?: LogExecutionContext);

### Applications

Applications are an organizational concept. They store Rule Sets. A RulesEngine.Engine schema can have more than one Rule Set,
and if none is provided when adding other rule constructs, or if rule construct text does not specify the name, a
default one called "Default" is added automatically.

### Rule Sets

### RulesEngine

### Different Ways To Execute RulesEngine

### Manipulating RulesEngine
