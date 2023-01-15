let blaBokData;
let blaBokTable;
let selectedYear;
let searchNr;
let currentSelectedRecordNr;
let sellers;

function newBlaBokEntry() {
    let today = new Date();
    today = String(today.getDate()).padStart(2, '0') + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + today.getFullYear();
    $("#inndato").datepicker('setDate', today);
    $('#empty_btn').remove();
    $('#reset_btn').remove();
    $('#modal_blabok_new_entry_footer').prepend('<button id="empty_btn" type="button" class="btn btn-danger me-auto" title="Nullstill alle felter"><i class="bi bi-trash"></i></button>');

    $('#my_blabok_new_entry_modal').modal('show');
    newBlaBokEntryModalHandlers();
}

function emptyBlaBokEntryForm() {
    let today = new Date();
    today = String(today.getDate()).padStart(2, '0') + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + today.getFullYear();
    $("#inndato").datepicker('setDate', today);
    $('#regnr').val('');
    $('#biltype').val('');
    $('#arsmodell').val('');
    $('#km').val('');
    $('#selger').val('');
    $('#nyeier').val('');
    $('#forrigeeier').val('');
    $('#innpris').val('');
    $('#utpris').val('');
    $('#innbytte').val('');
    $('#garanti').val('');
    $('#nokkelnr').val('');
}

function newBlaBokEntryModalHandlers() {
    $('#empty_btn').unbind('click');
    $('#empty_btn').click(function () {
        emptyBlaBokEntryForm();
    });
    $('#save_btn').unbind('click');
    $('#save_btn').click(function () {
        let object = {};
        object.innDato = $('#inndato').val();
        object.regNr = $('#regnr').val().toUpperCase();
        object.bilType = $('#biltype').val();
        object.arsmodell = $('#arsmodell').val();
        object.km = $('#km').val();
        object.selger = $('#selger').val();
        object.nyEier = $('#nyeier').val();
        object.forrigeEier = $('#forrigeeier').val();
        object.innpris = $('#innpris').val();
        object.utpris = $('#utpris').val();
        object.innbytte = $('#innbytte').val();
        object.garanti = $('#garanti').val();
        object.nokkelNr = $('#nokkelnr').val();
        createNewBlaBokRecord(object);
    });
    $('#close_btn').unbind('click');
    $('#close_btn').click(function () {
        $('#my_blabok_new_entry_modal').modal('hide');
    });
}

function editBlaBokEntryModalHandlers(nr) {
    searchNr = parseInt(nr);

    $('#reset_btn').unbind('click');
    $('#reset_btn').click(function () {
        populateBlaBokEntryFormWithExistingData($(this).attr('data'));
    });
    $('#empty_btn').unbind('click');
    $('#empty_btn').click(function () {
        emptyBlaBokEntryForm();
    });
    $('#save_btn').unbind('click');
    $('#save_btn').click(function () {
        let existingBlaBokEntry;
        for (var i = 0; i < blaBokData.length; i++) {
            if (blaBokData[i].nr === searchNr) {
                existingBlaBokEntry = blaBokData[i];
                break;
            }
        }
        if (existingBlaBokEntry === undefined || existingBlaBokEntry === null) {
            alert("Noe gikk galt. Last siden pånytt");
            return;
        }
        let object = {};
        object.nr = searchNr;
        object.innDato = $('#inndato').val();
        object.regNr = $('#regnr').val().toUpperCase();
        object.bilType = $('#biltype').val();
        object.arsmodell = $('#arsmodell').val();
        object.km = $('#km').val();
        object.selger = $('#selger').val();
        object.nyEier = $('#nyeier').val();
        object.forrigeEier = $('#forrigeeier').val();
        object.innpris = $('#innpris').val();
        object.utpris = $('#utpris').val();
        object.innbytte = $('#innbytte').val();
        object.garanti = $('#garanti').val();
        object.nokkelNr = $('#nokkelnr').val();
        updateBlaBokRecord(object);
    });
    $('#close_btn').unbind('click');
    $('#close_btn').click(function () {
        $('#my_blabok_new_entry_modal').modal('hide');
    });
}

function populateBlaBokEntryFormWithExistingData(nr) {
    searchNr = parseInt(nr);
    let existingBlaBokEntry;
    for (var i = 0; i < blaBokData.length; i++) {
        if (blaBokData[i].nr === searchNr) {
            existingBlaBokEntry = blaBokData[i];
            break;
        }
    }
    if (existingBlaBokEntry === undefined || existingBlaBokEntry === null) {
        alert("Noe gikk galt. Last siden pånytt");
        return;
    }

    $("#inndato").datepicker('setDate', getDateWithLeadingZeros(existingBlaBokEntry.innDato));
    $('#regnr').val(existingBlaBokEntry.regNr);
    $('#biltype').val(existingBlaBokEntry.bilType);
    $('#arsmodell').val(existingBlaBokEntry.arsmodell);
    $('#km').val(existingBlaBokEntry.km);
    $('#selger').val(existingBlaBokEntry.selger);
    $('#nyeier').val(existingBlaBokEntry.nyEier);
    $('#forrigeeier').val(existingBlaBokEntry.forrigeEier);
    $('#innpris').val(existingBlaBokEntry.innpris);
    $('#utpris').val(existingBlaBokEntry.utpris);
    $('#innbytte').val(existingBlaBokEntry.innbytte);
    $('#garanti').val(existingBlaBokEntry.garanti);
    $('#nokkelnr').val(existingBlaBokEntry.nokkelNr);
}

