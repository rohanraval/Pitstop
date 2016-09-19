$(document).ready(function () {
    $("#output").hide();
    $('#modelDD').prop('disabled', true);

    getTypeOptions();

    $('#typeDD').change(function () {
        var selectedType = $('#typeDD option:selected').text();
        getModelOptions(selectedType);
    });

    $("#button").click(function () {
        display();
    });

    $("#toggleOutput").click(function () {
        if ($(this).val() == "Close Output") {
            $("#output").hide();
            $(this).val("Open Output");
        }
        else {
            $("#output").show();
            $(this).val("Close Output");
        }
    });
});

function getTypeOptions() {

    var typeFile = '../data/types.txt';

    $.ajax({
        url: typeFile,
        type: "GET"
    }).done(function (responseText) {

        var types = responseText.split('\n');
        for(var i = 0; i < types.length; i++)
        {
            $('#typeDD').append($('<option>', {
            value: types[i],
            text: types[i]
            }));
        }

    }).fail(function (xhr) {

        if (xhr.status == 404) {
            $("#output").append("you are stupid.\r\n");
        }

    }).always(function () {
        $("#output").show();
        $("#toggleOutput").val("Close Output");
    });
}

function getModelOptions(selectedType) {

    $('#modelDD option:gt(0)').remove();
    $('#modelDD').prop('disabled', false);

    var modelsFile = '../data/models.txt';

    $.ajax({
        url: modelsFile,
        type: "GET"
    }).done(function (responseText) {

        var allModelsList = responseText.split('\n');
        var modelsOfSelectedType = [];

        for(var i = 0; i < allModelsList.length; i++)
        {
            var modelType = allModelsList[i].substring(0, allModelsList[i].indexOf(":"));
            var modelName = allModelsList[i].substring(allModelsList[i].indexOf(":") + 1);
            if(modelType === selectedType)
                modelsOfSelectedType.push(modelName);
        }

        for(var i = 0; i < modelsOfSelectedType.length; i++)
        {
            $('#modelDD').append($('<option>', {
            value: modelsOfSelectedType[i],
            text: modelsOfSelectedType[i]
            }));
        }

    }).fail(function (xhr) {

        if (xhr.status == 404) {
            $("#output").append("you are stupid.\r\n");
        }

    });
}

function display() {
    var output = $("#output");
    output.append( $('#modelDD option:selected').text() + '\n');
}
