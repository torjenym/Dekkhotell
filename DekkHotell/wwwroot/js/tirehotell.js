let tireHotel;
let tireSetTable;
let availableLocationsList = [];

function editLocation(id) {
    $('#modal_tiresets_title').empty();
    let edit_location_header = 'Rediger lokasjon';
    $('#modal_tiresets_title').append(edit_location_header);

    $('#modal_tiresets_content').empty();
    let edit_location_content = '<form>'
        + '<div class="form-group row">'
        + '<label for="lokasjon" class="col-sm-2 col-form-label">Lokasjon</label>'
        + '<div class="col-sm-10">'
        + '<input type="text" class="form-control" id="lokasjon" placeholder="Lokasjon" value="' + getObjectValueOrEmptyString(tireHotel[id].lokasjon) + '" readonly>'
        + '</div>'
        + '</div>'
        + '</br>'

        + '<div class="form-group row">'
        + '<label for="regNr" class="col-sm-2 col-form-label">Reg.Nr.</label>'
        + '<div class="col-sm-10">'
        + '<input type="text" class="form-control uppercase" id="regNr" placeholder="Reg.Nr." value="' + getObjectValueOrEmptyString(tireHotel[id].regNr) + '">'
        + '</div>'
        + '</div>'
        + '</br>'

        + '<div class="form-group row">'
        + '<label for="fornavn" class="col-sm-2 col-form-label">Fornavn</label>'
        + '<div class="col-sm-10">'
        + '<input type="text" class="form-control" id="fornavn" placeholder="Fornavn" value="' + getObjectValueOrEmptyString(tireHotel[id].fornavn) + '">'
        + '</div>'
        + '</div>'

        + '<div class="form-group row">'
        + '<label for="etternavn" class="col-sm-2 col-form-label">Etternavn</label>'
        + '<div class="col-sm-10">'
        + '<input type="text" class="form-control" id="etternavn" placeholder="Etternavn" value="' + getObjectValueOrEmptyString(tireHotel[id].etternavn) + '">'
        + '</div>'
        + '</div>'
        + '</br>'

        + '<div class="form-group row">'
        + '<label for="tlf" class="col-sm-2 col-form-label">Tlf</label>'
        + '<div class="col-sm-10">'
        + '<input type="text" class="form-control" id="tlf" placeholder="Tlf" value="' + getObjectValueOrEmptyString(tireHotel[id].tlf) + '">'
        + '</div>'
        + '</div>'

        + '<div class="form-group row">'
        + '<label for="epost" class="col-sm-2 col-form-label">Epost</label>'
        + '<div class="col-sm-10">'
        + '<input type="email" class="form-control" id="epost" placeholder="Epost" value="' + getObjectValueOrEmptyString(tireHotel[id].epost) + '">'
        + '</div>'
        + '</div>'
        + '</br>'

        + '<div class="form-group row">'
        + '<label for="merke" class="col-sm-2 col-form-label">Merke</label>'
        + '<div class="col-sm-10">'
        + '<input list="carbrands" type="text" class="form-control" id="merke" placeholder="Merke" value="' + getObjectValueOrEmptyString(tireHotel[id].merke) + '">'
        + '<datalist id="carbrands"><option value="Hyundai"><option value="Mitsubishi"><option value="Hongqi"></datalist>'

        + '</div>'
        + '</div>'

        + '<div class="form-group row">'
        + '<label for="modell" class="col-sm-2 col-form-label">Modell</label>'
        + '<div class="col-sm-10">'
        + '<input type="text" class="form-control" id="modell" placeholder="Modell" value="' + getObjectValueOrEmptyString(tireHotel[id].modell) + '">'
        + '</div>'
        + '</div>'
        + '</br>'

        + '<div class="form-group row">'
        + '<label for="notat" class="col-sm-2 col-form-label">Notat</label>'
        + '<div class="col-sm-10">'
        + '<textarea type="text" class="form-control" id="notat" placeholder="Notat" rows="3">' + getObjectValueOrEmptyString(tireHotel[id].notat) + '</textarea>'
        + '</div>'
        + '</div>';

    if (tireHotel[id].forfatter || tireHotel[id].forrigeVersjon) {
        edit_location_content += '</br></br>'
            + '<p>Siste endret av: ' + getObjectValueOrEmptyString(tireHotel[id].forfatter) + '</p>'
            + '<p>Forrige versjon: <small><code>' + JSON.stringify(getObjectValueOrEmptyStringFromLastVersion(tireHotel[id].forrigeVersjon)) + '</code></small></p>'
    }
    edit_location_content += '</form>';
    $('#modal_tiresets_content').append(edit_location_content);

    $('#modal_tiresets_footer').empty();
    let edit_location_footer = '<button id="reset_btn" type="button" class="btn btn-warning me-auto" data="' + id + '" title="Tilbakestill felter til opprinnelig data"><i class="bi bi-rewind"></i></button>'
        + '<button id="empty_btn" type="button" class="btn btn-danger me-auto" data="' + id + '" title="Nullstill alle felter"><i class="bi bi-trash"></i></button>'
        + '<button id="save_btn" type="button" class="btn btn-primary" data="' + id + '" title="Lagre data og lukk vindu"><i class="bi bi-save2"></i> Lagre</button>'
        + '<button id="close_btn" type="button" class="btn btn-secondary" title="Lukk vindu uten å lagre"><i class="bi bi-x-lg"></i></button>';
    $('#modal_tiresets_footer').append(edit_location_footer);

    editTiresetModalHandlers();
    $('#my_tiresets_modal').modal('show');
}

