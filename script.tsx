const CATEGORY_PREFIX = 'category-';
const TYPE_PREFIX = 'type-';
const CHOICE_PREFIX = 'choice-';
const SELECTED = 'selected';

const strToClass = (str: string): string => {
    return str.toLowerCase().replace(/[^a-z]+/g, '-');
}

const kinks: { [key: string]: { fields: Array<string>, kinks: Array<string> } } = {
    'Bodies': {
        'fields': ['General'],
        'kinks': [
            'Skinny',
            'Chubby',
            'Small breasts',
            'Large breasts',
            'Small cock',
            'Large cock',
            'Small ass',
            'Large ass',
            'Piercings',
            'Tattoos',
            'Pubic hair',
            'Shaved pubic hair',
            'Facial hair',
            'Body hair',
            'Legs / Feet',
        ]
    },
    'Outfit': {
        'fields': ['Self', 'Partner'],
        'kinks': [
            'Lingerie',
            'Pantyhose / Stockings',
            'Heels',
            'Leather',
            'Latex',
            'Cross-dressing',
            'Cosplay',
            'Business suits',
            'Goth',
            'School Uniform',
            'Maid Uniforms',
            'Cheerleading Uniforms',
            'Knee High Socks',
        ]
    },
    'General': {
        'fields': ['Giving', 'Receiving'],
        'kinks': [
            'Handjob / fingering',
            'Blowjob',
            'Deep throat',
            'Swallowing',
            'Facials',
            'Cunnilingus',
            'Face sitting / fucking',
            'Rough sex',
            'Sleepy Sex',
            'JOI, SI',
            'Multiple orgasms',
            'Creampie',
            'Tit fucking',
        ]
    },
    'Ass play': {
        'fields': ['Giving', 'Receiving'],
        'kinks': [
            'Anal toys',
            'Anal sex, pegging',
            'Rimming',
            'Double penetration',
            'Anal Fingering',
            'Anal fisting',
            'Anal Creampie',
        ]
    },
    'Restrictive': {
        'fields': ['Self', 'Partner'],
        'kinks': [
            'Gag',
            'Collar',
            'Leash',
            'Chastity',
            'Bondage',
            'Encasement / cage',
            'Blindfold',
            'Shibari',
        ]
    },
    'Toys': {
        'fields': ['Self', 'Partner'],
        'kinks': [
            'Dildos',
            'Plugs',
            'Vibrators',
            'Strap-on',
            'Remote controlled',
        ]
    },
    'Domination': {
        'fields': ['Dominant', 'Submissive'],
        'kinks': [
            'Dominant / Submissive',
            'Domestic servitude',
            'Pet play',
            'DD/lg, MD/lb',
            'Obedience training',
            'Forced orgasm',
            'Orgasm control',
            'Power exchange',
            'Mind control',
        ]
    },
    'Consensual Non consent': {
        'fields': ['Aggressor', 'Target'],
        'kinks': [
            'Rape',
            'Blackmail / coercion',
            'Kidnapping',
            'Hypnosis',
        ]
    },
    'Taboo': {
        'fields': ['General'],
        'kinks': [
            'Incest',
            'Ageplay',
            'Interracial / Raceplay',
            'Bestiality',
            'Necrophilia',
            'Voyeurism',
        ]
    },
    'Fluids': {
        'fields': ['General'],
        'kinks': [
            'Blood',
            'Watersports',
            'Scat',
            'Lactation',
            'Diapers',
            'Cum play',
        ]
    },
    'Degradation': {
        'fields': ['Giving', 'Receiving'],
        'kinks': [
            'Name calling',
            'Humiliation',
            'Cuckold',
        ]
    },
    'Touch & Stimulation': {
        'fields': ['Actor', 'Subject'],
        'kinks': [
            'Cock/Pussy worship',
            'Ass worship',
            'Foot play',
            'Tickling',
            'Sensation play',
        ]
    },
    'Roleplay': {
        'fields': ['Self / partner', 'Partner / self'],
        'kinks': [
            'Sister/Brother',
            'Master/Slave',
            'Doctor/nurse',
            'Teacher/student',
            'Nun/priest',
        ]
    },
    'Surrealism': {
        'fields': ['Self', 'Partner'],
        'kinks': [
            'Futanari',
            'Furry',
            'Vore',
            'Tentacles',
            'Monster or Alien',
        ]
    },
    'Misc. Fetish': {
        'fields': ['Giving', 'Receiving'],
        'kinks': [
            'Gangbang',
            'Breath play',
            'Feminization',
            'Choking play',
            'Squirting',
            'Shower Sex',
        ]
    },
    'Exposure': {
        'fields': ['Self', 'Partner'],
        'kinks': [
            'Erotic Photos/Videos',
            'Exhibitionism',
            'Outdoor sex',
            'Flashing',
            'Butt plugs in public',
        ]
    },
    'Pain': {
        'fields': ['Giving', 'Receiving'],
        'kinks': [
            'Hair Pulling',
            'Nipple clamps',
            'Whips / Flogging',
            'Spanking / paddling',
            'Cock/Pussy torture',
            'Hot Wax',
            'Scratching',
            'Biting',
            'Cutting',
        ]
    },
};
const levels: { [key: string]: { colour: string, class: string } } = {
    'Favourite': {
        'colour': '#88FC79',
        'class': 'favourite',
    },
    'Like': {
        'colour': '#6DB5FE',
        'class': 'like',
    },
    'Curious': {
        'colour': '#F9BDF1',
        'class': 'curious',
    },
    'Okay': {
        'colour': '#FDFD6B',
        'class': 'okay',
    },
    'Turn Off': {
        'colour': '#920000',
        'class': 'turn-off',
    },
};

