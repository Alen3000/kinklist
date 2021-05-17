const CATEGORY_PREFIX = 'category-';
const TYPE_PREFIX = 'type-';
const CHOICE_PREFIX = 'choice-';

const strToClass = (str) => {
    return str.toLowerCase().replaceAll(/[^a-z]+/g, '-');
}

let kinks = {};
let colors = {}
let level = {};
const inputKinks = {
    createCategory: function (name, fields) {
        const $category = $('<div class="kink-category">')
            .addClass(CATEGORY_PREFIX + strToClass(name))
            .data('category', name)
            .append($('<h2>')
                .text(name));

        const $table = $('<table>').data('fields', fields);
        const $thead = $('<thead>').appendTo($table);
        for (const field of fields) {
            $('<th>').addClass('choicesCol').text(field).appendTo($thead);
        }
        $('<th>').appendTo($thead);
        $('<tbody>').appendTo($table);

        $category.append($table);

        return $category;
    },
    fillInputList: function () {
        const inputList = $('#InputList');
        inputList.empty();

        let kinkCats = Object.keys(kinks);
        for (let i = 0; i < kinkCats.length; i++) {
            const catName = kinkCats[i];
            const category = kinks[catName];
            const fields = category.fields;
            const kinkArr = category.kinks;

            const $category = inputKinks.createCategory(catName, fields);
            const $tbody = $category.find('tbody');
            for (let k = 0; k < kinkArr.length; k++) {
                const name = kinkArr[k];
                const $row = $('<tr>').data('kink', name).addClass('kink-type');
                for (let j = 0; j < fields.length; j++) {
                    const fieldName = fields[j];
                    const $choices = $('<div>').addClass('kink-choices');
                    const levels = Object.keys(level);
                    for (let l = 0; l < levels.length; l++) {
                        const levelName = levels[l];
                        $('<button>')
                            .addClass('choice')
                            .addClass(level[levelName])
                            .data('level', levelName)
                            .attr('title', levelName)
                            .appendTo($choices)
                            .on('click', (e) => {
                                for (const selected of e.target.parentElement.getElementsByClassName('selected')) {
                                    selected.classList.remove('selected');
                                }
                                e.target.classList.add('selected');
                                const path = `${strToClass(catName)}/${strToClass(name)}/${strToClass(fieldName)}`;
                                const value = strToClass(levelName);
                                console.log('Setting', path, 'to', value);
                                localStorage[path] = value;
                            });
                    }
                    $choices.data('field', fieldName);
                    $choices.addClass(CHOICE_PREFIX + strToClass(fieldName));
                    $('<td>').append($choices).appendTo($row);
                }
                $('<td>').text(name).appendTo($row);
                $row.addClass(TYPE_PREFIX + strToClass(name));
                $tbody.append($row);
            }
            inputList.append($category);
        }
    },
    init: function () {
        // Set up DOM
        inputKinks.fillInputList();

        // Read hash
        inputKinks.restoreState();

        // Make export button work
        $('#Export').on('click', inputKinks.export);
    },
    drawLegend: function (context) {
        context.font = "bold 13px Arial";
        context.fillStyle = '#000000';

        let levels = Object.keys(colors);
        let x = context.canvas.width - 15 - (120 * levels.length);
        for (let i = 0; i < levels.length; i++) {
            context.beginPath();
            context.arc(x + (120 * i), 17, 8, 0, 2 * Math.PI, false);
            context.fillStyle = colors[levels[i]];
            context.fill();
            context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
            context.lineWidth = 1;
            context.stroke();

            context.fillStyle = '#000000';
            context.fillText(levels[i], x + 15 + (i * 120), 22);
        }
    },
    setupCanvas: function (width, height, username) {
        $('canvas').remove();
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        let $canvas = $(canvas);
        $canvas.css({
            width: width,
            height: height
        });

        let context = canvas.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "bold 24px Arial";
        context.fillStyle = '#000000';
        context.fillText(`${username}'s Kink List`, 5, 25);

        inputKinks.drawLegend(context);
        return {context: context, canvas: canvas};
    },
    drawCallHandlers: {
        simpleTitle: function (context, drawCall) {
            context.fillStyle = '#000000';
            context.font = "bold 18px Arial";
            context.fillText(drawCall.data, drawCall.x, drawCall.y + 5);
        },
        titleSubtitle: function (context, drawCall) {
            context.fillStyle = '#000000';
            context.font = "bold 18px Arial";
            context.fillText(drawCall.data.category, drawCall.x, drawCall.y + 5);

            let fieldsStr = drawCall.data.fields.join(', ');
            context.font = "italic 12px Arial";
            context.fillText(fieldsStr, drawCall.x, drawCall.y + 20);
        },
        kinkRow: function (context, drawCall) {
            context.fillStyle = '#000000';
            context.font = "12px Arial";

            let x = drawCall.x + 5 + (drawCall.data.choices.length * 20);
            let y = drawCall.y - 6;
            context.fillText(drawCall.data.text, x, y);

            // Circles
            for (let i = 0; i < drawCall.data.choices.length; i++) {
                let choice = drawCall.data.choices[i];
                let color = colors[choice];

                let x = 10 + drawCall.x + (i * 20);
                let y = drawCall.y - 10;

                context.beginPath();
                context.arc(x, y, 8, 0, 2 * Math.PI, false);
                context.fillStyle = color;
                context.fill();
                context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
                context.lineWidth = 1;
                context.stroke();
            }

        }
    },
    export: function () {
        let username = prompt("Please enter your name");
        if (typeof username !== 'string' || !username.length) {
            return;
        }
        const kinkCategory = $('.kink-category');

        // Constants
        let numCols = 6;
        let columnWidth = 250;
        let simpleTitleHeight = 35;
        let titleSubtitleHeight = 50;
        let rowHeight = 25;
        let offsets = {
            left: 10,
            right: 10,
            top: 50,
            bottom: 10
        };

        // Find out how many we have of everything
        let numCats = kinkCategory.length;
        let dualCats = $('.kink-category th + th + th').length;
        let simpleCats = numCats - dualCats;
        let numKinks = $('.kink-type').length;

        // Determine the height required for all categories and kinks
        let totalHeight = (
            (numKinks * rowHeight) +
            (dualCats * titleSubtitleHeight) +
            (simpleCats * simpleTitleHeight)
        );

        // Initialize columns and drawStacks
        let columns = [];
        for (let i = 0; i < numCols; i++) {
            columns.push({height: 0, drawStack: []});
        }

        // Create drawcalls and place them in the drawStack
        // for the appropriate column
        let avgColHeight = totalHeight / numCols;
        let columnIndex = 0;
        kinkCategory.each(function () {
            let $cat = $(this);
            let catName = $cat.data('category');
            let category = kinks[catName];
            let fields = category.fields;
            let catKinks = category.kinks;

            let catHeight = 0;
            catHeight += (fields.length === 1) ? simpleTitleHeight : titleSubtitleHeight;
            catHeight += (catKinks.length * rowHeight);

            // Determine which column to place this category in
            if ((columns[columnIndex].height + (catHeight / 2)) > avgColHeight) columnIndex++;
            while (columnIndex >= numCols) columnIndex--;
            let column = columns[columnIndex];

            // Drawcall for title
            let drawCall = {y: column.height};
            column.drawStack.push(drawCall);
            if (fields.length < 2) {
                column.height += simpleTitleHeight;
                drawCall.type = 'simpleTitle';
                drawCall.data = catName;
            } else {
                column.height += titleSubtitleHeight;
                drawCall.type = 'titleSubtitle';
                drawCall.data = {
                    category: catName,
                    fields: fields
                };
            }

            // Drawcalls for kinks
            $cat.find('.kink-type').each(function () {
                let $kinkRow = $(this);
                let drawCall = {
                    y: column.height, type: 'kink-type', data: {
                        choices: [],
                        text: $kinkRow.data('kink')
                    }
                };
                column.drawStack.push(drawCall);
                column.height += rowHeight;

                // Add choices
                $kinkRow.find('.kink-choices').each(function () {
                    let $selection = $(this).find('.choice.selected');
                    let selection = ($selection.length > 0)
                        ? $selection.data('level')
                        : Object.keys(level)[0];

                    drawCall.data.choices.push(selection);
                });
            });
        });

        let tallestColumnHeight = 0;
        for (let i = 0; i < columns.length; i++) {
            if (tallestColumnHeight < columns[i].height) {
                tallestColumnHeight = columns[i].height;
            }
        }

        let canvasWidth = offsets.left + offsets.right + (columnWidth * numCols);
        let canvasHeight = offsets.top + offsets.bottom + tallestColumnHeight;
        let setup = inputKinks.setupCanvas(canvasWidth, canvasHeight, username);
        let context = setup.context;
        let canvas = setup.canvas;

        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let drawStack = column.drawStack;

            let drawX = offsets.left + (columnWidth * i);
            for (let j = 0; j < drawStack.length; j++) {
                let drawCall = drawStack[j];
                drawCall.x = drawX;
                drawCall.y += offsets.top;
                inputKinks.drawCallHandlers[drawCall.type](context, drawCall);
            }
        }

        // Save image
        let pom = document.createElement('a');
        pom.setAttribute('href', canvas.toDataURL());
        pom.setAttribute('download', username + '.png');
        pom.click();
    },
    restoreState: function () {
        for (const path in localStorage) {
            if (localStorage.hasOwnProperty(path)) {
                const bits = path.split('/');
                try {
                    document.querySelector(`.${CATEGORY_PREFIX}${bits[0]} .${TYPE_PREFIX}${bits[1]} .${CHOICE_PREFIX}${bits[2]} .${localStorage[path]}`).classList.add('selected');
                } catch (e) {
                    console.warn('Error restoring', bits);
                    localStorage.removeItem(path);
                }
            }
        }
    },
    saveSelection: function () {
        let selection = [];
        $('.choice.selected').each(function () {
            // .choice selector
            let selector = '.' + this.className.replace(/ /g, '.');
            // .choices selector
            selector = '.' + $(this).closest('.choices')[0].className.replace(/ /g, '.') + ' ' + selector;
            // .kinkRow selector
            selector = '.' + $(this).closest('tr.kink-type')[0].className.replace(/ /g, '.') + ' ' + selector;
            // .kinkCategory selector
            selector = '.' + $(this).closest('.kink-category')[0].className.replace(/ /g, '.') + ' ' + selector;
            selector = selector.replace('.selected', '');
            selection.push(selector);
        });
        return selection;
    },
    inputListToText: function () {
        let KinksText = "";
        let kinkCats = Object.keys(kinks);
        for (let i = 0; i < kinkCats.length; i++) {
            let catName = kinkCats[i];
            let catFields = kinks[catName].fields;
            let catKinks = kinks[catName].kinks;
            KinksText += '#' + catName + "\r\n";
            KinksText += '(' + catFields.join(', ') + ")\r\n";
            for (let j = 0; j < catKinks.length; j++) {
                KinksText += '* ' + catKinks[j] + "\r\n";
            }
            KinksText += "\r\n";
        }
        return KinksText;
    },
    restoreSavedSelection: function (selection) {
        for (let i = 0; i < selection.length; i++) {
            let selector = selection[i];
            $(selector).addClass('selected');
        }
    },
    parseKinksText: function (kinksText) {
        let newKinks = {};
        let lines = kinksText.replace(/\r/g, '').split("\n");

        let cat = null;
        let catName = null;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (!line.length) continue;

            if (line[0] === '#') {
                if (catName) {
                    if (!(cat.fields instanceof Array) || cat.fields.length < 1) {
                        alert(catName + ' does not have any fields defined!');
                        return;
                    }
                    if (!(cat.kinks instanceof Array) || cat.kinks.length < 1) {
                        alert(catName + ' does not have any kinks listed!');
                        return;
                    }
                    newKinks[catName] = cat;
                }
                catName = line.substring(1).trim();
                cat = {kinks: []};
            }
            if (!catName) continue;
            if (line[0] === '(') {
                cat.fields = line.substring(1, line.length - 1).trim().split(',');
                for (let j = 0; j < cat.fields.length; j++) {
                    cat.fields[j] = cat.fields[j].trim();
                }
            }
            if (line[0] === '*') {
                let kink = line.substring(1).trim();
                cat.kinks.push(kink);
            }
        }
        if (catName && !newKinks[catName]) {
            if (!(cat.fields instanceof Array) || cat.fields.length < 1) {
                alert(catName + ' does not have any fields defined!');
                return;
            }
            if (!(cat.kinks instanceof Array) || cat.kinks.length < 1) {
                alert(catName + ' does not have any kinks listed!');
                return;
            }
            newKinks[catName] = cat;
        }
        return newKinks;
    }
};