function readNote(id) {
    $('#modal_tiresets_title').empty();
    let note_header = 'Notat';
    $('#modal_tiresets_title').append(note_header);

    $('#modal_tiresets_content').empty();
    let note_content = '<p>' + getObjectValueOrEmptyString(tireHotel[id].notat) + '</p>';
    $('#modal_tiresets_content').append(note_content);

    $('#modal_tiresets_footer').empty();
    let note_footer = '<button id="close_btn" type="button" class="btn btn-secondary" title="Lukk vindu"><i class="bi bi-x-lg"></i></button>';
    $('#modal_tiresets_footer').append(note_footer);

    readNoteModalHandlers();
    $('#my_tiresets_modal').modal('show');
}

function getObjectValueOrEmptyString(value) {
    if (value === undefined || value === null) {
        return '';
    }
    return value;
}

function getObjectValueOrEmptyStringFromLastVersion(value) {
    if (value === undefined || value === null) {
        return '';
    }
    delete value.id;
    delete value.avtale;
    delete value.betalt;
    return value;
}

function loadedTableSetup(json) {
    tireHotel = json.data;
    setDekkhotellExtraInfo();
}

function setDekkhotellExtraInfo() {
    availableLocationsList = [];
    for (var i = 0; i < tireHotel.length; i++) {
        if (tireHotel[i].regNr === null) {
            availableLocationsList.push({ id: tireHotel[i].id, lokasjon: tireHotel[i].lokasjon })
        }
    }
    $('#dekkhotell_extra_info').empty();
    $('#dekkhotell_extra_info').append('Ledige plasser: ' + availableLocationsList.length);
}

function getEditButton(a, b, row) {
    if (localStorage.getItem('dekkHotellUserToken')) {
        return '<button type="button" onclick="editLocation(' + row.id +')" class="btn btn-primary btn-sm edit-btn" data=' + row.id + ' title="Rediger lokasjon">'
            + '<i class="bi bi-pencil-fill"></i></button>'; // </svg>
    }
    return '<button type="button" class="btn btn-secondary btn-sm edit-btn" data=' + row.id + ' title="Logg inn for å redigere lokasjon" disabled>'
        + '<i class="bi bi-pencil-fill"></i></button>'; // </svg>
}

function readNoteModalHandlers() {
    $('#close_btn').unbind('click');
    $('#close_btn').click(function () {
        $('#my_tiresets_modal').modal('hide');
    });
}

