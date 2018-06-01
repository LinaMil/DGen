/**
 * Šis skriptas vygdomas po to kai koregavimo veiksmas
 * konvertuojamas į skriptą. Jis įterpiamas iš kart po
 * logotipo atidarymo veiksmo
 */

var document = app.activeDocument,
    infoInputArray,
    headerStyleObject,
    mainStyleObject,
    themeObject,
    colorObject,
    styleObject,
    style_array = [],
    root,
    first_color_lyr,
    progress = 0,
	total,
	progressWindow,
	staticText,
	progressBar,
    is_text,
    is_button,
    second_color_lyr,
    layer_to_move,
    artboard,
    mc_doc,
    active_lyr;
// ikeliami naudojami kintamieji (objektai)
ImportScript("vars.jsx");


// gaunamos logotipo spalvos
var logoColors = getColors();

// sukuriamas ivesties langas
var window = new Window(
    'dialog {text: "Design_Generator 3.0", orientation: "column", alignChildren:["fill", "fill"], properties: { closeButton: false }}'
);
window.main = window.add('group { alignChildren: ["left","fill"]}');
// kairysis meniu
window.stubs = window.main.add('listbox', undefined, ['Pagrindiniai duomenys', 'Stilius', 'Maketai']);
window.stubs.preferredSize.width = 150;
window.tabGroup = window.main.add('group {alignment: ["left","fill"], orientation: "stack"}');
window.tabs = [];
MakeTab(0, "Pagrindiniai duomenys");
MakePanel("field", 0, "Apie įmonę", "right", infoInputArray, 0);
MakeTab(1, "Stilius");
var header_style_list = MakePanel("radio", 1, "Antraščių šrifras", "left", headerStyleObject, 1);
var body_style_list = MakePanel("radio", 1, "Kito teksto šriftas", "left", mainStyleObject, 1);
var theme_list = MakePanel("radio", 1, "Maketų tematika", "left", themeObject, 0);
MakeTab(2, "Maketų parametrai");
var mc_color_list = MakePanel("check", 2, "Spalvos", "left", colorObject, 0);
var mc_style_list = MakePanel("check", 2, "Stilistika", "left", styleObject, 0);

ShowTabs();
window.onShow = function () {
    window.stubs.selection = 0;
    showTab;
}

