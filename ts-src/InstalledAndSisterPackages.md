- [ReadMe](../ReadMe.md) 
- [Wiki](./ts-src/Wiki.md)
- [Wiki Index](./WikiIndex.md)

# Installed And Sister Packages

Installing @franzzemen will install subcomponents, including as of now:

    @franzzemen/rulesEngine                        All about the RulesEngine Engine
    @franzzemen/rulesEngine-application            All About Applications
    @franzzemen/rulesEngine-rule-set               All about Rule Sets
    @franzzemen/rulesEngine-rule                   All about Rule
    @franzzemen/rulesEngine-logical-condition      All about Logical Conditions. Also adds the Logical Condition Expression concept
    @franzzemen/rulesEngine-condition              All about Conditions.  Also adds the Condition Expression concept
    @franzzemen/rulesEngine-expression             All about Expressions
    @franzzemen/rulesEngine-data-type              All about Data Types
    @franzzemen/rulesEngine-common                 Common rules engine constructs
    @franzzemen/app-utility               Utility objects including a logger that supports any log framework

Third party non-development components directly installed include:

    moment                                Moment.js, which is deprecated but which we use for formatting and manipulation purposes (TBD on moving to something else)
    object-path                           An object traversal library. We build on this especially for Attribute Expressions
    uuid                                  A UID generator, used where random ids or other references must be constructed

These third party installations add their own dependencies.

Optional sister components, not included when installing the framework are:

    @franzzemen/rulesEngine-standard-functions     A compilation of pre-made Function Expressions covering well known calculations
    @franzzemen/rulesEngine-cli                    A cli (work in progress, but runs) to quickly test rules
    @franzzemen/rulesEngine-commonjs-examples      Examples on how to integrate into a CommonJS module

Additional optional sister components are in various stages of development:

Server Frameworks:

    @franzzemen/rulesEngine-server                 An abstraction to support a server implementation packages
    @franzzemen/rulesEngine-rest                   A rest server implementation deployable on bare metal, AWS EC2, AppEngine. Usually configured with a rulesEngine-persistence implementation.  Does **not** leverage Express or similar. Build from the ground up with Node, thus very lightweight.
    @franzzemen/rulesEngine-express                An expression implementation for use with an Express install, or usable directly

Persistence Frameworks:

    @franzzemen/rulesEngine-persistence            An abstraction to support persistence packages
    @franzzemen/rulesEngine-rulesEngine-jsondb              A json file based rulesEngine-persistence implementation
    @franzzemen/rulesEngine-reddis                 A reddis based rulesEngine-persistence implementation
    @franzzemen/rulesEngine-s3                     An AWS deployable S3 rulesEngine-persistence implementation
    @franzzemen/rulesEngine-dynamodb               An AWS deployable Dynamo rulesEngine-persistence implementation
    @franzemen/rulesEngine-rds                     An AWS deployable RDS rulesEngine-persistence implementation
    @franzemen/rulesEngine-lambdadb                An AWS deployable Lambda rulesEngine-persistence implementation backed by rulesEngine-s3, rre-dynamodb or rs-rds

Browser Based:

    @franzzemen/rulesEngine-browser                Run rulesEngine in the browser
    @franzzemen/rulesEngine-web-workers:           Supports web workers

UI Frameworks to manipulate building and parsing rules:

    @franzzemen/rulesEngine-ui:                    An abstract implementation to support ui packages, integrates either with rulesEngine-browser, a rulesEngine-server implementation or a configured mapping to a custom server rest API
    @franzzemen/rulesEngine-angular                Angular implementation of rulesEngine-ui
    @franzzemen/rulesEngine-react                  React implementation of rulesEngine-ui
    @franzzemen/rulesEngine-vue                    Vue implementation of rulesEngine-ui

Hosted

    https://www.butchersrow.com/rulesEngine/rest   Hosted, account based REST server and backing storage
    https://www.butchersrow.com/rulesEngine        Hosted, account based UI, REST server and backing storage

State Process

    @franzzemen/sp                        A state-process engine (aka mapped workflow) that leverages @franzzemen/rulesEngine
