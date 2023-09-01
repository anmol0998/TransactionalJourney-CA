define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);
//////////////////////////////////////////////////////////////////////////
    var eventDefinitionKey;
    connection.trigger('requestInteraction');
    connection.on('requestedInteraction', function (settings) {
        eventDefinitionKey = settings;
        console.log('settings'+settings);
    });
/////////////////////////////////////////////////////////////////////////////
    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

    function initialize(data) {
        console.log("Initializing data data: " + JSON.stringify(data));
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: ' + JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'accountSid') {
                    $('#accountSID').val(val);
                }

                if (key === 'authToken') {
                    $('#authToken').val(val);
                }

                if (key === 'messagingService') {
                    $('#messagingService').val(val);
                }

                if (key === 'body') {
                    $('#messageBody').val(val);
                }

            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens(tokens) {
        console.log("Tokens function: " + JSON.stringify(tokens));
    }

    function onGetEndpoints(endpoints) {
        console.log("Get End Points function: " + JSON.stringify(endpoints));
    }

    function save() {

        var body = $('#messageBody').val();

        payload['arguments'].execute.inArguments = [{
            "body": body,
            "EmailAddress": "{{Event.DEAudience-fe84da24-4962-1be6-f42f-6478915dc420.EmailAddress}}",
            "SubscriberKey": "{{Event.DEAudience-fe84da24-4962-1be6-f42f-6478915dc420.SubscriberKey}}"
        }];

        payload['metaData'].isConfigured = true;
        console.log("Payload on SAVE function: " + JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
        /////////////////////////////////////////////
        postmonger.on('requestedInteraction', function (interaction) {
            // Handle the interaction data received from Journey Builder
            console.log('Interaction Data:', interaction);
            console.log('Interaction JSON Data:', JSON.stringify(interaction));
            // You can access the interaction data properties like interaction.id, interaction.name, etc.
        });

    }
});