// mygtukai
var buttons = window.add("group");
buttons.orientation = "row";
buttons.alignment = "right";
window.okButton = buttons.add("button", undefined, "Patvirtinti");
window.cancelButton = buttons.add("button", undefined, "Atšaukti");
// kai paspaudžiam patvirtinti
window.okButton.onClick = function () {
  
    window.close();
    // #region MAKETO ATIDARYMAS
    var styles = findSelected(mc_style_list);
    //isData(styles);
		total = 7*styles.length;
		progressWindow = new Window('palette'),
		staticText = progressWindow.add("statictext"),
		progressBar = progressWindow.add('progressbar', undefined, progress, total);
    for (var selected_mc = 0; selected_mc < styles.length; selected_mc++) {
        var mc_name = styleObject[styles[selected_mc].text];
        root = new File($.fileName).parent.parent;
        var dir = root.toString() + "/templates/" + mc_name;
        app.open(File(dir));
        // #endregion
		progressInProgressBar();
        // #region LOGOTIPO ĮTRAUKIMAS Į MAKETĄ
        var logo_doc = app.documents[0],
            logos;
        mc_doc = app.documents[1];
        app.activeDocument = mc_doc;
		
        logos = findLayersBy("logo");

        for (var i = 0; i < logos.length; i++) {
            app.activeDocument = logo_doc;
            logo_doc.artLayers[0].duplicate(mc_doc);
			app.activeDocument = mc_doc;
            log(logos);
            if (mc_name == "temp-image.pdf") {
                switch (i) {
                    case 0:
                        x_pos = -90;
                        y_pos = -690;
                        x_dimention = 320;
                        y_dimention = 320;
                        break;
                    case 1:
                        x_pos = -1054;
                        y_pos = -1480;
                        x_dimention = 235;
                        y_dimention = 235;
                        break;
                    case 2:
                        x_pos = -690;
                        y_pos = -1949;
                        x_dimention = 60;
                        y_dimention = 60;
                        break;
                }
            } else if (mc_name == "temp-icon.pdf") {
                switch (i) {
                    case 0:
                        x_pos = -1055;
                        y_pos = -1750;
                        x_dimention = 235;
                        y_dimention = 235;
                        break;
                    case 1:
                        x_pos = 870;
                        y_pos = -242;
                        x_dimention = 320;
                        y_dimention = 320;
                        break;
                    case 2:
                        x_pos = 587;
                        y_pos = -307;
                        x_dimention = 320;
                        y_dimention = 320;
                        break;
                    case 3:
                        x_pos = -695;
                        y_pos = -1946;
                        x_dimention = 60;
                        y_dimention = 60;
                        break;
                    case 4:
                        x_pos = 1075;
                        y_pos = 500;
                        x_dimention = 320;
                        y_dimention = 320;
                        break;
                }
            }
			
            app.activeDocument = mc_doc;
            document = app.activeDocument;
            active_lyr = document.activeLayer;

            active_lyr = resizeLayer(active_lyr, x_dimention, y_dimention, 1);
            artboard = document.layers.getByName(closestArtboard(logos[i]).name);
            layer_to_move = artboard.layers.getByName(logos[i].name);
            active_lyr.move(layer_to_move, ElementPlacement.PLACEBEFORE);
            active_lyr.translate(new UnitValue(x_pos + 90, 'px'), new UnitValue(y_pos + 650, 'px'));
            logos[i].visible = false;
        }
		progressInProgressBar();
        //#endregion

        // #region MAKETO SPALVŲ PAKEITIMAS PAGAL LOGOTIPĄ

        first_color_lyr = findLayersBy(function (layer) {
            return layer.name.indexOf("pirmas") !== -1;
        });
        second_color_lyr = findLayersBy("antras");
        setColor(first_color_lyr, logoColors[0]);
        setColor(second_color_lyr, logoColors[1]);
		progressInProgressBar();
        //#endregion

        //#region VARTOTOJO SUVESTŲ DUOMENŲ PRITAIKYMAS
        for (var inputLabel in infoInputArray) {
            /**Vartotojo įvesti duomenys.*/
            var currentLabel = infoInputArray[inputLabel];
            /** Sluoksnis, kurio turinį reikia atnaujinti vartotojo įvestais duomenimis. */
            var machedLayers =
                findLayersBy(function (layer) {
                    return layer.name.indexOf(currentLabel.layerName) !== -1;
                });
            /** Apdorojamame PS sluoksnyje esantis teksto elementas. */
            for (var i = 0; i < machedLayers.length; i++) {
                var currentLayerText = machedLayers[i].textItem;
                /**pakeisti PS teksto sluoksnio turinį su vartotojo įvestimi.*/
                currentLayerText.contents = currentLabel.inputField.text;
            }
        }
		progressInProgressBar();
        // #endregion

        // #region PASIRINKTO ŠRIFTO PRITAIKYMAS
        changeLayersFont(header_style_list, "header");
        changeLayersFont(body_style_list, "normal");
		progressInProgressBar();
        // #endregion


         var selected_theme = findSelected(theme_list)[0],
            found_layers = findLayersBy("image"),
            mc_theme = themeObject[selected_theme.text],
            image,
            image_doc,
            x_pos,
            y_pos,
            x_dimention,
            y_dimention;

        for (var i = 0; i < found_layers.length; i++) {
            if (mc_name == "temp-image.pdf") {
                image = imageDirectory("image", mc_theme, i + 1);
            } else {
                image = imageDirectory("icon", mc_theme, i + 1);
            }
            app.open(File(image));
            mc_doc = app.documents[1];
            image_doc = app.documents[2];
            image_doc.artLayers[0].duplicate(mc_doc);
            image_doc.close(SaveOptions.DONOTSAVECHANGES);
            active_lyr = document.activeLayer;
            if (mc_name == "temp-image.pdf") {
                switch (i) {
                    case 0:
                        x_pos = 243;
                        y_pos = -40;
                        x_dimention = 1080;
                        y_dimention = 720;
                        break;
                    case 1:
                        x_pos = 572;
                        y_pos = 1960;
                        x_dimention = 1080;
                        y_dimention = 720;
                        break;
                    case 2:
                        x_pos = 566;
                        y_pos = 160;
                        x_dimention = 1080;
                        y_dimention = 720;
                        break;
                }
            } else if (mc_name == "temp-icon.pdf") {
                switch (i) {
                    case 0:
                        x_pos = -91;
                        y_pos = -308;
                        x_dimention = 100;
                        y_dimention = 100;
                        break;
                    case 1:
                        x_pos = 313;
                        y_pos = -300;
                        x_dimention = 100;
                        y_dimention = 100;
                        break;
                    case 2:
                        x_pos = -495;
                        y_pos = -300;
                        x_dimention = 100;
                        y_dimention = 100;
                        break;
                    case 3:
                        x_pos = 1075;
                        y_pos = -167;
                        x_dimention = 465;
                        y_dimention = 480;
                        break;
                }
            }
            active_lyr = resizeLayer(active_lyr, x_dimention, y_dimention, 1);
            artboard = document.layers.getByName(closestArtboard(found_layers[i]).name);
            layer_to_move = artboard.layers.getByName(found_layers[i].name);
            active_lyr.move(layer_to_move, ElementPlacement.PLACEBEFORE);
            active_lyr.translate(new UnitValue(x_pos + 90, 'px'), new UnitValue(y_pos + 650, 'px'));
            found_layers[i].visible = false;
        }
		progressInProgressBar();
        var selected_filter = findSelected(mc_color_list);
        for (var i = 0; i < selected_filter.length; i++) {
            setFilter(selected_filter[i], true);
            //saveFile("mc_for_print", selected_filter[i].text, false);
            saveFile("mc_for_edit", selected_filter[i].text, selected_mc, true);
			setFilter(selected_filter[i], false);
            
        }
		progressInProgressBar();
        mc_doc.close(SaveOptions.DONOTSAVECHANGES);
    }
    window.close();

}
window.cancelButton.onClick = function () {

    window.close();
}
window.show();

