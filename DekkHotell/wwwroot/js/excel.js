const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let excelSheetRowsOne = null;
let excelHeadersOne = null;
let excelUniqueHeadersOne = null;
let mergeColumnOne = null;
let excelSheetRowsTwo = null;
let excelHeadersTwo = null;
let excelUniqueHeadersTwo = null;
let mergeColumnTwo = null;
let allHeaders = null;

function fileUpload(fileNum) {
    if (fileNum === 1) {
        Upload('one', fileNum);
    } else {
        Upload('two', fileNum);
    }
}

function Upload(fileNumText, fileNum) {
    let fileUpload = document.getElementById("file-upload-" + fileNumText);

    //Validate whether File is valid Excel file.
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result, fileNumText, fileNum);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    let data = "";
                    let bytes = new Uint8Array(e.target.result);
                    for (let i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data, fileNumText, fileNum);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("Nettleser støtter ikke HTML5 teknologi.");
        }
    } else {
        alert("Vennligst last opp valid excel fil.");
    }
};
function ProcessExcel(data, fileNumText, fileNum) {
    let workbook = XLSX.read(data, {
        type: 'binary'
    });

    let firstSheet = workbook.SheetNames[0];
    let workSheet = workbook.Sheets[firstSheet];

    let excelRows = XLSX.utils.sheet_to_row_object_array(workSheet);
    let headers = extractHeaders(workSheet, fileNum);

    if (fileNum === 1) {
        excelSheetRowsOne = excelRows;
        excelHeadersOne = headers;
        excelUniqueHeadersOne = generateUniqueHeaders(headers, 'A');
    } else {
        excelSheetRowsTwo = excelRows;
        excelHeadersTwo = headers;
        excelUniqueHeadersTwo = generateUniqueHeaders(headers, 'B');
    }

    let headerButtons = document.createElement("div");
    headerButtons.innerHTML = '<br/><h4>Velg kolonne å slå sammen på</h4>';
    for (let i = 0; i < headers.length; i++) {
        headerButtons.innerHTML += '<div class="form-check">'
            + '<input class="form-check-input" type="radio" name="flexRadioDefault' + fileNumText + '" id="flexRadioDefault' + fileNumText + i + '" value="' + i + '">'
            + '<label class="form-check-label" for="flexRadioDefault' + fileNumText + i + '">'
            + headers[i]
            + '</label>'
        '</div>';
    }
    let dvExcel = document.getElementById("dv-excel-" + fileNumText);
    dvExcel.innerHTML = "";
    dvExcel.appendChild(headerButtons);
};

function extractHeaders(ws) {
    const header = []
    const columnCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1
    for (let i = 0; i < columnCount; ++i) {
        header[i] = ws[`${XLSX.utils.encode_col(i)}1`].v;
    }
    return header;
}

function generateUniqueHeaders(headers, fileChar) {
    let result = [];
    let headersLength = headers.length;
    for (let i = 0; i < headersLength; ++i) {
        result[i] = headers[i] + '--' + fileChar + '--' + generateString(3);
    }
    return result;
}

function fileMerge() {
    let mergeNotValidMessage = notValidForMergingMessage();
    if (notValidForMergingMessage.length >= 1) {
        alert(mergeNotValidMessage);
        return;
    }
    mergeColumnOne = $('#dv-excel-one input:radio:checked').val();
    mergeColumnTwo = $('#dv-excel-two input:radio:checked').val();
    if (mergeColumnOne === undefined || mergeColumnOne === null) {
        alert('Velg kolonner å slå sammen på.');
        return;
    }
    if (mergeColumnTwo === undefined || mergeColumnTwo === null) {
        alert('Velg kolonner å slå sammen på.');
        return;
    }
    mergeFiles();
}

function mergeFiles() {
    let result = [];
    let excelSheetRowsOneLength = excelSheetRowsOne.length;
    let headersOneLength = excelHeadersOne.length;
    let headersTwoLength = excelHeadersTwo.length;
    for (let i = 0; i < excelSheetRowsOneLength; ++i) {

        let excelSheetRowsTwoLength = excelSheetRowsTwo.length;
        let baseObject = {};
        let resultingMatchIndex = -1;

        for (let j = 0; j < excelSheetRowsTwoLength; ++j) {
            if (excelSheetRowsOne[i][excelHeadersOne[mergeColumnOne]] === excelSheetRowsTwo[j][excelHeadersTwo[mergeColumnTwo]]) {
                resultingMatchIndex = j;
                for (let k = 0; k < headersOneLength; ++k) {
                    baseObject[excelUniqueHeadersOne[k]] = excelSheetRowsOne[i][excelHeadersOne[k]] !== undefined ? excelSheetRowsOne[i][excelHeadersOne[k]] : null;
                }
                for (let k = 0; k < headersTwoLength; ++k) {
                    baseObject[excelUniqueHeadersTwo[k]] = excelSheetRowsTwo[j][excelHeadersTwo[k]] !== undefined ? excelSheetRowsTwo[j][excelHeadersTwo[k]] : null;
                }
                result.push(baseObject);
                break;
            }
        }

        if (Object.keys(baseObject).length === 0) {
            // POPULATE WITH ONLY SHEET A
            for (let k = 0; k < headersOneLength; ++k) {
                baseObject[excelUniqueHeadersOne[k]] = excelSheetRowsOne[i][excelHeadersOne[k]] !== undefined ? excelSheetRowsOne[i][excelHeadersOne[k]] : null;
            }
            result.push(baseObject);
        }

        // REMOVE FOUND MATCHES FROM SHEET B
        if (resultingMatchIndex > -1) {
            excelSheetRowsTwo.splice(resultingMatchIndex, 1);
        }
    }

    if (excelSheetRowsTwo.length >= 1) {
        // POPULATE WITH REMANING SHEET B
        for (let i = 0; i < excelSheetRowsTwo.length; ++i) {
            let baseObject = {};
            for (let k = 0; k < headersTwoLength; ++k) {
                baseObject[excelUniqueHeadersTwo[k]] = excelSheetRowsTwo[i][excelHeadersTwo[k]] !== undefined ? excelSheetRowsTwo[i][excelHeadersTwo[k]] : null;
            }
            result.push(baseObject);
        }
    }

    exportData(result);
}

function getAllHeadersCombinedAndUnique() {
    // allHeaders
    let allheadersCombinedAndUnique = [];
    let excelHeadersOnelength = excelHeadersOne.length;
    let excelHeadersTwolength = excelHeadersTwo.length;
    for (let i = 0; i < excelHeadersOnelength; ++i) {

    }
}

function notValidForMergingMessage() {
    if (excelSheetRowsOne === undefined || excelSheetRowsOne === null) {
        return 'Last opp valide excelfiler før du slår sammen.';
    }
    if (excelHeadersOne === undefined || excelHeadersOne === null) {
        return 'Last opp valide excelfiler før du slår sammen.';
    }
    if (excelSheetRowsTwo === undefined || excelSheetRowsOne === null) {
        return 'Last opp valide excelfiler før du slår sammen.';
    }
    if (excelHeadersTwo === undefined || excelHeadersTwo === null) {
        return 'Last opp valide excelfiler før du slår sammen.';
    }
    return '';
}

function exportData(data) {
    filename = 'reports.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ark1");
    XLSX.writeFile(wb, filename);
}

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.trim();
}