const updateOwner = (target: HTMLInputElement): void => {
    // Update title
    if (target.value.length > 0) {
        document.title = `${target.value}'s Kink List`;
        localStorage.owner = target.value;
    } else {
        document.title = 'Kink List';
        localStorage.removeItem('owner');
    }

    // Update input size
    const content = target.value || target.placeholder;
    const span = document.createElement("span");
    span.innerHTML = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    if (target.parentElement !== null) {
        target.parentElement.appendChild(span);
        const theWidth = span.getBoundingClientRect().width;
        target.parentElement.removeChild(span);
        target.style.width = `${theWidth}px`;
    }
}

const setupDOM = (): void => {
    const inputList = $('#InputList');
    inputList.empty();

    for (const catName of Object.keys(kinks)) {
        const category = kinks[catName];

        const $category = $('<div class="kink-category">')
            .addClass(CATEGORY_PREFIX + strToClass(catName))
            .data('category', catName)
            .append($('<h2>')
                .text(catName));

        const $table = $('<table>').data('fields', category.fields);
        const $thead = $('<thead>').appendTo($table);
        for (const field of category.fields) {
            $('<th>').addClass('choicesCol').text(field).appendTo($thead);
        }
        $('<th>').appendTo($thead);
        $('<tbody>').appendTo($table);
        $category.append($table);

        const $tbody = $category.find('tbody');
        for (const name of category.kinks) {
            const $row = document.createElement('tr');
            $row.classList.add('kink-type', TYPE_PREFIX + strToClass(name));
            $row.dataset['kink'] = name;
            for (const fieldName of category.fields) {
                const $td = document.createElement('td');
                const $choices = document.createElement('div');
                $choices.classList.add('kink-choices', CHOICE_PREFIX + strToClass(fieldName));
                $choices.dataset['field'] = fieldName;
                for (const levelName of Object.keys(levels)) {
                    const $button = document.createElement('button');
                    $button.classList.add('choice', levels[levelName].class);
                    $button.dataset['level'] = levelName;
                    $button.addEventListener('click', (e) => {
                        const target = e.target as HTMLElement;
                        const path = `${strToClass(catName)}/${strToClass(name)}/${strToClass(fieldName)}`;
                        const currentlySet = target.classList.contains(SELECTED);
                        if (target.parentElement !== null) {
                            for (const selected of target.parentElement.getElementsByClassName(SELECTED)) {
                                selected.classList.remove(SELECTED);
                            }
                        }
                        if (currentlySet) {
                            localStorage.removeItem(path);
                        } else {
                            target.classList.add(SELECTED);
                            localStorage[path] = strToClass(levelName);
                        }
                    });
                    $choices.append($button);
                }
                $td.append($choices);
                $row.append($td);
            }
            const $td = document.createElement('td');
            $td.textContent = name;
            $row.append($td);
            $tbody.append($row);
        }
        inputList.append($category);
    }
};

const restoreState = (): void => {
    for (const path in localStorage) {
        if (localStorage.hasOwnProperty(path) && path.indexOf('/') >= 0) {
            const bits = path.split('/');
            if (bits.length === 3) {
                const [category, type, choice] = bits;
                const selector = `.${CATEGORY_PREFIX}${category} .${TYPE_PREFIX}${type} .${CHOICE_PREFIX}${choice} .${localStorage[path]}`;
                const element = document.querySelector(selector);
                if (element === null) {
                    console.warn('Path no longer exists:', bits);
                    localStorage.removeItem(path);
                } else {
                    element.classList.add(SELECTED)
                }
            } else {
                console.warn('Bad state path:', bits);
                localStorage.removeItem(path);
            }
        }
    }
};

interface PartialDrawCall {
    y: number,
    handler: (context: CanvasRenderingContext2D, drawCall: DrawCall) => void,
    data: {
        category?: string,
        text?: string,
        fields?: Array<string>,
        choices?: Array<string>,
    }
}