// Papildomos funkcijos
/**
 * Funkcija logotipo spalvoms surasti.
 * @param {number} grid Kokiu dažnumu turi būti imama pikselio spalvos reikšmė logotipe.
 */
function progressInProgressBar() {
  progress++;
  progressBar.value = progress;
  staticText.text = "Generuojamas maketas... Progresas: " + progress + "/" + total + ".";
  progressWindow.show();
}

function getColors(grid) {
    var w = document.width,
        h = document.height;

    if (grid === undefined) grid = (w < h ? w : h) / 10; // 10x10 grid
    /** spalvų imtuvų masyvas. */
    var cs = app.activeDocument.colorSamplers;
    cs.removeAll();
    cs.add([grid, grid]);
    /** Informacija apie vieną iš spalvos imtuvų. */
    var colorSamplerRef = cs[0];
    /** lokalus spalvų iš logotipo masyvas. */
    var colors = [];
    /** Objektas, kurio parametras yra šešioliktainė paimtos spalvos reikšmė. */
    var addedColors = {};
    for (var x = grid / 2; x < w; x += grid) {
        for (var y = grid / 2; y < h; y += grid) {
            colorSamplerRef.move([x, y]);
            try {
                /** objektas saugantis spalvos RGB reikšmes. */
                var color = colorSamplerRef.color;
            } catch (ex) {
                continue;
            }
            if (!addedColors.hasOwnProperty(color.rgb.hexValue)) {
                addedColors[color.rgb.hexValue] = true;
                colors.push(color);
            }
        }
    }
    cs.removeAll();
    return colors;
}

