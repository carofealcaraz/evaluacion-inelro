/**
 * Evaluacion Academia Inelro - registro de resultados en Google Sheets.
 *
 * Este codigo va pegado en el Apps Script del Google Sheet donde se quieren
 * ver los resultados (Extensiones > Apps Script). Despues se implementa como
 * aplicacion web y esa URL se pega en index.html, en URL_REGISTRO.
 *
 * Hace dos cosas:
 *   - accion "consultar": dice cuantos intentos lleva un DNI y si ya aprobo.
 *   - accion "registrar": agrega una fila con el resultado del intento.
 */

var HOJA = 'Resultados';
var ENCABEZADOS = ['Fecha', 'Hora', 'Nombre y apellido', 'DNI', 'Sucursal',
                   'Intento', 'Nota', 'Estado', 'Minutos', 'Temas que falló'];


function hojaResultados() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
  }
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(ENCABEZADOS);
    var cabecera = hoja.getRange(1, 1, 1, ENCABEZADOS.length);
    cabecera.setFontWeight('bold');
    cabecera.setBackground('#00548A');
    cabecera.setFontColor('#FFFFFF');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(3, 220);
    hoja.setColumnWidth(5, 150);
    hoja.setColumnWidth(10, 320);
  }
  return hoja;
}


/** Intentos previos de un DNI: cuantos lleva y si alguna vez aprobo. */
function historial(dni) {
  var hoja = hojaResultados();
  var ultima = hoja.getLastRow();
  if (ultima < 2) {
    return { intentos: 0, aprobado: false, mejorNota: 0 };
  }
  var filas = hoja.getRange(2, 4, ultima - 1, 5).getValues();  // DNI..Nota
  var intentos = 0, aprobado = false, mejor = 0;
  for (var i = 0; i < filas.length; i++) {
    if (String(filas[i][0]).trim() !== String(dni).trim()) continue;
    intentos++;
    var nota = Number(filas[i][3]) || 0;
    if (nota > mejor) mejor = nota;
    if (String(filas[i][4]).indexOf('Aprob') === 0) aprobado = true;
  }
  return { intentos: intentos, aprobado: aprobado, mejorNota: mejor };
}


function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


function doPost(e) {
  var candado = LockService.getScriptLock();
  try {
    candado.waitLock(20000);
  } catch (err) {
    return responder({ ok: false, error: 'ocupado' });
  }

  try {
    var d = JSON.parse(e.postData.contents);
    var dni = String(d.dni || '').trim();
    if (!dni) {
      return responder({ ok: false, error: 'falta el DNI' });
    }

    if (d.accion === 'consultar') {
      var h = historial(dni);
      h.ok = true;
      return responder(h);
    }

    if (d.accion === 'registrar') {
      var previo = historial(dni);
      var ahora = new Date();
      var zona = Session.getScriptTimeZone();
      hojaResultados().appendRow([
        Utilities.formatDate(ahora, zona, 'dd/MM/yyyy'),
        Utilities.formatDate(ahora, zona, 'HH:mm'),
        String(d.nombre || '').trim(),
        dni,
        String(d.sucursal || '').trim(),
        previo.intentos + 1,
        Number(d.nota) || 0,
        d.aprobado ? 'Aprobada' : 'No aprobada',
        Number(d.minutos) || 0,
        String(d.fallos || '—')
      ]);
      return responder({ ok: true, intentos: previo.intentos + 1 });
    }

    return responder({ ok: false, error: 'acción desconocida' });

  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    candado.releaseLock();
  }
}


/** Solo para probar desde el navegador que la implementación quedó activa. */
function doGet() {
  return ContentService
    .createTextOutput('El registro de la evaluación Inelro está activo.')
    .setMimeType(ContentService.MimeType.TEXT);
}