function editTiresetModalHandlers() {
    //$('#move_tireset_btn').unbind('click');
    //$('#move_tireset_btn').click(function () {
    //    moveLocationHandler($(this).attr('data'));
    //});
    $('#reset_btn').unbind('click');
    $('#reset_btn').click(function () {
        editLocation($(this).attr('data'));
    });
    $('#empty_btn').unbind('click');
    $('#empty_btn').click(function () {
        $('#regNr').val('');
        $('#fornavn').val('');
        $('#etternavn').val('');
        $('#tlf').val('');
        $('#epost').val('');
        $('#merke').val('');
        $('#modell').val('');
        $('#notat').val('');
    });
    $('#save_btn').unbind('click');
    $('#save_btn').click(function () {
        let object = tireHotel[$(this).attr('data')];
        object.regNr = $('#regNr').val().toUpperCase();
        object.fornavn = $('#fornavn').val();
        object.etternavn = $('#etternavn').val();
        object.tlf = $('#tlf').val();
        object.epost = $('#epost').val();
        object.merke = $('#merke').val();
        object.modell = $('#modell').val();
        object.notat = $('#notat').val();
        updateDekkHotell(object);
    });
    $('#close_btn').unbind('click');
    $('#close_btn').click(function () {
        $('#my_tiresets_modal').modal('hide');
    });
}

function modalTiresetStatic() {
    $('#my_tiresets_modal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

// https://datatables.net/examples/styling/bootstrap5.html
function initDekkHotell() {
    tireSetTable = $('#dekkhotell_table').DataTable({
        type: "GET",
        ajax: "/api/v1/tireset",
        stripeClasses: ['odd-row', 'even-row'],
        language: {
            url: 'json/datatables_no.json'
        },
        lengthMenu: [[10, 20, 40, -1], [10, 20, 40, "Alle"]],
        columns: [
            { data: "lokasjon" }
            , { data: "regNr" }
            , { data: "fornavn" }
            , { data: "etternavn" }
            , { data: "tlf" }
            , { data: "epost" }
            , { data: "notat" }
            , { data: "merke" }
            , { data: "modell" }
            , {
                mData: "Rediger",
                mRender: function (data, type, row) {
                    return getEditButton(data, type, row);
                }
            }
        ],
        columnDefs: [
            {
                targets: [0], render: function (a, b, data) {
                    if (data.regNr !== null) {
                        return '<i class="bi bi-lock location-taken"></i>' + a;
                    }
                    return a;
                },
                className: "dt-center"
            },
            {
                targets: [5], render: function (data) {
                    if (data !== null && data !== '') {
                        return '<a href = "mailto:' + data + '">' + data + '</a>';
                    }
                    return data;
                },
            },
            {
                targets: [6], render: function (a, b, data) {
                    if (a && a.length >= 28) {
                        return '<button type="button" onclick="readNote(' + data.id + ')" class="btn btn-primary btn-sm read-note-btn" title="Les hele notat" data="' + data.id + '"><i class="bi bi-book"></i></button> ' + a;
                    }
                    return a;
                }
            },
            {
                targets: [9],
                className: "dt-center"
            }
        ],
        error: function () {
            alert("Failed loading data. Contact support ... Ring han Torje")
        },
        fnInitComplete: function (a, json) {
            loadedTableSetup(json);
        }
    });
}

function updateDekkHotell(obj) {
    if (localStorage.getItem('dekkHotellUserToken') == null) {
        alert("No access!");
        return;
    }
    $.ajax({
        type: "PUT",
        url: "/api/v1/tireset/" + obj.Id,
        headers: { "Authorization": localStorage.getItem('dekkHotellUserToken') },
        data: obj,
        dataType: 'json',
        success: function () {
            tireSetTable.ajax.reload(function (json) {
                loadedTableSetup(json);
            });
            $('#my_tiresets_modal').modal('hide');
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

$(document).ready(function () {
    function init() {
        initDekkHotell();
        modalTiresetStatic();
    }

    init();
});