function setColor(layer_set, color) {
    for (var i = 0; i < layer_set.length; i++) {
        app.activeDocument.activeLayer = layer_set[i];
        is_button = layer_set[i].name.indexOf("b_");
        is_text = layer_set[i].name.indexOf("normal");
        if (is_text > -1) {
            layer_set[i].textItem.color = color;
        } else if (is_button > -1) {
            setShapeFill(color, "button");
        } else
            setShapeFill(color, "shape");
    }
}

function setShapeFill(sColor, type) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(stringIDToTypeID('contentLayer'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc.putReference(charIDToTypeID('null'), ref);
    var fillDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    if (type == "shape") {
        colorDesc.putDouble(charIDToTypeID('Rd  '), sColor.rgb.red);
        colorDesc.putDouble(charIDToTypeID('Grn '), sColor.rgb.green);
        colorDesc.putDouble(charIDToTypeID('Bl  '), sColor.rgb.blue);
        fillDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('RGBC'), colorDesc);
        desc.putObject(charIDToTypeID('T   '), stringIDToTypeID('solidColorLayer'), fillDesc);
        executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
    } else if (type == "button") {
        var desc2 = new ActionDescriptor();
        var desc3 = new ActionDescriptor();
        var desc4 = new ActionDescriptor();
        var desc5 = new ActionDescriptor();
        desc5.putDouble(cTID('Rd  '), sColor.rgb.red);
        desc5.putDouble(cTID('Grn '), sColor.rgb.green);
        desc5.putDouble(cTID('Bl  '), sColor.rgb.blue);
        desc4.putObject(cTID('Clr '), sTID("RGBColor"), desc5);
        desc3.putObject(sTID("strokeStyleContent"), sTID("solidColorLayer"), desc4);
        desc3.putInteger(sTID("strokeStyleVersion"), 2);
        desc3.putBoolean(sTID("strokeEnabled"), true);
        desc2.putObject(sTID("strokeStyle"), sTID("strokeStyle"), desc3);
        desc.putObject(cTID('T   '), sTID("shapeStyle"), desc2);
        executeAction(cTID('setd'), desc, DialogModes.NO);
    }
}

function setFilter(filterName, toSet) {
    var filter = colorObject[filterName.text],
        filter_layers = findLayersBy(filter);
    if (filter != "origin") {
        for (var k = 0; k < filter_layers.length; k++) {
			if(toSet){
				filter_layers[k].visible = true;
			} else{
				filter_layers[k].visible = false;
			}
        }
    }
}

/**
 * Funkcija importuoti išoriniams skriptams
 * @param {string} file_name - išorinio failo pavadinimas 
 */
function ImportScript(file_name) {
    var DIR = ((new File($.fileName)).parent.toString().replace(/\\/g, '/'));
    eval('#include ' + DIR + '/' + file_name);
}

function imageDirectory(type, theme, no) {
    var folder,
        format;
    if (type == "i" || type == "image" || type == "images") {
        folder = "/images/";
        format = ".jpg";
    } else {
        folder = "/icons/";
        format = ".png";
    }
    return root.toString() + folder + theme + "/" + no + format;
}





// Lango kūrimo funkcijos
/**
 * funkcija sukurti skyreliui 
 * @param {number} index skyrelio indeksas 
 * @param {string} tabName skyrelio pavadinimas
 */
function MakeTab(index, tabName) {
    var tab = window.tabs[index] = window.tabGroup.add('group');
    tab.add('statictext {text: "' + tabName + '"}');
    tab.add('panel');
}

function showTab() {
    if (window.stubs.selection !== null) {
        for (var i = window.tabs.length - 1; i >= 0; i--) {
            window.tabs[i].visible = false;
        }
        window.tabs[window.stubs.selection.index].visible = true;
    }
}

