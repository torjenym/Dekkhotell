let tireHotel;
let tireSetTable;
$(document).ready(function () {
    // https://datatables.net/examples/styling/bootstrap5.html
    function initDekkHotell() {
        tireSetTable = $('#dekkhotell_table').DataTable({
            type: "GET",
            ajax: "/tireset",
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
            fnInitComplete: function (settings, json) {
                loadedTableSetup(json);
            }
        });
    }

    function updateDekkHotell(obj) {
        $.ajax({
            type: "PUT",
            url: "/tireset/" + obj.Id,
            data: obj,
            dataType: 'json',
            success: function (e, d, b) {
                tireSetTable.ajax.reload(function (json) {
                    loadedTableSetup(json);
                });
                $('#my_modal').modal('hide');
            },
            error: function (e, d, b) {
                alert("Failed saving data. Contact support ... Ring han Torje")
            }
        });
    }

    function loadedTableSetup(json) {
        tireHotel = json.data;
        editButtonHandler();
    }

    function getEditButton(d, t, row) {
        return '<button type="button" class="btn btn-primary btn-sm edit-btn" data=' + row.id + ' title="Rediger lokasjon">'
            + '<i class="bi bi-pencil-fill"></i></svg></button>';
    }

    // https://getbootstrap.com/docs/4.0/components/forms/
    // https://stackoverflow.com/questions/16152073/prevent-bootstrap-modal-from-disappearing-when-clicking-outside-or-pressing-esca
    function editLocation(id) {
        $('#modal_title').empty();
        let header = '';
        $('#modal_title').append(header);

        $('#modal_content').empty();
        let content = '<form>'
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
            + '</div>'

            + '</form>';
        $('#modal_content').append(content);

        $('#modal_footer').empty();
        let footer = '<button id="reset_btn" type="button" class="btn btn-warning me-auto" data="' + id + '" title="Tilbakestill felter til opprinnelig data"><i class="bi bi-rewind"></i></button>'
            + '<button id="empty_btn" type="button" class="btn btn-danger me-auto" data="' + id + '" title="Nullstill alle felter"><i class="bi bi-trash"></i></button>'
            + '<button id="save_btn" type="button" class="btn btn-primary" data="' + id + '" title="Lagre data og lukk vindu"><i class="bi bi-save2"></i> Lagre</button>'
            + '<button id="close_btn" type="button" class="btn btn-secondary" title="Lukk vindu uten å lagre"><i class="bi bi-x-lg"></i></button>';
        $('#modal_footer').append(footer);

        editModalHandlers();
        $('#my_modal').modal('show');
    }

    function getObjectValueOrEmptyString(value) {
        if (value === undefined || value === null) {
            return '';
        }
        return value;
    }

    function editButtonHandler() {
        $('.edit-btn').unbind('click');
        $('.edit-btn').click(function () {
            let id = $(this).attr('data');
            editLocation(id);
        });
    }

    function editModalHandlers() {
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
            $('#my_modal').modal('hide');
        });
    }

    function modalStatic() {
        $('#my_modal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    function init() {
        initDekkHotell();
        modalStatic();
    }

    init();
});