interface DrawCall {
    x: number,
    y: number,
    data: {
        category?: string,
        text?: string,
        fields?: Array<string>,
        choices?: Array<string>,
    }
}

const drawLegend = (context: CanvasRenderingContext2D): void => {
    context.font = "bold 13px Arial";
    context.fillStyle = '#000000';

    const levelNames = Object.keys(levels);
    const x = context.canvas.width - 15 - (120 * levelNames.length);
    for (let i = 0; i < levelNames.length; i++) {
        context.beginPath();
        context.arc(x + (120 * i), 17, 8, 0, 2 * Math.PI, false);
        context.fillStyle = levels[levelNames[i]].colour;
        context.fill();
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
        context.lineWidth = 1;
        context.stroke();

        context.fillStyle = '#000000';
        context.fillText(levelNames[i], x + 15 + (i * 120), 22);
    }
}
const setupCanvas = (width: number, height: number, username: string) => {
    for (const oldCanvas of document.getElementsByTagName('canvas')) {
        oldCanvas.remove();
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (context === null) {
        throw new Error('Could not get 2D canvas');
    }
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "bold 24px Arial";
    context.fillStyle = '#000000';
    if (username.length > 0) {
        context.fillText(`${username}'s Kink List`, 5, 25);
    } else {
        context.fillText('Kink List', 5, 25);
    }

    drawLegend(context);
    return {context: context, canvas: canvas};
}
const drawCallHandlers = {
    simpleTitle: (context: CanvasRenderingContext2D, drawCall: DrawCall): void => {
        if (drawCall.data.text === undefined) {
            throw new Error('Title missing data.text');
        }
        context.fillStyle = '#000000';
        context.font = "bold 18px Arial";
        context.fillText(drawCall.data.text, drawCall.x, drawCall.y + 5);
    },
    titleSubtitle: (context: CanvasRenderingContext2D, drawCall: DrawCall): void => {
        if (drawCall.data.category === undefined || drawCall.data.fields === undefined) {
            throw new Error('Title missing data.category or data.fields');
        }
        context.fillStyle = '#000000';
        context.font = "bold 18px Arial";
        context.fillText(drawCall.data.category, drawCall.x, drawCall.y + 5);

        const fieldsStr = drawCall.data.fields.join(', ');
        context.font = "italic 12px Arial";
        context.fillText(fieldsStr, drawCall.x, drawCall.y + 20);
    },
    kinkType: (context: CanvasRenderingContext2D, drawCall: DrawCall): void => {
        if (drawCall.data.text === undefined || drawCall.data.choices === undefined) {
            throw new Error('Kink type missing data.text or data.choices');
        }
        context.fillStyle = '#000000';
        context.font = "12px Arial";

        const x = drawCall.x + 5 + (drawCall.data.choices.length * 20);
        const y = drawCall.y - 6;
        context.fillText(drawCall.data.text, x, y);

        // Circles
        for (let i = 0; i < drawCall.data.choices.length; i++) {
            const choice = drawCall.data.choices[i];
            const color = (choice in levels) ? levels[choice].colour : 'rgba(200, 200, 200, 0.5)';

            const x = 10 + drawCall.x + (i * 20);
            const y = drawCall.y - 10;

            context.beginPath();
            context.arc(x, y, 8, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
            context.lineWidth = 1;
            context.stroke();
        }
    }
}
const exportImage = (): void => {
    const kinkCategory = $('.kink-category');

    // Constants
    const numCols = 6;
    const columnWidth = 250;
    const simpleTitleHeight = 35;
    const titleSubtitleHeight = 50;
    const rowHeight = 25;
    const offsets = {
        left: 10,
        right: 10,
        top: 50,
        bottom: 10
    };

    // Find out how many we have of everything
    const numCats = kinkCategory.length;
    const dualCats = $('.kink-category th + th + th').length;
    const simpleCats = numCats - dualCats;
    const numKinks = $('.kink-type').length;

    // Determine the height required for all categories and kinks
    const totalHeight = (
        (numKinks * rowHeight) +
        (dualCats * titleSubtitleHeight) +
        (simpleCats * simpleTitleHeight)
    );

    // Initialize columns and drawStacks
    const columns: Array<{ height: number, drawStack: Array<PartialDrawCall> }> = [];
    for (let i = 0; i < numCols; i++) {
        columns.push({height: 0, drawStack: []});
    }

    // Create drawcalls and place them in the drawStack
    // for the appropriate column
    const avgColHeight = totalHeight / numCols;
    let columnIndex = 0;
    kinkCategory.each((_, e) => {
        const $cat = $(e);
        const catName = $cat.data('category');
        const category = kinks[catName];
        const fields = category.fields;
        const catKinks = category.kinks;

        let catHeight = 0;
        catHeight += (fields.length === 1) ? simpleTitleHeight : titleSubtitleHeight;
        catHeight += (catKinks.length * rowHeight);

        // Determine which column to place this category in
        if ((columns[columnIndex].height + (catHeight / 2)) > avgColHeight) columnIndex++;
        while (columnIndex >= numCols) {
            columnIndex--;
        }
        const column = columns[columnIndex];

        // DrawCall for title
        if (fields.length < 2) {
            column.drawStack.push({
                y: column.height,
                handler: drawCallHandlers.simpleTitle,
                data: {
                    text: catName
                }
            });
            column.height += simpleTitleHeight;
        } else {
            column.drawStack.push({
                y: column.height,
                handler: drawCallHandlers.titleSubtitle,
                data: {
                    category: catName,
                    fields: fields
                }
            });
            column.height += titleSubtitleHeight;
        }

        // DrawCalls for kinks
        $cat.find('.kink-type').each(function () {
            const $kinkRow = $(this);
            const choices: Array<string> = [];

            // Add choices
            $kinkRow.find('.kink-choices').each((c, e) => {
                const selected = e.getElementsByClassName(SELECTED);
                const selection = (selected.length > 0) ? (selected[0] as HTMLElement).dataset['level'] as string : 'not-chosen';
                choices.push(selection);
            });

            column.drawStack.push({
                y: column.height,
                handler: drawCallHandlers.kinkType,
                data: {
                    choices: choices,
                    text: $kinkRow.data('kink')
                }
            });
            column.height += rowHeight;
        });
    });

    let tallestColumnHeight = 0;
    for (let i = 0; i < columns.length; i++) {
        if (tallestColumnHeight < columns[i].height) {
            tallestColumnHeight = columns[i].height;
        }
    }

    const canvasWidth = offsets.left + offsets.right + (columnWidth * numCols);
    const canvasHeight = offsets.top + offsets.bottom + tallestColumnHeight;
    const owner = (document.getElementById('name') as HTMLInputElement).value;
    const setup = setupCanvas(canvasWidth, canvasHeight, owner);
    const context = setup.context;
    const canvas = setup.canvas;

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const drawStack = column.drawStack;

        const drawX = offsets.left + (columnWidth * i);
        for (let j = 0; j < drawStack.length; j++) {
            const partialDrawCall = drawStack[j];
            partialDrawCall.handler(context, {
                x: drawX,
                y: partialDrawCall.y + offsets.top,
                data: partialDrawCall.data,
            });
        }
    }

    // Stamp URL
    context.fillStyle = '#000000';
    context.font = "12px Arial";
    context.fillText('kinklist.xyz', canvasWidth - 70, canvasHeight - 10);

    // Save image
    const pom = document.createElement('a');
    pom.setAttribute('href', canvas.toDataURL());
    const filename = owner.length ? owner.replace(/[^a-zA-Z]+/g, '_') : 'kink_list';
    pom.setAttribute('download', filename + '.png');
    pom.click();
}


document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    if (localStorage.owner !== undefined) {
        nameInput.value = localStorage.owner;
    }
    updateOwner(nameInput);
    nameInput.addEventListener('input', (event) => updateOwner(event.target as HTMLInputElement));

    setupDOM();
    restoreState();
    const exportButton = document.getElementById('export');
    if (exportButton !== null) {
        exportButton.addEventListener('click', exportImage);
    }

    // Add level styles
    const style = document.createElement('style');
    const legend = document.getElementById('legend');
    document.head.appendChild(style);
    if (style.sheet !== null && legend !== null) {
        for (const levelsKey in levels) {
            const level = levels[levelsKey];
            style.sheet.insertRule(`.choice.${level.class} { background-color: ${level.colour}; }`, 0);
            legend.innerHTML += `<li><div class="choice ${level.class}"></div> <span class="legend-text">${levelsKey}</span></li>`;
        }
    }

    const clearButton = document.getElementById('Clear');
    if (clearButton !== null) {
        clearButton.addEventListener('click', (): void => {
            localStorage.clear();
            nameInput.value = '';
            updateOwner(nameInput);
            setupDOM();
        })
    }
    
    const themeStylesheet = document.getElementById('theme');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      themeStylesheet.href = storedTheme;
    }
    const themeToggle = document.getElementById('toggleDark');
    themeToggle.addEventListener('click', () => {
      if (themeStylesheet.href.includes('light')) {
        themeStylesheet.href = 'dark-theme.css'
        themeToggle.innerText = 'Switch to light mode'
      } else {
        themeStylesheet.href = 'light-theme.css'
        themeToggle.innerText = 'Switch to dark mode'
      }
      localStorage.setItem('theme', themeStylesheet.href);
    })
});