function ShowTabs() {
    for (var i = 0; i < window.tabs.length; i++) {
        window.tabs[i].orientation = 'column';
        window.tabs[i].alignChildren = 'fill';
        window.tabs[i].alignment = ['fill', 'fill'];
        window.tabs[i].visible = false;
    }
    window.stubs.onChange = showTab;
}
/**
 * Sukuria panelę nurodytame skyrelyje
 * @param {number} tab - skyrelio indeksas
 * @param {string} panelName - panelės pavadinimas
 * @param {string} align - sąrašo lygiavimas
 * @param {object} dataObject - pagal kokį objektą generuojamas 
 * panelės sąrašas
 * @param {number} hasFont - ar sąrašui suteiktas šrifto stilius
 */
function MakePanel(type, tab, panelName, align, dataObject, hasFont) {
    var panel = window.tabs[tab].add('panel {text:"' + panelName + '"}');
    panel.alignChildren = align;
    var group = panel.add("group");
    var text_style;
    var radioArray = [];

    var list = [];
    group.orientation = "column";
    group.alignChildren = align;
    // Ciklas skirtas sukurti mygtukų grupę teksto šriftui pasirinkti.
    // Kiekvieno mygtuko antraštė parašoma skirtingu šriftu.
    for (var data in dataObject) {
        var obj = dataObject[data];
        var input_group = group.add("group");
        if (type == "field") {
            /** Įvesties elementų ir jų antraščių grupė.*/
            input_group.add('statictext', undefined, data);
            obj.inputField = input_group.add(
                'edittext{justify:"left", text: "' + obj.sample + '"}',
                undefined,
                ""
            );
            obj.inputField.characters = 20;
        } else if (type == "radio") {
            var thisButton = group.add("radiobutton", undefined, data);
            radioArray.push(thisButton);
            text_style = dataObject[data].fontFamily;
            style_array.push(text_style);
            list.push(thisButton);
        } else if (type == "check") {
            thisButton = group.add("checkbox", undefined, data);
            list.push(thisButton);
        }
        if (hasFont) {
            thisButton.graphics.font = ScriptUI.newFont(dataObject[data].fontFamily, "Regular", 12);
        }
    }
    return list;
}

// -----------------------------------
// Pasirinkimų nustatymo funkcijos
// -----------------------------------

function findSelected(group) {
    var checked = [];
    for (var i = 0; i < group.length; i++) {
        var item = group[i];
        if (item.value == true) {
            checked.push(item);
        }
    }
    if (checked){
    return checked;
    }
    else{
        alert("Ne visi duomenys yra suvesti");
        return;
    }
}

function findSelectedFont(font_check_list) {
    var foundFont;
    for (var i = 0; i < font_check_list.length; i++) {
        if (font_check_list[i].value == true) {
            foundFont = findFont(style_array[i])
            break;
        }
    }

    if (foundFont) {
        return foundFont;
		debugger;
    } else {
        alert("Nepasirinktas šriftas arba pasirinktas šriftas nėra įrašytas į kompiuterį. Patikrinkite ar įsirašėte visus įskiepio kataloge esančius šriftus ir paleiskite programą iš naujo.");
        return;
    }
}

// Sluoksnių aptikimo funkcijos


/** Grąžina visus sluoksnius duotajame kontekste `doc`.
 * @param {object} [doc=app.activeDocument]
 * @param {array} [allLayers]
 * @return {array}
 */
function collectAllLayers(doc, allLayers) {
    if (doc === undefined) doc = app.activeDocument;
    if (allLayers === undefined) allLayers = [];

    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        if (layer.typename === "ArtLayer") {
            allLayers.push(layer);
        } else {
            collectAllLayers(layer, allLayers);
        }

    }
    return allLayers;
}

/** Grąžina Artboard grupę, kuriame yra paduodasis `layer`
 * @param {ArtLayer} layer
 * @return {LayerSet}
 */
function closestArtboard(layer) {
    if (!layer) return;
    if (layer.length) layer = layer[0]; // jeigu paduotas masyvas

    // Jeigu sluoksnio tėvas yra dokumentas -->
    if (layer.parent === app.activeDocument) {
        return layer;
    } else {
        return closestArtboard(layer.parent);
    }
}