function getObjectValueOrEmptyString(value) {
    if (value === undefined || value === null) {
        return '';
    }
    return value;
}

function updateBlaBokRecord(obj) {
    if (!validForm(obj)) {
        alert("Krever Inn dato og Reg.nr. for å lagre oppføring i BlåBok");
        return;
    }
    var dateFormated = stringDateToCSharpDateTime(obj.innDato);
    if (dateFormated == null) {
        alert("Feil med datoformat!");
        return;
    }
    obj.innDato = dateFormated.toJSON();
    executeUpdateBlaBokRecord(obj);
}

function createNewBlaBokRecord(obj) {
    if (!validForm(obj)) {
        alert("Krever Inn dato og Reg.nr. for å lagre oppføring i BlåBok");
        return;
    }
    executeCreateNewBlaBokRecord(obj);
}

function validForm(obj) {
    if (obj.innDato == null || obj.innDato.length <= 3) {
        return false;
    }
    if (obj.regNr == null || obj.regNr.length <= 3) {
        return false;
    }
    return true;
}

function loadedBlaBokTableSetup(json) {
    blaBokData = json.data;
}

function initSelectedYear() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    selectedYear = parseInt(urlParams.get('year'));
    if (selectedYear === null || isNaN(selectedYear)) {
        selectedYear = new Date().getFullYear();
    }
}

function setSelectedYearBox() {
    $('#selected-blabok-year').text(selectedYear);
}

function changeBlaBokYear(number) {
    selectedYear += number;
    if (isNaN(selectedYear)) {
        // fallback
        initSelectedYear();
    }
    let urlParams = new URLSearchParams();
    urlParams.set('year', selectedYear);
    window.location.search = urlParams;
    //setSelectedYearBox();
    //blaBokTable.ajax.url("/api/v1/blabok?year=" + selectedYear);
    //blaBokTable.ajax.reload(function (json) {
    //    loadedBlaBokTableSetup(json);
    //});
}

function modalBlaBokStatic() {
    $('#my_blabok_new_entry_modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#my_blabok_modal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function stringDateToCSharpDateTime(date) {
    var splitted = date.split('.');
    if (splitted.length != 3) {
        return null;
    }
    return new Date(splitted[2], (parseInt(splitted[1]) - 1), splitted[0], 12, 0, 0, 0, 0);
}

function executeCreateNewBlaBokRecord(obj) {
    if (localStorage.getItem('dekkHotellUserToken') == null) {
        alert("No access!");
        return;
    }
    var dateFormated = stringDateToCSharpDateTime(obj.innDato);
    if (dateFormated == null) {
        alert("Feil med datoformat!");
        return;
    }
    obj.innDato = dateFormated.toJSON();
    $.ajax({
        type: "POST",
        url: "/api/v1/blabok/",
        headers: { "Authorization": localStorage.getItem('dekkHotellUserToken') },
        data: obj,
        dataType: 'json',
        success: function () {
            alert("Oppføring lagret!");
            blaBokTable.ajax.url("/api/v1/blabok?year=" + selectedYear);
            blaBokTable.ajax.reload(function (json) {
                loadedBlaBokTableSetup(json);
            });
            $('#my_blabok_new_entry_modal').modal('hide');
            emptyBlaBokEntryForm();
        },
        error: function (error) {
            if (error.status === 401) {
                removeLocalStorageSession();
                alert("Session timeout. You need to login again");
                window.location.reload();
                return;
            }
            alert(error.responseText);
        }
    });
}

function executeUpdateBlaBokRecord(obj) {
    if (localStorage.getItem('dekkHotellUserToken') == null) {
        alert("No access!");
        return;
    }
    $.ajax({
        type: "PUT",
        url: "/api/v1/blabok/" + obj.nr,
        headers: { "Authorization": localStorage.getItem('dekkHotellUserToken') },
        data: obj,
        dataType: 'json',
        success: function () {
            alert("Oppføring er oppdatert!");
            blaBokTable.ajax.url("/api/v1/blabok?year=" + selectedYear);
            blaBokTable.ajax.reload(function (json) {
                loadedBlaBokTableSetup(json);
            });
            $('#my_blabok_new_entry_modal').modal('hide');
            emptyBlaBokEntryForm();
        },
        error: function (error) {
            if (error.status === 401) {
                removeLocalStorageSession();
                alert("Session timeout. You need to login again");
                window.location.reload();
                return;
            }
            alert(error.responseText);
        }
    });
}

function getSellers() {
    //if (localStorage.getItem('dekkHotellUserToken') == null) {
    //    alert("No access!");
    //    return;
    //}
    $.ajax({
        type: "GET",
        url: "/api/v1/user/seller",
        headers: { "Authorization": localStorage.getItem('dekkHotellUserToken') },
        dataType: 'json',
        success: function (data) {
            sellers = data.data;
            console.log(sellers);
        },
        error: function (error) {
            if (error.status === 401) {
                removeLocalStorageSession();
                alert("Session timeout. You need to login again");
                window.location.reload();
                return;
            }
            alert(error.responseText);
        }
    });
}

function initBlaBok() {
    initSelectedYear();
    setSelectedYearBox();

    blaBokTable = $('#blabok_table').DataTable({
        type: "GET",
        ajax: "/api/v1/blabok?year=" + selectedYear,
        stripeClasses: ['odd-row', 'even-row'],
        language: {
            url: 'json/datatables_no.json'
        },
        lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "Alle"]],
        columns: [
            { data: "nr" }
            , { data: "innDato" }
            , { data: "regNr" }
            , { data: "bilType" }
            , { data: "arsmodell" }
            , { data: "km" }
            , { data: "selger" }
            , { data: "nyEier" }
            , { data: "forrigeEier" }
            , { data: "innpris" }
            , { data: "utpris" }
            , { data: "innbytte" }
            , { data: "garanti" }
            , { data: "nokkelNr" }
            , {
                mData: "Rediger",
                mRender: function (data, type, row, index) {
                    return getEditBlaBokEntryButton(data, type, row, index);
                }
            }
        ],
        columnDefs: [
            {
                targets: [1], render: function (data) {
                    if (data !== null) {
                        return getDateWithLeadingZeros(data);
                    }
                },
                className: "dt-center",
                type: 'extract-date',
            },
            {
                targets: [5], render: function (data) {
                    if (data !== null && data !== '') {
                        return numberWithSpaces(data);
                    }
                    return data;
                },
            },
            {
                targets: [6],
                visible: false
            },
            {
                targets: [9], render: function (data) {
                    if (data !== null && data !== '') {
                        return numberWithSpaces(data);
                    }
                    return data;
                },
            },
            {
                targets: [10], render: function (data) {
                    if (data !== null && data !== '') {
                        return numberWithSpaces(data);
                    }
                    return data;
                },
            },
            {
                targets: [11],
                visible: false
            },
            {
                targets: [12],
                visible: false
            },
            {
                targets: [13],
                visible: false
            },
            {
                targets: [14],
                visible: false,
                className: "dt-center"
            },
        ],
        error: function () {
            alert("Failed loading data. Contact support ... Ring han Torje")
        },
        fnInitComplete: function (a, json) {
            loadedBlaBokTableSetup(json);
        }
    });
}