$('#Edit').on('click', function () {
    let KinksText = inputKinks.inputListToText();
    $('#Kinks').val(KinksText.trim());
    $('#EditOverlay').fadeIn();
});
$('#EditOverlay').on('click', function () {
    $(this).fadeOut();
});
$('#Clear').on('click', function () {
    localStorage.choices = [];
    inputKinks.fillInputList();
});
$('#KinksOK').on('click', function () {
    let selection = inputKinks.saveSelection();
    try {
        let kinksText = $('#Kinks').val();
        kinks = inputKinks.parseKinksText(kinksText);
    } catch (e) {
        alert('An error occured trying to parse the text entered, please correct it and try again');
        return;
    }
    inputKinks.restoreSavedSelection(selection);
    $('#EditOverlay').fadeOut();
});
$('.overlay > *').on('click', function (e) {
    e.stopPropagation();
});

$('.legend .choice').each(function () {
    let $choice = $(this);
    let $parent = $choice.parent();
    let text = $parent.text().trim();
    let color = $choice.data('color');
    let cssClass = this.className.replace('choice ', '').trim();

    document.styleSheets[0].insertRule(`.choice.${cssClass} { background-color: ${color}; }`, 0);
    colors[text] = color;
    level[text] = cssClass;
});

kinks = inputKinks.parseKinksText($('#Kinks').text().trim());
inputKinks.init();