function log(message) {
    $.writeln(message);
}

/** Suranda ir grąžina sluoksnius, tenkinančius paduotą kriterijų `predicate`
 * @param {string|function} predicate
 * @return {array}
 * @example Visi sluoksniai, kurie pavadinime turi 'header'
 * findLayersBy(function(layer){
 *     return layer.name.indexOf("header") !== -1;
 * });
 */
function findLayersBy(predicate) {
    var allLayers = collectAllLayers();
    var foundLayers = [];

    if (typeof predicate === "string") {
        var term = predicate;
        predicate = function (layer) {
            return layer.name === term;
        }
    }
    for (var i = 0; i < allLayers.length; i++) {
        var layer = allLayers[i];
        if (predicate(layer) === true) {
            foundLayers.push(layer);
        }
    }
    return foundLayers;
}

function findFont(fontFamily) {
    // ciklas ieškantis pasirinkto šrifto tarp tų, kurie įrašyti į kompiuterį.
    for (var j = 0; j < app.fonts.length; j++) {
        if (fontFamily == app.fonts[j].name) {
            return app.fonts[j];
        }
    }
}

function changeLayersFont(font_list, type) {
    var checked_style = findSelectedFont(font_list);
    var found_layers = findLayersBy(function (layer) {
        return layer.name.indexOf(type) !== -1;
    });
    for (var i = 0; i < found_layers.length; i++) {
        found_layers[i].textItem.font = checked_style.postScriptName;
    }
}


//-----------------------------------------
// Funkcijos iš actionToJSX
//-----------------------------------------

function cTID(s) {
    return app.charIDToTypeID(s);
}

function sTID(s) {
    return app.stringIDToTypeID(s);
}

function resizeLayer(layer, width, height, keepAspect) { // keepAspect:Boolean - optional. Default to false  
    // do nothing if layer is background or locked  
    if (layer.isBackgroundLayer || layer.allLocked || layer.pixelsLocked ||
        layer.positionLocked || layer.transparentPixelsLocked) return;
    // do nothing if layer is not normal artLayer or Smart Object  
    if (layer.kind != LayerKind.NORMAL && layer.kind != LayerKind.SMARTOBJECT) return;
    // store the ruler  
    var defaultRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;

    var bounds = layer.bounds;
    var layerWidth = bounds[2].as('px') - bounds[0].as('px');
    var layerHeight = bounds[3].as('px') - bounds[1].as('px');

    // move the layer so top left corner matches canvas top left corner  

    if (!keepAspect) {
        // scale the layer to match canvas  
        layer.resize((width / layerWidth) * 100, (height / layerHeight) * 100, AnchorPosition.TOPLEFT);
    } else {
        var layerRatio = layerWidth / layerHeight;
        var newWidth = width;
        var newHeight = ((1.0 * width) / layerRatio);
        if (newHeight >= height) {
            newWidth = layerRatio * height;
            newHeight = height;
        }
        var resizePercent = newWidth / layerWidth * 100;
        app.bringToFront();
        layer.resize(resizePercent, resizePercent, AnchorPosition.TOPLEFT);
    }
    layer.translate(new UnitValue(0 - layer.bounds[0].as('px'), 'px'), new UnitValue(0 - layer.bounds[1].as('px'), 'px'));
    // restore the ruler  
    app.preferences.rulerUnits = defaultRulerUnits;
    return layer;
}

function saveFile(fileName, nameExtension,selectedMC, hasLayers) {
    var file_properties = new PDFSaveOptions(),
        file = new File(root + "/exported_templates/" + fileName + "_" + nameExtension +(selectedMC+1)+ ".pdf");
    file_properties.layers = hasLayers;
    app.documents[0].saveAs(file, file_properties);
}
function isData(data){
    if(data==false){
        alert("Nebuvo pasirinktas maketas. Paleiskite programą iš naujo ir suveskite visus reikiamus duomenis.");
        return;
    }
}