function getDateWithLeadingZeros(data) {
    let innDate = new Date(data);
    try {
        return ('0' + innDate.getDate()).slice(-2) + '.'
            + ('0' + (innDate.getMonth() + 1)).slice(-2) + '.'
            + innDate.getFullYear();
    } catch (error) {
        return data;
    }
}

function getEditBlaBokEntryButton(a, b, row) {
    if (localStorage.getItem('dekkHotellUserToken')) {
        return '<button type="button" onclick="editBlaBokEntry(' + row.nr + ')" class="btn btn-primary btn-sm edit-btn" data=' + row.nr + ' title="Rediger BLåBok-oppføring">'
            + '<i class="bi bi-pencil-fill"></i></button>';
    }
    return '<button type="button" class="btn btn-secondary btn-sm edit-btn" data=' + row.nr + ' title="Logg inn for å redigere BlåBok-oppføring" disabled>'
        + '<i class="bi bi-pencil-fill"></i></button>';
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function editBlaBokEntry(nr) {
    $('#empty_btn').remove();
    $('#reset_btn').remove();
    $('#modal_blabok_new_entry_footer').prepend('<button id="reset_btn" type="button" class="btn btn-warning me-auto" data="' + nr + '" title="Tilbakestill felter til opprinnelig data"><i class="bi bi-rewind"></i></button>');  
    populateBlaBokEntryFormWithExistingData(nr);
    $('#my_blabok_new_entry_modal').modal('show');
    editBlaBokEntryModalHandlers(nr);
}

$(function () {
    $('#inndato').datepicker({
        dateFormat: "dd.mm.yy",
        autoclose: true
    });
});

$(function () {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "extract-date-pre": function (value) {
            var date = value;
            date = date.split('.');
            return Date.parse(date[1] + '.' + date[0] + '.' + date[2])
        },
        "extract-date-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        "extract-date-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });
});

$(function () {
    $('a.toggle-vis').on('click', function (e) {
        e.preventDefault();

        // Get the column API object
        var column = blaBokTable.column($(this).attr('data-column'));

        // Toggle the visibility
        column.visible(!column.visible());

        if ($(this).hasClass("hidden-column")) {
            $(this).removeClass("hidden-column");
        } else {
            $(this).addClass("hidden-column");
        }
        
    });
});

$(document).ready(function () {
    function init() {
        initBlaBok();
        getSellers();
        modalBlaBokStatic();
    }

    init();
});