let $popup = $('#InputOverlay');
let $previous = $('#InputPrevious');
let $next = $('#InputNext');

// current
let $category = $('#InputCategory');
let $field = $('#InputField');
let $options = $('#InputValues');

function getChoiceValue($choices) {
    let $selected = $choices.find('.choice.selected');
    return $selected.data('level');
}

function getChoicesElement(category, kink, field) {
    return $(`.${CATEGORY_PREFIX}${strToClass(category)} .${TYPE_PREFIX}${strToClass(kink)} .${CHOICE_PREFIX}${strToClass(field)}`);
}

inputKinks.getAllKinks = function () {
    let list = [];

    let categories = Object.keys(kinks);
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let fields = kinks[category].fields;
        let kinkArr = kinks[category].kinks;

        for (let j = 0; j < fields.length; j++) {
            let field = fields[j];
            for (let k = 0; k < kinkArr.length; k++) {
                let kink = kinkArr[k];
                let $choices = getChoicesElement(category, kink, field);
                let value = getChoiceValue($choices);
                let obj = {
                    category: category,
                    kink: kink,
                    field: field,
                    value: value,
                    $choices: $choices,
                    showField: (fields.length >= 2)
                };
                list.push(obj);
            }
        }

    }
    return list;
};

inputKinks.inputPopup = {
    numPrev: 3,
    numNext: 3,
    allKinks: [],
    kinkByIndex: function (i) {
        let numKinks = inputKinks.inputPopup.allKinks.length;
        i = (numKinks + i) % numKinks;
        return inputKinks.inputPopup.allKinks[i];
    },
    generatePrimary: function (kink) {
        let $container = $('<div>');
        let btnIndex = 0;
        $('.legend > div').each(function () {
            let $btn = $(this).clone();
            $btn.addClass('big-choice');
            $btn.appendTo($container);

            $('<span>')
                .addClass('btn-num-text')
                .text(btnIndex++)
                .appendTo($btn)

            let text = $btn.text().trim().replace(/[0-9]/g, '');
            if (kink.value === text) {
                $btn.addClass('selected');
            }

            $btn.on('click', function () {
                $container.find('.big-choice').removeClass('selected');
                $btn.addClass('selected');
                kink.value = text;
                $options.fadeOut(200, function () {
                    $options.show();
                    inputKinks.inputPopup.showNext();
                });
                let choiceClass = strToClass(text);
                kink.$choices.find('.' + choiceClass).click();
            });
        });
        return $container;
    },
    generateSecondary: function (kink) {
        let $container = $('<div class="kink-simple">');
        $('<span class="choice">').addClass(level[kink.value]).appendTo($container);
        $('<span class="txt-category">').text(kink.category).appendTo($container);
        if (kink.showField) {
            $('<span class="txt-field">').text(kink.field).appendTo($container);
        }
        $('<span class="txt-kink">').text(kink.kink).appendTo($container);
        return $container;
    },
    showIndex: function (index) {
        $previous.html('');
        $next.html('');
        $options.html('');
        $popup.data('index', index);

        // Current
        let currentKink = inputKinks.inputPopup.kinkByIndex(index);
        let $currentKink = inputKinks.inputPopup.generatePrimary(currentKink);
        $options.append($currentKink);
        $category.text(currentKink.category);
        $field.text((currentKink.showField ? '(' + currentKink.field + ') ' : '') + currentKink.kink);
        $options.append($currentKink);

        // Prev
        for (let i = inputKinks.inputPopup.numPrev; i > 0; i--) {
            let prevKink = inputKinks.inputPopup.kinkByIndex(index - i);
            let $prevKink = inputKinks.inputPopup.generateSecondary(prevKink);
            $previous.append($prevKink);
            (function (skip) {
                $prevKink.on('click', function () {
                    inputKinks.inputPopup.showPrev(skip);
                });
            })(i);
        }
        // Next
        for (let i = 1; i <= inputKinks.inputPopup.numNext; i++) {
            let nextKink = inputKinks.inputPopup.kinkByIndex(index + i);
            let $nextKink = inputKinks.inputPopup.generateSecondary(nextKink);
            $next.append($nextKink);
            (function (skip) {
                $nextKink.on('click', function () {
                    inputKinks.inputPopup.showNext(skip);
                });
            })(i);
        }
    },
    showPrev: function (skip) {
        if (typeof skip !== "number") skip = 1;
        let index = $popup.data('index') - skip;
        let numKinks = inputKinks.inputPopup.allKinks.length;
        index = (numKinks + index) % numKinks;
        inputKinks.inputPopup.showIndex(index);
    },
    showNext: function (skip) {
        if (typeof skip !== "number") skip = 1;
        let index = $popup.data('index') + skip;
        let numKinks = inputKinks.inputPopup.allKinks.length;
        index = (numKinks + index) % numKinks;
        inputKinks.inputPopup.showIndex(index);
    },
    show: function () {
        inputKinks.inputPopup.allKinks = inputKinks.getAllKinks();
        inputKinks.inputPopup.showIndex(0);
        $popup.fadeIn();
    }
};

// TODO: Keyboard selections?
$('#StartBtn').on('click', inputKinks.inputPopup.show);
$('#InputCurrent .closePopup, #InputOverlay').on('click', function () {
    $popup.fadeOut();
});
